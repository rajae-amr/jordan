"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import ProviderRegistrationForm from "./ProviderRegistrationForm";

export default function DashboardServices() {
  const { data: session } = useSession();
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  if (!session?.user) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">خدماتي</h2>
        </div>

        {session.user.accountType === "provider" ? (
          <div className="text-center text-gray-600">
            لم تقم بإضافة أي خدمات بعد
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                سجل كمقدم خدمة وابدأ في عرض خدماتك
              </h3>
              <p className="text-gray-600 mb-4">
                يمكنك الوصول إلى المزيد من العملاء وإدارة خدماتك بسهولة
              </p>
              {!showRegistrationForm && (
                <Button
                  onClick={() => setShowRegistrationForm(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  تسجيل كمقدم خدمة
                </Button>
              )}
            </div>

            {showRegistrationForm && <ProviderRegistrationForm />}
          </div>
        )}
      </div>
    </Card>
  );
}