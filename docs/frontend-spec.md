# Frontend Design Document — Logistics Platform

## 1. Overview

Platform for carrier companies to optimise fleet logistics: dynamic route generation, peak-demand resolution via freelance drivers, and offline-first communication between warehouse managers, drivers and operations managers.

### Tech stack

| Layer | Choice |
|---|---|
| Framework | React 19 + Vite |
| Routing | TanStack Router (file-based) |
| Data fetching | TanStack Query (server data via typed HTTP to Fastify) |
| Local persistence | **Dexie** (IndexedDB schema, migrations) + **TanStack DB** (collections, live queries, sync-friendly client cache) |
| State | Zustand (client), nuqs (URL params) |
| UI kit | shadcn/ui (`@innovate-test/ui`) + Tailwind 4 |
| Auth | Better Auth (email/password + roles) |
| Offline / local-first | Service worker + Dexie outbox + TanStack DB collections, BLE mesh relay |
| Maps | Mapbox GL JS (routes, truck GPS, geofencing) |

### Roles

| Code | Description |
|---|---|
| `CARRIER_ADMIN` | Company owner. Registers self, invites all other carrier roles. Full access. |
| `CARRIER_MANAGER` | Operations manager. Creates tasks, triggers route generation, manages demand. |
| `CARRIER_DRIVER` | Company driver. Receives assigned routes, updates status, communicates. |
| `CARRIER_WAREHOUSE_MANAGER` | Warehouse staff. Creates cargo tasks, confirms loading/unloading. |
| `FREELANCE_DRIVER` | Independent driver. Self-registers, receives and accepts freight offers. |

---

## 2. Information Architecture

```
/                           → redirect → /dashboard (authenticated) or /auth/sign-in
/auth/sign-in               → sign-in (email + password)
/auth/sign-up               → carrier admin registration (step-by-step)
/auth/sign-up/freelance     → freelance driver self-registration

── authenticated shell (sidebar + topbar) ──────────────────────────
/dashboard                  → role-aware dashboard
/fleet                      → truck / trailer management         [ADMIN, MANAGER]
/fleet/:truckId             → single truck detail + GPS history
/team                       → invite & manage team members        [ADMIN]
/team/invite                → invite form (role picker)
/tasks                      → task board (kanban or list)         [ALL]
/tasks/new                  → create task form                    [MANAGER, WAREHOUSE_MANAGER]
/tasks/:taskId              → task detail + status timeline
/routes                     → generated route plans               [ADMIN, MANAGER]
/routes/generate            → route generation wizard
/routes/:routeId            → single route on map + stops
/demand                     → freelance demand board              [ADMIN, MANAGER]
/demand/:requestId          → offer detail / negotiation
/offers                     → inbound freight offers              [FREELANCE_DRIVER]
/offers/:offerId            → single offer + accept / decline
/messages                   → conversations (offline-capable)     [ALL]
/messages/:threadId         → thread detail
/settings                   → profile, company, notifications     [ALL]
/settings/company           → company profile                     [ADMIN]
```

---

## 3. Layouts

### 3.1 Auth layout (`auth`)

Minimal centered card on a subtle gradient background. Wraps all routes under `/auth/*` (`/auth/sign-in`, `/auth/sign-up`, `/auth/sign-up/freelance`).

```
┌─────────────────────────────────────────────┐
│              brand logo + tagline            │
│  ┌───────────────────────────────────────┐   │
│  │                                       │   │
│  │         auth form (card)              │   │
│  │                                       │   │
│  └───────────────────────────────────────┘   │
│              footer link                     │
└─────────────────────────────────────────────┘
```

### 3.2 App shell (`_authenticated`)

Collapsible sidebar + top bar. Sidebar items filtered by role.

```
┌──────┬──────────────────────────────────────┐
│ logo │  topbar: search · notifications · ⚡ │
│      │         connectivity indicator       │
├──────┼──────────────────────────────────────┤
│ nav  │                                      │
│      │          <Outlet />                  │
│ items│                                      │
│      │                                      │
│      │                                      │
├──────┤                                      │
│ user │                                      │
│ menu │                                      │
└──────┴──────────────────────────────────────┘
```

**Sidebar nav by role:**

