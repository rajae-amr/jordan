"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Star } from "lucide-react";
import { useRouter } from "next/navigation";

interface ReviewFormProps {
  providerId: string;
  bookingId: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ providerId, bookingId, onSuccess }: ReviewFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    comment: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      toast.error("يرجى اختيار التقييم");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/providers/${providerId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          bookingId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "حدث خطأ أثناء إضافة التقييم");
      }

      toast.success("تم إضافة التقييم بنجاح");

      if (onSuccess) {
        onSuccess();
      }

      router.refresh();
    } catch (error: any) {
      toast.error("خطأ في إضافة التقييم", {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>التقييم</Label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none"
              onClick={() => setFormData({ ...formData, rating: star })}
            >
              <Star
                className={`h-8 w-8 ${
                  formData.rating >= star
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">تعليقك</Label>
        <Textarea
          id="comment"
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          placeholder="اكتب تجربتك مع مقدم الخدمة"
          className="h-32"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            جاري إرسال التقييم...
          </>
        ) : (
          "إرسال التقييم"
        )}
      </Button>
    </form>
  );
}