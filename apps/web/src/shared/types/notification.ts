import type { PaginatedResponse } from "./pagination";

export type NotificationType = "route_offer_created" | "route_offer_accepted";

export type NotificationData = {
  routeOfferId?: string;
  routePlanId?: string;
  driverName?: string;
  driverId?: string;
};

export type AppNotification = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data: NotificationData | null;
  readAt: string | null;
  createdAt: string;
};

export type NotificationsResponse = PaginatedResponse<AppNotification> & {
  unreadCount: number;
};
