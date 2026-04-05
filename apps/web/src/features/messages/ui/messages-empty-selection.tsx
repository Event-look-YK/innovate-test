import { MessageSquareIcon } from "lucide-react";

export const MessagesEmptySelection = () => (
  <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center">
    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/8">
      <MessageSquareIcon className="size-6 text-primary/60" />
    </div>
    <div>
      <p className="font-semibold text-foreground">Select a thread</p>
      <p className="mt-0.5 text-sm text-muted-foreground">
        Pick a conversation in the list to read and send messages.
      </p>
    </div>
  </div>
);
