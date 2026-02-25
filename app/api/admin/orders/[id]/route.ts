import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function checkAdminKey(req: NextRequest) {
    const key = req.headers.get("x-admin-key");
    return key === process.env.ADMIN_PASSWORD || "123";
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!checkAdminKey(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { id } = await params;
        const { order_status } = await req.json();

        if (!order_status) {
            return NextResponse.json({ error: "order_status is required" }, { status: 400 });
        }

        const { error: updateError } = await supabaseAdmin
            .from("orders")
            .update({ order_status })
            .eq("id", id);

        if (updateError) throw updateError;

        // Append to status log
        await supabaseAdmin.from("order_status_logs").insert({
            order_id: id,
            status: order_status,
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[admin/orders/[id] PATCH]", err);
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }
}
