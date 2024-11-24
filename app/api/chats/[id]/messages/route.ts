import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Chat from "@/lib/models/Chat";
import pusher from "@/lib/pusher";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول أولاً" },
        { status: 401 }
      );
    }

    await connectDB();

    const chat = await Chat.findById(params.id)
      .populate('messages.sender', 'name');

    if (!chat) {
      return NextResponse.json(
        { error: "المحادثة غير موجودة" },
        { status: 404 }
      );
    }

    // التحقق من أن المستخدم مشارك في المحادثة
    if (!chat.participants.includes(session.user.id)) {
      return NextResponse.json(
        { error: "غير مصرح لك بالوصول لهذه المحادثة" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      messages: chat.messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الرسائل" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول أولاً" },
        { status: 401 }
      );
    }

    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "محتوى الرسالة مطلوب" },
        { status: 400 }
      );
    }

    await connectDB();

    const chat = await Chat.findById(params.id);

    if (!chat) {
      return NextResponse.json(
        { error: "المحادثة غير موجودة" },
        { status: 404 }
      );
    }

    // التحقق من أن المستخدم مشارك في المحادثة
    if (!chat.participants.includes(session.user.id)) {
      return NextResponse.json(
        { error: "غير مصرح لك بإرسال رسائل في هذه المحادثة" },
        { status: 403 }
      );
    }

    const message = {
      sender: session.user.id,
      content,
      createdAt: new Date(),
    };

    chat.messages.push(message);
    chat.lastMessage = message;
    chat.updatedAt = new Date();
    
    await chat.save();

    // إرسال إشعار في الوقت الفعلي
    const otherParticipant = chat.participants.find(
      p => p.toString() !== session.user.id
    );

    await pusher.trigger(`chat-${params.id}`, 'new-message', {
      message: {
        ...message,
        sender: {
          id: session.user.id,
          name: session.user.name,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إرسال الرسالة" },
      { status: 500 }
    );
  }
}