"use client";

import React from "react";
import { fmtDate } from "../constants";
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
        <div className="flex flex-col gap-3 md:gap-4">
            <input
                placeholder="Search enquiries (company, person, product)…"
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full max-w-[360px] px-3.5 py-2.5 bg-white border border-[var(--ap-border)] text-[var(--ap-text)] text-sm font-[family-name:var(--ap-font-body)] rounded-lg outline-none focus:border-[var(--ap-accent)] transition-colors mb-1"
            />
            {enquiries.length === 0 && (
                <p className="text-[var(--ap-muted)] font-[family-name:var(--ap-font-body)] py-16 text-center">No bulk enquiries yet.</p>
            )}
            {filtered.map((enq) => (
                <div key={enq.id} className="bg-white border border-[var(--ap-border)] p-4 md:p-5 rounded-xl ap-animate-fadeIn">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 mb-4">
                        <div className="min-w-0">
                            <p className="text-[0.92rem] font-bold text-[var(--ap-text)] font-[family-name:var(--ap-font-heading)]">
                                {enq.company_name || "—"} <span className="font-normal text-[var(--ap-muted)]">· {enq.contact_person}</span>
                            </p>
                            <p className="text-xs text-[var(--ap-muted)] font-[family-name:var(--ap-font-body)] mt-0.5 truncate">
                                {enq.email} · {enq.phone}{enq.city && ` · ${enq.city}`}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-[var(--ap-muted)] font-[family-name:var(--ap-font-body)]">{fmtDate(enq.created_at)}</span>
                            <a
                                href={`mailto:${enq.email}?subject=Re: Bulk Enquiry — SANRA LIVING™&body=${encodeURIComponent(`Hi ${enq.contact_person},\n\nThank you for your bulk enquiry at SANRA LIVING™.\n\n`)}`}
                                className="inline-block px-3.5 py-1.5 bg-[var(--ap-accent-dim)] border border-[var(--ap-accent)] text-[var(--ap-accent)] text-[0.65rem] font-bold font-[family-name:var(--ap-font-heading)] rounded tracking-wider uppercase no-underline"
                            >
                                ✉ Reply
                            </a>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                        {enq.product_interest && (
                            <div>
                                <p className="text-[0.58rem] text-[var(--ap-muted)] font-[family-name:var(--ap-font-heading)] tracking-[0.14em] uppercase mb-1">Product</p>
                                <p className="text-sm text-[var(--ap-text)] font-[family-name:var(--ap-font-body)]">{enq.product_interest}</p>
                            </div>
                        )}
                        {enq.quantity && (
                            <div>
                                <p className="text-[0.58rem] text-[var(--ap-muted)] font-[family-name:var(--ap-font-heading)] tracking-[0.14em] uppercase mb-1">Quantity</p>
                                <p className="text-sm text-[var(--ap-accent)] font-[family-name:var(--ap-font-heading)] font-bold">{enq.quantity} units</p>
                            </div>
                        )}
                    </div>
                    {enq.message && (
                        <p className="text-[0.875rem] text-[var(--ap-muted)] font-[family-name:var(--ap-font-body)] leading-relaxed border-t border-[var(--ap-border)] pt-3 whitespace-pre-wrap">
                            {enq.message}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}
