import type { FastifyInstance } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

export async function registerSwagger(fastify: FastifyInstance) {
  await fastify.register(swagger, {
    openapi: {
      openapi: "3.1.0",
      info: {
        title: "Innovate Test API",
        description:
          "Logistics platform API for carrier companies and freelance drivers. Manages fleet, tasks, routes, demand/offers marketplace, team collaboration, and messaging.",
        version: "1.0.0",
      },
      servers: [
        { url: "http://localhost:3000", description: "Local development" },
      ],
      tags: [
        { name: "Health", description: "Health check" },
        { name: "Auth", description: "Authentication (Better Auth)" },
        { name: "Profile", description: "User profile and onboarding" },
        { name: "Company", description: "Company management" },
        { name: "Fleet", description: "Truck fleet management" },
        { name: "Tasks", description: "Cargo task management" },
        { name: "Routes", description: "Route planning and LLM-based optimization" },
        { name: "Dashboard", description: "Dashboard statistics" },
        { name: "Team", description: "Team member management and invites" },
        { name: "Demand", description: "Freight demand requests" },
        { name: "Offers", description: "Freight offer management" },
        { name: "Messages", description: "Messaging threads and messages" },
        {
          name: "Route Offers",
          description: "Route offers to freelance drivers",
        },
        {
          name: "Marketplace",
          description: "Freelancer marketplace for available routes",
        },
        { name: "Notifications", description: "User notifications" },
      ],
      components: {
        securitySchemes: {
          cookieAuth: {
            type: "apiKey",
            in: "cookie",
            name: "better-auth.session_token",
            description: "Session cookie set by Better Auth after sign-in",
          },
        },
      },
      security: [{ cookieAuth: [] }],
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: "/api/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
      persistAuthorization: true,
    },
  });
}
