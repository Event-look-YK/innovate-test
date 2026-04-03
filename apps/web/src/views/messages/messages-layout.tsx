import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ScrollArea } from "@innovate-test/ui/components/scroll-area";
import { cn } from "@innovate-test/ui/lib/utils";

import { useThreads } from "@/features/messages/hooks/use-messages";

export const MessagesLayout = () => {
  const { data: threads } = useThreads();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const activeId = pathname.startsWith("/messages/") ? pathname.split("/messages/")[1]?.split("/")[0] : undefined;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Threads (offline-first mock)</p>
      </div>
      <div className="grid min-h-[480px] gap-0 overflow-hidden rounded-xl border border-border md:grid-cols-[280px_1fr]">
        <ScrollArea className="border-border md:border-r">
          <div className="flex flex-col p-2">
            {threads?.map((t) => (
              <Link
                key={t.id}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm hover:bg-muted",
                  activeId === t.id && "bg-muted font-medium",
                )}
                params={{ threadId: t.id }}
                to="/messages/$threadId"
              >
                <p className="truncate">{t.title}</p>
                <p className="truncate text-xs text-muted-foreground">{t.lastMessage}</p>
              </Link>
            ))}
          </div>
        </ScrollArea>
        <Outlet />
      </div>
    </div>
  );
};
