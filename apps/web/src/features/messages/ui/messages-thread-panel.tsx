import { Button } from "@innovate-test/ui/components/button";
import { Input } from "@innovate-test/ui/components/input";
import { ScrollArea } from "@innovate-test/ui/components/scroll-area";
import { Separator } from "@innovate-test/ui/components/separator";
import { cn } from "@innovate-test/ui/lib/utils";
import { ClockIcon } from "lucide-react";

import type { Message } from "@/features/messages/lib/mock-data";

type Props = {
  messages: Message[] | undefined;
};

export const MessagesThreadPanel = ({ messages }: Props) => (
  <div className="flex flex-col">
    <ScrollArea className="h-[min(420px,50vh)] p-4 md:h-auto md:max-h-[calc(100vh-220px)]">
      <div className="flex flex-col gap-3">
        {messages?.map((m) => (
          <div
            key={m.id}
            className={cn(
              "max-w-[85%] rounded-lg border border-border px-3 py-2 text-sm",
              m.author === "You" ? "ml-auto bg-primary/10" : "bg-muted/50",
            )}
          >
            <p className="text-xs text-muted-foreground">{m.author}</p>
            <p>{m.body}</p>
            <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
              {m.status === "queued" ? <ClockIcon className="size-3" /> : null}
              {m.sentAt}
            </p>
          </div>
        ))}
      </div>
    </ScrollArea>
    <Separator />
    <div className="flex gap-2 p-3">
      <Input className="flex-1" placeholder="Message…" />
      <Button type="button">Send</Button>
    </div>
  </div>
);
