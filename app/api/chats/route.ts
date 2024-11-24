import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Chat from "@/lib/models/Chat";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول أولاً" },
        { status: 401 }
      );
    }

    await connectDB();

    const chats = await Chat.find({
      participants: session.user.id
    })
    .populate('participants', 'name')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });

    return NextResponse.json({
      success: true,
      chats: chats.map(chat => ({
        id: chat._id,
        participants: chat.participants,
        lastMessage: chat.lastMessage,
        updatedAt: chat.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب المحادثات" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول أولاً" },
        { status: 401 }
      );
    }

    const { participantId } = await req.json();

    if (!participantId) {
      return NextResponse.json(
        { error: "معرف المستخدم الآخر مطلوب" },
        { status: 400 }
      );
    }

    await connectDB();

    // التحقق من وجود محادثة سابقة
    const existingChat = await Chat.findOne({
      participants: { 
        $all: [session.user.id, participantId] 
      }
    });

    if (existingChat) {
      return NextResponse.json({
        success: true,
        chatId: existingChat._id,
      });
    }

    // إنشاء محادثة جديدة
    const newChat = await Chat.create({
      participants: [session.user.id, participantId],
      messages: [],
    });

    return NextResponse.json({
      success: true,
      chatId: newChat._id,
    });
  } catch (error) {
    console.error("Error creating chat:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إنشاء المحادثة" },
      { status: 500 }
    );
  }
}