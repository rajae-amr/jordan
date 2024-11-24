"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "next-i18next";
import { Check, Star } from "lucide-react";
import Link from "next/link";

const packages = [
  {
    id: "basic",
    price: {
      monthly: 29,
      yearly: 290,
    },
    maxBookings: 20,
  },
  {
    id: "professional",
    price: {
      monthly: 79,
      yearly: 790,
    },
    maxBookings: -1, // غير محدود
  },
  {
    id: "enterprise",
    price: {
      monthly: 199,
      yearly: 1990,
    },
    maxBookings: -1,
  },
];

export default function PackagesPage() {
  const { t } = useTranslation();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t("packages.title")}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t("packages.description")}
        </p>

        <div className="flex justify-center gap-4 mt-8">
          <Button
            variant={billingCycle === "monthly" ? "default" : "outline"}
            onClick={() => setBillingCycle("monthly")}
          >
            {t("packages.monthly")}
          </Button>
          <Button
            variant={billingCycle === "yearly" ? "default" : "outline"}
            onClick={() => setBillingCycle("yearly")}
          >
            {t("packages.yearly")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packages.map((pkg) => (
          <Card
            key={pkg.id}
            className={`p-6 relative ${
              pkg.id === "professional" ? "border-primary" : ""
            }`}
          >
            {pkg.id === "professional" && (
              <div className="absolute -top-3 right-4 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm">
                {t("packages.popular")}
              </div>
            )}

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">
                {t(`packages.${pkg.id}.name`)}
              </h2>
              <p className="text-gray-600">
                {t(`packages.${pkg.id}.description`)}
              </p>
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  {pkg.price[billingCycle]}
                </span>
                <span className="text-gray-600"> د.أ</span>
                <span className="block text-sm text-gray-500">
                  {billingCycle === "monthly"
                    ? t("packages.monthly")
                    : t("packages.yearly")}
                </span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <p className="font-medium">{t("packages.features")}:</p>
              <ul className="space-y-2">
                {t(`packages.${pkg.id}.features`, { returnObjects: true }).map(
                  (feature: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  )
                )}
              </ul>
            </div>

            <Button
              className="w-full"
              variant={pkg.id === "professional" ? "default" : "outline"}
              asChild
            >
              <Link href={`/packages/subscribe/${pkg.id}`}>
                {t("packages.subscribe")}
              </Link>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}