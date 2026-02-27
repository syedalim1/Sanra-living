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
            .from("coupons")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return NextResponse.json({ coupons: data ?? [] });
    } catch (err) {
        console.error("[admin/coupons GET]", err);
        return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    if (!checkAdminKey(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const body = await req.json();
        const {
            code, description, discount_type, discount_value,
            min_order_amount, max_discount, max_uses, expires_at,
        } = body;

        if (!code || !discount_value) {
            return NextResponse.json({ error: "code and discount_value are required" }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from("coupons")
            .insert({
                code: code.toUpperCase().trim(),
                description: description ?? "",
                discount_type: discount_type ?? "percentage",
                discount_value: Number(discount_value),
                min_order_amount: Number(min_order_amount ?? 0),
                max_discount: max_discount ? Number(max_discount) : null,
                max_uses: Number(max_uses ?? 100),
                used_count: 0,
                is_active: true,
                expires_at: expires_at || null,
            })
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ coupon: data }, { status: 201 });
    } catch (err) {
        console.error("[admin/coupons POST]", err);
        return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    if (!checkAdminKey(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

        const body = await req.json();
        const { error } = await supabaseAdmin
            .from("coupons")
            .update(body)
            .eq("id", id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[admin/coupons PATCH]", err);
        return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    if (!checkAdminKey(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

        const { error } = await supabaseAdmin
            .from("coupons")
            .delete()
            .eq("id", id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[admin/coupons DELETE]", err);
        return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
    }
}
