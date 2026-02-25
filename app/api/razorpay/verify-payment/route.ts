import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    try {
        const {
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            dbOrderId,
            items,
        } = await req.json();

        // 1. Verify HMAC SHA-256 signature
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(`${razorpayOrderId}|${razorpayPaymentId}`)
            .digest("hex");

        if (expectedSignature !== razorpaySignature) {
            return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
        }

        // 2. Mark order as paid
        const { error: updateError } = await supabaseAdmin
            .from("orders")
            .update({
                payment_status: "paid",
                order_status: "processing",
                razorpay_payment_id: razorpayPaymentId,
            })
            .eq("id", dbOrderId);

        if (updateError) throw updateError;

        // 3. Log status
        await supabaseAdmin.from("order_status_logs").insert({
            order_id: dbOrderId,
            status: "processing",
        });

        // 4. Deduct stock for each item
        for (const item of items as { id: number; qty: number }[]) {
            await supabaseAdmin.rpc("decrement_stock", {
                p_product_id: String(item.id),
                p_qty: item.qty,
            });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[verify-payment]", err);
        return NextResponse.json({ error: "Verification failed" }, { status: 500 });
    }
}
