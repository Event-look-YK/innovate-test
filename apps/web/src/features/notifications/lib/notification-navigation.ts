import type { AppNotification } from "@/shared/types/notification";

export const getNotificationLink = (
  notification: AppNotification,
): { to: string; params?: Record<string, string> } | null => {
  const data = notification.data;
  if (!data) return null;

  if (notification.type === "route_offer_created" && data.routeOfferId) {
    return { to: "/offers/$offerId", params: { offerId: data.routeOfferId } };
  }

  if (notification.type === "route_offer_accepted" && data.routePlanId) {
    return { to: "/routes/$routeId", params: { routeId: data.routePlanId } };
  }

  return null;
};
