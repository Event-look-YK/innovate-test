# Routes — LLM Optimization Feature

FE integration docs for all four `/routes` endpoints. Focus is on `POST /routes/generate` which replaces the old greedy algorithm with LLM-based route optimization.

**Base URL:** `VITE_SERVER_URL` (default: `http://localhost:3000`)  
**Auth:** All routes require a valid session cookie (Better Auth). No bearer token — cookies are sent automatically by the browser.

---

## Table of Contents

1. [POST /routes/generate](#1-post-routesgenerate)
2. [GET /routes](#2-get-routes)
3. [GET /routes/:routeId](#3-get-routesrouteid)
4. [PATCH /routes/:routeId/status](#4-patch-routesrouteidstatus)

---

## 1. POST /routes/generate

Sends selected tasks and trucks to the LLM optimizer. The LLM assigns tasks to trucks, builds multi-stop routes, and saves them to the DB. All assigned tasks are updated to status `"Assigned"`.

**This call is slow (~5–15 s) due to the LLM.** Show a loading state.

### Auth & Roles

- Requires active session
- Allowed roles: `CARRIER_ADMIN`, `CARRIER_MANAGER`
- User must belong to a company (`companyId` must exist on their profile)

### Request

```
POST /routes/generate
Content-Type: application/json
```

#### Body

```ts
{
  taskIds: string[];   // min 1 item — IDs of tasks to optimize (must be Pending, must belong to user's company)
  truckIds: string[];  // min 1 item — IDs of trucks to use (must belong to user's company)
}
```

#### Example

```json
{
  "taskIds": ["task_abc123", "task_def456", "task_ghi789"],
  "truckIds": ["truck_xyz111", "truck_xyz222"]
}
```

#### Validation rules

| Field | Rule |
|-------|------|
| `taskIds` | Required. Array of strings. Min 1 item. |
| `truckIds` | Required. Array of strings. Min 1 item. |

If the body fails validation, the server responds with `400` before calling the LLM.

### Response — Success `200`

```ts
{
  plan: {
    total_distance_km: number;      // sum of all route distances
    total_cost_uah: number;         // estimated cost (distance × 25 UAH/km)
    total_empty_km: number;         // deadhead (empty) km across all routes
    trucks_used: number;            // how many trucks got at least one task
    trucks_idle: number;            // trucks that stayed empty
    avg_utilization_pct: number;    // average weight utilization across used trucks (0–100)
  };
  routes: Array<{
    id: string;                     // routePlan DB id — use this for GET /routes/:routeId
    truckName: string;              // truck.name
    distanceKm: number;
    durationHours: number;
    loadT: number;                  // total cargo weight in tonnes
    capacityT: number;              // truck payload capacity in tonnes
    status: "draft";                // always "draft" on creation
    createdAt: string;              // ISO datetime
    stops: Array<{
      id: string;
      label: string;                // address / location name
      eta: string;                  // ISO datetime — estimated arrival
      note: string | null;          // Ukrainian-language action description, e.g. "Завантаження: ..."
      sortOrder: number;            // 0-based leg index — use to render stops in order
    }>;
  }>;
  unassigned: Array<{
    task_id: string;
    reason: string;                 // why the LLM could not assign this task
  }>;
  warnings: string[];               // non-fatal LLM warnings (e.g. tight deadline, suboptimal route)
}
```

#### Example response

```json
{
  "plan": {
    "total_distance_km": 920,
    "total_cost_uah": 23000,
    "total_empty_km": 80,
    "trucks_used": 2,
    "trucks_idle": 0,
    "avg_utilization_pct": 78.5
  },
  "routes": [
    {
      "id": "rp_01jxabc",
      "truckName": "Volvo FH16 — АА1234КК",
      "distanceKm": 540,
      "durationHours": 7.5,
      "loadT": 18.5,
      "capacityT": 20,
      "status": "draft",
      "createdAt": "2026-04-04T10:00:00.000Z",
      "stops": [
        {
          "id": "rs_01stop1",
          "label": "Київ, вул. Промислова 5",
          "eta": "2026-04-04T08:00:00+02:00",
          "note": "Порожній перегін до точки завантаження",
          "sortOrder": 0
        },
        {
          "id": "rs_01stop2",
          "label": "Київ, вул. Промислова 5",
          "eta": "2026-04-04T08:30:00+02:00",
          "note": "Завантаження: Загальний вантаж 18.5т",
          "sortOrder": 1
        },
        {
          "id": "rs_01stop3",
          "label": "Львів, вул. Городоцька 1",
          "eta": "2026-04-04T15:45:00+02:00",
          "note": "Розвантаження: Загальний вантаж",
          "sortOrder": 2
        }
      ]
    }
  ],
  "unassigned": [],
  "warnings": []
}
```

### Side effects

- All tasks in `routes[].task_ids` (internally) → status updated to `"Assigned"`, `assignedTruckId` set
- Tasks in `unassigned[]` → status stays `"Pending"`
- Route plans saved with `status: "draft"`

### Error responses

| Status | `code` | Trigger |
|--------|--------|---------|
| `400` | `BAD_REQUEST` | Body validation failed (missing fields, empty arrays) |
| `400` | `BAD_REQUEST` | `"No valid tasks found"` — none of the taskIds belong to this company |
| `400` | `BAD_REQUEST` | `"No valid trucks found"` — none of the truckIds belong to this company |
| `400` | `BAD_REQUEST` | `"No company associated with this account"` — user has no companyId |
| `401` | `UNAUTHORIZED` | No session cookie |
| `403` | `FORBIDDEN` | Role is `CARRIER_DRIVER` or `CARRIER_WAREHOUSE_MANAGER` |
| `502` | — | LLM optimization failed after 3 attempts (includes reason in `error` field) |

#### Error response shape

```json
{ "error": "No valid tasks found", "code": "BAD_REQUEST" }
```

For `502`:
```json
{ "error": "Route optimization failed after 3 attempts: Business rule violations:\nTask task_abc123 missing from result" }
```

### UX guidance

- **Before calling:** Let the user select tasks (filter by `status: "Pending"`) and trucks separately in the UI. Both multi-selects are required.
- **During call:** Show a spinner with message like "Оптимізуємо маршрути..." — expect 5–20 s.
- **On success:** Show `plan` stats (total cost, distance, utilization), render each route's stops as a timeline or map polyline. Show `unassigned[]` as a warning list so the user knows which tasks were skipped.
- **On `warnings[]`:** Display as dismissible info banners below the result.
- **On `502`:** Show a retry button — the LLM is non-deterministic, a second attempt often succeeds.

---

## 2. GET /routes

List all route plans for the current user's company.

### Auth & Roles

- Requires active session
- Allowed roles: `CARRIER_ADMIN`, `CARRIER_MANAGER`, `CARRIER_DRIVER`
- Drivers only see routes where they are the assigned driver

### Request

```
GET /routes?page=1&limit=20&status=draft
```

#### Query params

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | Page number (1-based) |
| `limit` | number | `20` | Items per page. Max `100`. |
| `status` | `"draft" \| "active" \| "completed"` | — | Filter by status. Omit to get all. |

### Response — Success `200`

```ts
{
  data: Array<{
    id: string;
    truckId: string;
    truckName: string | null;    // null if truck was deleted
    distanceKm: number;
    durationHours: number;
    loadT: number;
    capacityT: number;
    status: "draft" | "active" | "completed";
    createdAt: string;           // ISO datetime
  }>;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### Error responses

| Status | `code` | Trigger |
|--------|--------|---------|
| `401` | `UNAUTHORIZED` | No session |
| `403` | `FORBIDDEN` | Role not allowed |

---

## 3. GET /routes/:routeId

Get full detail for a single route, including all stops and linked tasks.

### Auth & Roles

- Requires active session
- Allowed roles: `CARRIER_ADMIN`, `CARRIER_MANAGER`, `CARRIER_DRIVER`
- Drivers get all routes (no driver-filter here, unlike the list endpoint)

### Request

```
GET /routes/:routeId
```

### Response — Success `200`

```ts
{
  id: string;
  truckId: string;
  truckName: string | null;
  driverId: string | null;
  distanceKm: number;
  durationHours: number;
  loadT: number;
  capacityT: number;
  status: "draft" | "active" | "completed";
  createdAt: string;
  stops: Array<{
    id: string;
    routePlanId: string;
    label: string;
    lat: number;
    lng: number;
    eta: string;                 // ISO datetime
    note: string | null;         // Ukrainian action description
    sortOrder: number;           // render stops in ascending sortOrder
  }>;
  tasks: Array<{
    id: string;
    title: string;
    cargoType: "General" | "Refrigerated" | "Hazardous" | "Oversized" | "Fragile";
    weightT: number;
    originLabel: string;
    destinationLabel: string;
    status: "Pending" | "Assigned" | "InTransit" | "Delivered" | "Completed";
    priority: "LOW" | "MEDIUM" | "HIGH" | "EMERGENCY";
  }>;
}
```

### Error responses

| Status | `code` | Trigger |
|--------|--------|---------|
| `404` | `NOT_FOUND` | Route doesn't exist or belongs to another company |
| `401` | `UNAUTHORIZED` | No session |
| `403` | `FORBIDDEN` | Role not allowed |

---

## 4. PATCH /routes/:routeId/status

Advance a route's lifecycle status. Allowed transitions:

```
draft → active → completed
```

No other transitions are permitted (can't go backwards, can't skip steps).

### Auth & Roles

- Requires active session
- Allowed roles: `CARRIER_ADMIN`, `CARRIER_MANAGER`

### Request

```
PATCH /routes/:routeId/status
Content-Type: application/json
```

#### Body

```ts
{
  status: "active" | "completed"
}
```

### Response — Success `200`

```json
{ "id": "rp_01jxabc", "status": "active" }
```

### Side effects

| Transition | Side effect |
|------------|-------------|
| `draft → active` | Truck status → `"on_road"` |
| `active → completed` | Truck status → `"idle"`. All linked tasks → status `"Completed"`. |

### Error responses

| Status | `code` | Trigger |
|--------|--------|---------|
| `400` | `BAD_REQUEST` | Invalid transition (e.g. `draft → completed`, or route already `completed`) |
| `400` | `BAD_REQUEST` | Body validation failed |
| `404` | `NOT_FOUND` | Route not found |
| `401` | `UNAUTHORIZED` | No session |
| `403` | `FORBIDDEN` | Role not allowed |

---

## Enums reference

### Cargo type

| Value | Compatible truck types |
|-------|----------------------|
| `"General"` | Truck, Semi, Refrigerated, Flatbed |
| `"Refrigerated"` | Refrigerated only |
| `"Hazardous"` | Truck, Semi only. Cannot share with other cargo. |
| `"Oversized"` | Flatbed only |
| `"Fragile"` | Truck, Semi only |

### Task priority

| Value | Meaning |
|-------|---------|
| `"EMERGENCY"` | Gets a dedicated truck if needed |
| `"HIGH"` | Assigned before medium/low |
| `"MEDIUM"` | Standard |
| `"LOW"` | Lowest priority |

### Task status

| Value | Set by |
|-------|--------|
| `"Pending"` | Default on creation |
| `"Assigned"` | Set by `POST /routes/generate` |
| `"InTransit"` | Set manually |
| `"Delivered"` | Set manually |
| `"Completed"` | Set by `PATCH /routes/:id/status` → `completed` |

### Route status

| Value | Transition |
|-------|------------|
| `"draft"` | Created by `POST /routes/generate` |
| `"active"` | Via `PATCH` |
| `"completed"` | Via `PATCH` |

### Leg types (in `stops[].note`)

The `note` field on each stop is a Ukrainian-language description of what happens at that stop. It comes directly from the LLM, so it's human-readable but not a machine-parseable enum. Examples:

- `"Порожній перегін до точки завантаження"` — deadhead leg (truck traveling empty)
- `"Завантаження: ..."` — loading cargo
- `"Перевезення вантажу до ..."` — transit leg
- `"Розвантаження: ..."` — unloading cargo
- `"Відпочинок водія"` — driver rest stop

---

## Suggested FE flow for route generation

```
1. User selects Pending tasks from task list  →  taskIds[]
2. User selects available trucks from fleet   →  truckIds[]
3. User clicks "Генерувати маршрути"
4. POST /routes/generate  (show spinner ~5–20s)
5. On success:
   a. Show plan.total_cost_uah, plan.avg_utilization_pct summary
   b. Render each route as a card with its stops timeline
   c. Show unassigned[] tasks as warnings
   d. Show warnings[] as info banners
6. User reviews draft routes
7. User clicks "Активувати" → PATCH /routes/:id/status { status: "active" }
8. Truck status becomes "on_road"
9. After delivery → PATCH /routes/:id/status { status: "completed" }
10. Tasks automatically marked Completed, truck returns to idle
```
