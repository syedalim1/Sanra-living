"use client";

import React from "react";
import { fmtDate } from "../constants";
import type { Message } from "../types";

interface Props {
    messages: Message[];
    searchQuery: string;
    setSearchQuery: (v: string) => void;
}

export default function MessagesTab({ messages, searchQuery, setSearchQuery }: Props) {
    const filtered = messages.filter(m => {
        const q = searchQuery.toLowerCase();
        return !q || m.full_name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || (m.subject ?? "").toLowerCase().includes(q);
    });

    return (
        <div className="flex flex-col gap-3 md:gap-4">
            <input
                placeholder="Search messages (name, email, subject)…"
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full max-w-[360px] px-3.5 py-2.5 bg-white border border-[var(--ap-border)] text-[var(--ap-text)] text-sm font-[family-name:var(--ap-font-body)] rounded-lg outline-none focus:border-[var(--ap-accent)] transition-colors mb-1"
            />
            {messages.length === 0 && (
                <p className="text-[var(--ap-muted)] font-[family-name:var(--ap-font-body)] py-16 text-center">No messages yet.</p>
            )}
            {filtered.map((msg) => (
                <div key={msg.id} className="bg-white border border-[var(--ap-border)] p-4 md:p-5 rounded-xl ap-animate-fadeIn">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 mb-3">
                        <div className="min-w-0">
                            <p className="text-[0.92rem] font-bold text-[var(--ap-text)] font-[family-name:var(--ap-font-heading)]">{msg.full_name}</p>
                            <p className="text-xs text-[var(--ap-muted)] font-[family-name:var(--ap-font-body)] mt-0.5 truncate">{msg.email}{msg.phone && ` · ${msg.phone}`}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            {msg.subject && (
                                <span className="text-[0.62rem] font-bold px-2.5 py-1 bg-[#3B82F622] text-[#3B82F6] rounded font-[family-name:var(--ap-font-heading)] tracking-wider uppercase">
                                    {msg.subject}
                                </span>
                            )}
                            <span className="text-xs text-[var(--ap-muted)] font-[family-name:var(--ap-font-body)]">{fmtDate(msg.created_at)}</span>
                            <a
                                href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject ?? "Your Enquiry — SANRA LIVING™")}&body=${encodeURIComponent(`Hi ${msg.full_name},\n\nThank you for reaching out to SANRA LIVING™.\n\n`)}`}
                                className="inline-block px-3.5 py-1.5 bg-[var(--ap-accent-dim)] border border-[var(--ap-accent)] text-[var(--ap-accent)] text-[0.65rem] font-bold font-[family-name:var(--ap-font-heading)] rounded tracking-wider uppercase no-underline"
                            >
                                ✉ Reply
                            </a>
                            {msg.phone && (
                                <a
                                    href={`https://wa.me/${msg.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${msg.full_name}, regarding your message to SANRA LIVING™...`)}`}
                                    target="_blank" rel="noopener"
                                    className="inline-block px-3.5 py-1.5 bg-[#25D36622] border border-[#25D366] text-[#25D366] text-[0.65rem] font-bold font-[family-name:var(--ap-font-heading)] rounded tracking-wider uppercase no-underline"
                                >
                                    WhatsApp
                                </a>
                            )}
                        </div>
                    </div>
                    <p className="text-[0.875rem] text-[var(--ap-muted)] font-[family-name:var(--ap-font-body)] leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                </div>
            ))}
        </div>
    );
}
