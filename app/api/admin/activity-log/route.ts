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
        const { searchParams } = new URL(req.url);
        const actionType = searchParams.get("type");

        let query = supabaseAdmin
            .from("admin_activity_log")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(100);

        if (actionType && actionType !== "all") {
            query = query.eq("action_type", actionType);
        }

        const { data, error } = await query;
        if (error) throw error;
        return NextResponse.json({ logs: data ?? [] });
    } catch (err) {
        console.error("[admin/activity-log GET]", err);
        return NextResponse.json({ error: "Failed to fetch activity log" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    if (!checkAdminKey(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const body = await req.json();
        const { action_type, description, admin_email, metadata } = body;

        if (!action_type || !description) {
            return NextResponse.json({ error: "action_type and description are required" }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from("admin_activity_log")
            .insert({
                action_type,
                description,
                admin_email: admin_email ?? null,
                metadata: metadata ?? {},
            })
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ log: data }, { status: 201 });
    } catch (err) {
        console.error("[admin/activity-log POST]", err);
        return NextResponse.json({ error: "Failed to create log entry" }, { status: 500 });
    }
}
