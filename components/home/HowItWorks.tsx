import { Card } from "@/components/ui/card";
import { Search, UserCheck, Calendar, Star } from "lucide-react";

const steps = [
  {
    title: "ابحث عن الخدمة",
    description: "اختر الخدمة المناسبة من مجموعة متنوعة من التخصصات",
    icon: Search,
  },
  {
    title: "اختر مقدم الخدمة",
    description: "راجع التقييمات والمراجعات واختر الأفضل",
    icon: UserCheck,
  },
  {
    title: "احجز موعدك",
    description: "حدد الوقت المناسب لك وأكد حجزك",
    icon: Calendar,
  },
  {
    title: "قيّم تجربتك",
    description: "شارك تجربتك لمساعدة الآخرين",
    icon: Star,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">كيف يعمل</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={step.title} className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="relative">
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 right-[-50%] w-[100px] border-t-2 border-dashed border-primary/30" />
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}