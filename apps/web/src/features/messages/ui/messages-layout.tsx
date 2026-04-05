import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Button } from "@innovate-test/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@innovate-test/ui/components/dialog";
import { Input } from "@innovate-test/ui/components/input";
import { Label } from "@innovate-test/ui/components/label";
import { ScrollArea } from "@innovate-test/ui/components/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@innovate-test/ui/components/select";
import { cn } from "@innovate-test/ui/lib/utils";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useCreateThread, useThreads } from "@/features/messages/hooks/use-messages";
import type { MessageThreadType } from "@/shared/types/message";

export const MessagesLayout = () => {
  const { data: threads } = useThreads();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const activeId = pathname.startsWith("/messages/") ? pathname.split("/messages/")[1]?.split("/")[0] : undefined;

  const navigate = useNavigate();
  const createThread = useCreateThread();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [threadType, setThreadType] = useState<MessageThreadType>("direct");
  const [threadTitle, setThreadTitle] = useState("");

  const handleCreate = async () => {
    if (!threadTitle.trim()) {
      toast.error("Title is required");
      return;
    }
    try {
      const newThread = await createThread.mutateAsync({
        type: threadType,
        title: threadTitle.trim(),
      });
      setDialogOpen(false);
      setThreadTitle("");
      setThreadType("direct");
      toast.success("Thread created");
      await navigate({ to: "/messages/$threadId", params: { threadId: newThread.id } });
    } catch {
      toast.error("Failed to create thread");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
        <p className="text-sm text-muted-foreground">Team conversations</p>
      </div>
      <div className="grid min-h-[480px] gap-0 overflow-hidden h-full rounded-2xl border border-border/60 shadow-sm md:grid-cols-[280px_1fr]">
        <ScrollArea className="border-border/60 md:border-r bg-muted/20">
          <div className="p-3">
            <div className="mb-2 flex items-center justify-between px-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                Threads
              </p>
              <Button
                className="h-6 w-6"
                icon={<PlusIcon className="size-4" />}
                size="icon"
                variant="ghost"
                onClick={() => setDialogOpen(true)}
              />
            </div>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>New thread</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="thread-type">Type</Label>
              <Select
                value={threadType}
                onValueChange={(v) => setThreadType(v as MessageThreadType)}
              >
                <SelectTrigger id="thread-type" className="w-full">
                  <SelectValue placeholder="Select type">
                    {(value: string | null) => {
                      const labels: Record<string, string> = { direct: "Direct", group: "Group", task: "Task" };
                      return value ? labels[value] ?? value : null;
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="direct">Direct</SelectItem>
                    <SelectItem value="group">Group</SelectItem>
                    <SelectItem value="task">Task</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="thread-title">Title</Label>
              <Input
                id="thread-title"
                placeholder="Thread title"
                value={threadTitle}
                onChange={(e) => setThreadTitle(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button icon={<PlusIcon />} loading={createThread.isPending} onClick={handleCreate}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
