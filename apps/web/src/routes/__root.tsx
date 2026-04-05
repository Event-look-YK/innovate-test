import { Toaster } from "@innovate-test/ui/components/sonner";
import { TooltipProvider } from "@innovate-test/ui/components/tooltip";
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import appCss from "../index.css?url";
import { QueryProvider } from "@/shared/providers/query-provider";
import { ThemeProvider } from "@/shared/providers/theme-provider";

export interface RouterAppContext {}

const RootDocument = () => (
  <html lang="en" suppressHydrationWarning>
    <head>
      <HeadContent />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
    </head>
    <body>
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
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  component: RootDocument,
});
