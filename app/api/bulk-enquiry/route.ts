import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    try {
        const {
            companyName, contactPerson, phone, email,
            city, productInterest, quantity, message,
        } = await req.json();

        if (!contactPerson || !phone) {
            return NextResponse.json({ error: "Contact person and phone are required" }, { status: 400 });
        }

        const { error } = await supabaseAdmin.from("bulk_enquiries").insert({
            company_name: companyName ?? null,
            contact_person: contactPerson,
            phone,
            email: email ?? null,
            city: city ?? null,
            product_interest: productInterest ?? null,
            quantity: quantity ? Number(quantity) : null,
            message: message ?? null,
        });

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[bulk-enquiry]", err);
        return NextResponse.json({ error: "Failed to save enquiry" }, { status: 500 });
    }
}
