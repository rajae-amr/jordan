"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ReviewForm from "@/components/providers/ReviewForm";

interface CompletedBookingCardProps {
  booking: {
    id: string;
    provider: {
      id: string;
      name: string;
      specialty: string;
    };
    date: string;
    time: string;
    hasReview: boolean;
  };
  onReviewAdded?: () => void;
}

export default function CompletedBookingCard({ booking, onReviewAdded }: CompletedBookingCardProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    if (onReviewAdded) {
      onReviewAdded();
    }
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{booking.provider.name}</h3>
          <p className="text-gray-600">{booking.provider.specialty}</p>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
            <span>{new Date(booking.date).toLocaleDateString("ar-EG")}</span>
            <span>•</span>
            <span>{booking.time}</span>
          </div>
        </div>

        {!booking.hasReview && (
          <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Star className="h-4 w-4" />
                <MessageSquare className="h-4 w-4" />
                تقييم الخدمة
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>تقييم الخدمة</DialogTitle>
              </DialogHeader>
              <ReviewForm
                providerId={booking.provider.id}
                bookingId={booking.id}
                onSuccess={handleReviewSuccess}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Card>
  );
}