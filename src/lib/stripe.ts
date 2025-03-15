import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

export const createCheckoutSession = async (params: {
  successUrl: string;
  cancelUrl: string;
  userEmail: string;
  userId: string;
}) => {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price: "price_1R2fUNQ4fcq7usZKvbLQ9A3P",
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    customer_email: params.userEmail,
    metadata: {
      userId: params.userId,
    },
  });

  return session;
};
