"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

interface PayPalButtonsProps {
  amount: number;
  cause: string;
  donationType: string;
}

export function PayPalButtons({
  amount,
  cause,
  donationType,
}: PayPalButtonsProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded && window.paypal) {
      try {
        window.paypal
          .Buttons({
            style: {
              layout: "vertical",
              color: "blue",
              shape: "rect",
              label: "paypal",
            },
            createOrder: (data: any, actions: any) => {
              return actions.order.create({
                purchase_units: [
                  {
                    description: `Donation to ${cause.replace(/-/g, " ")}`,
                    amount: {
                      value: amount.toString(),
                    },
                  },
                ],
                application_context: {
                  shipping_preference: "NO_SHIPPING",
                },
              });
            },
            onApprove: (data: any, actions: any) => {
              return actions.order.capture().then((details: any) => {
                alert("Transaction completed! Thank you for your donation.");
                // Here you would typically call your server to record the donation
              });
            },
            onError: (err: any) => {
              console.error("PayPal error:", err);
              alert(
                "There was an error processing your payment. Please try again."
              );
            },
          })
          .render("#paypal-button-container");
      } catch (error) {
        console.error("Error rendering PayPal buttons:", error);
      }
    }
  }, [loaded, amount, cause, donationType]);

  return (
    <>
      <Script
        src="https://www.paypal.com/sdk/js?client-id=test&currency=GBP"
        onLoad={() => setLoaded(true)}
      />
      <div id="paypal-button-container" className="w-full"></div>
      <p className="text-xs text-center text-muted-foreground mt-2">
        Secure payment processing by PayPal
      </p>
    </>
  );
}
