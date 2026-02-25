import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    try {
        const { fullName, email, phone, subject, message } = await req.json();

        if (!fullName || !email || !message) {
            return NextResponse.json({ error: "Name, email and message are required" }, { status: 400 });
        }

        const { error } = await supabaseAdmin.from("contact_messages").insert({
            full_name: fullName,
            email,
            phone: phone ?? null,
            subject: subject ?? null,
            message,
        });

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[contact]", err);
        return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
    }
}
