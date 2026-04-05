import fastifyCors from "@fastify/cors";
import {auth} from "@innovate-test/auth";
import {env} from "@innovate-test/env/server";
import Fastify from "fastify";

import {registerAuthDecorator} from "./lib/auth-middleware";
import {registerSwagger} from "./lib/swagger";
import {profileRoutes} from "./routes/profile";
import {companyRoutes} from "./routes/company";
import {fleetRoutes} from "./routes/fleet";
import {taskRoutes} from "./routes/tasks";
import {dashboardRoutes} from "./routes/dashboard";
import {routeRoutes} from "./routes/routes";
import {routeOfferRoutes} from "./routes/route-offers";
import {teamRoutes} from "./routes/team";
import {demandRoutes} from "./routes/demand";
import {offerRoutes} from "./routes/offers";
import {messageRoutes} from "./routes/messages";
import {marketplaceRoutes} from "./routes/marketplace";
import {notificationRoutes} from "./routes/notifications";

const baseCorsConfig = {
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    maxAge: 86400,
};

const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyCors, baseCorsConfig);

registerAuthDecorator(fastify);

await registerSwagger(fastify);

fastify.register(profileRoutes, {prefix: "/api"});
fastify.register(companyRoutes, {prefix: "/api"});
fastify.register(fleetRoutes, {prefix: "/api"});
fastify.register(taskRoutes, {prefix: "/api"});
fastify.register(dashboardRoutes, {prefix: "/api"});
fastify.register(routeRoutes, {prefix: "/api"});
fastify.register(teamRoutes, {prefix: "/api"});
fastify.register(demandRoutes, {prefix: "/api"});
fastify.register(offerRoutes, {prefix: "/api"});
fastify.register(messageRoutes, {prefix: "/api"});
fastify.register(routeOfferRoutes, {prefix: "/api"});
fastify.register(marketplaceRoutes, {prefix: "/api"});
fastify.register(notificationRoutes, {prefix: "/api"});

fastify.route({
    method: ["GET", "POST"],
    url: "/api/auth/*",
    schema: {
        summary: "Authentication endpoints (Better Auth)",
        description:
            "All authentication operations (sign-up, sign-in, sign-out, session management) are handled by Better Auth. See Better Auth documentation for details.",
        tags: ["Auth"],
        security: [],
    },
    async handler(request, reply) {
        try {
            const url = new URL(request.url, `http://${request.headers.host}`);
            const headers = new Headers();
            Object.entries(request.headers).forEach(([key, value]) => {
                if (value) headers.append(key, value.toString());
            });
            const req = new Request(url.toString(), {
                method: request.method,
                headers,
                body: request.body ? JSON.stringify(request.body) : undefined,
            });
            const response = await auth.handler(req);
            reply.status(response.status);
            response.headers.forEach((value, key) => reply.header(key, value));
            reply.send(response.body ? await response.text() : null);
        } catch (error) {
            fastify.log.error({err: error}, "Authentication Error:");
            reply.status(500).send({
                error: "Internal authentication error",
                code: "AUTH_FAILURE",
            });
        }
    },
});

fastify.get(
    "/",
    {
        schema: {
            summary: "Health check",
            tags: ["Health"],
            security: [],
            response: {200: {type: "string"}},
        },
    },
    async () => {
        return "OK";
    },
);

fastify.listen({port: 3000, host: "0.0.0.0"}, (err) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    console.log("Server running on port 3000");
});
