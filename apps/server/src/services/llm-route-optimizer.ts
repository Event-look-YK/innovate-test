import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { z } from "zod";

import { env } from "@innovate-test/env/server";

// ── Input types (adapted to actual DB schema) ─────────────────────────────────

export interface TaskForOptimization {
  id: string;
  title: string;
  cargo_type: "General" | "Refrigerated" | "Hazardous" | "Oversized" | "Fragile";
  weight_t: number;
  pickup: { address: string; lat: number; lng: number };
  delivery: { address: string; lat: number; lng: number };
  distance_km: number;
  priority: "EMERGENCY" | "HIGH" | "MEDIUM" | "LOW";
  deadline: string; // ISO datetime
}

export interface TruckForOptimization {
  id: string;
  name: string;
  type: "Truck" | "Semi" | "Refrigerated" | "Flatbed";
  payload_t: number;
  current_location: { address: string; lat: number; lng: number };
}

export interface OptimizationInput {
  tasks: TaskForOptimization[];
  trucks: TruckForOptimization[];
  generated_at: string;
}

// ── Zod schemas for LLM output ────────────────────────────────────────────────

const LegSchema = z.object({
  leg_index: z.number().int().nonnegative(),
  type: z.enum(["deadhead", "loaded", "rest"]),
  from: z.object({ address: z.string(), lat: z.number(), lng: z.number() }),
  to: z.object({ address: z.string(), lat: z.number(), lng: z.number() }),
  distance_km: z.number().nonnegative(),
  estimated_departure: z.string(),
  estimated_arrival: z.string(),
  driving_time_minutes: z.number().nonnegative(),
  task_ids_on_board: z.array(z.string()),
  action: z.string(),
});

const RouteSchema = z.object({
  truck_id: z.string(),
  task_ids: z.array(z.string()).min(1),
  total_weight_t: z.number().nonnegative(),
  weight_utilization_pct: z.number().min(0).max(100),
  legs: z.array(LegSchema).min(1),
  total_distance_km: z.number().nonnegative(),
  empty_km: z.number().nonnegative(),
  total_cost_uah: z.number().nonnegative(),
  estimated_start: z.string(),
  estimated_end: z.string(),
  total_duration_hours: z.number().nonnegative(),
});

const OptimizationResultSchema = z.object({
  plan: z.object({
    total_distance_km: z.number().nonnegative(),
    total_cost_uah: z.number().nonnegative(),
    total_empty_km: z.number().nonnegative(),
    trucks_used: z.number().int().nonnegative(),
    trucks_idle: z.number().int().nonnegative(),
    avg_utilization_pct: z.number().min(0).max(100),
  }),
  routes: z.array(RouteSchema),
  unassigned_tasks: z.array(z.object({ task_id: z.string(), reason: z.string() })),
  warnings: z.array(z.string()),
});

export type OptimizationResult = z.infer<typeof OptimizationResultSchema>;

// ── System prompt ─────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a fleet route optimization engine for a Ukrainian logistics carrier.

Your ONLY job: produce an optimal assignment of freight tasks to available trucks, with detailed multi-stop routes.

## CONTEXT
- All operations are in Ukraine. Use realistic Ukrainian road distances (not straight-line).
- Road speed varies: highways ~80 km/h, regional roads ~60 km/h, urban ~35 km/h.
- Currency is UAH. Estimated cost per km: ~25 UAH/km (fuel + maintenance).
- Weights are in TONNES (t), not kg.

## OPTIMIZATION OBJECTIVES (strict priority order)
1. FEASIBILITY — every task must be assigned or explicitly marked unassignable with a reason.
2. HARD CONSTRAINTS — never exceed truck payload_t, never miss delivery deadlines, never schedule incompatible cargo types together.
3. MINIMIZE EMPTY KM — combine tasks into multi-stop routes where pickup/delivery points are nearby.
4. MAXIMIZE TRUCK UTILIZATION — fill trucks to highest practical capacity. Fewer trucks used = better.
5. MINIMIZE TOTAL COST — distance × 25 UAH/km.

