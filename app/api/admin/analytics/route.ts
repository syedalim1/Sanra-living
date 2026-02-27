import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function checkAdminKey(req: NextRequest) {
    const key = req.headers.get("x-admin-key");
    return key === process.env.ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
    if (!checkAdminKey(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { searchParams } = new URL(req.url);
        const days = Number(searchParams.get("days") ?? 30);

        const since = new Date();
        since.setDate(since.getDate() - days);

        // Fetch paid orders in period
        const { data: orders, error } = await supabaseAdmin
            .from("orders")
            .select("total_amount, payment_status, created_at")
            .gte("created_at", since.toISOString())
            .order("created_at", { ascending: true });

        if (error) throw error;

        // Group by day
        const dailyMap = new Map<string, { revenue: number; order_count: number }>();
        for (const o of orders ?? []) {
            const day = new Date(o.created_at).toISOString().slice(0, 10);
            const existing = dailyMap.get(day) ?? { revenue: 0, order_count: 0 };
            existing.order_count += 1;
            if (o.payment_status === "paid") existing.revenue += Number(o.total_amount);
            dailyMap.set(day, existing);
        }

        const daily = Array.from(dailyMap.entries()).map(([date, d]) => ({
            date,
            revenue: d.revenue,
            order_count: d.order_count,
        }));

        // Top products
        const { data: items, error: itemsErr } = await supabaseAdmin
            .from("order_items")
            .select("product_name, quantity, total_price");

        if (itemsErr) throw itemsErr;

        const prodMap = new Map<string, { total_qty: number; total_revenue: number }>();
        for (const item of items ?? []) {
            const key = item.product_name;
            const existing = prodMap.get(key) ?? { total_qty: 0, total_revenue: 0 };
            existing.total_qty += item.quantity;
            existing.total_revenue += Number(item.total_price);
            prodMap.set(key, existing);
        }

        const topProducts = Array.from(prodMap.entries())
            .map(([product_name, d]) => ({ product_name, ...d }))
            .sort((a, b) => b.total_revenue - a.total_revenue)
            .slice(0, 10);

        return NextResponse.json({ daily, topProducts });
    } catch (err) {
        console.error("[admin/analytics GET]", err);
        return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
    }
}
