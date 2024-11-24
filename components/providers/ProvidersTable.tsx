"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, MapPin, Search } from "lucide-react";
import Link from "next/link";

const specialties = [
  { value: "all", label: "جميع التخصصات" },
  { value: "education", label: "تعليم خصوصي" },
  { value: "physiotherapy", label: "علاج طبيعي" },
  { value: "psychology", label: "علاج نفسي" },
  { value: "homecare", label: "رعاية منزلية" },
];

const locations = [
  { value: "all", label: "جميع المناطق" },
  { value: "amman", label: "عمان" },
  { value: "irbid", label: "إربد" },
  { value: "zarqa", label: "الزرقاء" },
  { value: "aqaba", label: "العقبة" },
];

interface Provider {
  id: string;
  name: string;
  specialty: string;
  location: string;
  experience: string;
  rating: number;
  reviews: number;
  bio?: string;
}

interface ProvidersTableProps {
  providers: Provider[];
}

export default function ProvidersTable({ providers: initialProviders }: ProvidersTableProps) {
  const [specialty, setSpecialty] = useState("all");
  const [location, setLocation] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProviders = initialProviders.filter((provider) => {
    const matchesSpecialty = specialty === "all" || provider.specialty === specialty;
    const matchesLocation = location === "all" || provider.location === location;
    const matchesSearch = 
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false;

    return matchesSpecialty && matchesLocation && (searchQuery === "" || matchesSearch);
  });

  const getSpecialtyLabel = (value: string) => {
    return specialties.find(s => s.value === value)?.label || value;
  };

  const getLocationLabel = (value: string) => {
    return locations.find(l => l.value === value)?.label || value;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ابحث باسم مقدم الخدمة"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>
        <Select value={specialty} onValueChange={setSpecialty}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="التخصص" />
          </SelectTrigger>
          <SelectContent>
            {specialties.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="المنطقة" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>مقدم الخدمة</TableHead>
              <TableHead>التخصص</TableHead>
              <TableHead>المنطقة</TableHead>
              <TableHead>الخبرة</TableHead>
              <TableHead>التقييم</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProviders.length > 0 ? (
              filteredProviders.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell className="font-medium">{provider.name}</TableCell>
                  <TableCell>{getSpecialtyLabel(provider.specialty)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      {getLocationLabel(provider.location)}
                    </div>
                  </TableCell>
                  <TableCell>{provider.experience}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span>{provider.rating}</span>
                      <span className="text-gray-500 text-sm">
                        ({provider.reviews})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/providers/${provider.id}`}>
                        عرض الملف
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  لم يتم العثور على نتائج
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}