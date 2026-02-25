import Razorpay from "razorpay";

/**
 * Server-only Razorpay client.
 * Never import this in Client Components — key_secret must stay server-side.
 */
export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});
