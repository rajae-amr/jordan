"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const specialties = [
  { value: "education", label: "تعليم خصوصي" },
  { value: "physiotherapy", label: "علاج طبيعي" },
  { value: "psychology", label: "علاج نفسي" },
  { value: "homecare", label: "رعاية منزلية" },
];

const locations = [
  { value: "amman", label: "عمان" },
  { value: "irbid", label: "إربد" },
  { value: "zarqa", label: "الزرقاء" },
  { value: "aqaba", label: "العقبة" },
];

export default function ProviderRegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    specialty: "",
    location: "",
    experience: "",
    bio: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/providers/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "حدث خطأ أثناء التسجيل");
      }

      toast.success("تم التسجيل بنجاح", {
        description: "تم تسجيلك كمقدم خدمة بنجاح"
      });

      // Refresh the page to update the UI
      window.location.reload();
    } catch (error: any) {
      toast.error("خطأ في التسجيل", {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="specialty">التخصص</Label>
        <Select
          value={formData.specialty}
          onValueChange={(value) =>
            setFormData({ ...formData, specialty: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر تخصصك" />
          </SelectTrigger>
          <SelectContent>
            {specialties.map((specialty) => (
              <SelectItem key={specialty.value} value={specialty.value}>
                {specialty.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">المنطقة</Label>
        <Select
          value={formData.location}
          onValueChange={(value) =>
            setFormData({ ...formData, location: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر منطقتك" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location.value} value={location.value}>
                {location.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience">سنوات الخبرة</Label>
        <Input
          id="experience"
          value={formData.experience}
          onChange={(e) =>
            setFormData({ ...formData, experience: e.target.value })
          }
          placeholder="مثال: 5 سنوات"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">نبذة عنك</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="اكتب نبذة مختصرة عن خبراتك ومؤهلاتك"
          className="h-32"
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            جاري التسجيل...
          </>
        ) : (
          "تسجيل كمقدم خدمة"
        )}
      </Button>
    </form>
  );
}