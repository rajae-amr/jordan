import { Card } from "@/components/ui/card";
import {
  GraduationCap,
  Stethoscope,
  Home,
  Baby,
  Heart,
  Users,
} from "lucide-react";
import Link from "next/link";

const categories = [
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
    title: "رعاية الأطفال",
    icon: Baby,
    description: "جليسات أطفال مؤهلات وذوات خبرة",
    href: "/services/childcare",
  },
  {
    title: "العلاج النفسي",
    icon: Heart,
    description: "أخصائيون نفسيون معتمدون",
    href: "/services/psychology",
  },
  {
    title: "رعاية المسنين",
    icon: Users,
    description: "خدمات رعاية متخصصة لكبار السن",
    href: "/services/elderly",
  },
];

export default function ServiceCategories() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">خدماتنا</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.title} href={category.href}>
                <Card className="p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{category.title}</h3>
                      <p className="text-gray-600 mt-1">{category.description}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}