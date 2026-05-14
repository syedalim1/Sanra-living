"use client";

import React, { useState } from "react";
import { fmt, fmtDate } from "../constants";
import { Th, Td } from "../components/AdminUI";
import type { Customer } from "../types";

interface Props { customers: Customer[]; }

export default function CustomersTab({ customers }: Props) {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"total_spent" | "total_orders" | "last_order_date">("total_spent");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

    const toggleSort = (field: typeof sortBy) => { if (sortBy === field) setSortDir(d => d === "desc" ? "asc" : "desc"); else { setSortBy(field); setSortDir("desc"); } };

    const filtered = customers.filter(c => { const q = searchQuery.toLowerCase(); return !q || c.user_email.toLowerCase().includes(q) || c.user_phone.includes(q) || (c.city ?? "").toLowerCase().includes(q); }).sort((a, b) => {
        const m = sortDir === "desc" ? -1 : 1;
        if (sortBy === "total_spent") return (a.total_spent - b.total_spent) * m;
        if (sortBy === "total_orders") return (a.total_orders - b.total_orders) * m;
        return (new Date(a.last_order_date).getTime() - new Date(b.last_order_date).getTime()) * m;
    });

    const totalRevenue = customers.reduce((s, c) => s + c.total_spent, 0);
    const totalOrders = customers.reduce((s, c) => s + c.total_orders, 0);
    const avgOV = totalRevenue / Math.max(totalOrders, 1);
    const repeatCustomers = customers.filter(c => c.total_orders > 1).length;
    const arrow = (f: typeof sortBy) => sortBy === f ? (sortDir === "desc" ? " ↓" : " ↑") : "";

    return (
        <div>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {[{ l: "Total Customers", v: customers.length, c: "var(--ap-accent)" }, { l: "Total Revenue", v: fmt(totalRevenue), c: "#10B981" }, { l: "Avg Order Value", v: fmt(Math.round(avgOV)), c: "#3B82F6" }, { l: "Repeat Customers", v: repeatCustomers, c: "#8B5CF6" }].map(({ l, v, c }) => (
                    <div key={l} className="bg-white border border-[var(--ap-border)] p-4 rounded-xl">
                        <p className="text-[0.55rem] font-bold tracking-[0.18em] uppercase text-[var(--ap-muted)] font-[family-name:var(--ap-font-heading)] mb-1.5">{l}</p>
                        <p className="text-xl md:text-2xl font-black font-[family-name:var(--ap-font-heading)]" style={{ color: c }}>{v}</p>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5 items-stretch sm:items-center">
                <input placeholder="Search by email, phone, or city…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full sm:max-w-[360px] px-3.5 py-2.5 bg-white border border-[var(--ap-border)] text-sm rounded-lg outline-none focus:border-[var(--ap-accent)] transition-colors" />
                <span className="text-xs text-[var(--ap-muted)] sm:ml-auto">{filtered.length} customers</span>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <Th>Customer</Th><Th>Phone</Th><Th>Location</Th>
                            {(["total_orders", "total_spent", "last_order_date"] as const).map(f => (
                                <th key={f} onClick={() => toggleSort(f)} className={`py-3 px-4 text-left text-[0.6rem] font-bold tracking-[0.15em] uppercase font-[family-name:var(--ap-font-heading)] border-b border-[var(--ap-border)] whitespace-nowrap bg-[#fafafa] cursor-pointer select-none ${sortBy === f ? "text-[var(--ap-accent)]" : "text-[var(--ap-muted)]"}`}>
                                    {f === "total_orders" ? "Orders" : f === "total_spent" ? "Total Spent" : "Last Order"}{arrow(f)}
                                </th>
                            ))}
                            <Th>Actions</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((c, i) => (
                            <tr key={i} className="border-b border-[var(--ap-border)]">
                                <Td><p className="text-sm font-bold text-[var(--ap-text)] font-[family-name:var(--ap-font-heading)]">{c.user_email || "—"}</p></Td>
                                <Td><span className="text-sm text-[var(--ap-muted)]">{c.user_phone || "—"}</span></Td>
                                <Td><span className="text-sm text-[var(--ap-muted)]">{[c.city, c.state].filter(Boolean).join(", ") || "—"}</span></Td>
                                <Td><span className="text-sm font-bold font-[family-name:var(--ap-font-heading)]">{c.total_orders}{c.total_orders > 1 && <span className="text-[0.6rem] text-[#10B981] ml-1.5 font-bold">REPEAT</span>}</span></Td>
                                <Td><span className="text-sm font-bold text-[#10B981] font-[family-name:var(--ap-font-heading)]">{fmt(c.total_spent)}</span></Td>
                                <Td><span className="text-xs text-[var(--ap-muted)] whitespace-nowrap">{fmtDate(c.last_order_date)}</span></Td>
                                <Td>
                                    <div className="flex gap-1.5">
                                        {c.user_email && <a href={`mailto:${c.user_email}?subject=Hello from SANRA LIVING™`} className="px-3 py-1.5 bg-transparent border border-[var(--ap-border)] text-[var(--ap-accent)] text-[0.65rem] font-bold rounded tracking-wider uppercase no-underline">✉ Email</a>}
                                        {c.user_phone && <a href={`https://wa.me/${c.user_phone.replace(/\D/g, "")}?text=${encodeURIComponent("Hi! Thank you for shopping with SANRA LIVING™.")}`} target="_blank" rel="noopener" className="px-3 py-1.5 bg-transparent border border-[#25D366] text-[#25D366] text-[0.65rem] font-bold rounded tracking-wider uppercase no-underline">WhatsApp</a>}
                                    </div>
                                </Td>
                            </tr>
                        ))}
                        {filtered.length === 0 && <tr><td colSpan={7} className="py-16 text-center text-[var(--ap-muted)]">No customers found.</td></tr>}
                    </tbody>
                </table>
            </div>

            {/* Mobile cards */}
            <div className="flex flex-col gap-3 md:hidden">
                {filtered.map((c, i) => (
                    <div key={i} className="bg-white border border-[var(--ap-border)] rounded-2xl p-4">
                        <p className="text-sm font-bold text-[var(--ap-text)] font-[family-name:var(--ap-font-heading)] truncate">{c.user_email || "—"}</p>
                        <p className="text-xs text-[var(--ap-muted)] mt-0.5">{c.user_phone || "—"} · {[c.city, c.state].filter(Boolean).join(", ") || "—"}</p>
                        <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-[var(--ap-border-light)]">
                            <div><p className="text-[0.55rem] text-[var(--ap-muted)] uppercase tracking-wider font-bold">Orders</p><p className="text-sm font-bold">{c.total_orders}</p></div>
                            <div><p className="text-[0.55rem] text-[var(--ap-muted)] uppercase tracking-wider font-bold">Spent</p><p className="text-sm font-bold text-[#10B981]">{fmt(c.total_spent)}</p></div>
                            <div><p className="text-[0.55rem] text-[var(--ap-muted)] uppercase tracking-wider font-bold">Last</p><p className="text-xs text-[var(--ap-muted)]">{fmtDate(c.last_order_date)}</p></div>
                        </div>
                        <div className="flex gap-2 mt-3">
                            {c.user_email && <a href={`mailto:${c.user_email}`} className="flex-1 text-center py-2.5 bg-transparent border border-[var(--ap-border)] text-[var(--ap-accent)] text-xs font-bold rounded-lg no-underline">✉ Email</a>}
                            {c.user_phone && <a href={`https://wa.me/${c.user_phone.replace(/\D/g, "")}`} target="_blank" rel="noopener" className="flex-1 text-center py-2.5 bg-transparent border border-[#25D366] text-[#25D366] text-xs font-bold rounded-lg no-underline">WhatsApp</a>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
