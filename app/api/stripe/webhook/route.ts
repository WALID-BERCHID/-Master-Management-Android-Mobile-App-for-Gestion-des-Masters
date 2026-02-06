import { NextResponse } from "next/server";
import Stripe from "stripe";
import { billingEnabled } from "@/lib/billing";

export async function POST(request: Request) {
  if (!billingEnabled) {
    return NextResponse.json({ status: "billing disabled" });
  }

  const signature = request.headers.get("stripe-signature");
  const body = await request.text();

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe keys missing" }, { status: 400 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

  try {
    stripe.webhooks.constructEvent(body, signature || "", process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  return NextResponse.json({ received: true });
}
