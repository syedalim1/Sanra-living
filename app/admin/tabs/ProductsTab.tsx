"use client";

import React, { useState } from "react";
import { C, FM, FO, fmt, CATEGORIES } from "../constants";
import { inputStyle, selectStyle } from "../components/AdminUI";
import type { Product } from "../types";

interface Props {
    products: Product[];
    adminKey: string;
    searchQuery: string;
    setSearchQuery: (v: string) => void;
    productCategoryFilter: string;
    setProductCategoryFilter: (v: string) => void;
    onAddProduct: () => void;
    onEditProduct: (p: Product) => void;
    toggleProductActive: (p: Product) => void;
    duplicateProduct: (p: Product) => void;
    deleteProduct: (id: string) => void;
    onBulkAction: (ids: string[], action: "publish" | "hide" | "delete") => void;
}

export default function ProductsTab({
    products,
    searchQuery, setSearchQuery,
    productCategoryFilter, setProductCategoryFilter,
    onAddProduct, onEditProduct,
    deleteProduct,
}: Props) {
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const filtered = products.filter(p => {
        const q = searchQuery.toLowerCase();
        const matchSearch = !q || p.title.toLowerCase().includes(q);
        const matchCat = productCategoryFilter === "all" || p.category === productCategoryFilter;
        return matchSearch && matchCat;
    });

    return (
        <div>
            {/* Toolbar */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
                <input
                    placeholder="Search products…"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ ...inputStyle, maxWidth: 300, padding: "0.625rem 1rem" }}
                />
                <select
                    value={productCategoryFilter}
                    onChange={e => setProductCategoryFilter(e.target.value)}
                    style={{ ...selectStyle, maxWidth: 200, padding: "0.625rem 1rem" }}
                >
                    <option value="all">All Categories</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div style={{ marginLeft: "auto" }}>
                    <button
                        onClick={onAddProduct}
                        style={{
                            padding: "0.75rem 1.75rem", background: C.accent, color: "#fff",
                            fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.05em",
                            textTransform: "uppercase", border: "none", cursor: "pointer",
                            borderRadius: 6, fontFamily: FM,
                        }}
                    >
                        + Add Product
                    </button>
                </div>
            </div>

            <p style={{ fontSize: "0.85rem", color: C.muted, fontFamily: FO, marginBottom: "1rem" }}>
                {filtered.length} products
            </p>

            {/* Products Table */}
            <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            {["Image", "Name", "Price", "Stock", "Status", "Actions"].map(h => (
                                <th key={h} style={{
                                    padding: "1rem 1.25rem", textAlign: "left", fontSize: "0.75rem",
                                    fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                                    color: C.muted, fontFamily: FM, borderBottom: `1px solid ${C.border}`,
                                    background: "#fafafa",
                                }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(product => (
                            <tr key={product.id} style={{ borderBottom: `1px solid ${C.border}`, transition: "background 0.15s" }}
                                onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                                onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                            >
                                {/* Image */}
                                <td style={{ padding: "0.75rem 1.25rem", width: 72 }}>
                                    <div style={{ width: 56, height: 56, background: "#f0f0f0", borderRadius: 6, overflow: "hidden" }}>
                                        {product.image_url ? (
                                            <img src={product.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        ) : (
                                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc", fontSize: "1.25rem" }}>🖼</div>
                                        )}
                                    </div>
                                </td>

                                {/* Name */}
                                <td style={{ padding: "0.75rem 1.25rem" }}>
                                    <p style={{ fontSize: "0.95rem", fontWeight: 700, color: C.text, fontFamily: FM, margin: 0 }}>{product.title}</p>
                                    <p style={{ fontSize: "0.8rem", color: C.muted, fontFamily: FO, margin: "0.2rem 0 0" }}>{product.category}</p>
                                </td>

                                {/* Price */}
                                <td style={{ padding: "0.75rem 1.25rem" }}>
                                    <span style={{ fontWeight: 800, color: C.text, fontFamily: FM, fontSize: "1rem" }}>{fmt(product.price)}</span>
                                </td>

                                {/* Stock */}
                                <td style={{ padding: "0.75rem 1.25rem" }}>
                                    <span style={{
                                        fontSize: "0.9rem", fontWeight: 700, fontFamily: FM,
                                        color: product.stock_qty <= 5 ? C.red : C.text,
                                    }}>
                                        {product.stock_qty}
                                    </span>
                                </td>

                                {/* Status */}
                                <td style={{ padding: "0.75rem 1.25rem" }}>
                                    <span style={{
                                        display: "inline-block", padding: "0.25rem 0.75rem", borderRadius: 4,
                                        fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em",
                                        textTransform: "uppercase", fontFamily: FM,
                                        background: product.is_active ? "#10B98118" : "#EF444418",
                                        color: product.is_active ? C.green : C.red,
                                    }}>
                                        {product.is_active ? "Active" : "Hidden"}
                                    </span>
                                </td>

                                {/* Actions */}
                                <td style={{ padding: "0.75rem 1.25rem" }}>
                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                        <button
                                            onClick={() => onEditProduct(product)}
                                            style={{
                                                padding: "0.4rem 0.9rem", background: "#fff",
                                                border: `1px solid ${C.border}`, color: C.blue,
                                                fontSize: "0.75rem", fontWeight: 700, fontFamily: FM,
                                                cursor: "pointer", borderRadius: 4,
                                            }}
                                        >
                                            Edit
                                        </button>
                                        {deleteConfirm === product.id ? (
                                            <>
                                                <button
                                                    onClick={() => { deleteProduct(product.id); setDeleteConfirm(null); }}
                                                    style={{
                                                        padding: "0.4rem 0.9rem", background: C.red,
                                                        border: "none", color: "#fff",
                                                        fontSize: "0.75rem", fontWeight: 700, fontFamily: FM,
                                                        cursor: "pointer", borderRadius: 4,
                                                    }}
                                                >
                                                    Confirm
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(null)}
                                                    style={{
                                                        padding: "0.4rem 0.6rem", background: "#fff",
                                                        border: `1px solid ${C.border}`, color: C.muted,
                                                        fontSize: "0.75rem", fontWeight: 700, fontFamily: FM,
                                                        cursor: "pointer", borderRadius: 4,
                                                    }}
                                                >
                                                    ✕
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => setDeleteConfirm(product.id)}
                                                style={{
                                                    padding: "0.4rem 0.9rem", background: "#fff",
                                                    border: `1px solid ${C.border}`, color: C.red,
                                                    fontSize: "0.75rem", fontWeight: 700, fontFamily: FM,
                                                    cursor: "pointer", borderRadius: 4,
                                                }}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filtered.length === 0 && (
                <p style={{ color: C.muted, fontFamily: FO, padding: "4rem", textAlign: "center", fontSize: "1rem" }}>No products found.</p>
            )}
        </div>
    );
}
