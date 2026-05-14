"use client";

import React, { useState, useRef, useEffect } from "react";
import { CATEGORIES } from "../constants";

/* ── Collections & Constants ── */
const COLLECTIONS = [
    "Core Collection",
    "Premium Line",
    "Signature Series",
    "Essentials",
    "Limited Edition",
    "Commercial Grade",
    "Outdoor Living",
];

const STOCK_STATUSES = ["In Stock", "Out of Stock", "Pre Order", "Limited"];

interface BasicProductInfoProps {
    title: string;
    subtitle: string;
    category: string;
    stockStatus: string;
    price: string;
    comparePrice: string;
    collection: string;
    isFeatured: boolean;
    isBestSeller: boolean;
    onChange: (field: string, value: unknown) => void;
    /** Section number for accordion display */
    sectionNum?: number;
    /** Default open state */
    defaultOpen?: boolean;
}

export default function BasicProductInfo({
    title,
    subtitle,
    category,
    stockStatus,
    price,
    comparePrice,
    collection,
    isFeatured,
    isBestSeller,
    onChange,
    sectionNum = 1,
    defaultOpen = true,
}: BasicProductInfoProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const contentRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLButtonElement>(null);
    const [contentHeight, setContentHeight] = useState<number>(0);
    const [isSticky, setIsSticky] = useState(false);

    /* ── Measure content height for smooth animation ── */
    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }
    }, [title, subtitle, category, stockStatus, price, comparePrice, collection, isFeatured, isBestSeller]);

    /* ── Sticky header detection ── */
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsSticky(!entry.isIntersecting && isOpen);
            },
            { threshold: 0, rootMargin: "-1px 0px 0px 0px" }
        );

        const sentinel = document.getElementById(`bpi-sentinel-${sectionNum}`);
        if (sentinel) observer.observe(sentinel);

        return () => observer.disconnect();
    }, [isOpen, sectionNum]);

    /* ── Discount calculation ── */
    const discountPct =
        comparePrice &&
        price &&
        Number(comparePrice) > Number(price)
            ? Math.round((1 - Number(price) / Number(comparePrice)) * 100)
            : null;

    return (
        <>
            {/* Sentinel element for sticky detection */}
            <div id={`bpi-sentinel-${sectionNum}`} style={{ height: 0 }} />

            <div className={`bpi-section${isOpen ? " bpi-open" : ""}`}>
                {/* ── Accordion Header ── */}
                <button
                    ref={headerRef}
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`bpi-header${isSticky ? " bpi-header-sticky" : ""}`}
                >
                    <div className="bpi-header-left">
                        <span className={`bpi-num${isOpen ? " bpi-num-active" : ""}`}>
                            {sectionNum}
                        </span>
                        <div>
                            <span className="bpi-title">Basic Product Info</span>
                            {!isOpen && title && (
                                <span className="bpi-title-preview">— {title}</span>
                            )}
                        </div>
                    </div>
                    <span className={`bpi-arrow${isOpen ? " bpi-arrow-open" : ""}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </span>
                </button>

                {/* ── Accordion Body with smooth animation ── */}
                <div
                    className="bpi-body"
                    style={{
                        maxHeight: isOpen ? `${contentHeight + 80}px` : "0px",
                        opacity: isOpen ? 1 : 0,
                    }}
                >
                    <div ref={contentRef} className="bpi-inner">
                        {/* ── ROW 1: Product Title (Full Width) ── */}
                        <div className="bpi-grid bpi-grid-full">
                            <div className="bpi-field bpi-full">
                                <label className="bpi-label">
                                    Product Title
                                    <span className="bpi-required">*</span>
                                </label>
                                <input
                                    value={title}
                                    onChange={(e) => onChange("title", e.target.value)}
                                    className="bpi-input bpi-input-title"
                                    placeholder="e.g. SL Edge Premium Shelf"
                                    required
                                />
                                <span className="bpi-hint">
                                    {title.length}/80 characters · Keep it clear and descriptive
                                </span>
                            </div>
                        </div>

                        {/* ── ROW 2: Subtitle (Full Width) ── */}
                        <div className="bpi-grid bpi-grid-full">
                            <div className="bpi-field bpi-full">
                                <label className="bpi-label">Subtitle</label>
                                <input
                                    value={subtitle}
                                    onChange={(e) => onChange("subtitle", e.target.value)}
                                    className="bpi-input"
                                    placeholder="Heavy Duty Everyday Use — Crafted for Modern Interiors"
                                />
                            </div>
                        </div>

                        {/* ── Divider ── */}
                        <div className="bpi-divider" />

                        {/* ── ROW 3: Category + Collection (2 columns) ── */}
                        <div className="bpi-grid bpi-grid-2">
                            <div className="bpi-field">
                                <label className="bpi-label">
                                    Category
                                    <span className="bpi-required">*</span>
                                </label>
                                <div className="bpi-select-wrapper">
                                    <select
                                        value={category}
                                        onChange={(e) => onChange("category", e.target.value)}
                                        className="bpi-select"
                                    >
                                        {CATEGORIES.map((c) => (
                                            <option key={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="bpi-field">
                                <label className="bpi-label">Collection</label>
                                <div className="bpi-select-wrapper">
                                    <select
                                        value={collection}
                                        onChange={(e) => onChange("collection", e.target.value)}
                                        className="bpi-select"
                                    >
                                        <option value="">None</option>
                                        {COLLECTIONS.map((c) => (
                                            <option key={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* ── ROW 4: Stock Status (single col on mobile) ── */}
                        <div className="bpi-grid bpi-grid-2">
                            <div className="bpi-field">
                                <label className="bpi-label">Stock Status</label>
                                <div className="bpi-select-wrapper">
                                    <select
                                        value={stockStatus}
                                        onChange={(e) => onChange("stock_status", e.target.value)}
                                        className="bpi-select"
                                    >
                                        {STOCK_STATUSES.map((s) => (
                                            <option key={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                                <span className="bpi-hint">
                                    {stockStatus === "In Stock" && (
                                        <span className="bpi-stock-dot bpi-stock-green" />
                                    )}
                                    {stockStatus === "Out of Stock" && (
                                        <span className="bpi-stock-dot bpi-stock-red" />
                                    )}
                                    {stockStatus === "Limited" && (
                                        <span className="bpi-stock-dot bpi-stock-orange" />
                                    )}
                                    {stockStatus === "Pre Order" && (
                                        <span className="bpi-stock-dot bpi-stock-blue" />
                                    )}
                                    {stockStatus}
                                </span>
                            </div>
                        </div>

                        {/* ── Divider ── */}
                        <div className="bpi-divider" />

                        {/* ── ROW 5: Pricing (2 columns) ── */}
                        <div className="bpi-grid bpi-grid-2">
                            <div className="bpi-field">
                                <label className="bpi-label">
                                    Current Price
                                    <span className="bpi-required">*</span>
                                </label>
                                <div className="bpi-price-wrapper">
                                    <span className="bpi-currency">₹</span>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => onChange("price", e.target.value)}
                                        className="bpi-input bpi-input-price"
                                        placeholder="2,499"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="bpi-field">
                                <label className="bpi-label">Compare Price</label>
                                <div className="bpi-price-wrapper">
                                    <span className="bpi-currency bpi-currency-muted">₹</span>
                                    <input
                                        type="number"
                                        value={comparePrice}
                                        onChange={(e) => onChange("compare_at_price", e.target.value)}
                                        className="bpi-input bpi-input-price bpi-input-compare"
                                        placeholder="3,999"
                                    />
                                </div>
                                {discountPct !== null && discountPct > 0 && (
                                    <span className="bpi-discount-badge">
                                        {discountPct}% OFF
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* ── Divider ── */}
                        <div className="bpi-divider" />

                        {/* ── ROW 6: Toggles ── */}
                        <div className="bpi-toggles">
                            {/* Featured Product Toggle */}
                            <label className="bpi-toggle">
                                <div className="bpi-toggle-info">
                                    <span className="bpi-toggle-icon">⭐</span>
                                    <div>
                                        <span className="bpi-toggle-name">Featured Product</span>
                                        <span className="bpi-toggle-desc">Show on homepage & featured sections</span>
                                    </div>
                                </div>
                                <div
                                    className={`bpi-switch${isFeatured ? " bpi-switch-on" : ""}`}
                                    onClick={() => onChange("is_featured", !isFeatured)}
                                >
                                    <div className="bpi-switch-thumb" />
                                </div>
                            </label>

                            {/* Best Seller Toggle */}
                            <label className="bpi-toggle">
                                <div className="bpi-toggle-info">
                                    <span className="bpi-toggle-icon">🏆</span>
                                    <div>
                                        <span className="bpi-toggle-name">Best Seller</span>
                                        <span className="bpi-toggle-desc">Display best seller badge on product card</span>
                                    </div>
                                </div>
                                <div
                                    className={`bpi-switch${isBestSeller ? " bpi-switch-on" : ""}`}
                                    onClick={() => onChange("is_best_seller", !isBestSeller)}
                                >
                                    <div className="bpi-switch-thumb" />
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
