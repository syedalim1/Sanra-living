"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { FM, FO } from "../constants";

/* ─────────────────────────────────────────────────────────────
   LUXURY RELATED PRODUCTS SECTION
   Apple + IKEA inspired · Searchable · Drag-to-reorder
   Max 4 related products · Preview cards · Premium design
   ───────────────────────────────────────────────────────────── */

interface ProductMini {
    id: string;
    title: string;
    price: number;
    image_url: string;
    category: string;
    is_featured?: boolean;
    is_best_seller?: boolean;
    created_at?: string;
}

export interface RelatedProductsSectionProps {
    /** Currently selected related product IDs (slugs or IDs) */
    relatedProducts: string[];
    /** Called with the full updated list */
    onChange: (products: string[]) => void;
    /** Admin key for API calls */
    adminKey: string;
    /** Current product ID to exclude from search */
    currentProductId?: string;
    /** Section number */
    sectionNum?: number;
    /** Default open state */
    defaultOpen?: boolean;
}

export default function RelatedProductsSection({
    relatedProducts,
    onChange,
    adminKey,
    currentProductId,
    sectionNum = 5,
    defaultOpen = false,
}: RelatedProductsSectionProps) {
    const [allProducts, setAllProducts] = useState<ProductMini[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [dragIdx, setDragIdx] = useState<number | null>(null);
    const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    /* ── Fetch all products once ── */
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/admin/products", {
                    headers: { "x-admin-key": adminKey },
                });
                if (!res.ok) throw new Error();
                const data = await res.json();
                setAllProducts(
                    (data.products ?? []).map((p: any) => ({
                        id: p.id,
                        title: p.title,
                        price: p.price,
                        image_url: p.image_url ?? "",
                        category: p.category ?? "",
                        is_featured: p.is_featured,
                        is_best_seller: p.is_best_seller,
                        created_at: p.created_at,
                    }))
                );
            } catch {
                /* silent */
            } finally {
                setLoading(false);
            }
        })();
    }, [adminKey]);

    /* ── Click outside to close dropdown ── */
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    /* ── Filtered search results ── */
    const searchResults = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();
        return allProducts
            .filter(p =>
                p.id !== currentProductId &&
                !relatedProducts.includes(p.id) &&
                (q === "" || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
            )
            .slice(0, 8);
    }, [allProducts, searchQuery, relatedProducts, currentProductId]);

    /* ── Recently added products (for suggestions) ── */
    const recentProducts = useMemo(() => {
        return allProducts
            .filter(p => p.id !== currentProductId && !relatedProducts.includes(p.id))
            .sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))
            .slice(0, 4);
    }, [allProducts, relatedProducts, currentProductId]);

    /* ── Selected product details ── */
    const selectedDetails = useMemo(() => {
        return relatedProducts
            .map(id => allProducts.find(p => p.id === id))
            .filter(Boolean) as ProductMini[];
    }, [relatedProducts, allProducts]);

    /* ── Handlers ── */
    const addProduct = useCallback((id: string) => {
        if (relatedProducts.length >= 4) return;
        if (relatedProducts.includes(id)) return;
        onChange([...relatedProducts, id]);
        setSearchQuery("");
        setShowDropdown(false);
    }, [relatedProducts, onChange]);

    const removeProduct = useCallback((id: string) => {
        onChange(relatedProducts.filter(x => x !== id));
    }, [relatedProducts, onChange]);

    /* ── Drag reorder ── */
    const handleDragStart = useCallback((idx: number) => {
        setDragIdx(idx);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent, idx: number) => {
        e.preventDefault();
        setDragOverIdx(idx);
    }, []);

    const handleDrop = useCallback((idx: number) => {
        if (dragIdx === null || dragIdx === idx) {
            setDragIdx(null);
            setDragOverIdx(null);
            return;
        }
        const updated = [...relatedProducts];
        const [moved] = updated.splice(dragIdx, 1);
        updated.splice(idx, 0, moved);
        onChange(updated);
        setDragIdx(null);
        setDragOverIdx(null);
    }, [dragIdx, relatedProducts, onChange]);

    const fmtPrice = (n: number) => `₹${Number(n).toLocaleString("en-IN")}`;

    const [isOpen, setIsOpen] = useState(defaultOpen);
    const contentRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLButtonElement>(null);
    const [contentHeight, setContentHeight] = useState<number>(0);
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        if (contentRef.current) setContentHeight(contentRef.current.scrollHeight);
    }, [relatedProducts, searchResults, recentProducts, showDropdown]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsSticky(!entry.isIntersecting && isOpen),
            { threshold: 0, rootMargin: "-1px 0px 0px 0px" }
        );
        const sentinel = document.getElementById(`rps-sentinel-${sectionNum}`);
        if (sentinel) observer.observe(sentinel);
        return () => observer.disconnect();
    }, [isOpen, sectionNum]);

    return (
        <>
            <div id={`rps-sentinel-${sectionNum}`} style={{ height: 0 }} />
            <div className={`bpi-section${isOpen ? " bpi-open" : ""}`}>
            <style>{`
                .rp-card {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 0.85rem 1rem;
                    background: #FAFAF8;
                    border: 1.5px solid #E8E4DC;
                    border-radius: 14px;
                    transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
                    cursor: grab;
                    user-select: none;
                    -webkit-tap-highlight-color: transparent;
                }
                .rp-card:hover {
                    border-color: #C8B89A;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.06);
                    transform: translateY(-1px);
                }
                .rp-card--dragging {
                    opacity: 0.5;
                    transform: scale(0.97);
                }
                .rp-card--drag-over {
                    border-color: #111 !important;
                    box-shadow: 0 0 0 2px rgba(17,17,17,0.12) !important;
                }
                .rp-search-item {
                    display: flex;
                    align-items: center;
                    gap: 0.85rem;
                    padding: 0.7rem 1rem;
                    cursor: pointer;
                    transition: background 0.12s ease;
                    border-bottom: 1px solid #F5F3EF;
                }
                .rp-search-item:last-child { border-bottom: none; }
                .rp-search-item:hover { background: #F9F7F3; }
                .rp-empty-slot {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1.25rem;
                    border: 2px dashed #E8E4DC;
                    border-radius: 14px;
                    cursor: pointer;
                    transition: all 0.18s ease;
                    background: #FDFDFC;
                }
                .rp-empty-slot:hover {
                    border-color: #C8B89A;
                    background: #FAF8F4;
                }
                @media (max-width: 640px) {
                    .rp-grid { grid-template-columns: 1fr !important; }
                    .rp-suggestions-grid { grid-template-columns: 1fr 1fr !important; }
                }
            `}</style>

            {/* ── Header ── */}
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
                        <span className="bpi-title">Related Products</span>
                        {!isOpen && relatedProducts.length > 0 && (
                            <span className="bpi-title-preview">— {relatedProducts.length} selected</span>
                        )}
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span style={{
                        padding: "0.3rem 0.85rem", borderRadius: 99,
                        background: relatedProducts.length > 0 ? "#111" : "#F0EDE8",
                        color: relatedProducts.length > 0 ? "#fff" : "#9C9485",
                        fontSize: "0.68rem", fontWeight: 700, fontFamily: FM, letterSpacing: "0.06em",
                        transition: "all 0.2s",
                    }}>
                        {relatedProducts.length} / 4
                    </span>
                    <span className={`bpi-arrow${isOpen ? " bpi-arrow-open" : ""}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </span>
                </div>
            </button>

            <div
                className="bpi-body"
                style={{
                    maxHeight: isOpen ? `${contentHeight + 80}px` : "0px",
                    opacity: isOpen ? 1 : 0,
                }}
            >
                <div ref={contentRef} className="bpi-inner" style={{ padding: "1.75rem" }}>

                {/* ── Search ── */}
                {relatedProducts.length < 4 && (
                    <div ref={searchRef} style={{ position: "relative", marginBottom: "1.5rem" }}>
                        <div style={{
                            display: "flex", alignItems: "center", gap: "0.75rem",
                            background: "#FAFAF8", border: "1.5px solid #E8E4DC", borderRadius: "12px",
                            padding: "0.75rem 1rem", transition: "border-color 0.2s",
                            ...(showDropdown ? { borderColor: "#111", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" } : {}),
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9C9485" strokeWidth="2.5">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input
                                ref={inputRef}
                                value={searchQuery}
                                onChange={e => { setSearchQuery(e.target.value); setShowDropdown(true); }}
                                onFocus={() => setShowDropdown(true)}
                                placeholder="Search products by name or category..."
                                style={{
                                    flex: 1, border: "none", outline: "none", background: "transparent",
                                    fontSize: "0.85rem", fontFamily: FO, color: "#111",
                                }}
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => { setSearchQuery(""); inputRef.current?.focus(); }}
                                    style={{ background: "none", border: "none", color: "#9C9485", cursor: "pointer", padding: 0, fontSize: "0.8rem" }}
                                >✕</button>
                            )}
                        </div>

                        {/* ── Dropdown results ── */}
                        {showDropdown && (
                            <div style={{
                                position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
                                background: "#fff", border: "1px solid #E8E4DC", borderRadius: "12px",
                                boxShadow: "0 12px 40px rgba(0,0,0,0.12)", zIndex: 50,
                                maxHeight: 320, overflowY: "auto",
                            }}>
                                {loading ? (
                                    <div style={{ padding: "1.5rem", textAlign: "center", color: "#9C9485", fontSize: "0.8rem", fontFamily: FO }}>
                                        Loading products…
                                    </div>
                                ) : searchResults.length === 0 ? (
                                    <div style={{ padding: "1.5rem", textAlign: "center", color: "#9C9485", fontSize: "0.8rem", fontFamily: FO }}>
                                        {searchQuery ? "No products found" : "All products are already linked"}
                                    </div>
                                ) : (
                                    <>
                                        {searchQuery === "" && (
                                            <div style={{ padding: "0.6rem 1rem 0.3rem", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9C9485", fontFamily: FM }}>
                                                Suggested Products
                                            </div>
                                        )}
                                        {searchResults.map(p => (
                                            <div
                                                key={p.id}
                                                className="rp-search-item"
                                                onClick={() => addProduct(p.id)}
                                            >
                                                <div style={{
                                                    width: 44, height: 44, borderRadius: 8, overflow: "hidden",
                                                    background: "#F3F0EB", flexShrink: 0, border: "1px solid #E8E4DC",
                                                }}>
                                                    {p.image_url ? (
                                                        <img src={p.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                    ) : (
                                                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#C8B89A", fontSize: "0.7rem" }}>—</div>
                                                    )}
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{ fontSize: "0.8rem", fontWeight: 600, fontFamily: FM, color: "#111", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                        {p.title}
                                                    </p>
                                                    <p style={{ fontSize: "0.65rem", color: "#9C9485", fontFamily: FO, margin: "0.1rem 0 0" }}>
                                                        {p.category} · {fmtPrice(p.price)}
                                                    </p>
                                                </div>
                                                <div style={{
                                                    width: 24, height: 24, borderRadius: "50%", border: "1.5px solid #E8E4DC",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    color: "#9C9485", fontSize: "0.85rem", flexShrink: 0,
                                                    transition: "all 0.15s",
                                                }}>+</div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* ── Selected products grid ── */}
                <div
                    className="rp-grid"
                    style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.5rem" }}
                >
                    {selectedDetails.map((p, idx) => (
                        <div
                            key={p.id}
                            className={`rp-card${dragIdx === idx ? " rp-card--dragging" : ""}${dragOverIdx === idx ? " rp-card--drag-over" : ""}`}
                            draggable
                            onDragStart={() => handleDragStart(idx)}
                            onDragOver={e => handleDragOver(e, idx)}
                            onDrop={() => handleDrop(idx)}
                            onDragEnd={() => { setDragIdx(null); setDragOverIdx(null); }}
                        >
                            {/* Drag handle */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 2, cursor: "grab", padding: "0 2px", flexShrink: 0 }}>
                                {[0, 1, 2].map(i => (
                                    <div key={i} style={{ display: "flex", gap: 2 }}>
                                        <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#C8B89A" }} />
                                        <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#C8B89A" }} />
                                    </div>
                                ))}
                            </div>

                            {/* Image */}
                            <div style={{
                                width: 52, height: 52, borderRadius: 10, overflow: "hidden",
                                background: "#F3F0EB", flexShrink: 0, border: "1px solid #E8E4DC",
                            }}>
                                {p.image_url ? (
                                    <img src={p.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#C8B89A", fontSize: "0.8rem" }}>📦</div>
                                )}
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.15rem" }}>
                                    <p style={{ fontSize: "0.78rem", fontWeight: 700, fontFamily: FM, color: "#111", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {p.title}
                                    </p>
                                    {(p.is_featured || p.is_best_seller) && (
                                        <span style={{
                                            fontSize: "0.5rem", fontWeight: 700, fontFamily: FM,
                                            padding: "0.1rem 0.35rem", borderRadius: 4,
                                            background: p.is_best_seller ? "#FFF5F0" : "#FDF6E3",
                                            color: p.is_best_seller ? "#8B2500" : "#B8860B",
                                            textTransform: "uppercase", letterSpacing: "0.06em",
                                            flexShrink: 0,
                                        }}>
                                            {p.is_best_seller ? "BEST" : "★"}
                                        </span>
                                    )}
                                </div>
                                <p style={{ fontSize: "0.68rem", color: "#9C9485", fontFamily: FO, margin: 0 }}>
                                    {p.category} · {fmtPrice(p.price)}
                                </p>
                            </div>

                            {/* Remove button */}
                            <button
                                type="button"
                                onClick={e => { e.stopPropagation(); removeProduct(p.id); }}
                                style={{
                                    width: 24, height: 24, borderRadius: "50%", border: "1.5px solid #E8E4DC",
                                    background: "transparent", color: "#9C9485", fontSize: "0.7rem",
                                    cursor: "pointer", flexShrink: 0, display: "flex",
                                    alignItems: "center", justifyContent: "center",
                                    transition: "all 0.15s",
                                }}
                                onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = "#EF4444"; (e.target as HTMLElement).style.color = "#EF4444"; }}
                                onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = "#E8E4DC"; (e.target as HTMLElement).style.color = "#9C9485"; }}
                                aria-label={`Remove ${p.title}`}
                            >✕</button>
                        </div>
                    ))}

                    {/* Empty slots */}
                    {Array.from({ length: Math.max(0, (relatedProducts.length === 0 ? 2 : 4) - selectedDetails.length) }).map((_, i) => (
                        <div
                            key={`empty-${i}`}
                            className="rp-empty-slot"
                            onClick={() => inputRef.current?.focus()}
                        >
                            <div style={{ textAlign: "center" }}>
                                <div style={{ fontSize: "1.2rem", marginBottom: "0.3rem", opacity: 0.4 }}>+</div>
                                <p style={{ fontSize: "0.65rem", color: "#C8B89A", fontFamily: FO, margin: 0 }}>
                                    Add product
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Recently Added Suggestions ── */}
                {relatedProducts.length < 4 && recentProducts.length > 0 && (
                    <div>
                        <div style={{
                            display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem",
                        }}>
                            <div style={{ flex: 1, height: 1, background: "#F0EDE8" }} />
                            <span style={{
                                fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.2em",
                                textTransform: "uppercase", color: "#9C9485", fontFamily: FM, whiteSpace: "nowrap",
                            }}>Recently Added</span>
                            <div style={{ flex: 1, height: 1, background: "#F0EDE8" }} />
                        </div>

                        <div className="rp-suggestions-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.6rem" }}>
                            {recentProducts.map(p => (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => addProduct(p.id)}
                                    style={{
                                        background: "#FAFAF8", border: "1.5px solid #E8E4DC", borderRadius: 12,
                                        padding: "0.6rem", cursor: "pointer", textAlign: "center",
                                        transition: "all 0.18s ease",
                                    }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#C8B89A"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#E8E4DC"; (e.currentTarget as HTMLElement).style.transform = "none"; }}
                                >
                                    <div style={{
                                        width: "100%", aspectRatio: "1", borderRadius: 8, overflow: "hidden",
                                        background: "#F3F0EB", marginBottom: "0.4rem", border: "1px solid #E8E4DC",
                                    }}>
                                        {p.image_url ? (
                                            <img src={p.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        ) : (
                                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#C8B89A", fontSize: "1rem" }}>📦</div>
                                        )}
                                    </div>
                                    <p style={{ fontSize: "0.62rem", fontWeight: 600, fontFamily: FM, color: "#111", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {p.title}
                                    </p>
                                    <p style={{ fontSize: "0.55rem", color: "#9C9485", fontFamily: FO, margin: "0.1rem 0 0" }}>
                                        {fmtPrice(p.price)}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Footer hint ── */}
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    paddingTop: "1rem", borderTop: "1px solid #F0EDE8", marginTop: relatedProducts.length < 4 && recentProducts.length > 0 ? "1.25rem" : "0",
                }}>
                    <p style={{ fontSize: "0.65rem", color: "#9C9485", fontFamily: FO, margin: 0 }}>
                        Drag cards to reorder priority
                    </p>
                    {relatedProducts.length > 0 && (
                        <button
                            type="button"
                            onClick={() => onChange([])}
                            style={{
                                background: "none", border: "none", color: "#9C9485", fontSize: "0.65rem",
                                fontFamily: FM, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                                cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px", padding: 0,
                            }}
                        >Clear All</button>
                    )}
                </div>
            </div>
                </div>
            </div>
        </>
    );
}
