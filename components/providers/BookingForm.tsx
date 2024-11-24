"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import PaymentForm from "./PaymentForm";

interface BookingFormProps {
  providerId: string;
  onSuccess?: () => void;
}

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00"
];

export default function BookingForm({ providerId, onSuccess }: BookingFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingId, setBookingId] = useState<string>("");
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    notes: "",
  });

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedDate = new Date(formData.date);
    const selectedTime = formData.time;
    
    if (selectedDate.getDay() === 5 || selectedDate.getDay() === 6) {
      toast.error("عذراً، لا يمكن الحجز في عطلة نهاية الأسبوع");
      return;
    }

    if (!TIME_SLOTS.includes(selectedTime)) {
      toast.error("يرجى اختيار وقت من الأوقات المتاحة");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/providers/${providerId}/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "حدث خطأ أثناء حجز الموعد");
      }

      setBookingId(data.booking.id);
      setShowPayment(true);
    } catch (error: any) {
      toast.error("خطأ في حجز الموعد", {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    toast.success("تم حجز الموعد بنجاح", {
      description: "سيتم إعلامك عند تأكيد الحجز"
    });

    if (onSuccess) {
      onSuccess();
    }

    router.refresh();
  };

  if (showPayment) {
    return (
      <PaymentForm
        bookingId={bookingId}
        amount={25} // سعر الحجز الثابت
        onSuccess={handlePaymentSuccess}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="date">التاريخ</Label>
        <Input
          id="date"
          type="date"
          required
          min={today}
          max={maxDateStr}
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
        <p className="text-sm text-gray-500">
          يمكنك الحجز خلال 3 أشهر من اليوم، من الأحد إلى الخميس
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="time">الوقت</Label>
        <select
          id="time"
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
        >
          <option value="">اختر الوقت</option>
          {TIME_SLOTS.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-500">
          أوقات العمل من 9 صباحاً حتى 5 مساءً
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">ملاحظات إضافية</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="أي معلومات إضافية ترغب في إضافتها"
          className="h-32"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            جاري حجز الموعد...
          </>
        ) : (
          "متابعة للدفع"
        )}
      </Button>
    </form>
  );
}