import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest, { params }: { params: Promise<{ orderNumber: string }> }) {
    try {
        const { orderNumber } = await params;

        if (!orderNumber) {
            return NextResponse.json({ error: "Order number is required" }, { status: 400 });
        }

        // Fetch order details
        const { data: order, error: orderError } = await supabaseAdmin
            .from("orders")
            .select("*")
            .eq("order_number", orderNumber)
            .single();

        if (orderError || !order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Fetch order items with product details
        const { data: items, error: itemsError } = await supabaseAdmin
            .from("order_items")
            .select("*, products(image_url)")
            .eq("order_id", order.id);

        if (itemsError) {
            console.error("[order-items-fetch-error]", itemsError);
        }

        const formattedItems = (items || []).map((item) => ({
            ...item,
            image: item.products?.image_url || "/images/sanra_stool.png"
        }));

        return NextResponse.json({ order, items: formattedItems });
    } catch (err) {
        console.error("[api/orders/[orderNumber]]", err);
        return NextResponse.json({ error: "Failed to fetch order details" }, { status: 500 });
    }
}