| Item | ADMIN | MANAGER | DRIVER | WAREHOUSE | FREELANCE |
|---|---|---|---|---|---|
| Dashboard | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fleet | ✓ | ✓ | — | — | — |
| Team | ✓ | — | — | — | — |
| Tasks | ✓ | ✓ | ✓ | ✓ | — |
| Routes | ✓ | ✓ | ✓ (own) | — | — |
| Demand | ✓ | ✓ | — | — | — |
| Offers | — | — | — | — | ✓ |
| Messages | ✓ | ✓ | ✓ | ✓ | ✓ |
| Settings | ✓ | ✓ | ✓ | ✓ | ✓ |

**Topbar elements:**
- Global search (Cmd+K)
- Notification bell (badge count)
- Connectivity status indicator (online / offline / BLE)
- User avatar dropdown (profile, theme toggle, sign out)

---

## 4. Page Specifications

### 4.1 Auth Pages (`/auth/*`)

#### `/auth/sign-in`

| Element | Detail |
|---|---|
| Form fields | Email, Password |
| Actions | "Sign in" primary button |
| Links | "Create carrier account" → `/auth/sign-up`; "Join as freelance driver" → `/auth/sign-up/freelance` |
| Validation | Zod schema, inline field errors |
| UX | Disabled button + spinner on submit; toast on error |

**Mock data:** `admin@carrier.test` / `password123`

#### `/auth/sign-up` — Carrier Admin

Multi-step form (stepper).

| Step | Fields |
|---|---|
| 1 — Account | Full name, Email, Password, Confirm password |
| 2 — Company | Company name, Tax ID, Country, City |
| 3 — Confirmation | Summary card → submit |

On success → redirect to `/dashboard` with onboarding prompt.

Footer link: "Already have an account?" → `/auth/sign-in`.

#### `/auth/sign-up/freelance` — Freelance Driver

Single-page form.

| Field | Type |
|---|---|
| Full name | text |
| Email | email |
| Password | password |
| Phone | tel |
| Driver license number | text |
| Vehicle type | select (`Truck`, `Van`, `Refrigerated`) |
| Vehicle payload (t) | number |

On success → redirect to `/offers`.

Footer link: "Already have an account?" → `/auth/sign-in`.

---

### 4.2 Dashboard (`/dashboard`)

Role-aware landing page. Each role sees its own set of KPI cards + quick actions.

#### CARRIER_ADMIN / CARRIER_MANAGER

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Active tasks │ Trucks on    │ Pending      │ Route        │
│     24       │ road: 18/32  │ demand: 5    │ efficiency   │
│              │              │              │   87%        │
└──────────────┴──────────────┴──────────────┴──────────────┘

┌─────────────────────────────┬──────────────────────────────┐
│  Fleet map (Mapbox)         │  Recent tasks (table)        │
│  Live truck positions       │  status · priority · ETA     │
│  Color-coded by status      │                              │
└─────────────────────────────┴──────────────────────────────┘

