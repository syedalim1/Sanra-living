"use client";

import React, { useState } from "react";
import { C, fmt, CATEGORIES } from "../constants";
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
        <div className="flex flex-col gap-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center sticky top-0 z-40 bg-[var(--ap-bg)]/95 backdrop-blur-sm py-3">
                <input
                    placeholder="Search products…"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full sm:max-w-[300px] px-4 py-2.5 bg-white border border-[var(--ap-border)] text-[var(--ap-text)] text-sm font-[family-name:var(--ap-font-body)] rounded-lg outline-none focus:border-[var(--ap-accent)] transition-colors"
                />
                <select
                    value={productCategoryFilter}
                    onChange={e => setProductCategoryFilter(e.target.value)}
                    className="w-full sm:max-w-[200px] px-4 py-2.5 bg-white border border-[var(--ap-border)] text-[var(--ap-text)] text-sm font-[family-name:var(--ap-font-body)] rounded-lg outline-none cursor-pointer"
                >
                    <option value="all">All Categories</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="hidden sm:block ml-auto">
                    <button
                        onClick={onAddProduct}
                        className="px-6 py-3 bg-[var(--ap-accent)] text-white font-extrabold text-sm tracking-wider uppercase border-none cursor-pointer rounded-lg font-[family-name:var(--ap-font-heading)] hover:bg-[#222] transition-colors"
                    >
                        + Add Product
                    </button>
                </div>
            </div>

            <p className="text-sm text-[var(--ap-muted)] font-[family-name:var(--ap-font-body)]">
                {filtered.length} products
            </p>

            {/* Desktop: Table layout */}
            <div className="hidden md:block bg-white rounded-xl border border-[var(--ap-border)] shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
                {/* Table header */}
                <div className="grid grid-cols-[80px_3fr_1.5fr_1fr_1fr_150px] gap-4 px-5 py-3.5 text-xs font-bold tracking-[0.1em] uppercase text-[var(--ap-muted)] font-[family-name:var(--ap-font-heading)] border-b border-[var(--ap-border)] bg-[#fafafa] rounded-t-xl">
                    <div>Image</div>
                    <div>Name</div>
                    <div>Price</div>
                    <div>Stock</div>
                    <div>Status</div>
                    <div>Actions</div>
                </div>

                {filtered.map(product => (
                    <div key={product.id} className="grid grid-cols-[80px_3fr_1.5fr_1fr_1fr_150px] gap-4 items-center px-5 py-3 bg-white border-b border-[var(--ap-border)] last:border-b-0 last:rounded-b-xl hover:bg-[#fafafa] transition-colors">
                        {/* Image */}
                        <div className="w-14 h-14 bg-[#f0f0f0] rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                            {product.image_url ? (
                                <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-[#ccc] text-xl">🖼</div>
                            )}
                        </div>

                        {/* Name */}
                        <div>
                            <h3 className="text-[0.95rem] font-bold text-[var(--ap-text)] font-[family-name:var(--ap-font-heading)] m-0 line-clamp-2 leading-tight" title={product.title}>
                                {product.title}
                            </h3>
                            <p className="text-sm text-[var(--ap-muted)] font-[family-name:var(--ap-font-body)] mt-1">{product.category}</p>
                        </div>

                        {/* Price */}
                        <span className="font-extrabold text-[var(--ap-text)] font-[family-name:var(--ap-font-heading)] text-base">{fmt(product.price)}</span>

                        {/* Stock */}
                        <span className={`text-base font-bold font-[family-name:var(--ap-font-heading)] ${product.stock_qty <= 5 ? "text-[var(--ap-danger)]" : "text-[var(--ap-text)]"}`}>
                            {product.stock_qty}
                        </span>

                        {/* Status */}
                        <span className={`inline-block px-3 py-1 rounded-md text-[0.7rem] font-bold tracking-wider uppercase font-[family-name:var(--ap-font-heading)] w-fit ${product.is_active ? "bg-[#10B98118] text-[#10B981]" : "bg-[#EF444418] text-[#EF4444]"}`}>
                            {product.is_active ? "Active" : "Hidden"}
                        </span>

                        {/* Actions */}
                        <div className="flex gap-2 items-center">
                            <button
                                className="px-3.5 py-1.5 bg-white border border-[var(--ap-border)] text-[var(--ap-text)] text-xs font-bold font-[family-name:var(--ap-font-heading)] cursor-pointer rounded-md hover:border-[var(--ap-accent)] transition-colors"
                                onClick={() => onEditProduct(product)}
                            >
                                Edit
                            </button>
                            {deleteConfirm === product.id ? (
                                <>
                                    <button
                                        className="px-3.5 py-1.5 bg-[var(--ap-danger)] text-white border border-[var(--ap-danger)] text-xs font-bold font-[family-name:var(--ap-font-heading)] cursor-pointer rounded-md"
                                        onClick={() => { deleteProduct(product.id); setDeleteConfirm(null); }}
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        className="px-3.5 py-1.5 bg-white border border-[var(--ap-border)] text-[var(--ap-muted)] text-xs font-bold font-[family-name:var(--ap-font-heading)] cursor-pointer rounded-md"
                                        onClick={() => setDeleteConfirm(null)}
                                    >
                                        ✕
                                    </button>
                                </>
                            ) : (
                                <button
                                    className="px-3.5 py-1.5 bg-white border border-[var(--ap-border)] text-[var(--ap-danger)] text-xs font-bold font-[family-name:var(--ap-font-heading)] cursor-pointer rounded-md hover:border-[var(--ap-danger)] hover:bg-[#EF44440A] transition-colors"
                                    onClick={() => setDeleteConfirm(product.id)}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile: Card layout */}
            <div className="flex flex-col gap-3 md:hidden">
                {filtered.map(product => (
                    <div key={product.id} className="bg-white border border-[var(--ap-border)] rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                        {/* Top: Image + Name */}
                        <div className="flex gap-3 mb-3">
                            <div className="w-20 h-20 bg-[#f0f0f0] rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                                {product.image_url ? (
                                    <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-[#ccc] text-xl">🖼</div>
                                )}
                            </div>
                            <div className="flex-1 flex flex-col justify-center min-w-0">
                                <h3 className="text-[0.95rem] font-bold text-[var(--ap-text)] font-[family-name:var(--ap-font-heading)] m-0 line-clamp-2 leading-tight" title={product.title}>
                                    {product.title}
                                </h3>
                                <p className="text-sm text-[var(--ap-muted)] font-[family-name:var(--ap-font-body)] mt-1">{product.category}</p>
                            </div>
                        </div>

                        {/* Stats row */}
                        <div className="grid grid-cols-3 gap-3 py-3 border-y border-[var(--ap-border-light)]">
                            <div>
                                <span className="block text-[0.65rem] font-bold font-[family-name:var(--ap-font-heading)] text-[var(--ap-muted)] uppercase tracking-wider mb-1">Price</span>
                                <span className="font-extrabold text-[var(--ap-text)] font-[family-name:var(--ap-font-heading)]">{fmt(product.price)}</span>
                            </div>
                            <div>
                                <span className="block text-[0.65rem] font-bold font-[family-name:var(--ap-font-heading)] text-[var(--ap-muted)] uppercase tracking-wider mb-1">Stock</span>
                                <span className={`font-bold font-[family-name:var(--ap-font-heading)] ${product.stock_qty <= 5 ? "text-[var(--ap-danger)]" : "text-[var(--ap-text)]"}`}>
                                    {product.stock_qty}
                                </span>
                            </div>
                            <div>
                                <span className="block text-[0.65rem] font-bold font-[family-name:var(--ap-font-heading)] text-[var(--ap-muted)] uppercase tracking-wider mb-1">Status</span>
                                <span className={`inline-block px-2.5 py-0.5 rounded-md text-[0.65rem] font-bold uppercase font-[family-name:var(--ap-font-heading)] ${product.is_active ? "bg-[#10B98118] text-[#10B981]" : "bg-[#EF444418] text-[#EF4444]"}`}>
                                    {product.is_active ? "Active" : "Hidden"}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-2 mt-3">
                            <button
                                className="w-full py-3 bg-white border border-[var(--ap-border)] text-[var(--ap-text)] text-sm font-bold font-[family-name:var(--ap-font-heading)] cursor-pointer rounded-lg text-center"
                                onClick={() => onEditProduct(product)}
                            >
                                Edit
                            </button>
                            {deleteConfirm === product.id ? (
                                <>
                                    <button
                                        className="w-full py-3 bg-[var(--ap-danger)] text-white border border-[var(--ap-danger)] text-sm font-bold font-[family-name:var(--ap-font-heading)] cursor-pointer rounded-lg"
                                        onClick={() => { deleteProduct(product.id); setDeleteConfirm(null); }}
                                    >
                                        Confirm
                                    </button>
                                </>
                            ) : (
                                <button
                                    className="w-full py-3 bg-white border border-[var(--ap-border)] text-[var(--ap-danger)] text-sm font-bold font-[family-name:var(--ap-font-heading)] cursor-pointer rounded-lg"
                                    onClick={() => setDeleteConfirm(product.id)}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <p className="text-[var(--ap-muted)] font-[family-name:var(--ap-font-body)] p-16 text-center text-base">No products found.</p>
            )}

            {/* Mobile Floating Action Button */}
            <button
                className="fixed bottom-[calc(80px+env(safe-area-inset-bottom,0px))] right-4 w-[52px] h-[52px] bg-[var(--ap-accent)] text-white rounded-full shadow-[0_6px_20px_rgba(17,17,17,0.3)] z-[190] text-2xl cursor-pointer border-none flex items-center justify-center md:hidden active:scale-90 transition-transform"
                style={{ transitionTimingFunction: "var(--ap-spring)" }}
                onClick={onAddProduct}
            >
                +
            </button>
        </div>
    );
}
