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
            .from("products")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return NextResponse.json({ products: data ?? [] });
    } catch (err) {
        console.error("[admin/products GET]", err);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    if (!checkAdminKey(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const body = await req.json();
        const {
            title, subtitle, price, category, finish,
            stock_status, stock_qty, image_url, hover_image_url,
            is_new, images, description,
        } = body;

        if (!title || !price || !category) {
            return NextResponse.json({ error: "title, price, category are required" }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from("products")
            .insert({
                title,
                subtitle: subtitle ?? "",
                price: Number(price),
                category,
                finish: finish ?? "Matte Black",
                stock_status: stock_status ?? "In Stock",
                stock_qty: stock_qty ? Number(stock_qty) : 99,
                image_url: image_url ?? (images?.[0] ?? ""),
                hover_image_url: hover_image_url ?? (images?.[1] ?? ""),
                images: images ?? [],
                description: description ?? "",
                is_new: is_new ?? false,
                is_active: true,
            })
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ product: data }, { status: 201 });
    } catch (err) {
        console.error("[admin/products POST]", err);
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
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
            .from("products")
            .update(body)
            .eq("id", id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[admin/products PATCH]", err);
        return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }
}
