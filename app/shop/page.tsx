"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

/* ── FONTS ─────────────────────────────────────────────────── */
const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

/* ── TOKENS ────────────────────────────────────────────────── */
const C = {
    black: "#111111",
    dark: "#1C1C1C",
    mid: "#555555",
    muted: "#888888",
    border: "#E8E8E8",
    bg: "#F5F5F5",
    white: "#FFFFFF",
};

/* ── TYPES ─────────────────────────────────────────────────── */
interface Product {
    id: string;
    title: string;
    subtitle: string;
    price: number;
    category: string;
    finish: string;
    stock_status: string;
    stock_qty: number;
    image_url: string;
    hover_image_url: string;
    is_new: boolean;
    is_active: boolean;
}

const categories = ["All", "Entryway Storage", "Study Desks", "Wall Storage"];
const priceRanges = ["All", "₹999 – ₹2999", "₹3000 – ₹7999", "₹8000+"];
const finishes = ["All", "Matte Black", "Graphite Grey"];
const availability = ["All", "In Stock", "Limited Stock"];
const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low", "Newest"];

/* ── STOCK BADGE ───────────────────────────────────────────── */
type StockStatus = "In Stock" | "Only 12 Left" | "Only 3 Left" | "New" | "Limited";

function StockBadge({ status }: { status: StockStatus }) {
    const map: Record<StockStatus, { label: string; bg: string; color: string; border?: string }> = {
        "In Stock": { label: "In Stock", bg: "#111", color: "#fff" },
        "Only 12 Left": { label: "Only 12 Left", bg: "#3a3a3a", color: "#fff" },
        "Only 3 Left": { label: "Only 3 Left", bg: "#1C1C1C", color: "#fff" },
        "New": { label: "New", bg: "#fff", color: "#111", border: "1px solid #111" },
        "Limited": { label: "Limited", bg: "#555", color: "#fff" },
    };
    const cfg = map[status] ?? { label: status, bg: "#555", color: "#fff" };
    return (
        <span style={{
            position: "absolute", top: 12, left: 12, zIndex: 10,
            fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
            padding: "0.3rem 0.65rem", background: cfg.bg, color: cfg.color,
            border: cfg.border ?? "none", fontFamily: FM,
        }}>
            {cfg.label}
        </span>
    );
}

/* ── PRODUCT CARD ──────────────────────────────────────────── */
function ProductCard({ product, index }: { product: Product; index: number }) {
    const [hovered, setHovered] = useState(false);
    const priceDisplay = `₹${product.price.toLocaleString("en-IN")}`;
    const stockStatus = product.stock_status as "In Stock" | "Only 12 Left" | "Only 3 Left" | "New" | "Limited";

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: C.white, display: "flex", flexDirection: "column", cursor: "pointer",
                boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.12)" : "0 2px 12px rgba(0,0,0,0.06)",
                transition: "box-shadow 0.3s ease, transform 0.3s ease",
                transform: hovered ? "translateY(-2px)" : "translateY(0)",
            }}
        >
            {/* Image Area */}
            <div style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden", background: "#F5F5F3" }}>
                <StockBadge status={stockStatus} />
                <img
                    src={product.image_url || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80"} alt={product.title} loading="lazy"
                    style={{
                        position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
                        opacity: hovered ? 0 : 1, transition: "opacity 0.6s ease"
                    }}
                />
                <img
                    src={product.hover_image_url || product.image_url || "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80"} alt="" loading="lazy"
                    style={{
                        position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
                        opacity: hovered ? 1 : 0, transition: "opacity 0.6s ease",
                        transform: hovered ? "scale(1.04)" : "scale(1)", transitionProperty: "opacity, transform",
                        transitionDuration: "0.6s"
                    }}
                />
            </div>

            {/* Card Body */}
            <div style={{ padding: "1.25rem 1.25rem 1.5rem", display: "flex", flexDirection: "column", flex: 1 }}>
                <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.18em", color: C.muted, textTransform: "uppercase", marginBottom: "0.375rem", fontFamily: FM }}>
                    {product.category}
                </p>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: C.black, letterSpacing: "0.02em", fontFamily: FM, marginBottom: "0.25rem", lineHeight: 1.3 }}>
                    {product.title}
                </h3>
                <p style={{ fontSize: "0.8rem", color: C.mid, fontWeight: 400, marginBottom: "1rem", fontFamily: FO, lineHeight: 1.4 }}>
                    {product.subtitle}
                </p>

                <div style={{ marginTop: "auto" }}>
                    <p style={{ fontSize: "1.25rem", fontWeight: 800, color: C.black, letterSpacing: "-0.02em", fontFamily: FM, marginBottom: "0.25rem" }}>
                        {priceDisplay}
                    </p>
                    <p style={{ fontSize: "0.63rem", fontWeight: 600, letterSpacing: "0.14em", color: C.muted, textTransform: "uppercase", marginBottom: "1rem", fontFamily: FM }}>
                        10 Year Warranty Included
                    </p>

                    <Link href={`/shop/${product.id}`} style={{ textDecoration: "none", display: "block" }}>
                        <button style={{
                            width: "100%", padding: "0.8rem", fontSize: "0.72rem", fontWeight: 700,
                            letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer", fontFamily: FM,
                            background: hovered ? C.dark : "transparent",
                            color: hovered ? "#fff" : C.dark,
                            border: `1.5px solid ${C.dark}`,
                            transition: "all 0.3s ease",
                        }}>
                            View Details
                        </button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}