Quick actions:  [+ New task]  [Generate routes]  [Invite team member]
```

**Mock KPIs:**
- Active tasks: 24
- Trucks on road: 18 / 32
- Pending demand requests: 5
- Average route efficiency: 87%

#### CARRIER_DRIVER

```
┌─────────────────────────────────────────────┐
│  My current route (map + stop list)          │
│  Next stop: Warehouse B, Kyiv — ETA 14:30   │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  Upcoming tasks (list, sorted by deadline)   │
└─────────────────────────────────────────────┘
```

#### CARRIER_WAREHOUSE_MANAGER

```
┌──────────────┬──────────────┬──────────────┐
│ Pending      │ Loading      │ Dispatched   │
│ pickups: 6   │ now: 2       │ today: 11    │
└──────────────┴──────────────┴──────────────┘
┌─────────────────────────────────────────────┐
│  Today's cargo schedule (timeline)           │
└─────────────────────────────────────────────┘
```

#### FREELANCE_DRIVER

```
┌──────────────┬──────────────┬──────────────┐
│ New offers   │ Active jobs  │ Earnings     │
│     3        │     1        │ ₴ 12,400     │
└──────────────┴──────────────┴──────────────┘
┌─────────────────────────────────────────────┐
│  Open offers near you (map + list)           │
└─────────────────────────────────────────────┘
```

---

### 4.3 Fleet Management (`/fleet`)

Table view with filters + map toggle.

**Table columns:** Name · Type · Payload (t) · Trailer · Status · Location · Actions

**Filters:** Type (dropdown), Status (`idle`, `on_road`, `maintenance`), Search by name/plate.

**Actions per row:** View detail, Edit, Deactivate.

#### Add / Edit Truck dialog

| Field | Type | Notes |
|---|---|---|
| Name / plate | text | Required |
| Type | select | `Truck`, `Semi`, `Refrigerated`, `Flatbed` |
| Payload capacity (t) | number | |
| Trailer | select or "None" | Links to existing trailers |
| GPS tracker ID | text | For live location |
| Current location | map pin or address | Initial position |

**Mock fleet (seed):**

| Name | Type | Payload | Location |
|---|---|---|---|
| MAN TGX #01 | Semi | 24t | Uman |
| KAMAZ 5490 #02 | Truck | 18t | Zhytomyr |
| Volvo FH #03 | Refrigerated | 20t | Kyiv |
| DAF XF #04 | Flatbed | 22t | Lviv |
| MAN TGS #05 | Semi | 24t | Odesa |

#### `/fleet/:truckId`

- Truck info card (name, type, payload, trailer, driver assignment).
- Map with GPS trail (last 24h path).
- Task history table.
- Maintenance log (future).

---

### 4.4 Team Management (`/team`) — ADMIN only

Table of all team members.

**Columns:** Name · Email · Role · Status · Invited at · Actions

**Actions:** Edit role, Deactivate, Resend invite.

#### Invite flow (`/team/invite`)

Form:

| Field | Type |
|---|---|
| Email | email |
| Full name | text |
| Role | select (`CARRIER_MANAGER`, `CARRIER_DRIVER`, `CARRIER_WAREHOUSE_MANAGER`) |

On submit → sends invite email with registration link pre-filled with role. Mock: instant creation.

**Mock team:**

| Name | Role |
|---|---|
| Ivan Petrov | CARRIER_MANAGER |
| Olena Koval | CARRIER_DRIVER |
| Dmytro Shevchenko | CARRIER_DRIVER |
| Maria Bondar | CARRIER_WAREHOUSE_MANAGER |

---

### 4.5 Tasks (`/tasks`)

Dual view: **Kanban board** (default) / **Table list** (toggle).

#### Kanban columns

`Pending` → `Assigned` → `In transit` → `Delivered` → `Completed`

#### Task card (kanban)

```
┌──────────────────────────────────┐
│ 🔴 HIGH           deadline 04/10 │
│ Steel coils → Kyiv warehouse     │
│ Uman → Kyiv  ·  240 km          │
│ Assigned: MAN TGX #01           │
└──────────────────────────────────┘
```

Priority badge colors: `EMERGENCY` = red pulse, `HIGH` = red, `MEDIUM` = amber, `LOW` = gray.

#### Create task (`/tasks/new`)

| Field | Type | Notes |
|---|---|---|
| Title | text | Short description |
| Cargo description | textarea | What is being transported |
| Cargo type | select | `General`, `Refrigerated`, `Hazardous`, `Oversized`, `Fragile` |
| Weight (t) | number | |
| Point A (origin) | address autocomplete + map | Geocoded |
| Point B (destination) | address autocomplete + map | Geocoded |
| Deadline | datetime picker | |
| Priority | select | `LOW`, `MEDIUM`, `HIGH`, `EMERGENCY` |
| Assigned truck | select (optional) | Can be auto-assigned by route optimizer |
| Notes | textarea | |

**Mock tasks (seed):**

| Title | Cargo | A → B | Deadline | Priority |
|---|---|---|---|---|
| Steel coils delivery | General, 18t | Uman → Kyiv | Apr 10 | HIGH |
| Frozen fish transport | Refrigerated, 12t | Odesa → Lviv | Apr 8 | EMERGENCY |
| Electronics shipment | Fragile, 5t | Kyiv → Zhytomyr | Apr 12 | MEDIUM |
| Construction materials | General, 22t | Lviv → Uman | Apr 15 | LOW |
| Medical supplies | General, 3t | Zhytomyr → Kyiv | Apr 7 | EMERGENCY |

#### `/tasks/:taskId`

- Header: title, priority badge, status badge, deadline countdown.
- Detail card: cargo info, weight, type.
- Route mini-map: A → B with distance and estimated time.
- Assignment section: truck + driver (or "Unassigned").
- Status timeline: vertical stepper showing status history with timestamps.
- Actions: Update status (driver), Reassign (manager), Cancel (manager/admin).
- Communication thread: inline message feed linked to this task (offline-capable).

---

### 4.6 Route Generation (`/routes`)

#### Route list

Table: Route ID · Stops · Distance · Trucks assigned · Status · Created · Actions.

#### Route generation wizard (`/routes/generate`)

**Step 1 — Input tasks:**
Multi-select from unassigned tasks. Each task shows origin → destination, weight, priority, deadline. Table with checkboxes.

**Step 2 — Select available trucks:**
Multi-select from idle fleet. Shows type, payload, current location on mini-map.

**Step 3 — Configure:**

| Option | Type | Default |
|---|---|---|
| Optimize for | radio | `Distance` / `Time` / `Fuel cost` |
| Max route duration | number (hours) | 10 |
| Allow multi-drop | toggle | true |
| Respect deadlines strictly | toggle | true |

**Step 4 — Review generated routes:**
Map view with color-coded routes per truck. Each route card:

```
┌─────────────────────────────────────────────────────┐
│ Route #1 — MAN TGX #01                              │
│ Uman → Kyiv → Zhytomyr                              │
│ 3 stops · 420 km · ~6h · 18t / 24t capacity         │
│                                                      │
│ Stop 1: Uman (pickup Steel coils) — 09:00            │
│ Stop 2: Kyiv (deliver Steel coils, pickup Electr.) — │
│ Stop 3: Zhytomyr (deliver Electronics) — 15:30       │
│                                                      │
│ [Accept route]  [Modify]                             │
└─────────────────────────────────────────────────────┘
```

**Step 5 — Confirm & dispatch.**
Accepted routes assign trucks to tasks, update task statuses to `Assigned`, notify drivers.

#### `/routes/:routeId`

Full-screen map with the route path, stops, ETAs. Side panel with stop list (reorderable drag-and-drop). Live truck position overlay if in transit.

---

### 4.7 Demand Management (`/demand`)

When route generation identifies **not enough trucks** for pending tasks, it creates demand requests.

#### Demand board

Table: Request ID · Task · Required truck type · Payload · Route · Budget · Status · Actions.

Status: `Open` → `Offers sent` → `Accepted` → `In progress` → `Completed`.

#### `/demand/:requestId`

- Task summary card.
- Route map.
- **Matched freelancers list:** nearby freelance drivers whose vehicle matches requirements.
- Per freelancer: name, vehicle, distance from pickup, rating, price.
- Actions: "Send offer" (to one or many), "Auto-send to best match".

---

### 4.8 Offers (`/offers`) — Freelance Driver

List of incoming freight offers.

#### Offer card

```
┌─────────────────────────────────────────────┐
│ Frozen fish transport                        │
│ Odesa → Lviv · 680 km · Refrigerated        │
│ Weight: 12t · Deadline: Apr 8               │
│ Offered price: ₴ 18,500                     │
│                                              │
│ [Accept]  [Decline]  [Counter-offer]         │
└─────────────────────────────────────────────┘
```

#### `/offers/:offerId`

- Full cargo detail.
- Route map with distance / estimated fuel cost.
- Carrier company info (name, rating).
- Accept / Decline / Counter-offer form (proposed price + message).

---

### 4.9 Messages (`/messages`) — Offline-first

Split-pane layout: thread list (left) + active thread (right).

**Thread types:**
- Task thread (auto-created per task, includes all stakeholders).
- Direct message (1:1).
- Group chat (custom).

**Message features:**
- Text messages.
- Location sharing (pin on map).
- Photo attachments (cargo condition).
- Status indicator: sent → delivered → read. Pending (queued offline) shown with clock icon.

**Offline behavior:**
- Messages and outbox rows persist in **Dexie**; **TanStack DB** exposes threads/messages as collections for reactive UI and eventual sync.
- Queued messages sync when connectivity restores (Wi-Fi / cellular); outbox drained via TanStack Query mutations.
- BLE mesh: nearby devices relay messages via Web Bluetooth API when no internet.
- Connectivity banner: "You are offline. Messages will be sent when connection is restored."

---

### 4.10 Settings (`/settings`)

Tabs: **Profile** · **Company** (admin only) · **Notifications** · **Appearance**.

#### Profile tab
| Field | Type |
|---|---|
| Avatar | image upload |
| Full name | text |
| Email | text (readonly) |
| Phone | tel |
| Language | select (`uk`, `en`) |

#### Company tab (ADMIN)
| Field | Type |
|---|---|
| Company name | text |
| Logo | image upload |
| Tax ID | text |
| Country / City | selects |

#### Notifications tab
Toggle switches for: task assignments, route updates, offer received, messages, emergency alerts.

#### Appearance tab
Theme toggle: Light / Dark / System.

---

## 5. Local data (Dexie + TanStack DB)

- **Dexie** defines versioned stores: `messages`, `messageOutbox`, `threads`, optional `taskSnapshots`, etc. Use it for durable writes, migrations, and bulk export.
- **TanStack DB** holds client-side collections synced from Dexie and/or server responses; components subscribe via live queries. Prefer TanStack DB for UI-bound lists; Dexie remains the source of truth on disk until the server confirms.
- **TanStack Query** fetches remote data; on success, write-through to Dexie + hydrate TanStack DB collections where offline reads are required.

---

## 6. FSD File Structure (mock-first)

Imports use **concrete paths** (e.g. `@/features/fleet/ui/fleet-table`). No `index.ts` barrels in features or views.

```
apps/web/src/
├── shared/
│   ├── assets/
│   │   └── logo.svg
│   ├── constants/
│   │   ├── roles.ts                   # CARRIER_ADMIN, ... enum/map
│   │   └── task-status.ts             # Pending, Assigned, InTransit, ...
│   ├── db/
│   │   ├── dexie-schema.ts            # Dexie database class + tables + version
│   │   ├── dexie-migrations.ts        # version bumps
│   │   ├── collections.ts             # TanStack DB collection definitions + sync helpers
│   │   └── seed-local.ts              # optional: seed Dexie for demos
│   ├── hooks/
│   │   ├── use-current-user.ts        # session + role from auth
│   │   └── use-connectivity.ts        # online / offline / ble status
│   ├── lib/
│   │   ├── auth-client.ts             # (exists) better-auth client
│   │   ├── format.ts                  # distance, weight, currency formatters
│   │   └── http.ts                    # typed fetch helpers + base URL from env
│   ├── providers/
│   │   ├── query-provider.tsx
│   │   └── offline-provider.tsx       # Dexie + TanStack DB + BLE relay context
│   ├── stores/
│   │   ├── user.ts                    # Zustand: current user + role
│   │   └── connectivity.ts            # Zustand: network state
│   ├── types/
│   │   ├── truck.ts                   # Truck, Trailer types
│   │   ├── task.ts                    # Task, CargoType, Priority types
│   │   ├── route.ts                   # Route, Stop types
│   │   ├── offer.ts                   # FreelanceOffer type
│   │   └── user.ts                    # User, Role types
│   ├── ui/
│   │   ├── page-loader.tsx
│   │   ├── connectivity-badge.tsx
│   │   ├── priority-badge.tsx
│   │   ├── status-badge.tsx
│   │   └── role-guard.tsx             # renders children only for allowed roles
│   └── middlewares/
│       └── auth.ts                    # (exists) TanStack auth middleware
│
├── features/
│   ├── auth/
│   │   ├── ui/
│   │   │   ├── sign-in-form.tsx
│   │   │   ├── sign-up-carrier-form.tsx
│   │   │   └── sign-up-freelance-form.tsx
│   │   └── lib/
│   │       └── validation.ts          # Zod schemas for auth forms
│   │
│   ├── fleet/
│   │   ├── ui/
│   │   │   ├── fleet-table.tsx
│   │   │   ├── truck-card.tsx
│   │   │   ├── truck-form.tsx          # add / edit dialog
│   │   │   ├── truck-map.tsx           # single truck GPS trail
│   │   │   └── fleet-map.tsx           # all trucks on map
│   │   ├── hooks/
│   │   │   └── use-fleet.ts            # mock data hook (TanStack Query shape)
│   │   └── lib/
│   │       ├── mock-data.ts            # seed trucks
│   │       └── validation.ts
│   │
│   ├── team/
│   │   ├── ui/
│   │   │   ├── team-table.tsx
│   │   │   └── invite-form.tsx
│   │   ├── hooks/
│   │   │   └── use-team.ts
│   │   └── lib/
│   │       └── mock-data.ts
│   │
│   ├── tasks/
│   │   ├── ui/
│   │   │   ├── task-board.tsx          # kanban
│   │   │   ├── task-table.tsx          # list view
│   │   │   ├── task-card.tsx           # kanban card
│   │   │   ├── task-form.tsx           # create / edit
│   │   │   ├── task-detail.tsx         # full detail panel
│   │   │   └── task-timeline.tsx       # status history stepper
│   │   ├── hooks/
│   │   │   └── use-tasks.ts
│   │   └── lib/
│   │       ├── mock-data.ts
│   │       └── validation.ts
│   │
│   ├── routes/
│   │   ├── ui/
│   │   │   ├── route-table.tsx
│   │   │   ├── route-map.tsx           # full map with route polylines
│   │   │   ├── route-card.tsx          # single route summary
│   │   │   ├── route-wizard.tsx        # multi-step generation
│   │   │   └── stop-list.tsx           # reorderable stop list
│   │   ├── hooks/
│   │   │   └── use-routes.ts
│   │   └── lib/
│   │       ├── mock-data.ts
│   │       └── optimizer.ts            # client-side mock optimizer
│   │
│   ├── demand/
│   │   ├── ui/
│   │   │   ├── demand-table.tsx
│   │   │   ├── demand-detail.tsx
│   │   │   └── freelancer-match-list.tsx
│   │   ├── hooks/
│   │   │   └── use-demand.ts
│   │   └── lib/
│   │       └── mock-data.ts
│   │
│   ├── offers/
│   │   ├── ui/
│   │   │   ├── offer-list.tsx
│   │   │   ├── offer-card.tsx
│   │   │   └── offer-detail.tsx
│   │   ├── hooks/
│   │   │   └── use-offers.ts
│   │   └── lib/
│   │       └── mock-data.ts
│   │
│   ├── messages/
│   │   ├── ui/
│   │   │   ├── thread-list.tsx
│   │   │   ├── message-thread.tsx
│   │   │   ├── message-bubble.tsx
│   │   │   └── compose-bar.tsx
│   │   ├── hooks/
│   │   │   └── use-messages.ts
│   │   └── lib/
│   │       ├── mock-data.ts
│   │       └── message-sync.ts         # Dexie outbox + TanStack DB message collection hooks
│   │
│   └── settings/
│       ├── ui/
│       │   ├── profile-form.tsx
│       │   ├── company-form.tsx
│       │   └── notification-toggles.tsx
│       └── lib/
│           └── validation.ts
│
├── views/
│   ├── auth/
│   │   ├── sign-in-view.tsx
│   │   ├── sign-up-carrier-view.tsx
│   │   └── sign-up-freelance-view.tsx
│   ├── dashboard/
│   │   ├── admin-dashboard-view.tsx
│   │   ├── driver-dashboard-view.tsx
│   │   ├── warehouse-dashboard-view.tsx
│   │   ├── freelance-dashboard-view.tsx
│   │   └── dashboard-view.tsx           # role switch → renders correct sub-view
│   ├── fleet/
│   │   ├── fleet-view.tsx
│   │   └── truck-detail-view.tsx
│   ├── team/
│   │   ├── team-view.tsx
│   │   └── invite-view.tsx
│   ├── tasks/
│   │   ├── tasks-view.tsx
│   │   ├── task-create-view.tsx
│   │   └── task-detail-view.tsx
│   ├── routes/
│   │   ├── routes-view.tsx
│   │   ├── route-generate-view.tsx
│   │   └── route-detail-view.tsx
│   ├── demand/
│   │   ├── demand-view.tsx
│   │   └── demand-detail-view.tsx
│   ├── offers/
│   │   ├── offers-view.tsx
│   │   └── offer-detail-view.tsx
│   ├── messages/
│   │   └── messages-view.tsx
│   └── settings/
│       └── settings-view.tsx
│
└── routes/
    ├── __root.tsx                       # (exists) html shell
    ├── auth/
    │   ├── route.tsx                    # layout: /auth, centered card + <Outlet />
    │   ├── sign-in.tsx                  # /auth/sign-in
    │   ├── sign-up.tsx                  # /auth/sign-up (carrier admin)
    │   └── sign-up.freelance.tsx        # /auth/sign-up/freelance
    ├── _authenticated.tsx               # app shell (sidebar + topbar + auth guard)
    ├── _authenticated/
    │   ├── dashboard.tsx
    │   ├── fleet.tsx
    │   ├── fleet.$truckId.tsx
    │   ├── team.tsx
    │   ├── team.invite.tsx
    │   ├── tasks.tsx
    │   ├── tasks.new.tsx
    │   ├── tasks.$taskId.tsx
    │   ├── routes_.tsx                  # routes layout (avoid clash with "routes" dir)
    │   ├── routes_.$routeId.tsx
    │   ├── routes_.generate.tsx
    │   ├── demand.tsx
    │   ├── demand.$requestId.tsx
    │   ├── offers.tsx
    │   ├── offers.$offerId.tsx
    │   ├── messages.tsx
    │   ├── messages.$threadId.tsx
    │   └── settings.tsx
    └── index.tsx                        # redirect to /dashboard or /auth/sign-in
