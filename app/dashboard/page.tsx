"use client";

import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardProfile from "@/components/dashboard/DashboardProfile";
import DashboardServices from "@/components/dashboard/DashboardServices";
import DashboardBookings from "@/components/dashboard/DashboardBookings";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">لوحة التحكم</h1>
        <div className="text-gray-600">
          مرحباً, {session?.user?.name}
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
          <TabsTrigger value="services">الخدمات</TabsTrigger>
          <TabsTrigger value="bookings">الحجوزات</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <DashboardProfile />
        </TabsContent>

        <TabsContent value="services">
          <DashboardServices />
        </TabsContent>

        <TabsContent value="bookings">
          <DashboardBookings />
        </TabsContent>
      </Tabs>
    </div>
  );
}