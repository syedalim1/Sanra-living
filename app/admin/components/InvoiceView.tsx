"use client";

import React from "react";
import { fmt, fmtDate } from "../constants";
import type { Order } from "../types";

interface Props {
    order: Order;
    onClose: () => void;
}

export default function InvoiceView({ order, onClose }: Props) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(3px)" }} />
            <div onClick={e => e.stopPropagation()} style={{ position: "relative", zIndex: 1, width: "min(700px, 95vw)", maxHeight: "90vh", overflow: "auto", background: "#fff", borderRadius: 12, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
                {/* Print-only styles */}
                <style>{`
                    @media print {
                        body * { visibility: hidden; }
                        #invoice-content, #invoice-content * { visibility: visible; }
                        #invoice-content { position: absolute; left: 0; top: 0; width: 100%; }
                        .no-print { display: none !important; }
                    }
                `}</style>

                {/* Toolbar (not printed) */}
                <div className="no-print" style={{ display: "flex", justifyContent: "space-between", padding: "1rem 1.5rem", borderBottom: "1px solid #eee" }}>
                    <button onClick={handlePrint} style={{ padding: "0.5rem 1.25rem", background: "#111", color: "#fff", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", border: "none", cursor: "pointer", borderRadius: 6, fontFamily: "Inter, sans-serif" }}>🖨 Print Invoice</button>
                    <button onClick={onClose} style={{ padding: "0.5rem 0.75rem", background: "transparent", border: "1px solid #ddd", color: "#666", cursor: "pointer", borderRadius: 6, fontSize: "0.85rem" }}>✕</button>
                </div>

                {/* Invoice Content */}
                <div id="invoice-content" style={{ padding: "2rem 2.5rem", color: "#111", fontFamily: "Inter, Arial, sans-serif" }}>
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "2px solid #111" }}>
                        <div>
                            <h1 style={{ fontSize: "1.4rem", fontWeight: 900, letterSpacing: "0.15em", textTransform: "uppercase", margin: 0 }}>SANRA LIVING™</h1>
                            <p style={{ fontSize: "0.72rem", color: "#666", marginTop: "0.25rem" }}>Premium Steel Furniture</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <p style={{ fontSize: "1.2rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "#333" }}>Invoice</p>
                            <p style={{ fontSize: "0.78rem", color: "#666", marginTop: "0.25rem" }}>{fmtDate(order.created_at)}</p>
                        </div>
                    </div>

                    {/* Order & Customer Info */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
                        <div>
                            <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#999", marginBottom: "0.5rem" }}>Order Details</p>
                            <p style={{ fontSize: "0.88rem", fontWeight: 700, marginBottom: "0.25rem" }}>#{order.order_number}</p>
                            <p style={{ fontSize: "0.78rem", color: "#555" }}>Payment: {order.payment_method.toUpperCase()}</p>
                            <p style={{ fontSize: "0.78rem", color: "#555" }}>Status: {order.payment_status.toUpperCase()}</p>
                        </div>
                        <div>
                            <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#999", marginBottom: "0.5rem" }}>Ship To</p>
                            <p style={{ fontSize: "0.82rem", fontWeight: 600 }}>{order.user_email}</p>
                            {order.user_phone && <p style={{ fontSize: "0.78rem", color: "#555" }}>{order.user_phone}</p>}
                            <p style={{ fontSize: "0.78rem", color: "#555", lineHeight: 1.6, marginTop: "0.25rem" }}>
                                {order.shipping_address}<br />
                                {order.city}, {order.state} — {order.pincode}
                            </p>
                        </div>
                    </div>

                    {/* Items Table */}
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
                        <thead>
                            <tr style={{ borderBottom: "2px solid #111" }}>
                                <th style={{ textAlign: "left", padding: "0.75rem 0.5rem", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#999" }}>Item</th>
                                <th style={{ textAlign: "center", padding: "0.75rem 0.5rem", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#999" }}>Qty</th>
                                <th style={{ textAlign: "right", padding: "0.75rem 0.5rem", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#999" }}>Unit Price</th>
                                <th style={{ textAlign: "right", padding: "0.75rem 0.5rem", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#999" }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(order.order_items ?? []).map((item, i) => (
                                <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                                    <td style={{ padding: "0.75rem 0.5rem", fontSize: "0.85rem", fontWeight: 500 }}>{item.product_name}</td>
                                    <td style={{ padding: "0.75rem 0.5rem", fontSize: "0.85rem", textAlign: "center", color: "#555" }}>{item.quantity}</td>
                                    <td style={{ padding: "0.75rem 0.5rem", fontSize: "0.85rem", textAlign: "right", color: "#555" }}>{fmt(item.unit_price)}</td>
                                    <td style={{ padding: "0.75rem 0.5rem", fontSize: "0.85rem", textAlign: "right", fontWeight: 700 }}>{fmt(item.total_price)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Totals */}
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "2rem" }}>
                        <div style={{ width: 260 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", fontSize: "0.82rem", color: "#555" }}>
                                <span>Subtotal</span>
                                <span>{fmt(order.total_amount)}</span>
                            </div>
                            {order.advance_paid > 0 && (
                                <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", fontSize: "0.82rem", color: "#10B981" }}>
                                    <span>Advance Paid</span>
                                    <span>– {fmt(order.advance_paid)}</span>
                                </div>
                            )}
                            {order.remaining_amount > 0 && (
                                <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", fontSize: "0.82rem", color: "#F97316" }}>
                                    <span>Balance (COD)</span>
                                    <span>{fmt(order.remaining_amount)}</span>
                                </div>
                            )}
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 0", fontSize: "1.05rem", fontWeight: 900, borderTop: "2px solid #111", marginTop: "0.5rem" }}>
                                <span>Total</span>
                                <span>{fmt(order.total_amount)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={{ textAlign: "center", paddingTop: "1.5rem", borderTop: "1px solid #eee" }}>
                        <p style={{ fontSize: "0.68rem", color: "#999", lineHeight: 1.8 }}>
                            Thank you for your order!<br />
                            SANRA LIVING™ — Premium Steel Furniture<br />
                            support@sanraliving.com
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
