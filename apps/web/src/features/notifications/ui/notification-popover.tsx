import { useNavigate } from "@tanstack/react-router";
import { Button } from "@innovate-test/ui/components/button";
import { Popover, PopoverContent, PopoverTrigger } from "@innovate-test/ui/components/popover";
import { ScrollArea } from "@innovate-test/ui/components/scroll-area";
import { BellIcon } from "lucide-react";

import {
  useNotifications,
  useUnreadCount,
  useMarkRead,
  useMarkAllRead,
} from "@/features/notifications/hooks/use-notifications";
import { getNotificationLink } from "@/features/notifications/lib/notification-navigation";
import { formatRelativeTime } from "@/shared/lib/format";
import type { AppNotification } from "@/shared/types/notification";

const NotificationItem = ({ notification }: { notification: AppNotification }) => {
  const navigate = useNavigate();
  const markRead = useMarkRead();
  const isUnread = !notification.readAt;

  const handleClick = () => {
    if (isUnread) markRead.mutate(notification.id);
    const link = getNotificationLink(notification);
    if (link) {
      navigate({ to: link.to, params: link.params });
    }
  };

  return (
    <button
      className="flex w-full gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted/60"
      type="button"
      onClick={handleClick}
    >
      <div className="mt-1.5 shrink-0">
        {isUnread ? (
          <span className="block size-2 rounded-full bg-primary" />
        ) : (
          <span className="block size-2 rounded-full bg-transparent" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{notification.title}</p>
        <p className="truncate text-xs text-muted-foreground">{notification.body}</p>
        <p className="mt-0.5 text-[10px] text-muted-foreground/60">
          {formatRelativeTime(notification.createdAt)}
        </p>
      </div>
    </button>
  );
};

export const NotificationPopover = () => {
  const { data: unread } = useUnreadCount();
  const { data, isPending } = useNotifications();
  const markAllRead = useMarkAllRead();
  const notifications = data?.data ?? [];

  return (
    <Popover>
      <PopoverTrigger
        className="relative inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground group"
      >
        <BellIcon className="size-4 transition-colors group-hover:text-primary" />
        <span className="sr-only">Notifications</span>
        {!!unread && unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0" sideOffset={8}>
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold">Сповіщення</h3>
          {!!unread && unread > 0 && (
            <Button
              className="h-auto px-2 py-1 text-xs"
              disabled={markAllRead.isPending}
              size="sm"
              type="button"
              variant="ghost"
              onClick={() => markAllRead.mutate()}
            >
              Прочитати все
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-[400px]">
          {isPending ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-1 py-8">
              <BellIcon className="size-6 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">Немає сповіщень</p>
            </div>
          ) : (
            <div className="flex flex-col py-1">
              {notifications.map((n) => (
                <NotificationItem key={n.id} notification={n} />
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
