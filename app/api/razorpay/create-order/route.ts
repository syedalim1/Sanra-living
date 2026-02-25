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
            totalPayable,
            paymentMethod, // "prepaid" | "cod"
            shipping,
        } = body;

        // 1. Generate unique order number
        const orderNumber = `SL-${Date.now().toString().slice(-8)}`;

        // 2. Determine amount to charge via Razorpay (in paise)
        //    COD → charge advance only. Prepaid → full amount.
        const amountPaise = paymentMethod === "cod"
            ? (codAdvance ?? 149) * 100
            : totalPayable * 100;

        // 3. For COD we skip Razorpay and insert directly as pending
        if (paymentMethod === "cod") {
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
                    payment_method: "cod",
                    total_amount: totalPayable,
                    advance_paid: codAdvance,
                    remaining_amount: subtotal - codAdvance,
                    payment_status: "pending",
                    order_status: "processing",
                })
                .select()
                .single();

            if (error) throw error;

            // Insert order items
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

            // Insert initial status log
            await supabaseAdmin.from("order_status_logs").insert({
                order_id: order.id,
                status: "processing",
            });

            return NextResponse.json({
                orderId: order.id,
                orderNumber,
                cod: true,
                totalPayable,
                remaining: subtotal - codAdvance,
            });
        }

        // 4. Prepaid — create Razorpay order
        const rzpOrder = await razorpay.orders.create({
            amount: amountPaise,
            currency: "INR",
            receipt: orderNumber,
            notes: { shipping_name: shipping.name },
        });

        // 5. Insert DB order with "pending" status (will be confirmed after payment)
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
                payment_method: "prepaid",
                total_amount: totalPayable,
                advance_paid: totalPayable,
                remaining_amount: 0,
                payment_status: "pending",
                order_status: "processing",
                razorpay_payment_id: rzpOrder.id, // store rzp order id temporarily
            })
            .select()
            .single();

        if (error) throw error;

        // Insert order items
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
