import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * POST /api/webhook
 * Razorpay Webhook — receives server-to-server payment events.
 *
 * Configure in Razorpay Dashboard → Settings → Webhooks:
 *   URL  : https://yourdomain.com/api/webhook
 *   Events: payment.captured, payment.failed, order.paid
 *
 * Set RAZORPAY_WEBHOOK_SECRET in your .env.local / Vercel env.
 */
export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get("x-razorpay-signature");

        if (!signature) {
            return NextResponse.json({ error: "Missing signature" }, { status: 400 });
        }

        // 1. Verify webhook authenticity using the webhook secret
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;
        const expectedSig = crypto
            .createHmac("sha256", webhookSecret)
            .update(rawBody)
            .digest("hex");

        if (expectedSig !== signature) {
            console.warn("[webhook] Invalid signature received");
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }

        // 2. Parse the event payload
        const event = JSON.parse(rawBody);
        const eventType: string = event.event;

        console.log(`[webhook] Received event: ${eventType}`);

        // 3. Handle relevant events
        if (eventType === "payment.captured" || eventType === "order.paid") {
            const payment = event.payload?.payment?.entity;
            const rzpOrderId: string = payment?.order_id;
            const paymentId: string = payment?.id;

            if (!rzpOrderId || !paymentId) {
                return NextResponse.json({ received: true }); // ignore malformed events
            }

            // Find order by razorpay_payment_id (which stores the rzp order id before capture)
            const { data: order, error: fetchError } = await supabaseAdmin
                .from("orders")
                .select("id, payment_status")
                .eq("razorpay_payment_id", rzpOrderId)
                .single();

            if (fetchError || !order) {
                console.warn(`[webhook] Order not found for rzp_order_id: ${rzpOrderId}`);
                return NextResponse.json({ received: true });
            }

            // Avoid double-processing
            if (order.payment_status === "paid") {
                return NextResponse.json({ received: true });
            }

            // Update order status
            await supabaseAdmin
                .from("orders")
                .update({
                    payment_status: "paid",
                    order_status: "confirmed",
                    razorpay_payment_id: paymentId,
                })
                .eq("id", order.id);

            // Append status log
            await supabaseAdmin.from("order_status_logs").insert({
                order_id: order.id,
                status: "confirmed",
            });
        }

        if (eventType === "payment.failed") {
            const payment = event.payload?.payment?.entity;
            const rzpOrderId: string = payment?.order_id;

            if (rzpOrderId) {
                const { data: order } = await supabaseAdmin
                    .from("orders")
                    .select("id")
                    .eq("razorpay_payment_id", rzpOrderId)
                    .single();

                if (order) {
                    await supabaseAdmin
                        .from("orders")
                        .update({ payment_status: "failed" })
                        .eq("id", order.id);

                    await supabaseAdmin.from("order_status_logs").insert({
                        order_id: order.id,
                        status: "payment_failed",
                    });
                }
            }
        }

        return NextResponse.json({ received: true });
    } catch (err) {
        console.error("[webhook] Error:", err);
        // Always return 200 to Razorpay so it doesn't keep retrying
        return NextResponse.json({ received: true });
    }
}
