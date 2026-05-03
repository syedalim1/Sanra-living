import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// GET — Public: Fetch A+ content for a product
export async function GET(req: NextRequest) {
    const productId = req.nextUrl.searchParams.get("product_id");

    if (!productId) {
        return NextResponse.json({ error: "product_id required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
        .from("product_aplus_content")
        .select("id, title, description, image_url, position")
        .eq("product_id", productId)
        .order("position", { ascending: true });

    if (error) {
        return NextResponse.json({ blocks: [] });
    }

    return NextResponse.json({ blocks: data ?? [] });
}
