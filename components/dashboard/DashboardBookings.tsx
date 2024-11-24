"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader2, Calendar, Clock, Check, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusMap = {
  pending: { label: "قيد الانتظار", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "مؤكد", color: "bg-green-100 text-green-800" },
  cancelled: { label: "ملغي", color: "bg-red-100 text-red-800" },
  completed: { label: "مكتمل", color: "bg-blue-100 text-blue-800" },
};

export default function DashboardBookings() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const isProvider = session?.user?.accountType === "provider";

  const fetchBookings = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const endpoint = isProvider ? "/api/providers/bookings" : "/api/bookings";
      const res = await fetch(`${endpoint}?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "حدث خطأ في جلب الحجوزات");
      }

      setBookings(data.bookings);
    } catch (error: any) {
      toast.error("خطأ في جلب الحجوزات", {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "حدث خطأ في تحديث حالة الحجز");
      }

      toast.success("تم تحديث حالة الحجز بنجاح");
      fetchBookings(); // تحديث قائمة الحجوزات
    } catch (error: any) {
      toast.error("خطأ في تحديث حالة الحجز", {
        description: error.message
      });
    }
  };

  useEffect(() => {
    if (session) {
      fetchBookings();
    }
  }, [session, statusFilter]);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">
            {isProvider ? "الحجوزات المستلمة" : "حجوزاتي"}
          </h2>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="حالة الحجز" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحجوزات</SelectItem>
              <SelectItem value="pending">قيد الانتظار</SelectItem>
              <SelectItem value="confirmed">مؤكد</SelectItem>
              <SelectItem value="cancelled">ملغي</SelectItem>
              <SelectItem value="completed">مكتمل</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking: any) => (
              <Card key={booking.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {isProvider ? booking.user.name : booking.provider.name}
                    </h3>
                    <p className="text-gray-600">
                      {isProvider ? booking.user.email : booking.provider.specialty}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 ml-1" />
                        {new Date(booking.date).toLocaleDateString("ar-EG")}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 ml-1" />
                        {booking.time}
                      </div>
                    </div>
                    {booking.notes && (
                      <p className="mt-2 text-gray-600">{booking.notes}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm ${
                        statusMap[booking.status as keyof typeof statusMap].color
                      }`}
                    >
                      {statusMap[booking.status as keyof typeof statusMap].label}
                    </span>
                    
                    {isProvider && booking.status === "pending" && (
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="default"
                          className="flex items-center gap-1"
                          onClick={() => updateBookingStatus(booking.id, "confirmed")}
                        >
                          <Check className="h-4 w-4" />
                          قبول
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex items-center gap-1"
                          onClick={() => updateBookingStatus(booking.id, "cancelled")}
                        >
                          <X className="h-4 w-4" />
                          رفض
                        </Button>
                      </div>
                    )}
                    
                    {isProvider && booking.status === "confirmed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2"
                        onClick={() => updateBookingStatus(booking.id, "completed")}
                      >
                        تم الإنجاز
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">
            لا توجد حجوزات {statusFilter !== "all" && "بهذه الحالة"}
          </div>
        )}
      </div>
    </Card>
  );
}