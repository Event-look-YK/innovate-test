import dotenv from "dotenv";
dotenv.config({ path: "../../apps/server/.env" });

import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";
import { user, account, session, verification } from "./schema/auth";
import { company } from "./schema/company";
import { userProfile } from "./schema/user-profile";
import { truck } from "./schema/truck";
import { task } from "./schema/task";
import { routePlan, routeStop, routePlanTask } from "./schema/route";
import { demandRequest } from "./schema/demand";
import { freightOffer } from "./schema/offer";
import { thread, threadParticipant, message } from "./schema/message";
import { teamInvite } from "./schema/team-invite";

const db = drizzle(process.env.DATABASE_URL!, { schema });
const id = () => randomUUID();
const now = new Date();
const days = (n: number) => new Date(now.getTime() + n * 86_400_000);
const hours = (n: number) => new Date(now.getTime() + n * 3_600_000);

// ─── IDs ──────────────────────────────────────────────────────────────────────

// Companies
const npId = id();
const dlId = id();
const satId = id();

// Nova Poshta users
const npAdminId = id();
const npManagerId = id();
const npDriver1Id = id();
const npDriver2Id = id();
const npWarehouseId = id();

// Delivery users
const dlAdminId = id();
const dlManagerId = id();
const dlDriver1Id = id();
const dlDriver2Id = id();
const dlWarehouseId = id();

// SAT users
const satAdminId = id();
const satManagerId = id();
const satDriver1Id = id();
const satDriver2Id = id();
const satWarehouseId = id();

// Freelancers
const freelancer1Id = id();
const freelancer2Id = id();

// Trucks
const npTruck1Id = id();
const npTruck2Id = id();
const npTruck3Id = id();
const npTruck4Id = id();
const dlTruck1Id = id();
const dlTruck2Id = id();
const dlTruck3Id = id();
const dlTruck4Id = id();
const satTruck1Id = id();
const satTruck2Id = id();
const satTruck3Id = id();
const satTruck4Id = id();

// Tasks
const task1Id = id();
const task2Id = id();
const task3Id = id();
const task4Id = id();
const task5Id = id();
const task6Id = id();
const task7Id = id();
const task8Id = id();
const task9Id = id();

// Routes
const route1Id = id();
const route2Id = id();
const route3Id = id();

// Demands
const demand1Id = id();
const demand2Id = id();
const demand3Id = id();

// Threads
const thread1Id = id();
const thread2Id = id();
const thread3Id = id();

// ─── Coordinates ──────────────────────────────────────────────────────────────

