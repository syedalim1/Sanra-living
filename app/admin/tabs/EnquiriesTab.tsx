"use client";

import React from "react";
import { C, FM, FO, fmtDate } from "../constants";
import { inputStyle } from "../components/AdminUI";
import type { Enquiry } from "../types";

interface Props {
    enquiries: Enquiry[];
    searchQuery: string;
    setSearchQuery: (v: string) => void;
}

export default function EnquiriesTab({ enquiries, searchQuery, setSearchQuery }: Props) {
    const filtered = enquiries.filter(e => {
        const q = searchQuery.toLowerCase();
        return !q || (e.company_name ?? "").toLowerCase().includes(q) || e.contact_person.toLowerCase().includes(q) || (e.product_interest ?? "").toLowerCase().includes(q);
    });

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input
                placeholder="Search enquiries (company, person, product)…"
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                style={{ ...inputStyle, maxWidth: 360, padding: "0.5rem 0.875rem", marginBottom: "0.25rem" }}
            />
            {enquiries.length === 0 && (
                <p style={{ color: C.muted, fontFamily: FO, padding: "5rem", textAlign: "center" }}>No bulk enquiries yet.</p>
            )}
            {filtered.map((enq) => (
                <div key={enq.id} style={{ background: C.card, border: `1px solid ${C.border}`, padding: "1.25rem 1.5rem", borderRadius: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1rem" }}>
                        <div>
                            <p style={{ fontSize: "0.92rem", fontWeight: 700, color: C.text, fontFamily: FM }}>
                                {enq.company_name || "—"} <span style={{ fontWeight: 400, color: C.muted }}>· {enq.contact_person}</span>
                            </p>
                            <p style={{ fontSize: "0.75rem", color: C.muted, fontFamily: FO, marginTop: "0.2rem" }}>
                                {enq.email} · {enq.phone}{enq.city && ` · ${enq.city}`}
                            </p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                            <span style={{ fontSize: "0.72rem", color: C.muted, fontFamily: FO }}>{fmtDate(enq.created_at)}</span>
                            <a
                                href={`mailto:${enq.email}?subject=Re: Bulk Enquiry — SANRA LIVING™&body=${encodeURIComponent(`Hi ${enq.contact_person},\n\nThank you for your bulk enquiry at SANRA LIVING™.\n\n`)}`}
                                style={{ display: "inline-block", padding: "0.35rem 0.875rem", background: C.accentDim, border: `1px solid ${C.accent}`, color: C.accent, fontSize: "0.65rem", fontWeight: 700, fontFamily: FM, borderRadius: 4, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}
                            >
                                ✉ Reply
                            </a>
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.75rem", marginBottom: enq.message ? "1rem" : 0 }}>
                        {enq.product_interest && (
                            <div>
                                <p style={{ fontSize: "0.58rem", color: C.muted, fontFamily: FM, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Product</p>
                                <p style={{ fontSize: "0.82rem", color: C.text, fontFamily: FO }}>{enq.product_interest}</p>
                            </div>
                        )}
                        {enq.quantity && (
                            <div>
                                <p style={{ fontSize: "0.58rem", color: C.muted, fontFamily: FM, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Quantity</p>
                                <p style={{ fontSize: "0.82rem", color: C.accent, fontFamily: FM, fontWeight: 700 }}>{enq.quantity} units</p>
                            </div>
                        )}
                    </div>
                    {enq.message && (
                        <p style={{ fontSize: "0.875rem", color: "#ccc", fontFamily: FO, lineHeight: 1.75, borderTop: `1px solid ${C.border}`, paddingTop: "0.875rem", whiteSpace: "pre-wrap" }}>
                            {enq.message}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}
