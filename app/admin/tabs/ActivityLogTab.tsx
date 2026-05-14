"use client";

import React, { useState } from "react";
import { ACTION_TYPE_COLORS } from "../constants";
import type { ActivityLogEntry } from "../types";

interface Props { logs: ActivityLogEntry[]; filterType: string; onFilterChange: (type: string) => void; }

const AL: Record<string, string> = { order_status: "Order Status", product_add: "Product Added", product_edit: "Product Edited", product_delete: "Product Deleted", coupon_create: "Coupon Created", coupon_update: "Coupon Updated", settings_update: "Settings Updated", bulk_action: "Bulk Action" };
const AI: Record<string, string> = { order_status: "📦", product_add: "➕", product_edit: "✏️", product_delete: "🗑️", coupon_create: "🎟️", coupon_update: "🎟️", settings_update: "⚙️", bulk_action: "📋" };

export default function ActivityLogTab({ logs, filterType, onFilterChange }: Props) {
    const [searchQuery, setSearchQuery] = useState("");
    const filtered = logs.filter(l => { const q = searchQuery.toLowerCase(); return !q || l.description.toLowerCase().includes(q) || l.action_type.toLowerCase().includes(q); });

    const grouped = new Map<string, ActivityLogEntry[]>();
    for (const log of filtered) { const day = new Date(log.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }); const arr = grouped.get(day) ?? []; arr.push(log); grouped.set(day, arr); }

    return (
        <div>
            <div className="flex flex-col sm:flex-row gap-3 mb-6 items-stretch sm:items-center">
                <input placeholder="Search activity…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full sm:max-w-[280px] px-3.5 py-2.5 bg-white border border-[var(--ap-border)] text-sm rounded-lg outline-none focus:border-[var(--ap-accent)] transition-colors" />
                <select value={filterType} onChange={e => onFilterChange(e.target.value)} className="w-full sm:max-w-[180px] px-3.5 py-2.5 bg-white border border-[var(--ap-border)] text-sm rounded-lg outline-none cursor-pointer">
                    <option value="all">All Actions</option>
                    {Object.entries(AL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <span className="text-xs text-[var(--ap-muted)] sm:ml-auto">{filtered.length} entries</span>
            </div>

            {filtered.length === 0 ? (
                <p className="text-[var(--ap-muted)] py-16 text-center">No activity logged yet.</p>
            ) : (
                <div className="flex flex-col gap-6">
                    {Array.from(grouped.entries()).map(([date, entries]) => (
                        <div key={date}>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-[0.65rem] font-bold tracking-[0.15em] uppercase text-[var(--ap-muted)] font-[family-name:var(--ap-font-heading)] whitespace-nowrap">{date}</span>
                                <div className="flex-1 h-px bg-[var(--ap-border)]" />
                                <span className="text-[0.6rem] text-[var(--ap-muted)]">{entries.length} actions</span>
                            </div>
                            <div className="flex flex-col gap-1.5 pl-2">
                                {entries.map(log => {
                                    const color = ACTION_TYPE_COLORS[log.action_type] ?? "#555";
                                    const icon = AI[log.action_type] ?? "•";
                                    const label = AL[log.action_type] ?? log.action_type;
                                    const time = new Date(log.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
                                    return (
                                        <div key={log.id} className="flex gap-3 p-3 bg-white border border-[var(--ap-border)] rounded-lg items-start" style={{ borderLeftWidth: 3, borderLeftColor: color }}>
                                            <span className="text-base shrink-0 mt-0.5">{icon}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded font-[family-name:var(--ap-font-heading)] tracking-wider uppercase" style={{ background: `${color}22`, color }}>{label}</span>
                                                    <span className="text-[0.65rem] text-[var(--ap-muted)]">{time}</span>
                                                    {log.admin_email && <span className="text-[0.62rem] text-[#555] hidden sm:inline">by {log.admin_email}</span>}
                                                </div>
                                                <p className="text-sm text-[var(--ap-text)] leading-relaxed">{log.description}</p>
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
