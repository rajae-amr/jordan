import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">خطأ في المصادقة</h1>
        <p className="text-gray-600 mb-6">
          حدث خطأ أثناء محاولة تسجيل الدخول. يرجى المحاولة مرة أخرى.
        </p>
        <Button asChild>
          <Link href="/login">العودة لتسجيل الدخول</Link>
        </Button>
      </div>
    </div>
  );
}