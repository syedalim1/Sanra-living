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
            .from("store_settings")
            .select("*")
            .order("key");

        if (error) throw error;
        return NextResponse.json({ settings: data ?? [] });
    } catch (err) {
        console.error("[admin/settings GET]", err);
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    if (!checkAdminKey(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const body = await req.json();
        // body is an array of { key, value } pairs
        const updates: { key: string; value: string }[] = body.settings;

        if (!updates || !Array.isArray(updates)) {
            return NextResponse.json({ error: "settings array is required" }, { status: 400 });
        }

        for (const { key, value } of updates) {
            const { error } = await supabaseAdmin
                .from("store_settings")
                .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
            if (error) throw error;
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[admin/settings PATCH]", err);
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
    }
}
