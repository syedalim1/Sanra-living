"use client";

import React from "react";
import { C, FM, FO, fmt } from "../constants";
import { StatCard } from "../components/AdminUI";
import type { Order, Product } from "../types";

interface Props {
    orders: Order[];
    products: Product[];
    totalRevenue: number;
    paidOrders: Order[];
    onViewOrders: () => void;
}

export default function DashboardTab({ orders, products, totalRevenue, paidOrders, onViewOrders }: Props) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            
            {/* Main Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
                <StatCard label="Total Products" value={products.length} sub={`${products.filter(p => p.is_active).length} active`} color={C.blue} />
                <StatCard label="Total Orders" value={orders.length} sub={`${paidOrders.length} paid`} color={C.green} />
                <StatCard label="Total Revenue" value={fmt(totalRevenue)} sub="From paid orders" color={C.accent} />
            </div>

            {/* Recent Orders */}
            <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, padding: "1.5rem 2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, fontFamily: FM, color: C.text, margin: 0 }}>Recent Orders</h3>
                    <button onClick={onViewOrders} style={{ fontSize: "0.85rem", color: C.blue, background: "none", border: "none", cursor: "pointer", fontFamily: FM, fontWeight: 600 }}>View All →</button>
                </div>
                {orders.length === 0 ? (
                    <p style={{ fontSize: "0.9rem", color: C.muted, fontFamily: FO }}>No orders yet.</p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {[...orders]
                            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                            .slice(0, 5)
                            .map(o => (
                                <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.875rem 1rem", background: "#fafafa", borderRadius: 8 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                        <span style={{ fontWeight: 700, color: C.blue, fontFamily: FM, fontSize: "0.85rem" }}>{o.order_number}</span>
                                        <span style={{ fontSize: "0.85rem", color: C.muted, fontFamily: FO }}>{o.user_phone || o.user_email}</span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                        <span style={{ fontWeight: 700, fontSize: "0.95rem", fontFamily: FM, color: C.text }}>{fmt(o.total_amount)}</span>
                                        <span style={{
                                            padding: "0.2rem 0.6rem", borderRadius: 4, fontSize: "0.65rem",
                                            fontWeight: 700, textTransform: "uppercase", fontFamily: FM,
                                            background: o.payment_status === "paid" ? "#10B98118" : "#F5920018",
                                            color: o.payment_status === "paid" ? C.green : C.orange,
                                        }}>
                                            {o.payment_status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}
