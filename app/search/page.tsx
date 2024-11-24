"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

const categories = [
  { value: "education", label: "التعليم الخصوصي" },
  { value: "physiotherapy", label: "العلاج الطبيعي" },
  { value: "homecare", label: "الرعاية المنزلية" },
  { value: "psychology", label: "العلاج النفسي" },
];

const locations = [
  { value: "amman", label: "عمان" },
  { value: "irbid", label: "إربد" },
  { value: "zarqa", label: "الزرقاء" },
  { value: "aqaba", label: "العقبة" },
];

export default function SearchPage() {
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [query, setQuery] = useState("");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">البحث عن مقدمي الخدمات</h1>
      
      <Card className="p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="category">نوع الخدمة</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="اختر نوع الخدمة" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">المنطقة</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue placeholder="اختر المنطقة" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc.value} value={loc.value}>
                    {loc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="search">بحث</Label>
            <div className="flex gap-2">
              <Input
                id="search"
                placeholder="ابحث باسم مقدم الخدمة أو التخصص"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button type="submit">بحث</Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="text-center text-gray-600">
        <p>قريباً - سيتم عرض نتائج البحث هنا</p>
      </div>
    </div>
  );
}