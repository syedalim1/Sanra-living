"use client";

import React from "react";
import { C, FM, FO, fmt, CATEGORIES } from "../constants";
import { Th, Td, inputStyle, selectStyle } from "../components/AdminUI";
import ProductEditModal from "../ProductEditModal";
import type { Product } from "../types";

interface Props {
    products: Product[];
    adminKey: string;
    searchQuery: string;
    setSearchQuery: (v: string) => void;
    productCategoryFilter: string;
    setProductCategoryFilter: (v: string) => void;
    showAddProduct: boolean;
    setShowAddProduct: (v: boolean | ((prev: boolean) => boolean)) => void;
    newProduct: {
        title: string; subtitle: string; price: string; category: string;
        finish: string; stock_status: string; stock_qty: string;
        image_url: string; hover_image_url: string; is_new: boolean;
    };
    setNewProduct: React.Dispatch<React.SetStateAction<Props["newProduct"]>>;
    addingProduct: boolean;
    handleAddProduct: (e: React.FormEvent) => void;
    editingProduct: Product | null;
    setEditingProduct: (p: Product | null) => void;
    deleteConfirm: string | null;
    setDeleteConfirm: (id: string | null) => void;
    toggleProductActive: (p: Product) => void;
    duplicateProduct: (p: Product) => void;
    deleteProduct: (id: string) => void;
    onProductSaved: (updated: Product) => void;
}

