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
import { routeOffer } from "./schema/route-offer";
import { notification } from "./schema/notification";

const db = drizzle(process.env.DATABASE_URL!, { schema });
const id = () => randomUUID();
const now = new Date();
const days = (n: number) => new Date(now.getTime() + n * 86_400_000);
const hours = (n: number) => new Date(now.getTime() + n * 3_600_000);

// ─── IDs ──────────────────────────────────────────────────────────────────────

// Companies
const sfId = id(); // Swift Freight GmbH
const elId = id(); // EuroLogistics Ltd
const nxId = id(); // Nexus Transport S.A.

// Swift Freight users
const sfAdminId = id();
const sfManagerId = id();
const sfDriver1Id = id();
const sfDriver2Id = id();
const sfWarehouseId = id();

// EuroLogistics users
const elAdminId = id();
const elManagerId = id();
const elDriver1Id = id();
const elDriver2Id = id();
const elWarehouseId = id();

// Nexus Transport users
const nxAdminId = id();
const nxManagerId = id();
const nxDriver1Id = id();
const nxDriver2Id = id();
const nxWarehouseId = id();

// Freelancers
const freelancer1Id = id();
const freelancer2Id = id();

// Trucks
const sfTruck1Id = id();
const sfTruck2Id = id();
const sfTruck3Id = id();
const sfTruck4Id = id();
const elTruck1Id = id();
const elTruck2Id = id();
const elTruck3Id = id();
const elTruck4Id = id();
const nxTruck1Id = id();
const nxTruck2Id = id();
const nxTruck3Id = id();
const nxTruck4Id = id();

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
  berlin: { lat: 52.52, lng: 13.405 },
  munich: { lat: 48.1351, lng: 11.582 },
  hamburg: { lat: 53.5753, lng: 10.0153 },
  frankfurt: { lat: 50.1109, lng: 8.6821 },
  cologne: { lat: 50.9333, lng: 6.95 },
  stuttgart: { lat: 48.7758, lng: 9.1829 },
  paris: { lat: 48.8566, lng: 2.3522 },
  lyon: { lat: 45.7640, lng: 4.8357 },
  brussels: { lat: 50.8503, lng: 4.3517 },
  amsterdam: { lat: 52.3676, lng: 4.9041 },
  rotterdam: { lat: 51.9244, lng: 4.4777 },
  dortmund: { lat: 51.5136, lng: 7.4653 },
  dusseldorf: { lat: 51.2217, lng: 6.7762 },
  nuremberg: { lat: 49.4521, lng: 11.0767 },
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
    await tx.delete(routeOffer);
    await tx.delete(routePlanTask);
    await tx.delete(routeStop);
    await tx.delete(routePlan);
    await tx.delete(demandRequest);
    await tx.delete(task);
    await tx.delete(truck);
    await tx.delete(teamInvite);
    await tx.delete(userProfile);
    await tx.delete(notification);
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
      { id: sfId, name: "Swift Freight GmbH", taxId: "DE214789321", country: "Germany", city: "Berlin" },
      { id: elId, name: "EuroLogistics Ltd", taxId: "GB382940175", country: "United Kingdom", city: "London" },
      { id: nxId, name: "Nexus Transport S.A.", taxId: "FR76412983650", country: "France", city: "Paris" },
    ]);

    // ── Users ─────────────────────────────────────────────────────────────
    console.log("  Inserting users...");
    const users = [
      // Swift Freight GmbH
      { id: sfAdminId, name: "Thomas Becker", email: "t.becker@swiftfreight.de", emailVerified: true },
      { id: sfManagerId, name: "Anna Müller", email: "a.mueller@swiftfreight.de", emailVerified: true },
      { id: sfDriver1Id, name: "Klaus Hoffmann", email: "k.hoffmann@swiftfreight.de", emailVerified: true },
      { id: sfDriver2Id, name: "Stefan Weber", email: "s.weber@swiftfreight.de", emailVerified: true },
      { id: sfWarehouseId, name: "Petra Schneider", email: "p.schneider@swiftfreight.de", emailVerified: true },
      // EuroLogistics Ltd
      { id: elAdminId, name: "James Hartley", email: "j.hartley@eurologistics.co.uk", emailVerified: true },
      { id: elManagerId, name: "Sophie Clarke", email: "s.clarke@eurologistics.co.uk", emailVerified: true },
      { id: elDriver1Id, name: "Michael Turner", email: "m.turner@eurologistics.co.uk", emailVerified: true },
      { id: elDriver2Id, name: "Daniel Evans", email: "d.evans@eurologistics.co.uk", emailVerified: true },
      { id: elWarehouseId, name: "Laura Bennett", email: "l.bennett@eurologistics.co.uk", emailVerified: true },
      // Nexus Transport S.A.
      { id: nxAdminId, name: "Pierre Dubois", email: "p.dubois@nexustransport.fr", emailVerified: true },
      { id: nxManagerId, name: "Claire Martin", email: "c.martin@nexustransport.fr", emailVerified: true },
      { id: nxDriver1Id, name: "Luc Bernard", email: "l.bernard@nexustransport.fr", emailVerified: true },
      { id: nxDriver2Id, name: "Antoine Leroy", email: "a.leroy@nexustransport.fr", emailVerified: true },
      { id: nxWarehouseId, name: "Isabelle Moreau", email: "i.moreau@nexustransport.fr", emailVerified: true },
      // Freelancers
      { id: freelancer1Id, name: "Robert Collins", email: "r.collins@gmail.com", emailVerified: true },
      { id: freelancer2Id, name: "Erik Larsson", email: "e.larsson@outlook.com", emailVerified: true },
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
      // Swift Freight GmbH
      { id: id(), userId: sfAdminId, role: "CARRIER_ADMIN" as const, phone: "+4930123456", companyId: sfId },
      { id: id(), userId: sfManagerId, role: "CARRIER_MANAGER" as const, phone: "+4930123457", companyId: sfId },
      { id: id(), userId: sfDriver1Id, role: "CARRIER_DRIVER" as const, phone: "+4915112345678", companyId: sfId, licenseNumber: "B-DE-123456" },
      { id: id(), userId: sfDriver2Id, role: "CARRIER_DRIVER" as const, phone: "+4915112345679", companyId: sfId, licenseNumber: "B-DE-234567" },
      { id: id(), userId: sfWarehouseId, role: "CARRIER_WAREHOUSE_MANAGER" as const, phone: "+4930123458", companyId: sfId },
      // EuroLogistics Ltd
      { id: id(), userId: elAdminId, role: "CARRIER_ADMIN" as const, phone: "+442071234567", companyId: elId },
      { id: id(), userId: elManagerId, role: "CARRIER_MANAGER" as const, phone: "+442071234568", companyId: elId },
      { id: id(), userId: elDriver1Id, role: "CARRIER_DRIVER" as const, phone: "+447911123456", companyId: elId, licenseNumber: "GB-AB123456" },
      { id: id(), userId: elDriver2Id, role: "CARRIER_DRIVER" as const, phone: "+447911123457", companyId: elId, licenseNumber: "GB-CD234567" },
      { id: id(), userId: elWarehouseId, role: "CARRIER_WAREHOUSE_MANAGER" as const, phone: "+442071234569", companyId: elId },
      // Nexus Transport S.A.
      { id: id(), userId: nxAdminId, role: "CARRIER_ADMIN" as const, phone: "+33140123456", companyId: nxId },
      { id: id(), userId: nxManagerId, role: "CARRIER_MANAGER" as const, phone: "+33140123457", companyId: nxId },
      { id: id(), userId: nxDriver1Id, role: "CARRIER_DRIVER" as const, phone: "+33612345678", companyId: nxId, licenseNumber: "FR-123456AB" },
      { id: id(), userId: nxDriver2Id, role: "CARRIER_DRIVER" as const, phone: "+33612345679", companyId: nxId, licenseNumber: "FR-234567CD" },
      { id: id(), userId: nxWarehouseId, role: "CARRIER_WAREHOUSE_MANAGER" as const, phone: "+33140123458", companyId: nxId },
      // Freelancers
      { id: id(), userId: freelancer1Id, role: "FREELANCE_DRIVER" as const, phone: "+447700900123", licenseNumber: "GB-EF345678", vehicleType: "Truck" as const, payloadT: 10.0 },
      { id: id(), userId: freelancer2Id, role: "FREELANCE_DRIVER" as const, phone: "+46701234567", licenseNumber: "SE-789012GH", vehicleType: "Refrigerated" as const, payloadT: 7.0 },
    ]);

    // ── Trucks ─────────────────────────────────────────────────────────────
    console.log("  Inserting trucks...");
    await tx.insert(truck).values([
      // Swift Freight GmbH
      { id: sfTruck1Id, companyId: sfId, assignedDriverId: sfDriver1Id, name: "SF-001", type: "Truck" as const, payloadT: 10.0, trackerId: "GPS-SF-001", status: "idle" as const, locationLabel: "Berlin", locationLat: coords.berlin.lat, locationLng: coords.berlin.lng },
      { id: sfTruck2Id, companyId: sfId, assignedDriverId: sfDriver2Id, name: "SF-002", type: "Semi" as const, payloadT: 20.0, trackerId: "GPS-SF-002", status: "on_road" as const, locationLabel: "Hamburg", locationLat: coords.hamburg.lat, locationLng: coords.hamburg.lng },
      { id: sfTruck3Id, companyId: sfId, name: "SF-003", type: "Refrigerated" as const, payloadT: 8.0, trackerId: "GPS-SF-003", status: "idle" as const, locationLabel: "Munich", locationLat: coords.munich.lat, locationLng: coords.munich.lng },
      { id: sfTruck4Id, companyId: sfId, name: "SF-004", type: "Flatbed" as const, payloadT: 15.0, trackerId: "GPS-SF-004", status: "maintenance" as const, locationLabel: "Cologne", locationLat: coords.cologne.lat, locationLng: coords.cologne.lng },
      // EuroLogistics Ltd
      { id: elTruck1Id, companyId: elId, assignedDriverId: elDriver1Id, name: "EL-001", type: "Truck" as const, payloadT: 12.0, trackerId: "GPS-EL-001", status: "on_road" as const, locationLabel: "Frankfurt", locationLat: coords.frankfurt.lat, locationLng: coords.frankfurt.lng },
      { id: elTruck2Id, companyId: elId, name: "EL-002", type: "Semi" as const, payloadT: 22.0, trackerId: "GPS-EL-002", status: "idle" as const, locationLabel: "Berlin", locationLat: coords.berlin.lat, locationLng: coords.berlin.lng },
      { id: elTruck3Id, companyId: elId, name: "EL-003", type: "Refrigerated" as const, payloadT: 7.0, trackerId: "GPS-EL-003", status: "idle" as const, locationLabel: "Paris", locationLat: coords.paris.lat, locationLng: coords.paris.lng },
      { id: elTruck4Id, companyId: elId, assignedDriverId: elDriver2Id, name: "EL-004", type: "Truck" as const, payloadT: 10.0, trackerId: "GPS-EL-004", status: "on_road" as const, locationLabel: "Stuttgart", locationLat: coords.stuttgart.lat, locationLng: coords.stuttgart.lng },
      // Nexus Transport S.A.
      { id: nxTruck1Id, companyId: nxId, assignedDriverId: nxDriver2Id, name: "NX-001", type: "Semi" as const, payloadT: 25.0, trackerId: "GPS-NX-001", status: "idle" as const, locationLabel: "Paris", locationLat: coords.paris.lat, locationLng: coords.paris.lng },
      { id: nxTruck2Id, companyId: nxId, assignedDriverId: nxDriver1Id, name: "NX-002", type: "Truck" as const, payloadT: 10.0, trackerId: "GPS-NX-002", status: "on_road" as const, locationLabel: "Lyon", locationLat: coords.lyon.lat, locationLng: coords.lyon.lng },
      { id: nxTruck3Id, companyId: nxId, name: "NX-003", type: "Flatbed" as const, payloadT: 18.0, trackerId: "GPS-NX-003", status: "idle" as const, locationLabel: "Brussels", locationLat: coords.brussels.lat, locationLng: coords.brussels.lng },
      { id: nxTruck4Id, companyId: nxId, name: "NX-004", type: "Refrigerated" as const, payloadT: 9.0, trackerId: "GPS-NX-004", status: "maintenance" as const, locationLabel: "Amsterdam", locationLat: coords.amsterdam.lat, locationLng: coords.amsterdam.lng },
    ]);

    // ── Tasks ──────────────────────────────────────────────────────────────
    console.log("  Inserting tasks...");
    await tx.insert(task).values([
      {
        id: task1Id, companyId: sfId, title: "Electronics delivery Berlin-Munich",
        cargoDescription: "Laptops and monitors", cargoType: "General" as const, weightT: 3.5,
        originLabel: "Berlin", originLat: coords.berlin.lat, originLng: coords.berlin.lng,
        destinationLabel: "Munich", destinationLat: coords.munich.lat, destinationLng: coords.munich.lng,
        distanceKm: 584, deadline: days(3), priority: "HIGH" as const, status: "InTransit" as const,
        assignedTruckId: sfTruck2Id, createdById: sfManagerId,
      },
      {
        id: task2Id, companyId: sfId, title: "Frozen seafood transport Hamburg-Berlin",
        cargoDescription: "Frozen seafood products", cargoType: "Refrigerated" as const, weightT: 6.0,
        originLabel: "Hamburg", originLat: coords.hamburg.lat, originLng: coords.hamburg.lng,
        destinationLabel: "Berlin", destinationLat: coords.berlin.lat, destinationLng: coords.berlin.lng,
        distanceKm: 289, deadline: days(2), priority: "EMERGENCY" as const, status: "Assigned" as const,
        assignedTruckId: sfTruck3Id, createdById: sfAdminId,
      },
      {
        id: task3Id, companyId: sfId, title: "Construction materials Cologne-Frankfurt",
        cargoDescription: "Cement and steel rebar", cargoType: "General" as const, weightT: 18.0,
        originLabel: "Cologne", originLat: coords.cologne.lat, originLng: coords.cologne.lng,
        destinationLabel: "Frankfurt", destinationLat: coords.frankfurt.lat, destinationLng: coords.frankfurt.lng,
        distanceKm: 190, deadline: days(7), priority: "MEDIUM" as const, status: "Pending" as const,
        createdById: sfManagerId,
      },
      {
        id: task4Id, companyId: elId, title: "Office furniture Berlin-Rotterdam",
        cargoDescription: "Office furniture and fixtures", cargoType: "General" as const, weightT: 4.0,
        originLabel: "Berlin", originLat: coords.berlin.lat, originLng: coords.berlin.lng,
        destinationLabel: "Rotterdam", destinationLat: coords.rotterdam.lat, destinationLng: coords.rotterdam.lng,
        distanceKm: 647, deadline: days(-1), priority: "LOW" as const, status: "Completed" as const,
        assignedTruckId: elTruck2Id, createdById: elManagerId,
      },
      {
        id: task5Id, companyId: elId, title: "Pharmaceutical delivery Frankfurt-Stuttgart",
        cargoDescription: "Pharmaceutical products", cargoType: "Fragile" as const, weightT: 1.5,
        originLabel: "Frankfurt", originLat: coords.frankfurt.lat, originLng: coords.frankfurt.lng,
        destinationLabel: "Stuttgart", destinationLat: coords.stuttgart.lat, destinationLng: coords.stuttgart.lng,
        distanceKm: 204, deadline: days(2), priority: "HIGH" as const, status: "InTransit" as const,
        assignedTruckId: elTruck1Id, createdById: elAdminId,
      },
      {
        id: task6Id, companyId: elId, title: "Industrial chemicals Paris-Berlin",
        cargoDescription: "Industrial chemical compounds", cargoType: "Hazardous" as const, weightT: 8.0,
        originLabel: "Paris", originLat: coords.paris.lat, originLng: coords.paris.lng,
        destinationLabel: "Berlin", destinationLat: coords.berlin.lat, destinationLng: coords.berlin.lng,
        distanceKm: 1054, deadline: days(5), priority: "MEDIUM" as const, status: "Pending" as const,
        createdById: elManagerId,
      },
      {
        id: task7Id, companyId: nxId, title: "Oversized machinery Paris-Lyon",
        cargoDescription: "Industrial machine presses", cargoType: "Oversized" as const, weightT: 22.0,
        originLabel: "Paris", originLat: coords.paris.lat, originLng: coords.paris.lng,
        destinationLabel: "Lyon", destinationLat: coords.lyon.lat, destinationLng: coords.lyon.lng,
        distanceKm: 465, deadline: days(4), priority: "HIGH" as const, status: "InTransit" as const,
        assignedTruckId: nxTruck1Id, createdById: nxAdminId,
      },
      {
        id: task8Id, companyId: nxId, title: "Glass panels Brussels-Amsterdam",
        cargoDescription: "Window glass panels", cargoType: "Fragile" as const, weightT: 5.0,
        originLabel: "Brussels", originLat: coords.brussels.lat, originLng: coords.brussels.lng,
        destinationLabel: "Amsterdam", destinationLat: coords.amsterdam.lat, destinationLng: coords.amsterdam.lng,
        distanceKm: 209, deadline: days(6), priority: "MEDIUM" as const, status: "Assigned" as const,
        assignedTruckId: nxTruck3Id, createdById: nxManagerId,
      },
      {
        id: task9Id, companyId: nxId, title: "Dairy products Lyon-Paris",
        cargoDescription: "Refrigerated dairy products", cargoType: "Refrigerated" as const, weightT: 7.0,
        originLabel: "Lyon", originLat: coords.lyon.lat, originLng: coords.lyon.lng,
        destinationLabel: "Paris", destinationLat: coords.paris.lat, destinationLng: coords.paris.lng,
        distanceKm: 465, deadline: days(10), priority: "LOW" as const, status: "Pending" as const,
        createdById: nxManagerId,
      },
    ]);

    // ── Route Plans ────────────────────────────────────────────────────────
    console.log("  Inserting route plans...");
    await tx.insert(routePlan).values([
      { id: route1Id, companyId: sfId, truckId: sfTruck2Id, driverId: sfDriver2Id, distanceKm: 584, durationHours: 6.5, loadT: 3.5, capacityT: 20.0, status: "active" as const },
      { id: route2Id, companyId: elId, truckId: elTruck1Id, driverId: elDriver1Id, distanceKm: 204, durationHours: 2.5, loadT: 1.5, capacityT: 12.0, status: "active" as const },
      { id: route3Id, companyId: nxId, truckId: nxTruck2Id, driverId: nxDriver1Id, distanceKm: 465, durationHours: 5.0, loadT: 22.0, capacityT: 25.0, status: "active" as const },
    ]);

    // ── Route Stops ────────────────────────────────────────────────────────
    console.log("  Inserting route stops...");
    await tx.insert(routeStop).values([
      // Route 1: Berlin → Dortmund → Düsseldorf → Munich
      { id: id(), routePlanId: route1Id, label: "Berlin", lat: coords.berlin.lat, lng: coords.berlin.lng, eta: hours(0), sortOrder: 0 },
      { id: id(), routePlanId: route1Id, label: "Dortmund", lat: coords.dortmund.lat, lng: coords.dortmund.lng, eta: hours(2), sortOrder: 1 },
      { id: id(), routePlanId: route1Id, label: "Düsseldorf", lat: coords.dusseldorf.lat, lng: coords.dusseldorf.lng, eta: hours(3.5), sortOrder: 2 },
      { id: id(), routePlanId: route1Id, label: "Munich", lat: coords.munich.lat, lng: coords.munich.lng, eta: hours(6.5), sortOrder: 3 },
      // Route 2: Frankfurt → Nuremberg → Stuttgart
      { id: id(), routePlanId: route2Id, label: "Frankfurt", lat: coords.frankfurt.lat, lng: coords.frankfurt.lng, eta: hours(0), sortOrder: 0 },
      { id: id(), routePlanId: route2Id, label: "Nuremberg", lat: coords.nuremberg.lat, lng: coords.nuremberg.lng, eta: hours(1.5), sortOrder: 1 },
      { id: id(), routePlanId: route2Id, label: "Stuttgart", lat: coords.stuttgart.lat, lng: coords.stuttgart.lng, eta: hours(2.5), sortOrder: 2 },
      // Route 3: Paris → Lyon
      { id: id(), routePlanId: route3Id, label: "Paris", lat: coords.paris.lat, lng: coords.paris.lng, eta: hours(0), sortOrder: 0 },
      { id: id(), routePlanId: route3Id, label: "Nuremberg", lat: coords.nuremberg.lat, lng: coords.nuremberg.lng, eta: hours(2), sortOrder: 1 },
      { id: id(), routePlanId: route3Id, label: "Lyon", lat: coords.lyon.lat, lng: coords.lyon.lng, eta: hours(5), sortOrder: 2 },
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
        id: demand1Id, companyId: sfId, taskId: task2Id,
        requiredTruckType: "Refrigerated" as const, cargoType: "Refrigerated" as const, payloadT: 6.0,
        originLabel: "Hamburg", originLat: coords.hamburg.lat, originLng: coords.hamburg.lng,
        destinationLabel: "Berlin", destinationLat: coords.berlin.lat, destinationLng: coords.berlin.lng,
        distanceKm: 289, deadline: days(2), budgetUah: 3500, status: "Open" as const,
      },
      {
        id: demand2Id, companyId: elId, taskId: task6Id,
        requiredTruckType: "Truck" as const, cargoType: "Hazardous" as const, payloadT: 8.0,
        originLabel: "Paris", originLat: coords.paris.lat, originLng: coords.paris.lng,
        destinationLabel: "Berlin", destinationLat: coords.berlin.lat, destinationLng: coords.berlin.lng,
        distanceKm: 1054, deadline: days(5), budgetUah: 2200, status: "Offers sent" as const,
      },
      {
        id: demand3Id, companyId: nxId,
        requiredTruckType: "Flatbed" as const, cargoType: "Oversized" as const, payloadT: 15.0,
        originLabel: "Rotterdam", originLat: coords.rotterdam.lat, originLng: coords.rotterdam.lng,
        destinationLabel: "Cologne", destinationLat: coords.cologne.lat, destinationLng: coords.cologne.lng,
        distanceKm: 232, deadline: days(8), budgetUah: 4500, status: "Accepted" as const,
      },
    ]);

    // ── Freight Offers ─────────────────────────────────────────────────────
    console.log("  Inserting freight offers...");
    await tx.insert(freightOffer).values([
      { id: id(), demandRequestId: demand1Id, freelancerUserId: freelancer1Id, offeredPriceUah: 3200, estimatedHours: 5, note: "I have a refrigerated truck available and can depart tomorrow morning", status: "open" as const },
      { id: id(), demandRequestId: demand1Id, freelancerUserId: freelancer2Id, offeredPriceUah: 3400, estimatedHours: 4.5, note: "Experienced in cold chain logistics and seafood transport", status: "open" as const },
      { id: id(), demandRequestId: demand2Id, freelancerUserId: freelancer1Id, offeredPriceUah: 2000, estimatedHours: 14, note: "Certified for hazardous goods transport, ADR licence valid", status: "open" as const },
      { id: id(), demandRequestId: demand3Id, freelancerUserId: freelancer2Id, offeredPriceUah: 4200, estimatedHours: 4, status: "accepted" as const },
    ]);

    // ── Threads ────────────────────────────────────────────────────────────
    console.log("  Inserting threads & messages...");
    await tx.insert(thread).values([
      { id: thread1Id, companyId: sfId, type: "task" as const, title: "Berlin-Munich delivery discussion", taskId: task1Id, lastMessage: "Passed Dortmund, everything on schedule." },
      { id: thread2Id, companyId: elId, type: "group" as const, title: "EuroLogistics dispatch team", lastMessage: "Warehouse is ready for loading from 06:00." },
      { id: thread3Id, type: "direct" as const, title: "Robert Collins — Anna Müller", lastMessage: "Hello, I will send the details within the hour." },
    ]);

    // ── Thread Participants ────────────────────────────────────────────────
    await tx.insert(threadParticipant).values([
      { id: id(), threadId: thread1Id, userId: sfAdminId },
      { id: id(), threadId: thread1Id, userId: sfManagerId },
      { id: id(), threadId: thread1Id, userId: sfDriver2Id },
      { id: id(), threadId: thread2Id, userId: elAdminId },
      { id: id(), threadId: thread2Id, userId: elManagerId },
      { id: id(), threadId: thread2Id, userId: elWarehouseId },
      { id: id(), threadId: thread3Id, userId: freelancer1Id },
      { id: id(), threadId: thread3Id, userId: sfManagerId },
    ]);

    // ── Messages ───────────────────────────────────────────────────────────
    await tx.insert(message).values([
      // Thread 1
      { id: id(), threadId: thread1Id, authorId: sfManagerId, body: "Cargo is ready for dispatch, please confirm availability.", status: "read" as const, sentAt: hours(-3) },
      { id: id(), threadId: thread1Id, authorId: sfDriver2Id, body: "Confirmed, departing at 08:00.", status: "read" as const, sentAt: hours(-2.5) },
      { id: id(), threadId: thread1Id, authorId: sfAdminId, body: "Great, the client is expecting delivery by 18:00.", status: "read" as const, sentAt: hours(-2) },
      { id: id(), threadId: thread1Id, authorId: sfDriver2Id, body: "Passed Dortmund, everything on schedule.", status: "delivered" as const, sentAt: hours(-0.5) },
      // Thread 2
      { id: id(), threadId: thread2Id, authorId: elAdminId, body: "Team, sharing the updated plan for the week.", status: "read" as const, sentAt: hours(-5) },
      { id: id(), threadId: thread2Id, authorId: elManagerId, body: "New orders incoming for Stuttgart and Paris.", status: "read" as const, sentAt: hours(-4) },
      { id: id(), threadId: thread2Id, authorId: elWarehouseId, body: "Warehouse is ready for loading from 06:00.", status: "sent" as const, sentAt: hours(-1) },
      // Thread 3
      { id: id(), threadId: thread3Id, authorId: freelancer1Id, body: "Good day, I am interested in the Hamburg run.", status: "read" as const, sentAt: hours(-6) },
      { id: id(), threadId: thread3Id, authorId: sfManagerId, body: "Hello, I will send the details within the hour.", status: "delivered" as const, sentAt: hours(-5.5) },
    ]);

    // ── Team Invites ───────────────────────────────────────────────────────
    console.log("  Inserting team invites...");
    await tx.insert(teamInvite).values([
      { id: id(), companyId: sfId, email: "h.wagner@swiftfreight.de", fullName: "Hans Wagner", role: "CARRIER_DRIVER" as const, status: "invited", invitedById: sfAdminId },
      { id: id(), companyId: elId, email: "e.thompson@eurologistics.co.uk", fullName: "Emma Thompson", role: "CARRIER_MANAGER" as const, status: "invited", invitedById: elAdminId },
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
