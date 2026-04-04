import { db } from "@innovate-test/db";
import { notification } from "@innovate-test/db/schema/notification";
import { routeOffer } from "@innovate-test/db/schema/route-offer";
import { userProfile } from "@innovate-test/db/schema/user-profile";
import { eq } from "drizzle-orm";

import { genId } from "./id";

export async function createRouteOffer(
  routePlanId: string,
  companyId: string,
  triggerType: "manual" | "auto",
): Promise<string> {
  const offerId = genId();

  await db.insert(routeOffer).values({
    id: offerId,
    routePlanId,
    companyId,
    status: "open",
    triggerType,
  });

  await notifyAllFreelancers(
    "route_offer_created",
    "Новий маршрут доступний",
    "Компанія пропонує маршрут. Перейдіть до маркетплейсу, щоб переглянути деталі.",
    { routeOfferId: offerId, routePlanId },
  );

  return offerId;
}

export async function notifyAllFreelancers(
  type: string,
  title: string,
  body: string,
  data: Record<string, unknown>,
): Promise<void> {
  const freelancers = await db
    .select({ userId: userProfile.userId })
    .from(userProfile)
    .where(eq(userProfile.role, "FREELANCE_DRIVER"));

  if (freelancers.length === 0) return;

  await db.insert(notification).values(
    freelancers.map((f) => ({
      id: genId(),
      userId: f.userId,
      type,
      title,
      body,
      data,
    })),
  );
}

export async function notifyUsers(
  userIds: string[],
  type: string,
  title: string,
  body: string,
  data: Record<string, unknown>,
): Promise<void> {
  if (userIds.length === 0) return;

  await db.insert(notification).values(
    userIds.map((userId) => ({
      id: genId(),
      userId,
      type,
      title,
      body,
      data,
    })),
  );
}
