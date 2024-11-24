"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";
import PusherClient from 'pusher-js';
import { toast } from "sonner";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  status: string;
  link?: string;
  createdAt: string;
}

export default function NotificationBell() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchNotifications();
      setupPusher();
    }
  }, [session]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications?limit=5');
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error: any) {
      toast.error("خطأ في جلب الإشعارات", {
        description: error.message
      });
    }
  };

  const setupPusher = () => {
    const pusher = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(`user-${session?.user.id}`);
    
    channel.bind('new-notification', (data: Notification) => {
      setNotifications(prev => [data, ...prev].slice(0, 5));
      setUnreadCount(prev => prev + 1);
      
      toast.info(data.title, {
        description: data.message,
      });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  };

  const markAsRead = async () => {
    try {
      const unreadNotifications = notifications
        .filter(n => n.status === 'unread')
        .map(n => n._id);

      if (unreadNotifications.length === 0) return;

      const res = await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationIds: unreadNotifications,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to mark notifications as read');
      }

      setNotifications(prev =>
        prev.map(n => ({ ...n, status: 'read' }))
      );
      setUnreadCount(0);
    } catch (error: any) {
      toast.error("خطأ في تحديث الإشعارات", {
        description: error.message
      });
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-2">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">الإشعارات</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAsRead}
                className="text-xs"
              >
                تعيين الكل كمقروء
              </Button>
            )}
          </div>
          <div className="space-y-2">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification._id}
                  className={`flex flex-col items-start p-2 ${
                    notification.status === 'unread' ? 'bg-primary/5' : ''
                  }`}
                >
                  <span className="font-medium">{notification.title}</span>
                  <span className="text-sm text-gray-600">
                    {notification.message}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    {new Date(notification.createdAt).toLocaleString('ar-EG')}
                  </span>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                لا توجد إشعارات
              </div>
            )}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}