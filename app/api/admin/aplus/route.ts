import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function isAuthed(req: NextRequest) {
    const key = req.headers.get("x-admin-key");
    // Accept both env keys for compatibility
    return (
        key === process.env.ADMIN_PASSWORD ||
        key === process.env.NEXT_PUBLIC_ADMIN_KEY
    );
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
        console.error("[aplus GET] Error:", error.message, error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ blocks: data ?? [] });
}

// POST — Save all A+ content blocks (replaces existing)
export async function POST(req: NextRequest) {
    if (!isAuthed(req)) {
        console.error("[aplus POST] Unauthorized — key mismatch");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
        body = await req.json();
    } catch (e) {
        console.error("[aplus POST] Invalid JSON body");
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { product_id, blocks } = body;

    if (!product_id || !Array.isArray(blocks)) {
        console.error("[aplus POST] Missing product_id or blocks", { product_id, blocks });
        return NextResponse.json({ error: "product_id and blocks[] required" }, { status: 400 });
    }

    console.log(`[aplus POST] Saving ${blocks.length} blocks for product ${product_id}`);

    // Delete existing blocks for this product
    const { error: deleteError } = await supabaseAdmin
        .from("product_aplus_content")
        .delete()
        .eq("product_id", product_id);

    if (deleteError) {
        console.error("[aplus POST] Delete error:", deleteError.message, deleteError);
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

        console.log("[aplus POST] Inserting rows:", JSON.stringify(rows, null, 2));

        const { data: insertedData, error: insertError } = await supabaseAdmin
            .from("product_aplus_content")
            .insert(rows)
            .select();

        if (insertError) {
            console.error("[aplus POST] Insert error:", insertError.message, insertError);
            return NextResponse.json({ error: insertError.message }, { status: 500 });
        }

        console.log(`[aplus POST] Successfully inserted ${insertedData?.length ?? 0} blocks`);
    }

    return NextResponse.json({ success: true });
}
