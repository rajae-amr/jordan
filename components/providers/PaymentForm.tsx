"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  bookingId: string;
  amount: number;
  onSuccess?: () => void;
}

function CheckoutForm({ bookingId, amount, onSuccess }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast.error("خطأ في عملية الدفع", {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-lg font-semibold">المبلغ المطلوب</p>
        <p className="text-3xl font-bold text-primary">{amount} د.أ</p>
      </div>

      <PaymentElement />

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !stripe || !elements}
      >
        {isLoading ? (
          <>
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            جاري إتمام الدفع...
          </>
        ) : (
          "ادفع الآن"
        )}
      </Button>
    </form>
  );
}

export default function PaymentForm(props: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch("/api/payments/create-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId: props.bookingId,
            amount: props.amount,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "حدث خطأ في تجهيز عملية الدفع");
        }

        setClientSecret(data.clientSecret);
      } catch (error: any) {
        toast.error("خطأ في تجهيز الدفع", {
          description: error.message
        });
      }
    };

    createPaymentIntent();
  }, [props.bookingId, props.amount]);

  if (!clientSecret) {
    return (
      <div className="flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          labels: 'floating',
        },
        locale: 'ar',
      }}
    >
      <CheckoutForm {...props} />
    </Elements>
  );
}