"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Star, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const categories = [
  { id: "education", label: "التعليم الخصوصي", image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=400&h=300&fit=crop" },
  { id: "physiotherapy", label: "العلاج الطبيعي", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop" },
  { id: "psychology", label: "العلاج النفسي", image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=400&h=300&fit=crop" },
  { id: "homecare", label: "الرعاية المنزلية", image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=400&h=300&fit=crop" },
];

export default function TopProvidersByCategory() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopProviders = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/providers/top?category=${selectedCategory}&limit=3`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "حدث خطأ في جلب مقدمي الخدمات");
        }

        setProviders(data.providers);
      } catch (error: any) {
        toast.error("خطأ في جلب البيانات", {
          description: error.message
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopProviders();
  }, [selectedCategory]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          أفضل مقدمي الخدمات
        </h2>

        <div className="flex justify-center gap-4 mb-8 overflow-x-auto pb-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="min-w-[120px]"
            >
              {category.label}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {providers.map((provider: any) => (
              <Card key={provider.id} className="overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={categories.find(c => c.id === provider.specialty)?.image || ""}
                    alt={provider.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{provider.name}</h3>
                      <p className="text-gray-600">{provider.specialty}</p>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      <span className="ml-1 font-medium">{provider.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{provider.location}</span>
                  </div>

                  {provider.bio && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {provider.bio}
                    </p>
                  )}

                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/providers/${provider.id}`}>
                      عرض الملف الكامل
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}