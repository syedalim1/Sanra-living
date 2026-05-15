import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        const matchColumn = isUUID ? "id" : "slug";

        const { data, error } = await supabaseAdmin
            .from("products")
            .select("*")
            .eq(matchColumn, id)
            .eq("is_active", true)
            .single();

        if (error || !data) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ product: data });
    } catch (err) {
        console.error("[GET /api/products/[id]]", err);
        return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
    }
}
