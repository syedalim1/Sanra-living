import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const finish = searchParams.get("finish");
        const sort = searchParams.get("sort") ?? "featured";
        const page = parseInt(searchParams.get("page") ?? "1", 10);
        const limit = parseInt(searchParams.get("limit") ?? "20", 10);
        const offset = (page - 1) * limit;

        let query = supabaseAdmin
            .from("products")
            .select("*", { count: "exact" })
            .eq("is_active", true);

        if (category && category !== "All") {
            query = query.eq("category", category);
        }
        if (finish && finish !== "All") {
            query = query.eq("finish", finish);
        }

        if (sort === "price_asc") {
            query = query.order("price", { ascending: true });
        } else if (sort === "price_desc") {
            query = query.order("price", { ascending: false });
        } else if (sort === "newest") {
            query = query.order("is_new", { ascending: false }).order("created_at", { ascending: false });
        } else {
            query = query.order("created_at", { ascending: false });
        }

        query = query.range(offset, offset + limit - 1);

        const { data, error, count } = await query;
        if (error) throw error;

        return NextResponse.json({ products: data ?? [], total: count ?? 0, page, limit });
    } catch (err) {
        console.error("[GET /api/products]", err);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}
