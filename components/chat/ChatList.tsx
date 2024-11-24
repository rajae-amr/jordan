"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import PusherClient from 'pusher-js';

interface ChatListProps {
  selectedChat: string | null;
  onSelectChat: (chatId: string) => void;
}

interface Chat {
  id: string;
  participants: Array<{
    id: string;
    name: string;
  }>;
  lastMessage?: {
    content: string;
    createdAt: string;
  };
  updatedAt: string;
}

export default function ChatList({ selectedChat, onSelectChat }: ChatListProps) {
  const { data: session } = useSession();
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetchChats();
      setupPusher();
    }
  }, [session]);

  const fetchChats = async () => {
    try {
      const res = await fetch('/api/chats');
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setChats(data.chats);
    } catch (error: any) {
      toast.error("خطأ في جلب المحادثات", {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setupPusher = () => {
    const pusher = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    chats.forEach(chat => {
      const channel = pusher.subscribe(`chat-${chat.id}`);
      channel.bind('new-message', (data: any) => {
        setChats(prevChats => 
          prevChats.map(prevChat => 
            prevChat.id === chat.id
              ? {
                  ...prevChat,
                  lastMessage: data.message,
                  updatedAt: new Date().toISOString(),
                }
              : prevChat
          ).sort((a, b) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
        );
      });
    });

    return () => {
      chats.forEach(chat => {
        pusher.unsubscribe(`chat-${chat.id}`);
      });
    };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px]">
      <div className="p-4 space-y-2">
        {chats.length > 0 ? (
          chats.map((chat) => {
            const otherParticipant = chat.participants.find(
              p => p.id !== session?.user.id
            );

            return (
              <Button
                key={chat.id}
                variant={selectedChat === chat.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => onSelectChat(chat.id)}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">
                    {otherParticipant?.name}
                  </span>
                  {chat.lastMessage && (
                    <span className="text-sm text-gray-500 truncate">
                      {chat.lastMessage.content}
                    </span>
                  )}
                </div>
              </Button>
            );
          })
        ) : (
          <div className="text-center text-gray-500 py-4">
            لا توجد محادثات
          </div>
        )}
      </div>
    </ScrollArea>
  );
}