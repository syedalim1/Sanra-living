"use client";

import React from "react";
import { C, FM, FO, fmt, fmtDate, ORDER_STATUSES, STATUS_LABELS } from "../constants";
import { Badge, Th, Td, inputStyle, selectStyle } from "../components/AdminUI";
import type { Order } from "../types";

interface Props {
    orders: Order[];
    searchQuery: string;
    setSearchQuery: (v: string) => void;
    orderStatusFilter: string;
    setOrderStatusFilter: (v: string) => void;
    expandedOrder: string | null;
    setExpandedOrder: (id: string | null) => void;
    updatingOrder: string | null;
    updateOrderStatus: (orderId: string, status: string) => void;
    exportOrdersCsv: () => void;
}

export default function OrdersTab({
    orders, searchQuery, setSearchQuery,
    orderStatusFilter, setOrderStatusFilter,
    expandedOrder, setExpandedOrder,
    updatingOrder, updateOrderStatus, exportOrdersCsv,
}: Props) {
    const filtered = orders.filter(o => {
        const q = searchQuery.toLowerCase();
        const matchSearch = !q || o.order_number.toLowerCase().includes(q) || o.user_email.toLowerCase().includes(q) || o.user_phone.includes(q);
        const matchStatus = orderStatusFilter === "all" || o.order_status === orderStatusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <div style={{ overflowX: "auto" }}>
            {/* Toolbar */}
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
                <input
                    placeholder="Search orders (email, phone, order #)…"
                    value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    style={{ ...inputStyle, maxWidth: 320, padding: "0.5rem 0.875rem" }}
                />
                <select value={orderStatusFilter} onChange={e => setOrderStatusFilter(e.target.value)} style={{ ...selectStyle, maxWidth: 180, padding: "0.5rem 0.875rem" }}>
                    <option value="all">All Statuses</option>
                    {ORDER_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
                <button onClick={exportOrdersCsv} style={{ padding: "0.5rem 1rem", background: "transparent", border: `1px solid ${C.border}`, color: C.green, fontSize: "0.68rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    ↓ Export CSV
                </button>
                <span style={{ fontSize: "0.72rem", color: C.muted, fontFamily: FO, marginLeft: "auto" }}>{filtered.length} orders</span>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <Th>Order #</Th><Th>Customer</Th><Th>Phone</Th><Th>Total</Th>
                        <Th>Payment</Th><Th>Method</Th><Th>Order Status</Th><Th>Update Status</Th><Th>Date</Th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((order) => (
                        <React.Fragment key={order.id}>
                            <tr
                                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                style={{ borderBottom: `1px solid ${C.border}`, cursor: "pointer", transition: "background 0.12s" }}
                                onMouseEnter={e => (e.currentTarget.style.background = "#1a1a1a")}
                                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                            >
                                <Td><span style={{ fontWeight: 700, color: C.accent, fontFamily: FM, fontSize: "0.82rem" }}>{order.order_number}</span></Td>
                                <Td><span style={{ fontSize: "0.82rem", color: C.text }}>{order.user_email}</span></Td>
                                <Td><span style={{ fontSize: "0.8rem", color: C.muted }}>{order.user_phone}</span></Td>
                                <Td><span style={{ fontWeight: 700, fontSize: "0.85rem", fontFamily: FM }}>{fmt(order.total_amount)}</span></Td>
                                <Td><Badge status={order.payment_status} /></Td>
                                <Td><Badge status={order.payment_method} /></Td>
                                <Td><Badge status={order.order_status} /></Td>
                                <Td style={{ minWidth: 160 }} onClick={e => e.stopPropagation()}>
                                    <select
                                        value={order.order_status}
                                        disabled={updatingOrder === order.id}
                                        onChange={e => updateOrderStatus(order.id, e.target.value)}
                                        style={selectStyle}
                                    >
                                        {ORDER_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                                    </select>
                                </Td>
                                <Td><span style={{ fontSize: "0.72rem", color: C.muted, whiteSpace: "nowrap" }}>{fmtDate(order.created_at)}</span></Td>
                            </tr>

                            {expandedOrder === order.id && (
                                <tr>
                                    <td colSpan={9} style={{ background: "#111", padding: "1.25rem 1.5rem 1.5rem", borderBottom: `1px solid ${C.border}` }}>
                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1.5rem", marginBottom: "1.25rem" }}>
                                            {/* Shipping */}
                                            <div>
                                                <p style={{ fontSize: "0.58rem", color: C.muted, fontFamily: FM, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Shipping Address</p>
                                                <p style={{ fontSize: "0.82rem", color: C.text, fontFamily: FO, lineHeight: 1.7 }}>
                                                    {order.shipping_address}<br />
                                                    {order.city}, {order.state} – {order.pincode}
                                                </p>
                                            </div>
                                            {/* Payment */}
                                            <div>
                                                <p style={{ fontSize: "0.58rem", color: C.muted, fontFamily: FM, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Payment Details</p>
                                                <p style={{ fontSize: "0.82rem", color: C.text, fontFamily: FO, lineHeight: 1.8 }}>
                                                    Method: <strong>{order.payment_method.toUpperCase()}</strong><br />
                                                    Advance Paid: <strong style={{ color: C.green }}>{fmt(order.advance_paid)}</strong><br />
                                                    Remaining COD: <strong style={{ color: order.remaining_amount > 0 ? C.orange : C.muted }}>{fmt(order.remaining_amount)}</strong>
                                                </p>
                                            </div>
                                            {/* Razorpay ID */}
                                            {order.razorpay_payment_id && (
                                                <div>
                                                    <p style={{ fontSize: "0.58rem", color: C.muted, fontFamily: FM, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Payment ID</p>
                                                    <p style={{ fontSize: "0.75rem", color: C.blue, fontFamily: "monospace", wordBreak: "break-all" }}>{order.razorpay_payment_id}</p>
                                                </div>
                                            )}
                                            {/* Quick Actions */}
                                            <div>
                                                <p style={{ fontSize: "0.58rem", color: C.muted, fontFamily: FM, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Quick Actions</p>
                                                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                                    {["packed", "shipped", "out_for_delivery", "delivered"].map(s => (
                                                        <button key={s}
                                                            onClick={() => updateOrderStatus(order.id, s)}
                                                            disabled={order.order_status === s}
                                                            style={{ padding: "0.4rem 0.75rem", background: order.order_status === s ? C.accentDim : "transparent", border: `1px solid ${order.order_status === s ? C.accent : C.border}`, color: order.order_status === s ? C.accent : C.muted, fontSize: "0.68rem", fontWeight: 700, fontFamily: FM, cursor: order.order_status === s ? "default" : "pointer", borderRadius: 4, letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "left" }}>
                                                            {order.order_status === s ? "✓ " : ""}{STATUS_LABELS[s]}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Items List */}
                                        {order.order_items && order.order_items.length > 0 && (
                                            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "1rem" }}>
                                                <p style={{ fontSize: "0.58rem", color: C.muted, fontFamily: FM, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.625rem" }}>Items Ordered</p>
                                                <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                                                    {order.order_items.map((item, i) => (
                                                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.82rem", color: C.text, fontFamily: FO, padding: "0.5rem 0.875rem", background: C.card, borderRadius: 6 }}>
                                                            <span>{item.product_name} <span style={{ color: C.muted }}>× {item.quantity}</span></span>
                                                            <span style={{ fontWeight: 700, fontFamily: FM }}>{fmt(item.total_price)}</span>
                                                        </div>
                                                    ))}
                                                    <div style={{ display: "flex", justifyContent: "flex-end", padding: "0.5rem 0.875rem", fontSize: "0.88rem", fontWeight: 900, fontFamily: FM, color: C.accent }}>
                                                        Total: {fmt(order.total_amount)}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                    {orders.length === 0 && (
                        <tr><td colSpan={9} style={{ padding: "5rem", textAlign: "center", color: C.muted, fontFamily: FO }}>No orders yet.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
