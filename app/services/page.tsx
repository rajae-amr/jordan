import { Card } from "@/components/ui/card";
import {
  GraduationCap,
  Stethoscope,
  Home,
  Heart,
} from "lucide-react";
import Link from "next/link";

const services = [
  {
    title: "التعليم الخصوصي",
    icon: GraduationCap,
    description: "معلمون متخصصون في جميع المواد والمراحل الدراسية",
    href: "/services/education",
  },
  {
    title: "العلاج الطبيعي",
    icon: Stethoscope,
    description: "أخصائيو علاج طبيعي ذوو خبرة عالية",
    href: "/services/physiotherapy",
  },
  {
    title: "الرعاية المنزلية",
    icon: Home,
    description: "خدمات رعاية منزلية شاملة على مدار الساعة",
    href: "/services/homecare",
  },
  {
    title: "العلاج النفسي",
    icon: Heart,
    description: "أخصائيون نفسيون معتمدون",
    href: "/services/psychology",
  },
];

export default function ServicesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">خدماتنا</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <Link key={service.title} href={service.href}>
              <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{service.title}</h3>
                    <p className="text-gray-600 mt-1">{service.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}