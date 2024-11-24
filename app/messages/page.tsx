"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import ChatList from "@/components/chat/ChatList";
import MessageList from "@/components/chat/MessageList";

export default function MessagesPage() {
  const { data: session } = useSession();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !selectedChat) return;

    setIsSending(true);

    try {
      const res = await fetch(`/api/chats/${selectedChat}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: message }),
      });

      if (!res.ok) {
        throw new Error("فشل إرسال الرسالة");
      }

      setMessage("");
    } catch (error: any) {
      toast.error("خطأ في إرسال الرسالة", {
        description: error.message
      });
    } finally {
      setIsSending(false);
    }
  };

  if (!session) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="grid grid-cols-1 md:grid-cols-3 gap-0 h-[600px]">
        <div className="border-l">
          <ChatList
            selectedChat={selectedChat}
            onSelectChat={setSelectedChat}
          />
        </div>
        
        <div className="col-span-2 flex flex-col">
          {selectedChat ? (
            <>
              <MessageList chatId={selectedChat} />
              
              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="اكتب رسالتك..."
                    disabled={isSending}
                  />
                  <Button type="submit" disabled={isSending}>
                    {isSending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              اختر محادثة للبدء
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}