```

---

## 7. Shared UI Components Needed

Beyond existing `@innovate-test/ui` components (`Button`, `Card`, `Input`, `Label`, `Checkbox`, `DropdownMenu`, `Skeleton`, `Sonner`), these shadcn components should be added:

| Component | Usage |
|---|---|
| `Dialog` | Truck form, invite form, offer counter-offer |
| `Sheet` | Mobile sidebar, task detail slide-over |
| `Select` | All select fields (role, truck type, priority, cargo type) |
| `Badge` | Priority badges, status badges, role tags |
| `Table` | Fleet, team, tasks list, demand, routes list |
| `Tabs` | Settings page, dashboard sections |
| `Tooltip` | Action icons, truncated text |
| `Avatar` | User menu, team table, message bubbles |
| `Command` | Global search (Cmd+K) |
| `Separator` | Layout divisions |
| `ScrollArea` | Message thread, long lists |
| `Switch` | Notification toggles, settings |
| `Textarea` | Task notes, message compose, cargo description |
| `Progress` | Route capacity usage bar |
| `Stepper` (custom) | Registration wizard, route generation wizard, task timeline |
| `DatePicker` | Task deadline |
| `Popover` | Date picker wrapper, filter dropdowns |
| `Calendar` | Date selection |
| `Sidebar` | App shell sidebar navigation |

---

## 8. Mock Data Strategy

During the mock phase, each feature keeps `lib/mock-data.ts` with typed seed arrays. Hooks use TanStack Query with `queryFn` returning that data. When the Fastify API exists, replace `queryFn` with `http` helpers that `GET`/`POST` the same shapes; optionally mirror responses into Dexie and TanStack DB collections for offline reads.

```typescript
// Example: features/fleet/hooks/use-fleet.ts
export const useFleet = () => {
  return useQuery({
    queryKey: ["fleet"],
    queryFn: async () => {
      // mock: return mockTrucks
      // live: const res = await http.get<FleetResponse>("/api/fleet"); return res.trucks
      return mockTrucks;
    },
  });
};
```

### Mock user session

Default mock session stored in Zustand. Switchable via dev toolbar for testing different roles:

```typescript
const mockUsers = [
  { id: "1", name: "Admin Oleksiy", email: "admin@carrier.test", role: "CARRIER_ADMIN" },
  { id: "2", name: "Manager Ivan", email: "manager@carrier.test", role: "CARRIER_MANAGER" },
  { id: "3", name: "Driver Olena", email: "driver@carrier.test", role: "CARRIER_DRIVER" },
  { id: "4", name: "Warehouse Maria", email: "warehouse@carrier.test", role: "CARRIER_WAREHOUSE_MANAGER" },
  { id: "5", name: "Freelance Taras", email: "freelance@driver.test", role: "FREELANCE_DRIVER" },
]
```

**Dev toolbar** (bottom-right, dev-only): dropdown to switch active mock user → re-renders sidebar and dashboard.

---

## 9. Key UX Patterns

### 9.1 Offline-first indicators

- **Global connectivity banner** — appears below topbar when offline. Yellow for degraded (BLE only), red for fully offline.
- **Message status icons** — ✓ sent, ✓✓ delivered, clock for queued.
- **Optimistic UI** — task status updates apply immediately, sync on reconnect.
- **Conflict resolution** — last-write-wins for simple fields; manual merge prompt for task reassignment conflicts.

### 9.2 Responsive behavior

| Breakpoint | Behavior |
|---|---|
| `≥1280px` | Full sidebar + content |
| `1024–1279px` | Collapsed sidebar (icons only) + content |
| `<1024px` | Sidebar as sheet overlay; bottom nav on mobile for driver/freelance |

### 9.3 Map interactions

- Click truck marker → popup with truck info + "View detail" link.
- Click route segment → highlight + show distance / ETA for that segment.
- Cluster markers when zoomed out (fleet overview).
- Driver view: center on own position, show next stop direction.

### 9.4 Emergency handling

Tasks with `EMERGENCY` priority:
- Red pulsing badge everywhere the task appears.
- Push notification (when online) + BLE broadcast (when offline).
- Dashboard: pinned emergency banner at top.
- Route optimizer: emergency tasks get highest weight, can preempt existing routes.

---

## 10. Color System and Theming

Built on shadcn/Tailwind CSS variables. Light + Dark themes.

### Semantic status colors

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--status-idle` | `slate-400` | `slate-500` | Idle trucks, low priority |
| `--status-active` | `emerald-500` | `emerald-400` | On road, in transit |
| `--status-warning` | `amber-500` | `amber-400` | Medium priority, nearing deadline |
| `--status-danger` | `red-500` | `red-400` | Emergency, overdue |
| `--status-info` | `blue-500` | `blue-400` | New offers, informational |

