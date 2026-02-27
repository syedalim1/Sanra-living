"use client";

import React from "react";
import { C, FM, FO, fmtDate } from "../constants";
import { inputStyle } from "../components/AdminUI";
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
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input
                placeholder="Search messages (name, email, subject)…"
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                style={{ ...inputStyle, maxWidth: 360, padding: "0.5rem 0.875rem", marginBottom: "0.25rem" }}
            />
            {messages.length === 0 && (
                <p style={{ color: C.muted, fontFamily: FO, padding: "5rem", textAlign: "center" }}>No messages yet.</p>
            )}
            {filtered.map((msg) => (
                <div key={msg.id} style={{ background: C.card, border: `1px solid ${C.border}`, padding: "1.25rem 1.5rem", borderRadius: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.875rem" }}>
                        <div>
                            <p style={{ fontSize: "0.92rem", fontWeight: 700, color: C.text, fontFamily: FM }}>{msg.full_name}</p>
                            <p style={{ fontSize: "0.75rem", color: C.muted, fontFamily: FO, marginTop: "0.2rem" }}>{msg.email}{msg.phone && ` · ${msg.phone}`}</p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexWrap: "wrap" }}>
                            {msg.subject && (
                                <span style={{ fontSize: "0.62rem", fontWeight: 700, padding: "0.2rem 0.6rem", background: `${C.blue}22`, color: C.blue, borderRadius: 4, fontFamily: FM, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                                    {msg.subject}
                                </span>
                            )}
                            <span style={{ fontSize: "0.72rem", color: C.muted, fontFamily: FO }}>{fmtDate(msg.created_at)}</span>
                            <a
                                href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject ?? "Your Enquiry — SANRA LIVING™")}&body=${encodeURIComponent(`Hi ${msg.full_name},\n\nThank you for reaching out to SANRA LIVING™.\n\n`)}`}
                                style={{ display: "inline-block", padding: "0.35rem 0.875rem", background: C.accentDim, border: `1px solid ${C.accent}`, color: C.accent, fontSize: "0.65rem", fontWeight: 700, fontFamily: FM, borderRadius: 4, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}
                            >
                                ✉ Reply
                            </a>
                            {msg.phone && (
                                <a
                                    href={`https://wa.me/${msg.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${msg.full_name}, regarding your message to SANRA LIVING™...`)}`}
                                    target="_blank" rel="noopener"
                                    style={{ display: "inline-block", padding: "0.35rem 0.875rem", background: "#25D36622", border: "1px solid #25D366", color: "#25D366", fontSize: "0.65rem", fontWeight: 700, fontFamily: FM, borderRadius: 4, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}
                                >
                                    WhatsApp
                                </a>
                            )}
                        </div>
                    </div>
                    <p style={{ fontSize: "0.875rem", color: "#ccc", fontFamily: FO, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{msg.message}</p>
                </div>
            ))}
        </div>
    );
}
