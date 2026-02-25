import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get("q")?.trim();

        if (!q) {
            return NextResponse.json({ error: "Query parameter q is required" }, { status: 400 });
        }

        // Try to find by order_number (formatted SL-XXXXXXXX) OR by phone
        const { data: orders, error } = await supabaseAdmin
            .from("orders")
            .select("id, order_number, order_status, payment_status, total_amount, created_at, city, state")
            .or(`order_number.eq.${q},user_phone.eq.${q}`)
            .limit(5);

        if (error) throw error;
        if (!orders || orders.length === 0) {
            return NextResponse.json({ orders: [] });
        }

        // Fetch status logs for each order
        const ordersWithLogs = await Promise.all(
            orders.map(async (order) => {
                const { data: logs } = await supabaseAdmin
                    .from("order_status_logs")
                    .select("status, updated_at")
                    .eq("order_id", order.id)
                    .order("updated_at", { ascending: true });

                return { ...order, statusLogs: logs ?? [] };
            })
        );

        return NextResponse.json({ orders: ordersWithLogs });
    } catch (err) {
        console.error("[track-order]", err);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}