### Priority colors

| Priority | Color | Badge style |
|---|---|---|
| `EMERGENCY` | `red-500` + pulse animation | Filled red, animated border |
| `HIGH` | `red-500` | Filled red |
| `MEDIUM` | `amber-500` | Filled amber |
| `LOW` | `slate-400` | Outline gray |

---

## 11. Implementation Phases

### Phase 1 — Skeleton & Auth (Week 1)
- [ ] App shell layout (sidebar + topbar)
- [ ] Auth layout (`/auth/*`, centered card)
- [ ] Sign-in page `/auth/sign-in` (mock auth)
- [ ] Carrier sign-up `/auth/sign-up` (mock)
- [ ] Freelance sign-up `/auth/sign-up/freelance` (mock)
- [ ] Role-based sidebar rendering
- [ ] Mock user store + dev role switcher
- [ ] Add required shadcn components

### Phase 2 — Core Data Pages (Week 2)
- [ ] Dashboard (all role variants)
- [ ] Fleet management (table + add/edit dialog)
- [ ] Team management (table + invite)
- [ ] Task board (kanban + list toggle)
- [ ] Task create form
- [ ] Task detail page

### Phase 3 — Routes & Maps (Week 3)
- [ ] Mapbox integration (fleet map, route map)
- [ ] Route generation wizard (4-step)
- [ ] Route detail page (map + stop list)
- [ ] Truck GPS trail on detail page

### Phase 4 — Demand & Offers (Week 4)
- [ ] Demand board
- [ ] Demand detail + freelancer matching
- [ ] Offers list (freelance driver view)
- [ ] Offer detail + accept / decline / counter-offer

### Phase 5 — Messaging & Offline (Week 5)
- [ ] Message thread list + thread view
- [ ] Compose bar + attachments
- [ ] Dexie schema for threads, messages, outbox; TanStack DB collections + live queries
- [ ] Connectivity status provider
- [ ] BLE relay prototype
- [ ] Offline banner + message status indicators

### Phase 6 — Polish (Week 6)
- [ ] Settings pages (profile, company, notifications, theme)
- [ ] Global search (Cmd+K)
- [ ] Mobile responsive pass
- [ ] Emergency handling UX
- [ ] Loading states and skeletons for all pages
- [ ] Error boundaries
