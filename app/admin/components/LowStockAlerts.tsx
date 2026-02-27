"use client";

import React from "react";
import { C, FM, FO, fmt } from "../constants";
import type { Product } from "../types";

interface Props {
    products: Product[];
    onEditProduct: (p: Product) => void;
    onGoToProducts: () => void;
}

export default function LowStockAlerts({ products, onEditProduct, onGoToProducts }: Props) {
    const lowStock = products
        .filter(p => p.is_active && p.stock_qty <= 5)
        .sort((a, b) => a.stock_qty - b.stock_qty);

    if (lowStock.length === 0) return null;

    return (
        <div style={{ background: `${C.red}08`, border: `1px solid ${C.red}22`, borderRadius: 10, padding: "1.25rem 1.5rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "1rem" }}>⚠️</span>
                    <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.red, fontFamily: FM }}>
                        Low Stock Alert — {lowStock.length} {lowStock.length === 1 ? "product" : "products"}
                    </p>
                </div>
                <button onClick={onGoToProducts} style={{ padding: "0.3rem 0.75rem", background: "transparent", border: `1px solid ${C.red}44`, color: C.red, fontSize: "0.6rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>View All</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {lowStock.slice(0, 5).map(p => (
                    <div key={p.id} onClick={() => onEditProduct(p)} style={{ display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.5rem 0.75rem", background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, cursor: "pointer", transition: "border-color 0.15s" }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = C.red)}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
                    >
                        <div style={{ width: 40, height: 40, background: "#111", borderRadius: 6, overflow: "hidden", flexShrink: 0 }}>
                            {p.image_url && <img src={p.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: "0.78rem", fontWeight: 700, color: C.text, fontFamily: FM, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</p>
                            <p style={{ fontSize: "0.68rem", color: C.muted, fontFamily: FO }}>{p.category} · {fmt(p.price)}</p>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <p style={{ fontSize: "1.1rem", fontWeight: 900, color: p.stock_qty === 0 ? C.red : C.orange, fontFamily: FM }}>{p.stock_qty}</p>
                            <p style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: p.stock_qty === 0 ? C.red : C.orange, fontFamily: FM }}>
                                {p.stock_qty === 0 ? "OUT OF STOCK" : "LOW STOCK"}
                            </p>
                        </div>
                    </div>
                ))}
                {lowStock.length > 5 && (
                    <p style={{ fontSize: "0.68rem", color: C.muted, fontFamily: FO, textAlign: "center", padding: "0.375rem" }}>
                        +{lowStock.length - 5} more items with low stock
                    </p>
                )}
            </div>
        </div>
    );
}
