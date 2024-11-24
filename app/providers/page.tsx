"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import ProvidersTable from "@/components/providers/ProvidersTable";

export default function ProvidersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch("/api/providers");
        const data = await response.json();

        if (!response.ok) {
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

    fetchProviders();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">مقدمو الخدمات</h1>
        <p className="text-gray-600 mt-2">
          اكتشف أفضل مقدمي الخدمات في مختلف التخصصات
        </p>
      </div>

      <Card className="p-6">
        <ProvidersTable providers={providers} />
      </Card>
    </div>
  );
}