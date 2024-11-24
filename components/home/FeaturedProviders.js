"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function FeaturedProviders() {
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await fetch("/api/providers?limit=3");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "حدث خطأ في جلب مقدمي الخدمات");
        }

        setProviders(data.providers);
      } catch (error) {
        toast.error("خطأ في جلب مقدمي الخدمات", {
          description: error.message
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          مقدمو خدمات مميزون
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {providers.map((provider) => (
            <Card key={provider.id} className="overflow-hidden">
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2">{provider.name}</h3>
                <p className="text-gray-600 mb-4">{provider.specialty}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 font-medium">{provider.rating}</span>
                    <span className="text-gray-600 text-sm mr-1">
                      ({provider.reviews} تقييم)
                    </span>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/providers/${provider.id}`}>
                      عرض الملف
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}