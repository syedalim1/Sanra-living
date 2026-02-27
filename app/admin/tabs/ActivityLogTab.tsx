"use client";

import React, { useState } from "react";
import { C, FM, FO, fmtDate, ACTION_TYPE_COLORS } from "../constants";
import { inputStyle, selectStyle } from "../components/AdminUI";
import type { ActivityLogEntry } from "../types";

interface Props {
    logs: ActivityLogEntry[];
    filterType: string;
    onFilterChange: (type: string) => void;
}

const ACTION_LABELS: Record<string, string> = {
    order_status: "Order Status",
    product_add: "Product Added",
    product_edit: "Product Edited",
    product_delete: "Product Deleted",
    coupon_create: "Coupon Created",
    coupon_update: "Coupon Updated",
    settings_update: "Settings Updated",
    bulk_action: "Bulk Action",
};

const ACTION_ICONS: Record<string, string> = {
    order_status: "📦",
    product_add: "➕",
    product_edit: "✏️",
    product_delete: "🗑️",
    coupon_create: "🎟️",
    coupon_update: "🎟️",
    settings_update: "⚙️",
    bulk_action: "📋",
};

export default function ActivityLogTab({ logs, filterType, onFilterChange }: Props) {
    const [searchQuery, setSearchQuery] = useState("");

    const filtered = logs.filter(log => {
        const q = searchQuery.toLowerCase();
        return !q || log.description.toLowerCase().includes(q) || log.action_type.toLowerCase().includes(q);
    });

    // Group by date
    const grouped = new Map<string, ActivityLogEntry[]>();
    for (const log of filtered) {
        const day = new Date(log.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
        const arr = grouped.get(day) ?? [];
        arr.push(log);
        grouped.set(day, arr);
    }

    return (
        <div>
            {/* Toolbar */}
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
                <input placeholder="Search activity…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ ...inputStyle, maxWidth: 280, padding: "0.5rem 0.875rem" }} />
                <select value={filterType} onChange={e => onFilterChange(e.target.value)} style={{ ...selectStyle, maxWidth: 180, padding: "0.5rem 0.875rem" }}>
                    <option value="all">All Actions</option>
                    {Object.entries(ACTION_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                    ))}
                </select>
                <span style={{ fontSize: "0.72rem", color: C.muted, fontFamily: FO, marginLeft: "auto" }}>{filtered.length} entries</span>
            </div>

            {filtered.length === 0 ? (
                <p style={{ color: C.muted, fontFamily: FO, padding: "5rem", textAlign: "center" }}>No activity logged yet.</p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    {Array.from(grouped.entries()).map(([date, entries]) => (
                        <div key={date}>
                            {/* Date Header */}
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                                <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, fontFamily: FM, whiteSpace: "nowrap" }}>{date}</span>
                                <div style={{ flex: 1, height: 1, background: C.border }} />
                                <span style={{ fontSize: "0.6rem", color: C.muted, fontFamily: FO }}>{entries.length} actions</span>
                            </div>

                            {/* Timeline */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", paddingLeft: "0.5rem" }}>
                                {entries.map(log => {
                                    const color = ACTION_TYPE_COLORS[log.action_type] ?? "#555";
                                    const icon = ACTION_ICONS[log.action_type] ?? "•";
                                    const label = ACTION_LABELS[log.action_type] ?? log.action_type;
                                    const time = new Date(log.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

                                    return (
                                        <div key={log.id} style={{ display: "flex", gap: "0.875rem", padding: "0.75rem 1rem", background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, alignItems: "flex-start", borderLeft: `3px solid ${color}` }}>
                                            <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: "0.1rem" }}>{icon}</span>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem", flexWrap: "wrap" }}>
                                                    <span style={{ fontSize: "0.6rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: 3, background: `${color}22`, color, fontFamily: FM, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                                                        {label}
                                                    </span>
                                                    <span style={{ fontSize: "0.65rem", color: C.muted, fontFamily: FO }}>{time}</span>
                                                    {log.admin_email && (
                                                        <span style={{ fontSize: "0.62rem", color: "#555", fontFamily: FO }}>by {log.admin_email}</span>
                                                    )}
                                                </div>
                                                <p style={{ fontSize: "0.82rem", color: C.text, fontFamily: FO, lineHeight: 1.5 }}>{log.description}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
