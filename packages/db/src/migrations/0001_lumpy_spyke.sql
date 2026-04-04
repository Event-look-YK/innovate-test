CREATE TYPE "public"."cargo_type" AS ENUM('General', 'Refrigerated', 'Hazardous', 'Oversized', 'Fragile');--> statement-breakpoint
CREATE TYPE "public"."demand_status" AS ENUM('Open', 'Offers sent', 'Accepted', 'In progress', 'Completed');--> statement-breakpoint
CREATE TYPE "public"."freelance_vehicle_type" AS ENUM('Truck', 'Van', 'Refrigerated');--> statement-breakpoint
CREATE TYPE "public"."message_status" AS ENUM('sent', 'delivered', 'read', 'queued');--> statement-breakpoint
CREATE TYPE "public"."offer_status" AS ENUM('open', 'accepted', 'declined');--> statement-breakpoint
CREATE TYPE "public"."route_status" AS ENUM('draft', 'active', 'completed');--> statement-breakpoint
CREATE TYPE "public"."task_priority" AS ENUM('LOW', 'MEDIUM', 'HIGH', 'EMERGENCY');--> statement-breakpoint
CREATE TYPE "public"."task_status" AS ENUM('Pending', 'Assigned', 'InTransit', 'Delivered', 'Completed');--> statement-breakpoint
CREATE TYPE "public"."thread_type" AS ENUM('task', 'direct', 'group');--> statement-breakpoint
CREATE TYPE "public"."truck_status" AS ENUM('idle', 'on_road', 'maintenance');--> statement-breakpoint
CREATE TYPE "public"."truck_type" AS ENUM('Truck', 'Semi', 'Refrigerated', 'Flatbed');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('CARRIER_ADMIN', 'CARRIER_MANAGER', 'CARRIER_DRIVER', 'CARRIER_WAREHOUSE_MANAGER', 'FREELANCE_DRIVER');--> statement-breakpoint
CREATE TABLE "company" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"tax_id" text NOT NULL,
	"country" text NOT NULL,
	"city" text NOT NULL,
	"logo_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "demand_request" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"task_id" text,
	"task_title" text NOT NULL,
	"truck_type" text NOT NULL,
	"payload_t" real NOT NULL,
	"route_label" text NOT NULL,
	"budget_uah" real NOT NULL,
	"status" "demand_status" DEFAULT 'Open' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_profile" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"role" "user_role" NOT NULL,
	"phone" text,
	"language" text DEFAULT 'uk' NOT NULL,
	"company_id" text,
	"license_number" text,
	"vehicle_type" "freelance_vehicle_type",
	"payload_t" real,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_profile_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "truck" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"name" text NOT NULL,
	"type" "truck_type" NOT NULL,
	"payload_t" real NOT NULL,
	"trailer_id" text,
	"tracker_id" text NOT NULL,
	"status" "truck_status" DEFAULT 'idle' NOT NULL,
	"location_label" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"title" text NOT NULL,
	"cargo_description" text NOT NULL,
	"cargo_type" "cargo_type" NOT NULL,
	"weight_t" real NOT NULL,
	"origin_label" text NOT NULL,
	"destination_label" text NOT NULL,
	"distance_km" real NOT NULL,
	"deadline" timestamp NOT NULL,
	"priority" "task_priority" NOT NULL,
	"status" "task_status" DEFAULT 'Pending' NOT NULL,
	"assigned_truck_id" text,
	"notes" text,
	"created_by_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "route_plan" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"truck_id" text NOT NULL,
	"truck_name" text NOT NULL,
	"distance_km" real NOT NULL,
	"duration_hours" real NOT NULL,
	"load_t" real NOT NULL,
	"capacity_t" real NOT NULL,
	"status" "route_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "route_plan_task" (
	"route_plan_id" text NOT NULL,
	"task_id" text NOT NULL,
	CONSTRAINT "route_plan_task_route_plan_id_task_id_pk" PRIMARY KEY("route_plan_id","task_id")
);
--> statement-breakpoint
CREATE TABLE "route_stop" (
	"id" text PRIMARY KEY NOT NULL,
	"route_plan_id" text NOT NULL,
	"label" text NOT NULL,
	"eta" text NOT NULL,
	"note" text,
	"sort_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "freight_offer" (
	"id" text PRIMARY KEY NOT NULL,
	"demand_request_id" text NOT NULL,
	"freelancer_user_id" text NOT NULL,
	"task_title" text NOT NULL,
	"origin_label" text NOT NULL,
	"destination_label" text NOT NULL,
	"distance_km" real NOT NULL,
	"cargo_type" text NOT NULL,
	"weight_t" real NOT NULL,
	"deadline" timestamp NOT NULL,
	"offered_price_uah" real NOT NULL,
	"status" "offer_status" DEFAULT 'open' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message" (
	"id" text PRIMARY KEY NOT NULL,
	"thread_id" text NOT NULL,
	"author_id" text NOT NULL,
	"body" text NOT NULL,
	"status" "message_status" DEFAULT 'sent' NOT NULL,
	"sent_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "thread" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text,
	"type" "thread_type" NOT NULL,
	"title" text NOT NULL,
	"task_id" text,
	"last_message" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "thread_participant" (
	"id" text PRIMARY KEY NOT NULL,
	"thread_id" text NOT NULL,
	"user_id" text NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_invite" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"email" text NOT NULL,
	"full_name" text NOT NULL,
	"role" "user_role" NOT NULL,
	"status" text DEFAULT 'invited' NOT NULL,
	"invited_by_id" text NOT NULL,
	"accepted_user_id" text,
	"invited_at" timestamp DEFAULT now() NOT NULL,
	"accepted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "demand_request" ADD CONSTRAINT "demand_request_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demand_request" ADD CONSTRAINT "demand_request_task_id_task_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."task"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "truck" ADD CONSTRAINT "truck_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_assigned_truck_id_truck_id_fk" FOREIGN KEY ("assigned_truck_id") REFERENCES "public"."truck"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_created_by_id_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "route_plan" ADD CONSTRAINT "route_plan_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "route_plan" ADD CONSTRAINT "route_plan_truck_id_truck_id_fk" FOREIGN KEY ("truck_id") REFERENCES "public"."truck"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "route_plan_task" ADD CONSTRAINT "route_plan_task_route_plan_id_route_plan_id_fk" FOREIGN KEY ("route_plan_id") REFERENCES "public"."route_plan"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "route_plan_task" ADD CONSTRAINT "route_plan_task_task_id_task_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."task"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "route_stop" ADD CONSTRAINT "route_stop_route_plan_id_route_plan_id_fk" FOREIGN KEY ("route_plan_id") REFERENCES "public"."route_plan"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "freight_offer" ADD CONSTRAINT "freight_offer_demand_request_id_demand_request_id_fk" FOREIGN KEY ("demand_request_id") REFERENCES "public"."demand_request"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "freight_offer" ADD CONSTRAINT "freight_offer_freelancer_user_id_user_id_fk" FOREIGN KEY ("freelancer_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_thread_id_thread_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."thread"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread" ADD CONSTRAINT "thread_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread" ADD CONSTRAINT "thread_task_id_task_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."task"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread_participant" ADD CONSTRAINT "thread_participant_thread_id_thread_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."thread"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread_participant" ADD CONSTRAINT "thread_participant_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_invite" ADD CONSTRAINT "team_invite_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_invite" ADD CONSTRAINT "team_invite_invited_by_id_user_id_fk" FOREIGN KEY ("invited_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_invite" ADD CONSTRAINT "team_invite_accepted_user_id_user_id_fk" FOREIGN KEY ("accepted_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "demand_request_company_id_idx" ON "demand_request" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "demand_request_status_idx" ON "demand_request" USING btree ("status");--> statement-breakpoint
CREATE INDEX "user_profile_user_id_idx" ON "user_profile" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_profile_company_id_idx" ON "user_profile" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "truck_company_id_idx" ON "truck" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "truck_status_idx" ON "truck" USING btree ("status");--> statement-breakpoint
CREATE INDEX "task_company_id_idx" ON "task" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "task_status_idx" ON "task" USING btree ("status");--> statement-breakpoint
CREATE INDEX "task_assigned_truck_id_idx" ON "task" USING btree ("assigned_truck_id");--> statement-breakpoint
CREATE INDEX "task_priority_idx" ON "task" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "route_plan_company_id_idx" ON "route_plan" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "route_plan_truck_id_idx" ON "route_plan" USING btree ("truck_id");--> statement-breakpoint
CREATE INDEX "route_plan_status_idx" ON "route_plan" USING btree ("status");--> statement-breakpoint
CREATE INDEX "route_stop_route_plan_id_idx" ON "route_stop" USING btree ("route_plan_id");--> statement-breakpoint
CREATE INDEX "freight_offer_demand_request_id_idx" ON "freight_offer" USING btree ("demand_request_id");--> statement-breakpoint
CREATE INDEX "freight_offer_freelancer_user_id_idx" ON "freight_offer" USING btree ("freelancer_user_id");--> statement-breakpoint
CREATE INDEX "freight_offer_status_idx" ON "freight_offer" USING btree ("status");--> statement-breakpoint
CREATE INDEX "message_thread_id_idx" ON "message" USING btree ("thread_id");--> statement-breakpoint
CREATE INDEX "thread_company_id_idx" ON "thread" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "thread_task_id_idx" ON "thread" USING btree ("task_id");--> statement-breakpoint
CREATE INDEX "thread_participant_thread_id_idx" ON "thread_participant" USING btree ("thread_id");--> statement-breakpoint
CREATE INDEX "thread_participant_user_id_idx" ON "thread_participant" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "team_invite_company_id_idx" ON "team_invite" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "team_invite_email_idx" ON "team_invite" USING btree ("email");