/* ── FILTER ITEM ───────────────────────────────────────────── */
function FilterSection({ title, options, selected, onSelect }: {
    title: string; options: string[]; selected: string; onSelect: (v: string) => void;
}) {
    return (
        <div style={{ marginBottom: "1.5rem" }}>
            <h4 style={{ fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: C.black, fontFamily: FM, paddingBottom: "0.625rem", borderBottom: "1px solid #EBEBEB", marginBottom: "0.75rem" }}>
                {title}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                {options.map((opt) => {
                    const active = selected === opt;
                    return (
                        <button key={opt} onClick={() => onSelect(opt)} style={{
                            width: "100%", textAlign: "left", padding: "0.45rem 0.625rem",
                            fontSize: "0.82rem", fontFamily: FO, cursor: "pointer", border: "none",
                            background: active ? "#F0F0F0" : "transparent",
                            color: active ? C.black : "#666",
                            fontWeight: active ? 700 : 400,
                            display: "flex", alignItems: "center", gap: "0.5rem",
                            transition: "all 0.15s",
                        }}>
                            {active && <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: C.black, flexShrink: 0 }} />}
                            {opt}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

/* ── MAIN PAGE ─────────────────────────────────────────────── */
export default function ShopPage() {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedPrice, setSelectedPrice] = useState("All");
    const [selectedFinish, setSelectedFinish] = useState("All");
    const [selectedAvailability, setSelectedAvailability] = useState("All");
    const [selectedSort, setSelectedSort] = useState("Featured");
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(9);

    // Fetch all products from Supabase on mount
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/products?limit=100");
                if (!res.ok) throw new Error("Failed to load products");
                const json = await res.json();
                setAllProducts(json.products ?? []);
            } catch (err) {
                console.error(err);
                setFetchError("Could not load products. Please try again later.");
            } finally {
                setLoadingProducts(false);
            }
        })();
    }, []);

    const filtered = allProducts.filter((p) => {
        if (selectedCategory !== "All" && p.category !== selectedCategory) return false;
        if (selectedFinish !== "All" && p.finish !== selectedFinish) return false;
        const limitedStatuses = ["Only 12 Left", "Only 3 Left", "Limited"];
        if (selectedAvailability === "In Stock" && p.stock_status !== "In Stock") return false;
        if (selectedAvailability === "Limited Stock" && !limitedStatuses.includes(p.stock_status)) return false;
        if (selectedPrice === "₹999 – ₹2999" && (p.price < 999 || p.price > 2999)) return false;
        if (selectedPrice === "₹3000 – ₹7999" && (p.price < 3000 || p.price > 7999)) return false;
        if (selectedPrice === "₹8000+" && p.price < 8000) return false;
        return true;
    });

    const sorted = [...filtered].sort((a, b) => {
        if (selectedSort === "Price: Low to High") return a.price - b.price;
        if (selectedSort === "Price: High to Low") return b.price - a.price;
        if (selectedSort === "Newest") return (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0);
        return 0;
    });

    const visible = sorted.slice(0, visibleCount);
    const hasMore = visibleCount < sorted.length;

    useEffect(() => {
        document.body.style.overflow = filterDrawerOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [filterDrawerOpen]);

    const resetFilters = () => {
        setSelectedCategory("All"); setSelectedPrice("All");
        setSelectedFinish("All"); setSelectedAvailability("All");
    };

    const FilterPanel = () => (
        <>
            <FilterSection title="Category" options={categories} selected={selectedCategory} onSelect={setSelectedCategory} />
            <FilterSection title="Price Range" options={priceRanges} selected={selectedPrice} onSelect={setSelectedPrice} />
            <FilterSection title="Finish" options={finishes} selected={selectedFinish} onSelect={setSelectedFinish} />
            <FilterSection title="Availability" options={availability} selected={selectedAvailability} onSelect={setSelectedAvailability} />
            <button onClick={resetFilters} style={{
                width: "100%", padding: "0.625rem", fontSize: "0.68rem", fontWeight: 700,
                letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer", marginTop: "0.5rem",
                border: "1.5px solid #ddd", background: "transparent", color: "#666", fontFamily: FM,
                transition: "border-color 0.2s, color 0.2s",
            }}>
                Clear Filters
            </button>
        </>
    );

    return (
        <main style={{ background: C.bg, minHeight: "100vh", fontFamily: FO }}>

            <SiteHeader />

            {/* ── SHOP HEADER ──────────────────────────────────────── */}
            <section style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "2.5rem 1.5rem" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    {/* Breadcrumb */}
                    <p style={{ fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted, marginBottom: "1.5rem", fontFamily: FM }}>
                        <Link href="/" style={{ color: C.muted, textDecoration: "none" }}>Home</Link>
                        <span style={{ margin: "0 0.5rem" }}>/</span>
                        <span style={{ color: C.black, fontWeight: 700 }}>Shop</span>
                    </p>

                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem" }}>
                        <div>
                            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: C.black, letterSpacing: "-0.03em", lineHeight: 1.1, fontFamily: FM, marginBottom: "0.5rem" }}>
                                Shop Collection
                            </h1>
                            <p style={{ fontSize: "0.9375rem", color: C.mid, fontFamily: FO }}>Premium steel furniture engineered for modern homes.</p>
                        </div>

                        {/* Sort – desktop */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.muted, fontFamily: FM }}>Sort By</span>
                            <select value={selectedSort} onChange={(e) => setSelectedSort(e.target.value)}
                                style={{ border: `1.5px solid ${C.border}`, background: C.white, color: C.black, fontSize: "0.82rem", padding: "0.6rem 1rem", fontFamily: FO, appearance: "none", cursor: "pointer" }}>
                                {sortOptions.map((o) => <option key={o}>{o}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── MAIN: SIDEBAR + GRID ─────────────────────────────── */}
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
                <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>

                    {/* ── SIDEBAR – desktop only ────────────────────────── */}
                    <aside className="hidden lg:block" style={{ width: 220, flexShrink: 0 }}>
                        <div style={{ position: "sticky", top: "1.5rem" }}>
                            <div style={{ background: C.white, padding: "1.5rem", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
                                <h3 style={{ fontSize: "0.62rem", fontWeight: 900, letterSpacing: "0.28em", textTransform: "uppercase", color: C.black, fontFamily: FM, paddingBottom: "0.875rem", borderBottom: `2px solid ${C.black}`, marginBottom: "1.5rem" }}>
                                    Filters
                                </h3>
                                <FilterPanel />
                            </div>
                        </div>
                    </aside>

                    {/* ── PRODUCT AREA ─────────────────────────────────── */}
                    <div style={{ flex: 1, minWidth: 0 }}>

                        {/* Mobile top bar */}
                        <div className="flex lg:hidden" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                            <button onClick={() => setFilterDrawerOpen(true)}
                                style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1rem", border: `1.5px solid ${C.border}`, background: C.white, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", color: C.black, fontFamily: FM }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="3" y1="6" x2="21" y2="6" /><line x1="7" y1="12" x2="17" y2="12" /><line x1="10" y1="18" x2="14" y2="18" />
                                </svg>
                                Filters
                            </button>
                            <select value={selectedSort} onChange={(e) => setSelectedSort(e.target.value)}
                                style={{ border: `1.5px solid ${C.border}`, background: C.white, color: C.black, fontSize: "0.78rem", padding: "0.5rem 0.875rem", fontFamily: FO }}>
                                {sortOptions.map((o) => <option key={o}>{o}</option>)}
                            </select>
                        </div>

                        {/* Count */}
                        <p style={{ fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted, marginBottom: "1.5rem", fontFamily: FM }}>
                            {loadingProducts ? "Loading…" : `${sorted.length} ${sorted.length === 1 ? "product" : "products"} found`}
                        </p>

                        {/* Error */}
                        {fetchError && (
                            <div style={{ textAlign: "center", padding: "4rem 0" }}>
                                <p style={{ color: "#b04000", fontFamily: FO, marginBottom: "0.75rem" }}>{fetchError}</p>
                                <button onClick={() => window.location.reload()} style={{ background: "none", border: "none", color: C.black, fontSize: "0.875rem", fontFamily: FO, textDecoration: "underline", cursor: "pointer" }}>Retry</button>
                            </div>
                        )}

                        {/* Loading skeleton */}
                        {loadingProducts && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" style={{ gap: "1.5rem" }}>
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} style={{ background: C.white, aspectRatio: "3/4", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", animation: "pulse 1.5s ease-in-out infinite" }} />
                                ))}
                            </div>
                        )}

                        {/* Grid */}
                        {!loadingProducts && !fetchError && (sorted.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "5rem 0" }}>
                                <p style={{ color: C.muted, fontFamily: FO }}>No products match your filters.</p>
                                <button onClick={resetFilters} style={{ marginTop: "1rem", background: "none", border: "none", color: C.black, fontSize: "0.875rem", fontFamily: FO, textDecoration: "underline", cursor: "pointer" }}>Clear all filters</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" style={{ gap: "1.5rem" }}>
                                {visible.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
                            </div>
                        ))}

                        {/* Quality strip */}
                        {sorted.length > 0 && (
                            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                                style={{ margin: "3rem 0", padding: "2rem", background: C.white, border: `1px solid ${C.border}`, textAlign: "center" }}>
                                <div style={{ width: 24, height: 1, background: C.black, margin: "0 auto 1rem" }} />
                                <p style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: C.black, fontFamily: FM, marginBottom: "0.5rem" }}>
                                    Limited Production Runs.
                                </p>
                                <p style={{ fontSize: "0.875rem", color: "#666", fontFamily: FO, maxWidth: 440, margin: "0 auto", lineHeight: 1.65 }}>
                                    Each product is manufactured in controlled batches to maintain quality standards.
                                </p>
                                <div style={{ width: 24, height: 1, background: C.black, margin: "1rem auto 0" }} />
                            </motion.div>
                        )}

                        {/* Load more */}
                        {hasMore && (
                            <div style={{ display: "flex", justifyContent: "center", margin: "1rem 0 2rem" }}>
                                <button onClick={() => setVisibleCount((c) => c + 6)}
                                    style={{ padding: "0.9rem 3rem", background: C.dark, color: "#fff", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", border: "none", cursor: "pointer", fontFamily: FM, transition: "background 0.2s" }}>
                                    Load More
                                </button>
                            </div>
                        )}

                        {/* Bulk CTA */}
                        <p style={{ textAlign: "center", fontSize: "0.8rem", color: C.muted, fontFamily: FO, paddingBottom: "1rem" }}>
                            Need bulk orders or custom sizing?{" "}
                            <Link href="/contact" style={{ color: C.black, fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 3 }}>Contact Us</Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* ── MOBILE FILTER DRAWER ─────────────────────────────── */}
            <AnimatePresence>
                {filterDrawerOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setFilterDrawerOpen(false)}
                            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 40 }}
                        />
                        <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                            transition={{ type: "tween", duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            style={{ position: "fixed", top: 0, left: 0, height: "100%", width: 300, maxWidth: "85vw", background: C.white, zIndex: 50, overflowY: "auto" }}>
                            {/* Drawer header */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderBottom: `1px solid ${C.border}` }}>
                                <h2 style={{ fontSize: "0.62rem", fontWeight: 900, letterSpacing: "0.28em", textTransform: "uppercase", color: C.black, fontFamily: FM }}>Filters</h2>
                                <button onClick={() => setFilterDrawerOpen(false)}
                                    style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem" }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5">
                                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                            <div style={{ padding: "1.5rem" }}>
                                <FilterPanel />
                                <button onClick={() => setFilterDrawerOpen(false)}
                                    style={{ width: "100%", marginTop: "0.75rem", padding: "0.875rem", background: C.dark, color: "#fff", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", border: "none", cursor: "pointer", fontFamily: FM }}>
                                    Apply & View Results
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <SiteFooter />
        </main>
    );
}
