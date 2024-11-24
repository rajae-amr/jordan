"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="hero-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">الراعي الرسمي للموقع :  <span className="text-primary">الدكتور أحمد عناقوة</span></h1>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            اكتشف أفضل مقدمي الخدمات في{" "}
            <span className="text-primary">الأردن</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            نوفر لك مجموعة متنوعة من الخدمات المهنية في مجالات التعليم، الصحة،
            والرعاية المنزلية
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild>
              <Link href="/search">
                <Search className="ml-2 h-5 w-5" />
                ابحث عن خدمة
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/register">سجل كمقدم خدمة</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}