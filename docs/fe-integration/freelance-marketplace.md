# Freelance Driver Marketplace — FE Integration Docs

When a company's trucks are all busy (auto-trigger) or a manager manually offers a route, it appears in the freelance marketplace. Freelance drivers browse open offers and accept on a first-come-first-served basis.

**Base URL:** `VITE_SERVER_URL` (default: `http://localhost:3000`)  
**Auth:** All routes require a valid session cookie (Better Auth). No bearer token.

---

## Table of Contents

1. [POST /routes/:routeId/offer](#1-post-routesrouteidoffer)
2. [DELETE /routes/:routeId/offer](#2-delete-routesrouteidoffer)
3. [GET /routes/:routeId/offer](#3-get-routesrouteidoffer)
4. [GET /marketplace/routes](#4-get-marketplaceroutes)
5. [GET /marketplace/routes/:offerId](#5-get-marketplaceroutesofferid)
6. [POST /marketplace/routes/:offerId/accept](#6-post-marketplaceroutesofferidaccept)
7. [GET /notifications](#7-get-notifications)
8. [PATCH /notifications/:id/read](#8-patch-notificationsidread)
9. [POST /notifications/read-all](#9-post-notificationsread-all)

---

## 1. POST /routes/:routeId/offer

Manually offer a route plan to the freelance marketplace. Creates an open offer visible to all freelance drivers and sends them in-app notifications.

### Auth & Roles

- Requires active session
- Allowed roles: `CARRIER_ADMIN`, `CARRIER_MANAGER`
- User must belong to a company

### Request

```
POST /routes/:routeId/offer
```

No request body.

### Response — Success `201`

```json
{
  "offerId": "550e8400-e29b-41d4-a716-446655440000",
  "routePlanId": "rp_01jxabc",
  "status": "open"
}
```

### Error responses

| Status | `code` | Trigger |
|--------|--------|---------|
| `400` | `BAD_REQUEST` | Route already has an open offer |
| `400` | `BAD_REQUEST` | Route already accepted by a freelancer |
| `400` | `BAD_REQUEST` | No company associated with this account |
| `401` | `UNAUTHORIZED` | No session |
| `403` | `FORBIDDEN` | Role not allowed |
| `404` | `NOT_FOUND` | Route not found or belongs to another company |

### UX guidance

- Show "Запропонувати фрілансерам" button on route detail page when route status is `"draft"` or `"active"`
- Disable button if offer already open/accepted (check GET /routes/:routeId/offer first)
- On success, update the button to show "Пропозиція відкрита"

---

## 2. DELETE /routes/:routeId/offer

Cancel the open freelance offer for a route. Only works if status is `"open"`.

### Auth & Roles

- Allowed roles: `CARRIER_ADMIN`, `CARRIER_MANAGER`

### Request

```
DELETE /routes/:routeId/offer
```

### Response — Success `200`

```json
{ "id": "550e8400-...", "status": "cancelled" }
```

### Error responses

| Status | `code` | Trigger |
|--------|--------|---------|
| `404` | `NOT_FOUND` | No open offer found for this route |
| `401` | `UNAUTHORIZED` | No session |
| `403` | `FORBIDDEN` | Role not allowed |

---

## 3. GET /routes/:routeId/offer

Get the current offer status for a route, including accepted driver info if accepted.

### Auth & Roles

- Allowed roles: `CARRIER_ADMIN`, `CARRIER_MANAGER`

### Response — Success `200`

```ts
{
  id: string;
  routePlanId: string;
  status: "open" | "accepted" | "cancelled";
  triggerType: "manual" | "auto";
  acceptedByDriverId: string | null;
  acceptedAt: string | null;       // ISO datetime
  createdAt: string;               // ISO datetime
  driverName: string | null;       // null if not yet accepted
  driverEmail: string | null;
}
```

#### Example — accepted

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "routePlanId": "rp_01jxabc",
  "status": "accepted",
  "triggerType": "auto",
  "acceptedByDriverId": "usr_xyz",
  "acceptedAt": "2026-04-04T10:15:00.000Z",
  "createdAt": "2026-04-04T10:00:00.000Z",
  "driverName": "Іван Петренко",
  "driverEmail": "ivan@example.com"
}
```

### Error responses

| Status | `code` | Trigger |
|--------|--------|---------|
| `404` | `NOT_FOUND` | No offer found for this route |
| `401` | `UNAUTHORIZED` | No session |
| `403` | `FORBIDDEN` | Role not allowed |

---

## 4. GET /marketplace/routes

List all open route offers. Visible to freelance drivers only.

### Auth & Roles

- Allowed roles: `FREELANCE_DRIVER`
- No `companyId` required (freelancers have none)

### Request

```
GET /marketplace/routes?page=1&limit=20
```

#### Query params

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | Page number |
| `limit` | number | `20` | Max `100` |

### Response — Success `200`

```ts
{
  data: Array<{
    offerId: string;
    routePlanId: string;
    companyId: string;
    companyName: string;
    triggerType: "manual" | "auto";
    createdAt: string;          // ISO datetime — when the offer was posted
    distanceKm: number;
    durationHours: number;
    loadT: number;              // cargo weight in tonnes
    capacityT: number;          // truck capacity in tonnes
  }>;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

#### Example

```json
{
  "data": [
    {
      "offerId": "550e8400-e29b-41d4-a716-446655440000",
      "routePlanId": "rp_01jxabc",
      "companyId": "comp_xyz",
      "companyName": "Укр-Логістик ТОВ",
      "triggerType": "auto",
      "createdAt": "2026-04-04T10:00:00.000Z",
      "distanceKm": 540,
      "durationHours": 7.5,
      "loadT": 18.5,
      "capacityT": 20
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 1, "totalPages": 1 }
}
```

### Error responses

| Status | `code` | Trigger |
|--------|--------|---------|
| `401` | `UNAUTHORIZED` | No session |
| `403` | `FORBIDDEN` | Not a freelance driver |

---

## 5. GET /marketplace/routes/:offerId

Full detail for a single offer including stops and cargo tasks.

### Auth & Roles

- Allowed roles: `FREELANCE_DRIVER`

### Response — Success `200`

```ts
{
  offerId: string;
  status: "open" | "accepted" | "cancelled";
  routePlanId: string;
  companyId: string;
  companyName: string;
  triggerType: "manual" | "auto";
  createdAt: string;
  distanceKm: number;
  durationHours: number;
  loadT: number;
  capacityT: number;
  stops: Array<{
    id: string;
    routePlanId: string;
    label: string;
    lat: number;
    lng: number;
    eta: string;          // ISO datetime
    note: string | null;  // Ukrainian action description
    sortOrder: number;    // render in ascending order
  }>;
  tasks: Array<{
    id: string;
    title: string;
    cargoType: "General" | "Refrigerated" | "Hazardous" | "Oversized" | "Fragile";
    weightT: number;
    originLabel: string;
    destinationLabel: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "EMERGENCY";
    deadline: string;     // ISO datetime
  }>;
}
```

### Error responses

| Status | `code` | Trigger |
|--------|--------|---------|
| `404` | `NOT_FOUND` | Offer not found |
| `401` | `UNAUTHORIZED` | No session |
| `403` | `FORBIDDEN` | Not a freelance driver |

### UX guidance

- Render stops as a timeline (sorted by `sortOrder`)
- Show cargo tasks in a list with type badge and weight
- Show "Прийняти маршрут" button only when `status === "open"`
- If `status === "accepted"`, show "Вже зайнятий"

---

## 6. POST /marketplace/routes/:offerId/accept

Accept a route offer. First-come-first-served — only one driver can accept. On success, the driver is assigned to the route plan (`driverId` is set). Company managers receive an in-app notification.

### Auth & Roles

- Allowed roles: `FREELANCE_DRIVER`

### Request

```
POST /marketplace/routes/:offerId/accept
```

No request body.

### Response — Success `200`

```json
{
  "offerId": "550e8400-e29b-41d4-a716-446655440000",
  "routePlanId": "rp_01jxabc",
  "status": "accepted"
}
```

### Error responses

| Status | `code` | Trigger |
|--------|--------|---------|
| `409` | `CONFLICT` | Route already accepted by another driver |
| `409` | `CONFLICT` | Route already accepted or cancelled |
| `404` | `NOT_FOUND` | Offer not found |
| `401` | `UNAUTHORIZED` | No session |
| `403` | `FORBIDDEN` | Not a freelance driver |

### Side effects

- `route_offer.status` → `"accepted"`, `acceptedByDriverId` = freelancer's userId, `acceptedAt` = now
- `route_plan.driverId` → freelancer's userId
- In-app notifications sent to all `CARRIER_ADMIN` and `CARRIER_MANAGER` users of the company

### UX guidance

- After clicking "Прийняти маршрут", disable the button and show spinner
- On `200`: show success toast "Маршрут прийнятий! Перевірте деталі." and navigate to the route detail
- On `409`: show "На жаль, цей маршрут вже зайнятий. Оберіть інший." and refresh the list
- Refresh the marketplace list after accept to remove the accepted offer

---

## 7. GET /notifications

List the current user's notifications, newest first. Works for all roles.

### Auth & Roles

- Requires active session (any role)

### Request

```
GET /notifications?page=1&limit=20
```

### Response — Success `200`

```ts
{
  data: Array<{
    id: string;
    userId: string;
    type: string;           // "route_offer_created" | "route_offer_accepted"
    title: string;
    body: string;
    data: object | null;    // extra context (routeOfferId, routePlanId, etc.)
    readAt: string | null;  // null = unread
    createdAt: string;
  }>;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  unreadCount: number;      // total unread across all pages
}
```

#### Notification types and their `data` payloads

| `type` | Who receives | `data` fields |
|--------|-------------|---------------|
| `route_offer_created` | All `FREELANCE_DRIVER` users | `{ routeOfferId, routePlanId }` |
| `route_offer_accepted` | Company `CARRIER_ADMIN` + `CARRIER_MANAGER` | `{ routeOfferId, routePlanId, driverName, driverId }` |

### UX guidance

- Poll `GET /notifications` every 30s or use a bell icon badge driven by `unreadCount`
- Highlight unread items (no `readAt`)
- Clicking a `route_offer_created` notification → navigate to `/marketplace/routes/:offerId` (use `data.routeOfferId`)
- Clicking a `route_offer_accepted` notification → navigate to `/routes/:routePlanId` (use `data.routePlanId`)

---

## 8. PATCH /notifications/:id/read

Mark a single notification as read.

### Auth & Roles

- Requires active session. Only marks own notifications.

### Response — Success `200`

```json
{ "id": "notif_xyz", "readAt": "2026-04-04T10:20:00.000Z" }
```

### Error responses

| Status | `code` | Trigger |
|--------|--------|---------|
| `404` | `NOT_FOUND` | Notification not found or belongs to another user |

---

## 9. POST /notifications/read-all

Mark all unread notifications as read.

### Auth & Roles

- Requires active session.

### Response — Success `200`

```json
{ "ok": true }
```

---

## Suggested FE flows

### Company side — offering routes

```
1. Manager opens route detail page
2. GET /routes/:routeId/offer  →  check if offer exists
3. If no offer:  show "Запропонувати фрілансерам" button
   → POST /routes/:routeId/offer
   → Show "Пропозиція відкрита" badge
4. If offer.status === "open":  show "Скасувати пропозицію" button
   → DELETE /routes/:routeId/offer
5. If offer.status === "accepted": show "Прийнято: [driverName]"
```

### Auto-trigger

When `POST /routes/generate` completes and all company trucks are now `on_road`, the server automatically creates offers for every new route plan and notifies all freelance drivers. No FE action needed — but refresh notification count after generation.

### Freelance driver — accepting a route

```
1. Driver opens /marketplace page
2. GET /marketplace/routes  →  list of open offers
3. Driver clicks an offer card
4. GET /marketplace/routes/:offerId  →  full detail with stops & tasks
5. Driver clicks "Прийняти маршрут"
6. POST /marketplace/routes/:offerId/accept
   → 200: navigate to accepted route detail, show success toast
   → 409: show conflict toast, refresh list
```

---

## Auto-trigger behavior

The `POST /routes/generate` endpoint auto-offers all newly created routes to freelancers when:

- After saving routes, the company has **zero idle trucks** (`truck.status = 'idle'`)

This means all trucks are either `on_road` or `maintenance`. Each new route plan gets its own `route_offer` with `triggerType: "auto"`.

The response from `POST /routes/generate` does **not** include offer IDs — fetch them with `GET /routes/:routeId/offer` if needed on the company side.
