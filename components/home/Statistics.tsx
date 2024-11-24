"use client";

import { Card } from "@/components/ui/card";
import { Users, UserCog, Star, Clock } from "lucide-react";
import CountUp from "react-countup";

interface StatisticsProps {
  members: number;
  providers: number;
  averageRating?: number;
  completedServices?: number;
}

export default function Statistics({ 
  members, 
  providers, 
  averageRating = 0, 
  completedServices = 0 
}: StatisticsProps) {
  const stats = [
    {
      title: "الأعضاء المسجلين",
      value: members,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      description: "عدد العملاء المسجلين في المنصة",
      suffix: "",
      decimals: 0
    },
    {
      title: "مزودو الخدمات",
      value: providers,
      icon: UserCog,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      description: "عدد مقدمي الخدمات النشطين",
      suffix: "",
      decimals: 0
    },
    {
      title: "متوسط التقييمات",
      value: averageRating,
      icon: Star,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
      description: "متوسط تقييم مزودي الخدمات",
      suffix: " ★",
      decimals: 1
    },
    {
      title: "الخدمات المكتملة",
      value: completedServices,
      icon: Clock,
      color: "text-green-500",
      bgColor: "bg-green-50",
      description: "عدد الخدمات المقدمة بنجاح",
      suffix: "",
      decimals: 0
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">إحصائيات المنصة</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            نفخر بثقة عملائنا ومزودي الخدمات في منصتنا، ونسعى دائماً لتقديم أفضل تجربة للجميع
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={stat.title} 
                className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex justify-center mb-4">
                  <div className={`p-4 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{stat.title}</h3>
                <p className="text-3xl font-bold mb-2">
                  <CountUp 
                    end={stat.value} 
                    duration={2.5} 
                    separator="," 
                    decimals={stat.decimals}
                    suffix={stat.suffix}
                  />
                </p>
                <p className="text-sm text-gray-600">{stat.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}