## CONSOLIDATION RULES
- Multiple tasks CAN share one truck if:
  - combined weight_t ≤ truck payload_t
  - all cargo_types are compatible (see below)
  - deadlines allow sequential pickup/delivery without violations
- "Hazardous" cargo CANNOT share a truck with any other cargo type.
- "Refrigerated" cargo can only share with other "Refrigerated" cargo.
- Priority "EMERGENCY" tasks must be assigned first; they get a dedicated truck if needed.
- Prefer grouping tasks with nearby pickup OR nearby delivery points.

## CARGO TYPE vs TRUCK TYPE COMPATIBILITY
- General → any truck type
- Refrigerated → Refrigerated truck only
- Hazardous → Truck or Semi (not Refrigerated, not Flatbed)
- Oversized → Flatbed only
- Fragile → Truck or Semi

## ROUTE CONSTRUCTION RULES
- Each route starts at the truck's current_location.
- Each route is a sequence of LEGS. Leg types: "deadhead" (empty travel), "loaded" (carrying cargo), "rest" (break).
- Legs must be ordered: arrive at pickup → load → drive to delivery → unload → next task or end.
- Route must complete before the earliest deadline of assigned tasks.

## DISTANCE ESTIMATION
Use these approximate road distances between major Ukrainian cities:
- Kyiv ↔ Lviv: 540 km
- Kyiv ↔ Odesa: 475 km
- Kyiv ↔ Kharkiv: 480 km
- Kyiv ↔ Dnipro: 480 km
- Lviv ↔ Odesa: 800 km
- Kharkiv ↔ Dnipro: 220 km
- Kyiv ↔ Vinnytsia: 270 km
- Kyiv ↔ Zhytomyr: 140 km
For other city pairs, estimate proportionally based on geographic position.

## OUTPUT FORMAT
Respond with ONLY valid JSON. No markdown fences, no comments, no explanation. First character must be '{'.

{
  "plan": {
    "total_distance_km": <number>,
    "total_cost_uah": <number>,
    "total_empty_km": <number>,
    "trucks_used": <number>,
    "trucks_idle": <number>,
    "avg_utilization_pct": <number>
  },
  "routes": [
    {
      "truck_id": "<string — must match input truck id exactly>",
      "task_ids": ["<string>"],
      "total_weight_t": <number>,
      "weight_utilization_pct": <number>,
      "legs": [
        {
          "leg_index": <number starting at 0>,
          "type": "deadhead" | "loaded" | "rest",
          "from": { "address": "<string>", "lat": <number>, "lng": <number> },
          "to": { "address": "<string>", "lat": <number>, "lng": <number> },
          "distance_km": <number>,
          "estimated_departure": "<ISO datetime UTC+2>",
          "estimated_arrival": "<ISO datetime UTC+2>",
          "driving_time_minutes": <number>,
          "task_ids_on_board": ["<string>"],
          "action": "<string in Ukrainian>"
        }
      ],
      "total_distance_km": <number>,
      "empty_km": <number>,
      "total_cost_uah": <number>,
      "estimated_start": "<ISO datetime>",
      "estimated_end": "<ISO datetime>",
      "total_duration_hours": <number>
    }
  ],
  "unassigned_tasks": [
    { "task_id": "<string>", "reason": "<string>" }
  ],
  "warnings": ["<string>"]
}

## ACTION DESCRIPTIONS (use Ukrainian)
- "Порожній перегін до точки завантаження"
- "Завантаження: [cargo description]"
- "Перевезення вантажу до [destination]"
- "Розвантаження: [cargo description]"
- "Відпочинок водія"

