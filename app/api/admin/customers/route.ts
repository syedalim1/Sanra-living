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
        // Aggregate unique customers from orders
        const { data: orders, error } = await supabaseAdmin
            .from("orders")
            .select("user_email, user_phone, city, state, total_amount, payment_status, created_at")
            .order("created_at", { ascending: false });

        if (error) throw error;

        // Group by email
        const map = new Map<string, {
            user_email: string;
            user_phone: string;
            city: string;
            state: string;
            total_orders: number;
            total_spent: number;
            last_order_date: string;
        }>();

        for (const o of orders ?? []) {
            const key = o.user_email ?? o.user_phone ?? "unknown";
            const existing = map.get(key);
            if (existing) {
                existing.total_orders += 1;
                if (o.payment_status === "paid") existing.total_spent += Number(o.total_amount);
                if (new Date(o.created_at) > new Date(existing.last_order_date)) {
                    existing.last_order_date = o.created_at;
                    existing.city = o.city ?? existing.city;
                    existing.state = o.state ?? existing.state;
                    existing.user_phone = o.user_phone ?? existing.user_phone;
                }
            } else {
                map.set(key, {
                    user_email: o.user_email ?? "",
                    user_phone: o.user_phone ?? "",
                    city: o.city ?? "",
                    state: o.state ?? "",
                    total_orders: 1,
                    total_spent: o.payment_status === "paid" ? Number(o.total_amount) : 0,
                    last_order_date: o.created_at,
                });
            }
        }

        const customers = Array.from(map.values()).sort((a, b) => b.total_spent - a.total_spent);
        return NextResponse.json({ customers });
    } catch (err) {
        console.error("[admin/customers GET]", err);
        return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
    }
}