const coords = {
  kyiv: { lat: 50.4501, lng: 30.5234 },
  lviv: { lat: 49.8397, lng: 24.0297 },
  odesa: { lat: 46.4825, lng: 30.7233 },
  kharkiv: { lat: 49.9935, lng: 36.2304 },
  dnipro: { lat: 48.4647, lng: 35.0462 },
  zaporizhzhia: { lat: 47.8388, lng: 35.1396 },
  vinnytsia: { lat: 49.2331, lng: 28.4682 },
  poltava: { lat: 49.5883, lng: 34.5514 },
  chernihiv: { lat: 51.4982, lng: 31.2893 },
  sumy: { lat: 50.9077, lng: 34.7981 },
  mykolaiv: { lat: 46.975, lng: 31.9946 },
  zhytomyr: { lat: 50.2547, lng: 28.6587 },
  rivne: { lat: 50.6199, lng: 26.2516 },
  boryspil: { lat: 50.3491, lng: 30.95 },
};

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding database...\n");

  const hashedPw = await hashPassword("password123");

  // ── Cleanup ───────────────────────────────────────────────────────────────
  console.log("  Cleaning existing data...");
  await db.transaction(async (tx) => {
    await tx.delete(message);
    await tx.delete(threadParticipant);
    await tx.delete(thread);
    await tx.delete(freightOffer);
    await tx.delete(routePlanTask);
    await tx.delete(routeStop);
    await tx.delete(routePlan);
    await tx.delete(demandRequest);
    await tx.delete(task);
    await tx.delete(truck);
    await tx.delete(teamInvite);
    await tx.delete(userProfile);
    await tx.delete(session);
    await tx.delete(account);
    await tx.delete(verification);
    await tx.delete(user);
    await tx.delete(company);
  });

  // ── Insert ────────────────────────────────────────────────────────────────
  await db.transaction(async (tx) => {
    // ── Companies ─────────────────────────────────────────────────────────
    console.log("  Inserting companies...");
    await tx.insert(company).values([
      { id: npId, name: 'ТОВ "Нова Пошта"', taxId: "31316718", country: "Україна", city: "Київ" },
      { id: dlId, name: 'ТОВ "Делівері"', taxId: "35191005", country: "Україна", city: "Київ" },
      { id: satId, name: 'ТОВ "САТ"', taxId: "30638229", country: "Україна", city: "Київ" },
    ]);

    // ── Users ─────────────────────────────────────────────────────────────
    console.log("  Inserting users...");
    const users = [
      // Nova Poshta
      { id: npAdminId, name: "Олександр Петренко", email: "o.petrenko@novaposhta.ua", emailVerified: true },
      { id: npManagerId, name: "Ірина Коваленко", email: "i.kovalenko@novaposhta.ua", emailVerified: true },
      { id: npDriver1Id, name: "Василь Бондаренко", email: "v.bondarenko@novaposhta.ua", emailVerified: true },
      { id: npDriver2Id, name: "Андрій Шевченко", email: "a.shevchenko@novaposhta.ua", emailVerified: true },
      { id: npWarehouseId, name: "Наталія Ткаченко", email: "n.tkachenko@novaposhta.ua", emailVerified: true },
      // Delivery
      { id: dlAdminId, name: "Максим Іваненко", email: "m.ivanenko@delivery.ua", emailVerified: true },
      { id: dlManagerId, name: "Олена Сидоренко", email: "o.sydorenko@delivery.ua", emailVerified: true },
      { id: dlDriver1Id, name: "Дмитро Кравченко", email: "d.kravchenko@delivery.ua", emailVerified: true },
      { id: dlDriver2Id, name: "Сергій Мельник", email: "s.melnyk@delivery.ua", emailVerified: true },
      { id: dlWarehouseId, name: "Тетяна Литвиненко", email: "t.lytvynenko@delivery.ua", emailVerified: true },
      // SAT
      { id: satAdminId, name: "Юрій Марченко", email: "y.marchenko@sat.ua", emailVerified: true },
      { id: satManagerId, name: "Вікторія Гриценко", email: "v.grytsenko@sat.ua", emailVerified: true },
      { id: satDriver1Id, name: "Олег Козлов", email: "o.kozlov@sat.ua", emailVerified: true },
      { id: satDriver2Id, name: "Роман Попов", email: "r.popov@sat.ua", emailVerified: true },
      { id: satWarehouseId, name: "Людмила Морозова", email: "l.morozova@sat.ua", emailVerified: true },
      // Freelancers
      { id: freelancer1Id, name: "Артем Савченко", email: "a.savchenko@gmail.com", emailVerified: true },
      { id: freelancer2Id, name: "Богдан Лисенко", email: "b.lysenko@ukr.net", emailVerified: true },
    ];
    await tx.insert(user).values(users);

    // ── Accounts ──────────────────────────────────────────────────────────
    console.log("  Inserting accounts...");
    await tx.insert(account).values(
      users.map((u) => ({
        id: id(),
        accountId: u.id,
        providerId: "credential",
        userId: u.id,
        password: hashedPw,
        createdAt: now,
        updatedAt: now,
      })),
    );

    // ── User Profiles ─────────────────────────────────────────────────────
    console.log("  Inserting user profiles...");
    await tx.insert(userProfile).values([
      // Nova Poshta
      { id: id(), userId: npAdminId, role: "CARRIER_ADMIN" as const, phone: "+380501234567", companyId: npId },
      { id: id(), userId: npManagerId, role: "CARRIER_MANAGER" as const, phone: "+380501234568", companyId: npId },
      { id: id(), userId: npDriver1Id, role: "CARRIER_DRIVER" as const, phone: "+380671234567", companyId: npId, licenseNumber: "АА 123456" },
      { id: id(), userId: npDriver2Id, role: "CARRIER_DRIVER" as const, phone: "+380671234568", companyId: npId, licenseNumber: "АА 234567" },
      { id: id(), userId: npWarehouseId, role: "CARRIER_WAREHOUSE_MANAGER" as const, phone: "+380931234567", companyId: npId },
      // Delivery
      { id: id(), userId: dlAdminId, role: "CARRIER_ADMIN" as const, phone: "+380502345678", companyId: dlId },
      { id: id(), userId: dlManagerId, role: "CARRIER_MANAGER" as const, phone: "+380502345679", companyId: dlId },
      { id: id(), userId: dlDriver1Id, role: "CARRIER_DRIVER" as const, phone: "+380672345678", companyId: dlId, licenseNumber: "ВВ 345678" },
      { id: id(), userId: dlDriver2Id, role: "CARRIER_DRIVER" as const, phone: "+380672345679", companyId: dlId, licenseNumber: "ВВ 456789" },
      { id: id(), userId: dlWarehouseId, role: "CARRIER_WAREHOUSE_MANAGER" as const, phone: "+380932345678", companyId: dlId },
      // SAT
      { id: id(), userId: satAdminId, role: "CARRIER_ADMIN" as const, phone: "+380503456789", companyId: satId },
      { id: id(), userId: satManagerId, role: "CARRIER_MANAGER" as const, phone: "+380503456780", companyId: satId },
      { id: id(), userId: satDriver1Id, role: "CARRIER_DRIVER" as const, phone: "+380673456789", companyId: satId, licenseNumber: "СС 567890" },
      { id: id(), userId: satDriver2Id, role: "CARRIER_DRIVER" as const, phone: "+380673456780", companyId: satId, licenseNumber: "СС 678901" },
      { id: id(), userId: satWarehouseId, role: "CARRIER_WAREHOUSE_MANAGER" as const, phone: "+380933456789", companyId: satId },
      // Freelancers
      { id: id(), userId: freelancer1Id, role: "FREELANCE_DRIVER" as const, phone: "+380661112233", licenseNumber: "КК 111222", vehicleType: "Truck" as const, payloadT: 10.0 },
      { id: id(), userId: freelancer2Id, role: "FREELANCE_DRIVER" as const, phone: "+380661112244", licenseNumber: "КК 333444", vehicleType: "Refrigerated" as const, payloadT: 7.0 },
    ]);

    // ── Trucks ─────────────────────────────────────────────────────────────
    console.log("  Inserting trucks...");
    await tx.insert(truck).values([
      // Nova Poshta
      { id: npTruck1Id, companyId: npId, assignedDriverId: npDriver1Id, name: "НП-001", type: "Truck" as const, payloadT: 10.0, trackerId: "GPS-NP-001", status: "idle" as const, locationLabel: "Київ", locationLat: coords.kyiv.lat, locationLng: coords.kyiv.lng },
      { id: npTruck2Id, companyId: npId, assignedDriverId: npDriver2Id, name: "НП-002", type: "Semi" as const, payloadT: 20.0, trackerId: "GPS-NP-002", status: "on_road" as const, locationLabel: "Одеса", locationLat: coords.odesa.lat, locationLng: coords.odesa.lng },
      { id: npTruck3Id, companyId: npId, name: "НП-003", type: "Refrigerated" as const, payloadT: 8.0, trackerId: "GPS-NP-003", status: "idle" as const, locationLabel: "Львів", locationLat: coords.lviv.lat, locationLng: coords.lviv.lng },
      { id: npTruck4Id, companyId: npId, name: "НП-004", type: "Flatbed" as const, payloadT: 15.0, trackerId: "GPS-NP-004", status: "maintenance" as const, locationLabel: "Дніпро", locationLat: coords.dnipro.lat, locationLng: coords.dnipro.lng },
      // Delivery
      { id: dlTruck1Id, companyId: dlId, assignedDriverId: dlDriver1Id, name: "DL-001", type: "Truck" as const, payloadT: 12.0, trackerId: "GPS-DL-001", status: "on_road" as const, locationLabel: "Харків", locationLat: coords.kharkiv.lat, locationLng: coords.kharkiv.lng },
      { id: dlTruck2Id, companyId: dlId, name: "DL-002", type: "Semi" as const, payloadT: 22.0, trackerId: "GPS-DL-002", status: "idle" as const, locationLabel: "Київ", locationLat: coords.kyiv.lat, locationLng: coords.kyiv.lng },
      { id: dlTruck3Id, companyId: dlId, name: "DL-003", type: "Refrigerated" as const, payloadT: 7.0, trackerId: "GPS-DL-003", status: "idle" as const, locationLabel: "Вінниця", locationLat: coords.vinnytsia.lat, locationLng: coords.vinnytsia.lng },
      { id: dlTruck4Id, companyId: dlId, assignedDriverId: dlDriver2Id, name: "DL-004", type: "Truck" as const, payloadT: 10.0, trackerId: "GPS-DL-004", status: "on_road" as const, locationLabel: "Запоріжжя", locationLat: coords.zaporizhzhia.lat, locationLng: coords.zaporizhzhia.lng },
      // SAT
      { id: satTruck1Id, companyId: satId, assignedDriverId: satDriver2Id, name: "SAT-001", type: "Semi" as const, payloadT: 25.0, trackerId: "GPS-SAT-001", status: "idle" as const, locationLabel: "Київ", locationLat: coords.kyiv.lat, locationLng: coords.kyiv.lng },
      { id: satTruck2Id, companyId: satId, assignedDriverId: satDriver1Id, name: "SAT-002", type: "Truck" as const, payloadT: 10.0, trackerId: "GPS-SAT-002", status: "on_road" as const, locationLabel: "Полтава", locationLat: coords.poltava.lat, locationLng: coords.poltava.lng },
      { id: satTruck3Id, companyId: satId, name: "SAT-003", type: "Flatbed" as const, payloadT: 18.0, trackerId: "GPS-SAT-003", status: "idle" as const, locationLabel: "Чернігів", locationLat: coords.chernihiv.lat, locationLng: coords.chernihiv.lng },
      { id: satTruck4Id, companyId: satId, name: "SAT-004", type: "Refrigerated" as const, payloadT: 9.0, trackerId: "GPS-SAT-004", status: "maintenance" as const, locationLabel: "Суми", locationLat: coords.sumy.lat, locationLng: coords.sumy.lng },
    ]);

    // ── Tasks ──────────────────────────────────────────────────────────────
    console.log("  Inserting tasks...");
    await tx.insert(task).values([
      {
        id: task1Id, companyId: npId, title: "Доставка електроніки Київ-Львів",
        cargoDescription: "Партія ноутбуків та моніторів", cargoType: "General" as const, weightT: 3.5,
        originLabel: "Київ", originLat: coords.kyiv.lat, originLng: coords.kyiv.lng,
        destinationLabel: "Львів", destinationLat: coords.lviv.lat, destinationLng: coords.lviv.lng,
        distanceKm: 540, deadline: days(3), priority: "HIGH" as const, status: "InTransit" as const,
        assignedTruckId: npTruck2Id, createdById: npManagerId,
      },
      {
        id: task2Id, companyId: npId, title: "Перевезення морепродуктів Одеса-Київ",
        cargoDescription: "Заморожені морепродукти", cargoType: "Refrigerated" as const, weightT: 6.0,
        originLabel: "Одеса", originLat: coords.odesa.lat, originLng: coords.odesa.lng,
        destinationLabel: "Київ", destinationLat: coords.kyiv.lat, destinationLng: coords.kyiv.lng,
        distanceKm: 475, deadline: days(2), priority: "EMERGENCY" as const, status: "Assigned" as const,
        assignedTruckId: npTruck3Id, createdById: npAdminId,
      },
      {
        id: task3Id, companyId: npId, title: "Доставка будматеріалів Дніпро-Харків",
        cargoDescription: "Цемент та арматура", cargoType: "General" as const, weightT: 18.0,
        originLabel: "Дніпро", originLat: coords.dnipro.lat, originLng: coords.dnipro.lng,
        destinationLabel: "Харків", destinationLat: coords.kharkiv.lat, destinationLng: coords.kharkiv.lng,
        distanceKm: 220, deadline: days(7), priority: "MEDIUM" as const, status: "Pending" as const,
        createdById: npManagerId,
      },
      {
        id: task4Id, companyId: dlId, title: "Перевезення меблів Київ-Одеса",
        cargoDescription: "Офісні меблі", cargoType: "General" as const, weightT: 4.0,
        originLabel: "Київ", originLat: coords.kyiv.lat, originLng: coords.kyiv.lng,
        destinationLabel: "Одеса", destinationLat: coords.odesa.lat, destinationLng: coords.odesa.lng,
        distanceKm: 475, deadline: days(-1), priority: "LOW" as const, status: "Completed" as const,
        assignedTruckId: dlTruck2Id, createdById: dlManagerId,
      },
      {
        id: task5Id, companyId: dlId, title: "Доставка медикаментів Харків-Запоріжжя",
        cargoDescription: "Фармацевтична продукція", cargoType: "Fragile" as const, weightT: 1.5,
        originLabel: "Харків", originLat: coords.kharkiv.lat, originLng: coords.kharkiv.lng,
        destinationLabel: "Запоріжжя", destinationLat: coords.zaporizhzhia.lat, destinationLng: coords.zaporizhzhia.lng,
        distanceKm: 280, deadline: days(2), priority: "HIGH" as const, status: "InTransit" as const,
        assignedTruckId: dlTruck1Id, createdById: dlAdminId,
      },
      {
        id: task6Id, companyId: dlId, title: "Хімічна продукція Вінниця-Київ",
        cargoDescription: "Промислові хімікати", cargoType: "Hazardous" as const, weightT: 8.0,
        originLabel: "Вінниця", originLat: coords.vinnytsia.lat, originLng: coords.vinnytsia.lng,
        destinationLabel: "Київ", destinationLat: coords.kyiv.lat, destinationLng: coords.kyiv.lng,
        distanceKm: 260, deadline: days(5), priority: "MEDIUM" as const, status: "Pending" as const,
        createdById: dlManagerId,
      },
      {
        id: task7Id, companyId: satId, title: "Негабаритне обладнання Київ-Полтава",
        cargoDescription: "Промислові верстати", cargoType: "Oversized" as const, weightT: 22.0,
        originLabel: "Київ", originLat: coords.kyiv.lat, originLng: coords.kyiv.lng,
        destinationLabel: "Полтава", destinationLat: coords.poltava.lat, destinationLng: coords.poltava.lng,
        distanceKm: 340, deadline: days(4), priority: "HIGH" as const, status: "InTransit" as const,
        assignedTruckId: satTruck1Id, createdById: satAdminId,
      },
      {
        id: task8Id, companyId: satId, title: "Доставка скла Чернігів-Суми",
        cargoDescription: "Віконне скло", cargoType: "Fragile" as const, weightT: 5.0,
        originLabel: "Чернігів", originLat: coords.chernihiv.lat, originLng: coords.chernihiv.lng,
        destinationLabel: "Суми", destinationLat: coords.sumy.lat, destinationLng: coords.sumy.lng,
        distanceKm: 180, deadline: days(6), priority: "MEDIUM" as const, status: "Assigned" as const,
        assignedTruckId: satTruck3Id, createdById: satManagerId,
      },
      {
        id: task9Id, companyId: satId, title: "Молочна продукція Полтава-Київ",
        cargoDescription: "Молочна продукція", cargoType: "Refrigerated" as const, weightT: 7.0,
        originLabel: "Полтава", originLat: coords.poltava.lat, originLng: coords.poltava.lng,
        destinationLabel: "Київ", destinationLat: coords.kyiv.lat, destinationLng: coords.kyiv.lng,
        distanceKm: 340, deadline: days(10), priority: "LOW" as const, status: "Pending" as const,
        createdById: satManagerId,
      },
    ]);

    // ── Route Plans ────────────────────────────────────────────────────────
    console.log("  Inserting route plans...");
    await tx.insert(routePlan).values([
      { id: route1Id, companyId: npId, truckId: npTruck2Id, driverId: npDriver2Id, distanceKm: 540, durationHours: 7.5, loadT: 3.5, capacityT: 20.0, status: "active" as const },
      { id: route2Id, companyId: dlId, truckId: dlTruck1Id, driverId: dlDriver1Id, distanceKm: 280, durationHours: 4.0, loadT: 1.5, capacityT: 12.0, status: "active" as const },
      { id: route3Id, companyId: satId, truckId: satTruck2Id, driverId: satDriver1Id, distanceKm: 340, durationHours: 5.0, loadT: 22.0, capacityT: 25.0, status: "active" as const },
    ]);

    // ── Route Stops ────────────────────────────────────────────────────────
    console.log("  Inserting route stops...");
    await tx.insert(routeStop).values([
      // Route 1: Київ → Житомир → Рівне → Львів
      { id: id(), routePlanId: route1Id, label: "Київ", lat: coords.kyiv.lat, lng: coords.kyiv.lng, eta: hours(0), sortOrder: 0 },
      { id: id(), routePlanId: route1Id, label: "Житомир", lat: coords.zhytomyr.lat, lng: coords.zhytomyr.lng, eta: hours(2), sortOrder: 1 },
      { id: id(), routePlanId: route1Id, label: "Рівне", lat: coords.rivne.lat, lng: coords.rivne.lng, eta: hours(4.5), sortOrder: 2 },
      { id: id(), routePlanId: route1Id, label: "Львів", lat: coords.lviv.lat, lng: coords.lviv.lng, eta: hours(7.5), sortOrder: 3 },
      // Route 2: Харків → Дніпро → Запоріжжя
      { id: id(), routePlanId: route2Id, label: "Харків", lat: coords.kharkiv.lat, lng: coords.kharkiv.lng, eta: hours(0), sortOrder: 0 },
      { id: id(), routePlanId: route2Id, label: "Дніпро", lat: coords.dnipro.lat, lng: coords.dnipro.lng, eta: hours(2.5), sortOrder: 1 },
      { id: id(), routePlanId: route2Id, label: "Запоріжжя", lat: coords.zaporizhzhia.lat, lng: coords.zaporizhzhia.lng, eta: hours(4), sortOrder: 2 },
      // Route 3: Київ → Бориспіль → Полтава
      { id: id(), routePlanId: route3Id, label: "Київ", lat: coords.kyiv.lat, lng: coords.kyiv.lng, eta: hours(0), sortOrder: 0 },
      { id: id(), routePlanId: route3Id, label: "Бориспіль", lat: coords.boryspil.lat, lng: coords.boryspil.lng, eta: hours(0.5), sortOrder: 1 },
      { id: id(), routePlanId: route3Id, label: "Полтава", lat: coords.poltava.lat, lng: coords.poltava.lng, eta: hours(5), sortOrder: 2 },
    ]);

    // ── Route Plan Tasks ───────────────────────────────────────────────────
    await tx.insert(routePlanTask).values([
      { routePlanId: route1Id, taskId: task1Id },
      { routePlanId: route2Id, taskId: task5Id },
      { routePlanId: route3Id, taskId: task7Id },
    ]);

    // ── Demand Requests ────────────────────────────────────────────────────
    console.log("  Inserting demand requests...");
    await tx.insert(demandRequest).values([
      {
        id: demand1Id, companyId: npId, taskId: task2Id,
        requiredTruckType: "Refrigerated" as const, cargoType: "Refrigerated" as const, payloadT: 6.0,
        originLabel: "Одеса", originLat: coords.odesa.lat, originLng: coords.odesa.lng,
        destinationLabel: "Київ", destinationLat: coords.kyiv.lat, destinationLng: coords.kyiv.lng,
        distanceKm: 475, deadline: days(2), budgetUah: 35000, status: "Open" as const,
      },
      {
        id: demand2Id, companyId: dlId, taskId: task6Id,
        requiredTruckType: "Truck" as const, cargoType: "Hazardous" as const, payloadT: 8.0,
        originLabel: "Вінниця", originLat: coords.vinnytsia.lat, originLng: coords.vinnytsia.lng,
        destinationLabel: "Київ", destinationLat: coords.kyiv.lat, destinationLng: coords.kyiv.lng,
        distanceKm: 260, deadline: days(5), budgetUah: 22000, status: "Offers sent" as const,
      },
      {
        id: demand3Id, companyId: satId,
        requiredTruckType: "Flatbed" as const, cargoType: "Oversized" as const, payloadT: 15.0,
        originLabel: "Миколаїв", originLat: coords.mykolaiv.lat, originLng: coords.mykolaiv.lng,
        destinationLabel: "Дніпро", destinationLat: coords.dnipro.lat, destinationLng: coords.dnipro.lng,
        distanceKm: 480, deadline: days(8), budgetUah: 45000, status: "Accepted" as const,
      },
    ]);

    // ── Freight Offers ─────────────────────────────────────────────────────
    console.log("  Inserting freight offers...");
    await tx.insert(freightOffer).values([
      { id: id(), demandRequestId: demand1Id, freelancerUserId: freelancer1Id, offeredPriceUah: 32000, estimatedHours: 8, note: "Маю рефрижератор, готовий виїхати завтра", status: "open" as const },
      { id: id(), demandRequestId: demand1Id, freelancerUserId: freelancer2Id, offeredPriceUah: 34000, estimatedHours: 7.5, note: "Досвід перевезення морепродуктів", status: "open" as const },
      { id: id(), demandRequestId: demand2Id, freelancerUserId: freelancer1Id, offeredPriceUah: 20000, estimatedHours: 5, note: "Є дозвіл на перевезення небезпечних вантажів", status: "open" as const },
      { id: id(), demandRequestId: demand3Id, freelancerUserId: freelancer2Id, offeredPriceUah: 42000, estimatedHours: 9, status: "accepted" as const },
    ]);

    // ── Threads ────────────────────────────────────────────────────────────
    console.log("  Inserting threads & messages...");
    await tx.insert(thread).values([
      { id: thread1Id, companyId: npId, type: "task" as const, title: "Обговорення доставки Київ-Львів", taskId: task1Id, lastMessage: "Проїхав Житомир, все за графіком." },
      { id: thread2Id, companyId: dlId, type: "group" as const, title: "Логістика відділу Делівері", lastMessage: "Склад готовий до завантаження з 06:00." },
      { id: thread3Id, type: "direct" as const, title: "Артем Савченко — Ірина Коваленко", lastMessage: "Вітаю, надішлю деталі протягом години." },
    ]);

    // ── Thread Participants ────────────────────────────────────────────────
    await tx.insert(threadParticipant).values([
      { id: id(), threadId: thread1Id, userId: npAdminId },
      { id: id(), threadId: thread1Id, userId: npManagerId },
      { id: id(), threadId: thread1Id, userId: npDriver2Id },
      { id: id(), threadId: thread2Id, userId: dlAdminId },
      { id: id(), threadId: thread2Id, userId: dlManagerId },
      { id: id(), threadId: thread2Id, userId: dlWarehouseId },
      { id: id(), threadId: thread3Id, userId: freelancer1Id },
      { id: id(), threadId: thread3Id, userId: npManagerId },
    ]);

    // ── Messages ───────────────────────────────────────────────────────────
    await tx.insert(message).values([
      // Thread 1
      { id: id(), threadId: thread1Id, authorId: npManagerId, body: "Вантаж готовий до відправки, прошу підтвердити готовність.", status: "read" as const, sentAt: hours(-3) },
      { id: id(), threadId: thread1Id, authorId: npDriver2Id, body: "Підтверджую, виїжджаю о 08:00.", status: "read" as const, sentAt: hours(-2.5) },
      { id: id(), threadId: thread1Id, authorId: npAdminId, body: "Відмінно, клієнт чекає до 18:00.", status: "read" as const, sentAt: hours(-2) },
      { id: id(), threadId: thread1Id, authorId: npDriver2Id, body: "Проїхав Житомир, все за графіком.", status: "delivered" as const, sentAt: hours(-0.5) },
      // Thread 2
      { id: id(), threadId: thread2Id, authorId: dlAdminId, body: "Колеги, оновлюю план на тиждень.", status: "read" as const, sentAt: hours(-5) },
      { id: id(), threadId: thread2Id, authorId: dlManagerId, body: "Є нові замовлення на Запоріжжя та Вінницю.", status: "read" as const, sentAt: hours(-4) },
      { id: id(), threadId: thread2Id, authorId: dlWarehouseId, body: "Склад готовий до завантаження з 06:00.", status: "sent" as const, sentAt: hours(-1) },
      // Thread 3
      { id: id(), threadId: thread3Id, authorId: freelancer1Id, body: "Добрий день, цікавить замовлення на Одесу.", status: "read" as const, sentAt: hours(-6) },
      { id: id(), threadId: thread3Id, authorId: npManagerId, body: "Вітаю, надішлю деталі протягом години.", status: "delivered" as const, sentAt: hours(-5.5) },
    ]);

    // ── Team Invites ───────────────────────────────────────────────────────
    console.log("  Inserting team invites...");
    await tx.insert(teamInvite).values([
      { id: id(), companyId: npId, email: "m.koval@novaposhta.ua", fullName: "Михайло Коваль", role: "CARRIER_DRIVER" as const, status: "invited", invitedById: npAdminId },
      { id: id(), companyId: dlId, email: "o.bondar@delivery.ua", fullName: "Оксана Бондар", role: "CARRIER_MANAGER" as const, status: "invited", invitedById: dlAdminId },
    ]);
  });

  console.log("\n✅ Seed complete! Inserted:");
  console.log("   3 companies, 17 users, 12 trucks, 9 tasks");
  console.log("   3 route plans, 10 route stops, 3 demand requests");
  console.log("   4 freight offers, 3 threads, 9 messages, 2 team invites");
  console.log('\n   All users password: "password123"');

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
