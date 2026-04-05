import { Toaster } from "@innovate-test/ui/components/sonner";
import { TooltipProvider } from "@innovate-test/ui/components/tooltip";
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { lazy } from "react";

import appCss from "../index.css?url";
import { QueryProvider } from "@/shared/providers/query-provider";
import { ThemeProvider } from "@/shared/providers/theme-provider";

const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null
  : lazy(() =>
      import("@tanstack/react-router-devtools").then((m) => ({
        default: m.TanStackRouterDevtools,
      })),
    );

export interface RouterAppContext {}

const RootDocument = () => (
  <html lang="en" suppressHydrationWarning className="scroll-smooth">
    <head>
      <HeadContent />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
    </head>
    <body className="antialiased">
      <ThemeProvider>
        <QueryProvider>
          <TooltipProvider>
            <Outlet />
          </TooltipProvider>
        </QueryProvider>
      </ThemeProvider>
      <Toaster richColors />
      <TanStackRouterDevtools position="bottom-left" />
      <Scripts />
    </body>
  </html>
);

export const Route = createRootRouteWithContext<RouterAppContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Innovate Logistics",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.svg",
        type: "image/svg+xml",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  component: RootDocument,
});