## CRITICAL RULES
- Output ONLY valid JSON. First character must be '{'.
- Every input task_id appears in exactly one route's task_ids OR in unassigned_tasks.
- Never exceed payload_t. Double-check arithmetic.
- Never schedule arrival after a task deadline.
- All times are Europe/Kyiv (UTC+2).
- If input has 0 tasks or 0 trucks, return empty routes with appropriate warnings.
`;

// ── Business rule validation ──────────────────────────────────────────────────

function validateBusinessRules(
  result: OptimizationResult,
  input: OptimizationInput,
): string[] {
  const errors: string[] = [];

  // 1. All tasks accounted for
  const assignedTaskIds = result.routes.flatMap((r) => r.task_ids);
  const unassignedTaskIds = result.unassigned_tasks.map((u) => u.task_id);
  const allResultIds = new Set([...assignedTaskIds, ...unassignedTaskIds]);

  for (const t of input.tasks) {
    if (!allResultIds.has(t.id)) {
      errors.push(`Task ${t.id} missing from result`);
    }
  }

  // 2. No task assigned twice
  const seen = new Set<string>();
  for (const id of assignedTaskIds) {
    if (seen.has(id)) errors.push(`Task ${id} assigned to multiple routes`);
    seen.add(id);
  }

  // 3. Truck capacity not exceeded
  for (const route of result.routes) {
    const truck = input.trucks.find((t) => t.id === route.truck_id);
    if (!truck) {
      errors.push(`Route references unknown truck ${route.truck_id}`);
      continue;
    }
    if (route.total_weight_t > truck.payload_t + 0.01) {
      errors.push(
        `Truck ${truck.id}: weight ${route.total_weight_t}t exceeds payload ${truck.payload_t}t`,
      );
    }
  }

  // 4. No truck used twice
  const usedTrucks = new Set<string>();
  for (const route of result.routes) {
    if (usedTrucks.has(route.truck_id)) {
      errors.push(`Truck ${route.truck_id} assigned to multiple routes`);
    }
    usedTrucks.add(route.truck_id);
  }

  // 5. Cargo type / truck type compatibility
  const truckTypeCompatibility: Record<string, string[]> = {
    Truck: ["General", "Hazardous", "Fragile"],
    Semi: ["General", "Hazardous", "Fragile"],
    Refrigerated: ["Refrigerated"],
    Flatbed: ["General", "Oversized"],
  };

  for (const route of result.routes) {
    const truck = input.trucks.find((t) => t.id === route.truck_id);
    if (!truck) continue;
    const allowed = truckTypeCompatibility[truck.type] ?? [];
    const routeTasks = input.tasks.filter((t) => route.task_ids.includes(t.id));

    for (const t of routeTasks) {
      if (!allowed.includes(t.cargo_type)) {
        errors.push(
          `Truck ${truck.id} (${truck.type}) doesn't support ${t.cargo_type} cargo (task ${t.id})`,
        );
      }
    }

    const hasHazardous = routeTasks.some((t) => t.cargo_type === "Hazardous");
    if (hasHazardous && routeTasks.length > 1) {
      errors.push(`Truck ${truck.id}: Hazardous cargo cannot share truck`);
    }
  }

  return errors;
}

// ── LLM call ──────────────────────────────────────────────────────────────────

async function callLLM(input: OptimizationInput): Promise<string> {
  const google = createGoogleGenerativeAI({ apiKey: env.GEMINI_API_KEY });

  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    system: SYSTEM_PROMPT,
    prompt: JSON.stringify(input, null, 2),
    temperature: 0.1,
    maxOutputTokens: 16000,
  });

  return text;
}

// ── Main optimization function ────────────────────────────────────────────────

export async function optimizeRoutes(
  input: OptimizationInput,
  maxRetries = 2,
): Promise<OptimizationResult> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const raw = await callLLM(input);

      // Strip markdown fences if model ignores the instruction
      const jsonStr = raw
        .replace(/^```(?:json)?\n?/m, "")
        .replace(/\n?```$/m, "")
        .trim();

      const parsed = JSON.parse(jsonStr);
      const result = OptimizationResultSchema.parse(parsed);

      const errors = validateBusinessRules(result, input);
      if (errors.length > 0) {
        throw new Error(`Business rule violations:\n${errors.join("\n")}`);
      }

      return result;
    } catch (err) {
      lastError = err as Error;
      console.warn(`Route optimization attempt ${attempt + 1} failed:`, lastError.message);
    }
  }

  throw new Error(
    `Route optimization failed after ${maxRetries + 1} attempts: ${lastError?.message}`,
  );
}
