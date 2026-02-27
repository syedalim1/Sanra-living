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
    products, adminKey,
    searchQuery, setSearchQuery,
    productCategoryFilter, setProductCategoryFilter,
    onAddProduct, onEditProduct,
    toggleProductActive, duplicateProduct, deleteProduct,
    onBulkAction,
}: Props) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

    const filtered = products.filter(p => {
        const q = searchQuery.toLowerCase();
        const matchSearch = !q || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || (p.tags ?? []).some(t => t.toLowerCase().includes(q));
        const matchCat = productCategoryFilter === "all" || p.category === productCategoryFilter;
        return matchSearch && matchCat;
    });

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === filtered.length) setSelectedIds(new Set());
        else setSelectedIds(new Set(filtered.map(p => p.id)));
    };

    const handleBulk = (action: "publish" | "hide" | "delete") => {
        if (action === "delete" && !bulkDeleteConfirm) { setBulkDeleteConfirm(true); return; }
        onBulkAction(Array.from(selectedIds), action);
        setSelectedIds(new Set());
        setBulkDeleteConfirm(false);
    };

    const exportCsv = () => {
        const headers = ["Title", "Category", "Price", "Compare At", "Stock Qty", "Stock Status", "Finish", "Active", "Tags", "Weight (kg)", "Dimensions"];
        const rows = filtered.map(p => [
            p.title, p.category, p.price, p.compare_at_price ?? "", p.stock_qty,
            p.stock_status, p.finish, p.is_active ? "Yes" : "No",
            (p.tags ?? []).join("; "), p.weight_kg ?? "", p.dimensions ?? "",
        ]);
        const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
        a.download = `sanra-products-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    };

    const someSelected = selectedIds.size > 0;

    return (
        <div>
            {/* Toolbar */}
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
                <input placeholder="Search products or tags…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ ...inputStyle, maxWidth: 280, padding: "0.5rem 0.875rem" }} />
                <select value={productCategoryFilter} onChange={e => setProductCategoryFilter(e.target.value)} style={{ ...selectStyle, maxWidth: 180, padding: "0.5rem 0.875rem" }}>
                    <option value="all">All Categories</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                {/* View Toggle */}
                <div style={{ display: "flex", border: `1px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
                    {(["grid", "table"] as const).map(m => (
                        <button key={m} onClick={() => setViewMode(m)} style={{
                            padding: "0.4rem 0.75rem", background: viewMode === m ? C.accent : "transparent",
                            color: viewMode === m ? "#111" : C.muted, border: "none", cursor: "pointer",
                            fontSize: "0.65rem", fontWeight: 700, fontFamily: FM, letterSpacing: "0.08em", textTransform: "uppercase",
                        }}>
                            {m === "grid" ? "⊞ Grid" : "☰ Table"}
                        </button>
                    ))}
                </div>

                {/* Bulk Actions */}
                {someSelected && (
                    <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", padding: "0.35rem 0.75rem", background: `${C.accent}12`, border: `1px solid ${C.accent}44`, borderRadius: 6 }}>
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: C.accent, fontFamily: FM, marginRight: "0.5rem" }}>{selectedIds.size} selected</span>
                        <button onClick={() => handleBulk("publish")} style={{ padding: "0.3rem 0.6rem", background: "transparent", border: `1px solid ${C.green}`, color: C.green, fontSize: "0.62rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>Publish</button>
                        <button onClick={() => handleBulk("hide")} style={{ padding: "0.3rem 0.6rem", background: "transparent", border: `1px solid ${C.orange}`, color: C.orange, fontSize: "0.62rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>Hide</button>
                        {bulkDeleteConfirm ? (
                            <>
                                <button onClick={() => handleBulk("delete")} style={{ padding: "0.3rem 0.6rem", background: C.red, border: "none", color: "#fff", fontSize: "0.62rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4 }}>Confirm</button>
                                <button onClick={() => setBulkDeleteConfirm(false)} style={{ padding: "0.3rem 0.6rem", background: "transparent", border: `1px solid ${C.border}`, color: C.muted, fontSize: "0.62rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4 }}>✕</button>
                            </>
                        ) : (
                            <button onClick={() => handleBulk("delete")} style={{ padding: "0.3rem 0.6rem", background: "transparent", border: `1px solid ${C.red}`, color: C.red, fontSize: "0.62rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>Delete</button>
                        )}
                    </div>
                )}

                <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
                    <button onClick={exportCsv} style={{ padding: "0.5rem 1rem", background: "transparent", border: `1px solid ${C.border}`, color: C.green, fontSize: "0.68rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4, letterSpacing: "0.1em", textTransform: "uppercase" }}>↓ CSV</button>
                    <button onClick={onAddProduct} style={{ padding: "0.7rem 1.5rem", background: C.accent, color: "#111", fontWeight: 900, fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", border: "none", cursor: "pointer", borderRadius: 6, fontFamily: FM }}>+ Add Product</button>
                </div>
            </div>

            <span style={{ fontSize: "0.72rem", color: C.muted, fontFamily: FO, marginBottom: "1rem", display: "block" }}>{filtered.length} products</span>

            {/* ── GRID VIEW ── */}
            {viewMode === "grid" && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
                    {filtered.map(product => {
                        const isSelected = selectedIds.has(product.id);
                        const hasSale = product.compare_at_price && product.compare_at_price > product.price;
                        const discountPct = hasSale ? Math.round((1 - product.price / product.compare_at_price!) * 100) : 0;

                        return (
                            <div key={product.id} style={{
                                background: C.card, border: `1px solid ${isSelected ? C.accent : C.border}`,
                                borderRadius: 10, overflow: "hidden", opacity: product.is_active ? 1 : 0.55,
                                transition: "all 0.2s", position: "relative",
                            }}>
                                {/* Checkbox */}
                                <div style={{ position: "absolute", top: 8, left: 8, zIndex: 2 }}>
                                    <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(product.id)} style={{ width: 18, height: 18, accentColor: C.accent, cursor: "pointer" }} />
                                </div>

                                {/* Badges */}
                                <div style={{ position: "absolute", top: 8, right: 8, zIndex: 2, display: "flex", gap: "0.3rem" }}>
                                    {hasSale && <span style={{ background: C.red, color: "#fff", fontSize: "0.55rem", fontWeight: 900, fontFamily: FM, padding: "2px 6px", borderRadius: 4 }}>-{discountPct}%</span>}
                                    {product.is_new && <span style={{ background: C.accent, color: "#111", fontSize: "0.55rem", fontWeight: 900, fontFamily: FM, padding: "2px 6px", borderRadius: 4 }}>NEW</span>}
                                    {!product.is_active && <span style={{ background: `${C.red}cc`, color: "#fff", fontSize: "0.55rem", fontWeight: 900, fontFamily: FM, padding: "2px 6px", borderRadius: 4 }}>HIDDEN</span>}
                                </div>

                                {/* Image */}
                                <div style={{ aspectRatio: "4/3", background: "#111", overflow: "hidden", cursor: "pointer" }} onClick={() => onEditProduct(product)}>
                                    {product.image_url ? (
                                        <img src={product.image_url} alt={product.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }} />
                                    ) : (
                                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, fontSize: "2rem" }}>🖼</div>
                                    )}
                                </div>

                                {/* Info */}
                                <div style={{ padding: "1rem 1.25rem" }}>
                                    <p style={{ fontSize: "0.85rem", fontWeight: 700, color: C.text, fontFamily: FM, marginBottom: "0.15rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.title}</p>
                                    <p style={{ fontSize: "0.68rem", color: C.muted, fontFamily: FO, marginBottom: "0.5rem" }}>{product.category} · {product.finish}</p>

                                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                        <span style={{ fontSize: "1rem", fontWeight: 900, color: C.accent, fontFamily: FM }}>{fmt(product.price)}</span>
                                        {hasSale && <span style={{ fontSize: "0.72rem", color: C.muted, textDecoration: "line-through", fontFamily: FO }}>{fmt(product.compare_at_price!)}</span>}
                                    </div>

                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                                        <span style={{ fontSize: "0.68rem", color: product.stock_qty < 5 ? C.red : C.muted, fontFamily: FO }}>
                                            Qty: {product.stock_qty} · {product.stock_status}
                                        </span>
                                    </div>

                                    {/* Tags */}
                                    {product.tags && product.tags.length > 0 && (
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem", marginBottom: "0.75rem" }}>
                                            {product.tags.slice(0, 3).map(tag => (
                                                <span key={tag} style={{ fontSize: "0.55rem", padding: "0.15rem 0.4rem", background: `${C.accent}12`, border: `1px solid ${C.accent}22`, borderRadius: 10, color: C.accent, fontFamily: FM, fontWeight: 600 }}>{tag}</span>
                                            ))}
                                            {product.tags.length > 3 && <span style={{ fontSize: "0.55rem", color: C.muted, fontFamily: FO }}>+{product.tags.length - 3}</span>}
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div style={{ display: "flex", gap: "0.35rem", borderTop: `1px solid ${C.border}`, paddingTop: "0.75rem" }}>
                                        <button onClick={() => onEditProduct(product)} style={{ padding: "0.3rem 0.6rem", background: "transparent", border: `1px solid ${C.border}`, color: C.blue, fontSize: "0.6rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>Edit</button>
                                        <button onClick={() => toggleProductActive(product)} style={{ padding: "0.3rem 0.6rem", background: "transparent", border: `1px solid ${C.border}`, color: product.is_active ? C.red : C.green, fontSize: "0.6rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                                            {product.is_active ? "Hide" : "Show"}
                                        </button>
                                        <button onClick={() => duplicateProduct(product)} style={{ padding: "0.3rem 0.6rem", background: "transparent", border: `1px solid ${C.border}`, color: C.purple, fontSize: "0.6rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>Copy</button>
                                        {deleteConfirm === product.id ? (
                                            <>
                                                <button onClick={() => { deleteProduct(product.id); setDeleteConfirm(null); }} style={{ padding: "0.3rem 0.6rem", background: C.red, border: "none", color: "#fff", fontSize: "0.6rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4 }}>Yes</button>
                                                <button onClick={() => setDeleteConfirm(null)} style={{ padding: "0.3rem 0.6rem", background: "transparent", border: `1px solid ${C.border}`, color: C.muted, fontSize: "0.6rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4 }}>✕</button>
                                            </>
                                        ) : (
                                            <button onClick={() => setDeleteConfirm(product.id)} style={{ padding: "0.3rem 0.6rem", background: "transparent", border: `1px solid ${C.border}`, color: C.red, fontSize: "0.6rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4, marginLeft: "auto" }}>Del</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── TABLE VIEW ── */}
            {viewMode === "table" && (
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th style={{ padding: "0.75rem 0.5rem", textAlign: "center", borderBottom: `1px solid ${C.border}`, background: C.panel, width: 40 }}>
                                    <input type="checkbox" checked={filtered.length > 0 && selectedIds.size === filtered.length} onChange={toggleSelectAll} style={{ width: 16, height: 16, accentColor: C.accent, cursor: "pointer" }} />
                                </th>
                                {["Image", "Title", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
                                    <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, fontFamily: FM, borderBottom: `1px solid ${C.border}`, background: C.panel, whiteSpace: "nowrap" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(product => (
                                <tr key={product.id} style={{ borderBottom: `1px solid ${C.border}`, opacity: product.is_active ? 1 : 0.5, background: selectedIds.has(product.id) ? `${C.accent}08` : "transparent" }}>
                                    <td style={{ padding: "0.75rem 0.5rem", textAlign: "center" }}>
                                        <input type="checkbox" checked={selectedIds.has(product.id)} onChange={() => toggleSelect(product.id)} style={{ width: 16, height: 16, accentColor: C.accent, cursor: "pointer" }} />
                                    </td>
                                    <td style={{ padding: "0.5rem 1rem" }}>
                                        <div style={{ width: 48, height: 48, background: "#111", borderRadius: 6, overflow: "hidden" }}>
                                            {product.image_url && <img src={product.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                                        </div>
                                    </td>
                                    <td style={{ padding: "0.75rem 1rem" }}>
                                        <p style={{ fontSize: "0.82rem", fontWeight: 700, color: C.text, fontFamily: FM }}>{product.title}</p>
                                        <p style={{ fontSize: "0.68rem", color: C.muted, fontFamily: FO }}>{product.subtitle}</p>
                                    </td>
                                    <td style={{ padding: "0.75rem 1rem", fontSize: "0.78rem", color: C.muted }}>{product.category}</td>
                                    <td style={{ padding: "0.75rem 1rem" }}>
                                        <span style={{ fontWeight: 700, color: C.accent, fontFamily: FM, fontSize: "0.88rem" }}>{fmt(product.price)}</span>
                                        {product.compare_at_price && product.compare_at_price > product.price && (
                                            <span style={{ fontSize: "0.68rem", color: C.muted, textDecoration: "line-through", marginLeft: "0.4rem" }}>{fmt(product.compare_at_price)}</span>
                                        )}
                                    </td>
                                    <td style={{ padding: "0.75rem 1rem", fontSize: "0.82rem", color: product.stock_qty < 5 ? C.red : C.text }}>{product.stock_qty}</td>
                                    <td style={{ padding: "0.75rem 1rem" }}>
                                        <span style={{ display: "inline-block", padding: "0.2rem 0.6rem", borderRadius: 4, fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: FM, background: product.is_active ? `${C.green}22` : `${C.red}22`, color: product.is_active ? C.green : C.red }}>
                                            {product.is_active ? "Live" : "Hidden"}
                                        </span>
                                    </td>
                                    <td style={{ padding: "0.75rem 1rem" }}>
                                        <div style={{ display: "flex", gap: "0.3rem" }}>
                                            <button onClick={() => onEditProduct(product)} style={{ padding: "0.3rem 0.6rem", background: "transparent", border: `1px solid ${C.border}`, color: C.blue, fontSize: "0.62rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4 }}>Edit</button>
                                            <button onClick={() => toggleProductActive(product)} style={{ padding: "0.3rem 0.6rem", background: "transparent", border: `1px solid ${C.border}`, color: product.is_active ? C.red : C.green, fontSize: "0.62rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4 }}>
                                                {product.is_active ? "Hide" : "Show"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {filtered.length === 0 && (
                <p style={{ color: C.muted, fontFamily: FO, padding: "5rem", textAlign: "center" }}>No products found.</p>
            )}
        </div>
    );
}
