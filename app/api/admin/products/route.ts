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
            title, subtitle, price, category, product_type, finish,
            stock_status, stock_qty, image_url, hover_image_url, lifestyle_image, mobile_thumbnail,
            is_new, images, description, video_url, video_thumbnail,
            sku, compare_at_price, highlights, trust_features, material, pipe_type, steel_thickness, warranty,
            weight_kg, dimensions, delivery_info, tags, badge,
            seo_title, seo_description, seo_keywords, faqs, whatsapp_link, related_products, slug,
            image_style_preset, watermark_strength, care_instructions,
            assembly_required, usage_environment, weight_capacity, premium_finish, height, width, depth
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
                product_type: product_type ?? "",
                finish: finish ?? "Matte Black",
                stock_status: stock_status ?? "In Stock",
                stock_qty: stock_qty ? Number(stock_qty) : 99,
                image_url: image_url ?? (images?.[0] ?? ""),
                hover_image_url: hover_image_url ?? (images?.[1] ?? ""),
                lifestyle_image: lifestyle_image ?? "",
                mobile_thumbnail: mobile_thumbnail ?? "",
                images: images ?? [],
                video_url: video_url ?? "",
                video_thumbnail: video_thumbnail ?? "",
                description: description ?? "",
                is_new: is_new ?? false,
                is_active: true,
                sku: sku ?? "",
                compare_at_price: compare_at_price ? Number(compare_at_price) : null,
                highlights: highlights ?? [],
                trust_features: trust_features ?? [],
                material: material ?? "",
                pipe_type: pipe_type ?? "",
                steel_thickness: steel_thickness ?? "",
                warranty: warranty ?? "",
                weight_kg: weight_kg ? Number(weight_kg) : null,
                dimensions: dimensions ?? "",
                delivery_info: delivery_info ?? "Pan India Delivery Available",
                tags: tags ?? [],
                badge: badge ?? "",
                seo_title: seo_title ?? "",
                seo_description: seo_description ?? "",
                seo_keywords: seo_keywords ?? "",
                faqs: faqs ?? [],
                whatsapp_link: whatsapp_link ?? "",
                related_products: related_products ?? "",
                slug: slug ?? "",
                image_style_preset: image_style_preset ?? "",
                watermark_strength: watermark_strength ?? "Medium",
                care_instructions: care_instructions ?? "",
                assembly_required: assembly_required ?? false,
                usage_environment: usage_environment ?? "",
                weight_capacity: weight_capacity ?? "",
                premium_finish: premium_finish ?? "",
                height: height ?? "",
                width: width ?? "",
                depth: depth ?? "",
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

export async function DELETE(req: NextRequest) {
    if (!checkAdminKey(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

        const { error } = await supabaseAdmin
            .from("products")
            .delete()
            .eq("id", id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[admin/products DELETE]", err);
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
}
