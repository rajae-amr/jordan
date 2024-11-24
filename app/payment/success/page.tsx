import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold">تم الدفع بنجاح</h1>
        <p className="text-gray-600">
          تم تأكيد حجزك وسيتم إعلامك عند قبول مقدم الخدمة للحجز
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/dashboard">
              الذهاب للوحة التحكم
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              العودة للرئيسية
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}