export default function ProductsTab({
    products, adminKey,
    searchQuery, setSearchQuery,
    productCategoryFilter, setProductCategoryFilter,
    showAddProduct, setShowAddProduct,
    newProduct, setNewProduct, addingProduct, handleAddProduct,
    editingProduct, setEditingProduct,
    deleteConfirm, setDeleteConfirm,
    toggleProductActive, duplicateProduct, deleteProduct, onProductSaved,
}: Props) {
    const filtered = products.filter(p => {
        const q = searchQuery.toLowerCase();
        const matchSearch = !q || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
        const matchCat = productCategoryFilter === "all" || p.category === productCategoryFilter;
        return matchSearch && matchCat;
    });

    return (
        <div>
            {/* Toolbar */}
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                <input placeholder="Search products…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ ...inputStyle, maxWidth: 280, padding: "0.5rem 0.875rem" }} />
                <select value={productCategoryFilter} onChange={e => setProductCategoryFilter(e.target.value)} style={{ ...selectStyle, maxWidth: 180, padding: "0.5rem 0.875rem" }}>
                    <option value="all">All Categories</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button
                    onClick={() => setShowAddProduct(v => !v)}
                    style={{ padding: "0.7rem 1.5rem", background: showAddProduct ? "transparent" : C.accent, color: showAddProduct ? C.muted : "#111", fontWeight: 900, fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", border: `1px solid ${showAddProduct ? C.border : C.accent}`, cursor: "pointer", borderRadius: 6, fontFamily: FM, marginLeft: "auto" }}
                >
                    {showAddProduct ? "✕ Cancel" : "+ Add Product"}
                </button>
            </div>

            {/* Add Product Form */}
            {showAddProduct && (
                <form onSubmit={handleAddProduct} style={{ background: C.card, border: `1px solid ${C.border}`, padding: "1.5rem", borderRadius: 10, marginBottom: "1.5rem" }}>
                    <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.accent, fontFamily: FM, marginBottom: "1.25rem" }}>New Product</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                        {[
                            { label: "Title *", key: "title" },
                            { label: "Subtitle", key: "subtitle" },
                            { label: "Price (₹) *", key: "price", type: "number" },
                            { label: "Stock Qty", key: "stock_qty", type: "number" },
                            { label: "Image URL", key: "image_url" },
                            { label: "Hover Image URL", key: "hover_image_url" },
                        ].map(({ label, key, type = "text" }) => (
                            <div key={key}>
                                <label style={{ display: "block", fontSize: "0.6rem", fontWeight: 700, color: C.muted, fontFamily: FM, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>{label}</label>
                                <input
                                    type={type} value={newProduct[key as keyof typeof newProduct] as string}
                                    onChange={e => setNewProduct(p => ({ ...p, [key]: e.target.value }))}
                                    style={{ ...inputStyle, width: "100%", boxSizing: "border-box", padding: "0.625rem 0.875rem" }}
                                />
                            </div>
                        ))}
                        <div>
                            <label style={{ display: "block", fontSize: "0.6rem", fontWeight: 700, color: C.muted, fontFamily: FM, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Category *</label>
                            <select value={newProduct.category} onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))} style={{ ...selectStyle, width: "100%", boxSizing: "border-box", padding: "0.625rem 0.875rem" }}>
                                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "0.6rem", fontWeight: 700, color: C.muted, fontFamily: FM, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Finish</label>
                            <select value={newProduct.finish} onChange={e => setNewProduct(p => ({ ...p, finish: e.target.value }))} style={{ ...selectStyle, width: "100%", boxSizing: "border-box", padding: "0.625rem 0.875rem" }}>
                                {["Matte Black", "Graphite Grey", "White", "Bronze"].map(f => <option key={f}>{f}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "0.6rem", fontWeight: 700, color: C.muted, fontFamily: FM, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Stock Status</label>
                            <select value={newProduct.stock_status} onChange={e => setNewProduct(p => ({ ...p, stock_status: e.target.value }))} style={{ ...selectStyle, width: "100%", boxSizing: "border-box", padding: "0.625rem 0.875rem" }}>
                                {["In Stock", "Only 12 Left", "Only 3 Left", "New", "Limited", "Out of Stock"].map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", paddingTop: "1.5rem" }}>
                            <input type="checkbox" id="is_new" checked={newProduct.is_new} onChange={e => setNewProduct(p => ({ ...p, is_new: e.target.checked }))} style={{ width: 16, height: 16, accentColor: C.accent }} />
                            <label htmlFor="is_new" style={{ fontSize: "0.82rem", color: C.text, fontFamily: FO, cursor: "pointer" }}>Mark as New Arrival</label>
                        </div>
                    </div>
                    <div style={{ marginTop: "1.25rem" }}>
                        <button type="submit" disabled={addingProduct} style={{ padding: "0.75rem 2rem", background: C.accent, color: "#111", fontWeight: 900, fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", border: "none", cursor: "pointer", borderRadius: 6, fontFamily: FM }}>
                            {addingProduct ? "Adding…" : "Add Product"}
                        </button>
                    </div>
                </form>
            )}

            {/* Products Table */}
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <Th>Title</Th><Th>Category</Th><Th>Price (₹)</Th>
                            <Th>Stock Qty</Th><Th>Stock Status</Th><Th>Finish</Th>
                            <Th>Status</Th><Th>Actions</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((product) => (
                            <tr key={product.id} style={{ borderBottom: `1px solid ${C.border}`, opacity: product.is_active ? 1 : 0.5, transition: "opacity 0.2s" }}>
                                <Td>
                                    <p style={{ fontSize: "0.85rem", fontWeight: 700, color: C.text, fontFamily: FM }}>{product.title}</p>
                                    <p style={{ fontSize: "0.7rem", color: C.muted, fontFamily: FO }}>{product.subtitle}</p>
                                </Td>
                                <Td><span style={{ fontSize: "0.78rem", color: C.muted }}>{product.category}</span></Td>
                                <Td><span style={{ fontWeight: 700, color: C.accent, fontFamily: FM, fontSize: "0.88rem" }}>{fmt(product.price)}</span></Td>
                                <Td><span style={{ fontSize: "0.82rem", color: C.text }}>{product.stock_qty}</span></Td>
                                <Td><span style={{ fontSize: "0.78rem", color: C.muted }}>{product.stock_status}</span></Td>
                                <Td><span style={{ fontSize: "0.78rem", color: C.muted }}>{product.finish}</span></Td>
                                <Td>
                                    <span style={{ display: "inline-block", padding: "0.2rem 0.6rem", borderRadius: 4, fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: FM, background: product.is_active ? `${C.green}22` : `${C.red}22`, color: product.is_active ? C.green : C.red }}>
                                        {product.is_active ? "Live" : "Hidden"}
                                    </span>
                                </Td>
                                <Td>
                                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                                        <button onClick={() => setEditingProduct(product)} style={{ padding: "0.35rem 0.75rem", background: "transparent", border: `1px solid ${C.border}`, color: C.blue, fontSize: "0.65rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>Edit</button>
                                        <button onClick={() => toggleProductActive(product)} style={{ padding: "0.35rem 0.75rem", background: "transparent", border: `1px solid ${C.border}`, color: product.is_active ? C.red : C.green, fontSize: "0.65rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                                            {product.is_active ? "Hide" : "Publish"}
                                        </button>
                                        <button onClick={() => duplicateProduct(product)} style={{ padding: "0.35rem 0.75rem", background: "transparent", border: `1px solid ${C.border}`, color: C.purple, fontSize: "0.65rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>Copy</button>
                                        {deleteConfirm === product.id ? (
                                            <>
                                                <button onClick={() => deleteProduct(product.id)} style={{ padding: "0.35rem 0.75rem", background: C.red, border: "none", color: "#fff", fontSize: "0.65rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>Confirm</button>
                                                <button onClick={() => setDeleteConfirm(null)} style={{ padding: "0.35rem 0.75rem", background: "transparent", border: `1px solid ${C.border}`, color: C.muted, fontSize: "0.65rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4 }}>✕</button>
                                            </>
                                        ) : (
                                            <button onClick={() => setDeleteConfirm(product.id)} style={{ padding: "0.35rem 0.75rem", background: "transparent", border: `1px solid ${C.border}`, color: C.red, fontSize: "0.65rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>Del</button>
                                        )}
                                    </div>
                                </Td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr><td colSpan={8} style={{ padding: "5rem", textAlign: "center", color: C.muted, fontFamily: FO }}>No products yet. Add one above.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {editingProduct && (
                <ProductEditModal
                    product={editingProduct}
                    adminKey={adminKey}
                    onClose={() => setEditingProduct(null)}
                    onSaved={(updated) => {
                        onProductSaved(updated);
                        setEditingProduct(null);
                    }}
                />
            )}
        </div>
    );
}
