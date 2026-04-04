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
        <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
        <p className="text-sm text-muted-foreground">Team conversations</p>
      </div>
      <div className="grid min-h-[480px] gap-0 overflow-hidden rounded-2xl border border-border/60 shadow-sm md:grid-cols-[280px_1fr]">
        <ScrollArea className="border-border/60 md:border-r bg-muted/20">
          <div className="p-3">
            <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
              Threads
            </p>
            <div className="flex flex-col gap-0.5">
              {threads?.map((t) => (
                <Link
                  key={t.id}
                  className={cn(
                    "flex flex-col gap-0.5 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-background/80",
                    activeId === t.id
                      ? "bg-background shadow-sm font-semibold"
                      : "text-foreground/80",
                  )}
                  params={{ threadId: t.id }}
                  to="/messages/$threadId"
                >
                  <p className="truncate font-medium">{t.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{t.lastMessage}</p>
                </Link>
              ))}
            </div>
          </div>
        </ScrollArea>
        <Outlet />
      </div>
    </div>
  );
};
