import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const adminKey = process.env.NEXT_PUBLIC_ADMIN_KEY ?? "";

function isAuthed(req: NextRequest) {
    return req.headers.get("x-admin-key") === adminKey;
}

// GET — Fetch A+ content for a product
export async function GET(req: NextRequest) {
    const productId = req.nextUrl.searchParams.get("product_id");

    if (!productId) {
        return NextResponse.json({ error: "product_id required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
        .from("product_aplus_content")
        .select("*")
        .eq("product_id", productId)
        .order("position", { ascending: true });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ blocks: data ?? [] });
}

// POST — Save all A+ content blocks (replaces existing)
export async function POST(req: NextRequest) {
    if (!isAuthed(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { product_id, blocks } = await req.json();

    if (!product_id || !Array.isArray(blocks)) {
        return NextResponse.json({ error: "product_id and blocks[] required" }, { status: 400 });
    }

    // Delete existing blocks for this product
    const { error: deleteError } = await supabaseAdmin
        .from("product_aplus_content")
        .delete()
        .eq("product_id", product_id);

    if (deleteError) {
        return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    // Insert new blocks
    if (blocks.length > 0) {
        const rows = blocks.map((b: { title: string; description: string; image_url: string }, i: number) => ({
            product_id,
            title: b.title || "",
            description: b.description || "",
            image_url: b.image_url || "",
            position: i,
        }));

        const { error: insertError } = await supabaseAdmin
            .from("product_aplus_content")
            .insert(rows);

        if (insertError) {
            return NextResponse.json({ error: insertError.message }, { status: 500 });
        }
    }

    return NextResponse.json({ success: true });
}
