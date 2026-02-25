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
        const { data, error } = await supabaseAdmin
            .from("orders")
            .select("*, order_items(product_name, quantity, unit_price, total_price)")
            .order("created_at", { ascending: false })
            .limit(200);

        if (error) throw error;
        return NextResponse.json({ orders: data ?? [] });
    } catch (err) {
        console.error("[admin/orders GET]", err);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}
