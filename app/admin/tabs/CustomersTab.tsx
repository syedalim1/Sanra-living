"use client";

import React, { useState } from "react";
import { C, FM, FO, fmt, fmtDate } from "../constants";
import { Th, Td, inputStyle } from "../components/AdminUI";
import type { Customer } from "../types";

interface Props {
    customers: Customer[];
}

export default function CustomersTab({ customers }: Props) {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"total_spent" | "total_orders" | "last_order_date">("total_spent");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

    const toggleSort = (field: typeof sortBy) => {
        if (sortBy === field) {
            setSortDir(d => d === "desc" ? "asc" : "desc");
        } else {
            setSortBy(field);
            setSortDir("desc");
        }
    };

    const filtered = customers
        .filter(c => {
            const q = searchQuery.toLowerCase();
            return !q || c.user_email.toLowerCase().includes(q) || c.user_phone.includes(q) || (c.city ?? "").toLowerCase().includes(q);
        })
        .sort((a, b) => {
            const mult = sortDir === "desc" ? -1 : 1;
            if (sortBy === "total_spent") return (a.total_spent - b.total_spent) * mult;
            if (sortBy === "total_orders") return (a.total_orders - b.total_orders) * mult;
            return (new Date(a.last_order_date).getTime() - new Date(b.last_order_date).getTime()) * mult;
        });

    const totalCustomers = customers.length;
    const totalRevenue = customers.reduce((s, c) => s + c.total_spent, 0);
    const avgOrderValue = totalRevenue / Math.max(customers.reduce((s, c) => s + c.total_orders, 0), 1);
    const repeatCustomers = customers.filter(c => c.total_orders > 1).length;

    const sortArrow = (field: typeof sortBy) => sortBy === field ? (sortDir === "desc" ? " ↓" : " ↑") : "";

    return (
        <div>
            {/* Stats Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
                {[
                    { label: "Total Customers", value: totalCustomers, color: C.accent },
                    { label: "Total Revenue", value: fmt(totalRevenue), color: C.green },
                    { label: "Avg Order Value", value: fmt(Math.round(avgOrderValue)), color: C.blue },
                    { label: "Repeat Customers", value: repeatCustomers, color: C.purple },
                ].map(({ label, value, color }) => (
                    <div key={label} style={{ background: C.card, border: `1px solid ${C.border}`, padding: "1rem 1.25rem", borderRadius: 10 }}>
                        <p style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted, fontFamily: FM, marginBottom: "0.375rem" }}>{label}</p>
                        <p style={{ fontSize: "1.3rem", fontWeight: 900, color, fontFamily: FM }}>{value}</p>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", alignItems: "center" }}>
                <input placeholder="Search by email, phone, or city…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ ...inputStyle, maxWidth: 360, padding: "0.5rem 0.875rem" }} />
                <span style={{ fontSize: "0.72rem", color: C.muted, fontFamily: FO, marginLeft: "auto" }}>{filtered.length} customers</span>
            </div>

            {/* Table */}
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <Th>Customer</Th>
                            <Th>Phone</Th>
                            <Th>Location</Th>
                            <th
                                onClick={() => toggleSort("total_orders")}
                                style={{
                                    padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.6rem", fontWeight: 700,
                                    letterSpacing: "0.15em", textTransform: "uppercase", color: sortBy === "total_orders" ? C.accent : C.muted,
                                    fontFamily: FM, borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap",
                                    background: C.panel, cursor: "pointer", userSelect: "none",
                                }}
                            >
                                Orders{sortArrow("total_orders")}
                            </th>
                            <th
                                onClick={() => toggleSort("total_spent")}
                                style={{
                                    padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.6rem", fontWeight: 700,
                                    letterSpacing: "0.15em", textTransform: "uppercase", color: sortBy === "total_spent" ? C.accent : C.muted,
                                    fontFamily: FM, borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap",
                                    background: C.panel, cursor: "pointer", userSelect: "none",
                                }}
                            >
                                Total Spent{sortArrow("total_spent")}
                            </th>
                            <th
                                onClick={() => toggleSort("last_order_date")}
                                style={{
                                    padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.6rem", fontWeight: 700,
                                    letterSpacing: "0.15em", textTransform: "uppercase", color: sortBy === "last_order_date" ? C.accent : C.muted,
                                    fontFamily: FM, borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap",
                                    background: C.panel, cursor: "pointer", userSelect: "none",
                                }}
                            >
                                Last Order{sortArrow("last_order_date")}
                            </th>
                            <Th>Actions</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((customer, i) => (
                            <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                                <Td>
                                    <p style={{ fontSize: "0.85rem", fontWeight: 700, color: C.text, fontFamily: FM }}>{customer.user_email || "—"}</p>
                                </Td>
                                <Td><span style={{ fontSize: "0.8rem", color: C.muted, fontFamily: FO }}>{customer.user_phone || "—"}</span></Td>
                                <Td><span style={{ fontSize: "0.8rem", color: C.muted, fontFamily: FO }}>{[customer.city, customer.state].filter(Boolean).join(", ") || "—"}</span></Td>
                                <Td>
                                    <span style={{ fontSize: "0.88rem", fontWeight: 700, color: customer.total_orders > 1 ? C.accent : C.text, fontFamily: FM }}>
                                        {customer.total_orders}
                                        {customer.total_orders > 1 && <span style={{ fontSize: "0.6rem", color: C.green, marginLeft: "0.4rem", fontWeight: 700 }}>REPEAT</span>}
                                    </span>
                                </Td>
                                <Td><span style={{ fontSize: "0.88rem", fontWeight: 700, color: C.green, fontFamily: FM }}>{fmt(customer.total_spent)}</span></Td>
                                <Td><span style={{ fontSize: "0.72rem", color: C.muted, fontFamily: FO, whiteSpace: "nowrap" }}>{fmtDate(customer.last_order_date)}</span></Td>
                                <Td>
                                    <div style={{ display: "flex", gap: "0.4rem" }}>
                                        {customer.user_email && (
                                            <a
                                                href={`mailto:${customer.user_email}?subject=Hello from SANRA LIVING™`}
                                                style={{ padding: "0.35rem 0.75rem", background: "transparent", border: `1px solid ${C.border}`, color: C.accent, fontSize: "0.65rem", fontWeight: 700, fontFamily: FM, borderRadius: 4, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none" }}
                                            >✉ Email</a>
                                        )}
                                        {customer.user_phone && (
                                            <a
                                                href={`https://wa.me/${customer.user_phone.replace(/\D/g, "")}?text=${encodeURIComponent("Hi! Thank you for shopping with SANRA LIVING™.")}`}
                                                target="_blank" rel="noopener"
                                                style={{ padding: "0.35rem 0.75rem", background: "transparent", border: "1px solid #25D366", color: "#25D366", fontSize: "0.65rem", fontWeight: 700, fontFamily: FM, borderRadius: 4, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none" }}
                                            >WhatsApp</a>
                                        )}
                                    </div>
                                </Td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr><td colSpan={7} style={{ padding: "5rem", textAlign: "center", color: C.muted, fontFamily: FO }}>No customers found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
