import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { supabaseAdmin } from "@/lib/supabase";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            items,
            subtotal,
            codAdvance,
            totalPayable,     // full order value (= subtotal)
            amountPayableNow, // what Razorpay charges: 20% for COD, 100% for prepaid
            paymentMethod,    // "prepaid" | "cod"
            shipping,
        } = body;

        // 1. Generate unique order number
        const orderNumber = `SL-${Date.now().toString().slice(-8)}`;

        // 2. Charge via Razorpay:
        //    COD  → charge only the 20% advance (amountPayableNow)
        //    Prepaid → charge full amount
        const amountPaise = Math.round((amountPayableNow ?? totalPayable) * 100);

        // 3. Create Razorpay order (both COD advance and prepaid go through Razorpay)
        const rzpOrder = await razorpay.orders.create({
            amount: amountPaise,
            currency: "INR",
            receipt: orderNumber,
            notes: {
                shipping_name: shipping.name,
                payment_type: paymentMethod === "cod" ? "cod_advance_20pct" : "prepaid_full",
            },
        });

        // 4. Insert DB order — pending until payment verified
        const orderTotal = totalPayable ?? subtotal;
        const advance = paymentMethod === "cod" ? (codAdvance ?? 0) : orderTotal;
        const remaining = orderTotal - advance;

        const { data: order, error } = await supabaseAdmin
            .from("orders")
            .insert({
                order_number: orderNumber,
                user_email: shipping.email,
                user_phone: shipping.phone,
                shipping_address: `${shipping.address1}${shipping.address2 ? ", " + shipping.address2 : ""}`,
                city: shipping.city,
                state: shipping.state,
                pincode: shipping.pincode,
                payment_method: paymentMethod,  // "cod" or "prepaid"
                total_amount: orderTotal,
                advance_paid: advance,
                remaining_amount: remaining,
                payment_status: "pending",       // → "paid" after verify-payment
                order_status: "processing",      // → confirmed after verify-payment
                razorpay_payment_id: rzpOrder.id, // store rzp order id temporarily
            })
            .select()
            .single();

        if (error) throw error;

        // 5. Insert order items
        const orderItems = items.map((item: {
            id: number; title: string; qty: number; price: number;
        }) => ({
            order_id: order.id,
            product_id: String(item.id),
            product_name: item.title,
            quantity: item.qty,
            unit_price: item.price,
            total_price: item.price * item.qty,
        }));
        await supabaseAdmin.from("order_items").insert(orderItems);

        return NextResponse.json({
            rzpOrderId: rzpOrder.id,
            dbOrderId: order.id,
            orderNumber,
            amount: amountPaise,
            currency: "INR",
            keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        });
    } catch (err) {
        console.error("[create-order]", err);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
