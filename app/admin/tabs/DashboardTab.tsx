"use client";

import React from "react";
import { C, FM, FO, fmt, fmtDate, ORDER_STATUSES, STATUS_LABELS, STATUS_COLORS } from "../constants";
import { StatCard, Badge } from "../components/AdminUI";
import type { Order, Product } from "../types";

interface Props {
    orders: Order[];
    products: Product[];
    totalRevenue: number;
    paidOrders: Order[];
    onViewOrders: () => void;
}

export default function DashboardTab({ orders, products, totalRevenue, paidOrders, onViewOrders }: Props) {
    const now = new Date();
    const today = orders.filter(o => new Date(o.created_at).toDateString() === now.toDateString());
    const week = orders.filter(o => (now.getTime() - new Date(o.created_at).getTime()) < 7 * 86400000);
    const month = orders.filter(o =>
        new Date(o.created_at).getMonth() === now.getMonth() &&
        new Date(o.created_at).getFullYear() === now.getFullYear()
    );
    const todayRev = today.filter(o => o.payment_status === "paid").reduce((s, o) => s + o.total_amount, 0);
    const weekRev = week.filter(o => o.payment_status === "paid").reduce((s, o) => s + o.total_amount, 0);
    const monthRev = month.filter(o => o.payment_status === "paid").reduce((s, o) => s + o.total_amount, 0);
    const statusCounts = ORDER_STATUSES.map(s => ({ status: s, count: orders.filter(o => o.order_status === s).length })).filter(s => s.count > 0);
    const lowStock = products.filter(p => p.is_active && p.stock_qty <= 5);
    const recent = [...orders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Revenue Row */}
            <div>
                <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.muted, fontFamily: FM, marginBottom: "0.75rem" }}>Revenue (Paid)</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.75rem" }}>
                    <StatCard label="Today" value={fmt(todayRev)} sub={`${today.length} orders`} color={C.green} />
                    <StatCard label="This Week" value={fmt(weekRev)} sub={`${week.length} orders`} color={C.green} />
                    <StatCard label="This Month" value={fmt(monthRev)} sub={`${month.length} orders`} color={C.green} />
                    <StatCard label="All Time" value={fmt(totalRevenue)} sub={`${paidOrders.length} paid`} color={C.accent} />
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
                {/* Order Status Distribution */}
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "1.25rem 1.5rem" }}>
                    <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.muted, fontFamily: FM, marginBottom: "1rem" }}>Order Status Distribution</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {statusCounts.map(({ status, count }) => (
                            <div key={status} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <span style={{ width: 90, fontSize: "0.72rem", fontWeight: 600, color: C.muted, fontFamily: FM, textTransform: "capitalize" }}>{STATUS_LABELS[status]}</span>
                                <div style={{ flex: 1, height: 8, background: "#1a1a1a", borderRadius: 4, overflow: "hidden" }}>
                                    <div style={{ width: `${(count / orders.length) * 100}%`, height: "100%", background: STATUS_COLORS[status] ?? "#555", borderRadius: 4, transition: "width 0.5s" }} />
                                </div>
                                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: C.text, fontFamily: FM, minWidth: 24, textAlign: "right" }}>{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Low Stock Alerts */}
                <div style={{ background: C.card, border: `1px solid ${lowStock.length > 0 ? "#F9731644" : C.border}`, borderRadius: 10, padding: "1.25rem 1.5rem" }}>
                    <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: lowStock.length > 0 ? C.orange : C.muted, fontFamily: FM, marginBottom: "1rem" }}>
                        ⚠ Low Stock Alerts ({lowStock.length})
                    </p>
                    {lowStock.length === 0 ? (
                        <p style={{ fontSize: "0.82rem", color: C.green, fontFamily: FO }}>✓ All products are well stocked.</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                            {lowStock.map(p => (
                                <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0.75rem", background: "#111", borderRadius: 6 }}>
                                    <span style={{ fontSize: "0.82rem", color: C.text, fontFamily: FO }}>{p.title}</span>
                                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: p.stock_qty <= 2 ? C.red : C.orange, fontFamily: FM }}>{p.stock_qty} left</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Orders */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "1.25rem 1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.muted, fontFamily: FM }}>Recent Orders</p>
                    <button onClick={onViewOrders} style={{ fontSize: "0.65rem", color: C.accent, background: "none", border: "none", cursor: "pointer", fontFamily: FM, letterSpacing: "0.08em", textTransform: "uppercase" }}>View All →</button>
                </div>
                {recent.length === 0 ? (
                    <p style={{ fontSize: "0.82rem", color: C.muted, fontFamily: FO }}>No orders yet.</p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                        {recent.map(o => (
                            <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.625rem 0.875rem", background: "#111", borderRadius: 6, gap: "1rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
                                    <span style={{ fontWeight: 700, color: C.accent, fontFamily: FM, fontSize: "0.78rem", flexShrink: 0 }}>{o.order_number}</span>
                                    <span style={{ fontSize: "0.78rem", color: C.muted, fontFamily: FO, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.user_email}</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
                                    <span style={{ fontWeight: 700, fontSize: "0.82rem", fontFamily: FM }}>{fmt(o.total_amount)}</span>
                                    <Badge status={o.order_status} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
