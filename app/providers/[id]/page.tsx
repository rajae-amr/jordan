"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Star, MapPin, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import BookingForm from "@/components/providers/BookingForm";
import ReviewForm from "@/components/providers/ReviewForm";
import { useSession } from "next-auth/react";

export default function ProviderDetailsPage() {
  const params = useParams();
  const { data: session } = useSession();
  const [provider, setProvider] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const res = await fetch(`/api/providers/${params.id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "حدث خطأ في جلب بيانات مقدم الخدمة");
        }

        setProvider(data.provider);
      } catch (error: any) {
        toast.error("خطأ في جلب البيانات", {
          description: error.message
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchProvider();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">مقدم الخدمة غير موجود</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{provider.name}</h1>
              <p className="text-gray-600">{provider.specialty}</p>
            </div>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="ml-1 font-medium">{provider.rating}</span>
              <span className="text-gray-600 text-sm mr-1">
                ({provider.reviews.length} تقييم)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 ml-1" />
              {provider.location}
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 ml-1" />
              خبرة {provider.experience}
            </div>
          </div>

          {provider.bio && (
            <div>
              <h2 className="text-xl font-semibold mb-2">نبذة عني</h2>
              <p className="text-gray-600">{provider.bio}</p>
            </div>
          )}

          {session?.user && (
            <div className="flex gap-4">
              <Dialog open={showBookingForm} onOpenChange={setShowBookingForm}>
                <DialogTrigger asChild>
                  <Button className="flex-1">احجز موعد</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>حجز موعد مع {provider.name}</DialogTitle>
                  </DialogHeader>
                  <BookingForm
                    providerId={params.id as string}
                    onSuccess={() => setShowBookingForm(false)}
                  />
                </DialogContent>
              </Dialog>

              <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    أضف تقييم
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>تقييم {provider.name}</DialogTitle>
                  </DialogHeader>
                  <ReviewForm
                    providerId={params.id as string}
                    onSuccess={() => setShowReviewForm(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold mb-4">التقييمات</h2>
            {provider.reviews.length > 0 ? (
              <div className="space-y-4">
                {provider.reviews.map((review: any) => (
                  <Card key={review.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{review.userName}</p>
                        <p className="text-gray-600 text-sm">
                          {new Date(review.createdAt).toLocaleDateString("ar-EG")}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span className="ml-1">{review.rating}</span>
                      </div>
                    </div>
                    {review.comment && (
                      <p className="mt-2 text-gray-600">{review.comment}</p>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center">لا توجد تقييمات بعد</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}