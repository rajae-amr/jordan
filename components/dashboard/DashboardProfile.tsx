"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function DashboardProfile() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("فشل تحديث الملف الشخصي");
      }

      toast.success("تم تحديث الملف الشخصي", {
        description: "تم حفظ التغييرات بنجاح"
      });
      setIsEditing(false);
    } catch (error: any) {
      toast.error("خطأ في تحديث الملف الشخصي", {
        description: error.message
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">الملف الشخصي</h2>
          <p className="text-gray-600">إدارة معلومات حسابك الشخصي</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">الاسم</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div className="flex gap-4">
            {isEditing ? (
              <>
                <Button type="submit">حفظ التغييرات</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  إلغاء
                </Button>
              </>
            ) : (
              <Button type="button" onClick={() => setIsEditing(true)}>
                تعديل الملف الشخصي
              </Button>
            )}
          </div>
        </form>
      </div>
    </Card>
  );
}