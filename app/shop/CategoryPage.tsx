"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { ProductCard, FilterSection, Product, C, FM, FO, sortOptions } from "./ShopComponents";

/* ═══════════════════════════════════════════════════════════════
   CATEGORY CONFIG — each category can define custom filters
═══════════════════════════════════════════════════════════════ */
export interface CategoryFilterDef {
    title: string;
    key: string;
    options: string[];
}

export interface CategoryConfig {
    slug: string;
    name: string;
    description: string;
    /** DB category values to match (supports aliases) */
    dbCategories: string[];
    /** Extra filters beyond the global ones */
    extraFilters?: CategoryFilterDef[];
}

/* ── Global filters available on every category ──────────── */
const priceRanges = ["All", "Under ₹2,000", "₹2,000 – ₹5,000", "₹5,000 – ₹10,000", "₹10,000+"];
const finishes = ["All", "Matte Black", "Graphite Grey"];
const assemblyTypes = ["All", "Self Assembly", "Pre-assembled"];

/* ── FilterPanel OUTSIDE CategoryPage to prevent input remount on state change ── */
function FilterPanel({
    selectedPrice, setSelectedPrice,
    selectedFinish, setSelectedFinish,
    selectedAssembly, setSelectedAssembly,
    extraFilterValues, setExtraFilterValues,
    extraFilters,
    onReset,
}: {
    selectedPrice: string; setSelectedPrice: (v: string) => void;
    selectedFinish: string; setSelectedFinish: (v: string) => void;
    selectedAssembly: string; setSelectedAssembly: (v: string) => void;
    extraFilterValues: Record<string, string>;
    setExtraFilterValues: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    extraFilters?: CategoryFilterDef[];
    onReset: () => void;
}) {
    return (
        <>
            <FilterSection title="Price Range" options={priceRanges} selected={selectedPrice} onSelect={setSelectedPrice} />
            <FilterSection title="Finish" options={finishes} selected={selectedFinish} onSelect={setSelectedFinish} />
            <FilterSection title="Assembly" options={assemblyTypes} selected={selectedAssembly} onSelect={setSelectedAssembly} />
            {extraFilters?.map((ef) => (
                <FilterSection
                    key={ef.key}
                    title={ef.title}
                    options={["All", ...ef.options]}
                    selected={extraFilterValues[ef.key] ?? "All"}
                    onSelect={(v) => setExtraFilterValues((prev) => ({ ...prev, [ef.key]: v }))}
                />
            ))}
            <button
                onClick={onReset}
                style={{
                    width: "100%", padding: "0.625rem", fontSize: "0.68rem", fontWeight: 700,
                    letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer",
                    marginTop: "0.5rem", border: "1.5px solid #ddd", background: "transparent",
                    color: "#666", fontFamily: FM, transition: "border-color 0.2s, color 0.2s",
                }}
            >
                Clear Filters
            </button>
        </>
    );
}

/* ═══════════════════════════════════════════════════════════════
   CATEGORY PAGE COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function CategoryPage({ config }: { config: CategoryConfig }) {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /* Filter states */
    const [selectedPrice, setSelectedPrice] = useState("All");
    const [selectedFinish, setSelectedFinish] = useState("All");
    const [selectedAssembly, setSelectedAssembly] = useState("All");
    const [selectedSort, setSelectedSort] = useState("Featured");
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(12);

    /* Extra filter states (dynamic per category) */
    const [extraFilterValues, setExtraFilterValues] = useState<Record<string, string>>({});

    useEffect(() => {
        const initExtras: Record<string, string> = {};
        config.extraFilters?.forEach((f) => { initExtras[f.key] = "All"; });
        setExtraFilterValues(initExtras);
    }, [config]);

    /* ── Fetch products ──────────────────────── */
    useEffect(() => {
        (async () => {
            try {
                // Fetch all for this category (use first DB category value)
                const res = await fetch(`/api/products?category=${encodeURIComponent(config.dbCategories[0])}&limit=100`);
                if (!res.ok) throw new Error("Failed to load");
                const json = await res.json();
                let products: Product[] = json.products ?? json ?? [];

                // If multiple DB aliases, also fetch those
                if (config.dbCategories.length > 1) {
                    for (let i = 1; i < config.dbCategories.length; i++) {
                        const res2 = await fetch(`/api/products?category=${encodeURIComponent(config.dbCategories[i])}&limit=100`);
                        if (res2.ok) {
                            const json2 = await res2.json();
                            const extra: Product[] = json2.products ?? json2 ?? [];
                            products = [...products, ...extra];
                        }
                    }
                }

                setAllProducts(products.filter((p) => p.is_active));
            } catch {
                setError("Could not load products. Please try again.");
            } finally {
                setLoading(false);
            }
        })();
    }, [config.dbCategories]);

    /* ── Filter logic ────────────────────────── */
    const filtered = allProducts.filter((p) => {
        // Price
        if (selectedPrice === "Under ₹2,000" && p.price >= 2000) return false;
        if (selectedPrice === "₹2,000 – ₹5,000" && (p.price < 2000 || p.price > 5000)) return false;
        if (selectedPrice === "₹5,000 – ₹10,000" && (p.price < 5000 || p.price > 10000)) return false;
        if (selectedPrice === "₹10,000+" && p.price < 10000) return false;
        // Finish
        if (selectedFinish !== "All" && p.finish !== selectedFinish) return false;
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
        setSelectedPrice("All");
        setSelectedFinish("All");
        setSelectedAssembly("All");
        const resetExtras: Record<string, string> = {};
        config.extraFilters?.forEach((f) => { resetExtras[f.key] = "All"; });
        setExtraFilterValues(resetExtras);
    };



    return (
        <main style={{ background: C.bg, minHeight: "100vh", fontFamily: FO }}>
            <SiteHeader />

            {/* ── HEADER ──────────────────────────────────────────── */}
            <section style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "2.5rem 1.5rem" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    {/* Breadcrumb */}
                    <p style={{ fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted, marginBottom: "1.5rem", fontFamily: FM }}>
                        <Link href="/" style={{ color: C.muted, textDecoration: "none" }}>Home</Link>
                        <span style={{ margin: "0 0.5rem" }}>/</span>
                        <Link href="/shop" style={{ color: C.muted, textDecoration: "none" }}>Shop</Link>
                        <span style={{ margin: "0 0.5rem" }}>/</span>
                        <span style={{ color: C.black, fontWeight: 700 }}>{config.name}</span>
                    </p>

                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem" }}>
                        <div>
                            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: C.black, letterSpacing: "-0.03em", lineHeight: 1.1, fontFamily: FM, marginBottom: "0.5rem" }}>
                                {config.name}
                            </h1>
                            <p style={{ fontSize: "0.9375rem", color: C.mid, fontFamily: FO }}>{config.description}</p>
                        </div>

                        {/* Sort – desktop */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.muted, fontFamily: FM }}>Sort By</span>
                            <select
                                value={selectedSort}
                                onChange={(e) => setSelectedSort(e.target.value)}
                                style={{ border: `1.5px solid ${C.border}`, background: C.white, color: C.black, fontSize: "0.82rem", padding: "0.6rem 1rem", fontFamily: FO, appearance: "none", cursor: "pointer" }}
                            >
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
                        <div style={{ position: "sticky", top: "5rem" }}>
                            <div style={{ background: C.white, padding: "1.5rem", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
                                <h3 style={{ fontSize: "0.62rem", fontWeight: 900, letterSpacing: "0.28em", textTransform: "uppercase", color: C.black, fontFamily: FM, paddingBottom: "0.875rem", borderBottom: `2px solid ${C.black}`, marginBottom: "1.5rem" }}>
                                    Filters
                                </h3>
                                <FilterPanel
                                    selectedPrice={selectedPrice} setSelectedPrice={setSelectedPrice}
                                    selectedFinish={selectedFinish} setSelectedFinish={setSelectedFinish}
                                    selectedAssembly={selectedAssembly} setSelectedAssembly={setSelectedAssembly}
                                    extraFilterValues={extraFilterValues} setExtraFilterValues={setExtraFilterValues}
                                    extraFilters={config.extraFilters}
                                    onReset={resetFilters}
                                />
                            </div>

                            {/* Back to shop */}
                            <Link
                                href="/shop"
                                style={{
                                    display: "flex", alignItems: "center", gap: "0.5rem",
                                    marginTop: "1.25rem", fontSize: "0.78rem", fontWeight: 600,
                                    color: C.mid, textDecoration: "none", fontFamily: FM,
                                    letterSpacing: "0.08em",
                                }}
                            >
                                ← All Categories
                            </Link>
                        </div>
                    </aside>

                    {/* ── PRODUCT AREA ─────────────────────────────────── */}
                    <div style={{ flex: 1, minWidth: 0 }}>

                        {/* Mobile top bar */}
                        <div className="flex lg:hidden" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                            <button
                                onClick={() => setFilterDrawerOpen(true)}
                                style={{
                                    display: "flex", alignItems: "center", gap: "0.5rem",
                                    padding: "0.625rem 1rem", border: `1.5px solid ${C.border}`,
                                    background: C.white, fontSize: "0.72rem", fontWeight: 700,
                                    letterSpacing: "0.12em", textTransform: "uppercase",
                                    cursor: "pointer", color: C.black, fontFamily: FM,
                                }}
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="3" y1="6" x2="21" y2="6" /><line x1="7" y1="12" x2="17" y2="12" /><line x1="10" y1="18" x2="14" y2="18" />
                                </svg>
                                Filters
                            </button>
                            <select
                                value={selectedSort}
                                onChange={(e) => setSelectedSort(e.target.value)}
                                style={{ border: `1.5px solid ${C.border}`, background: C.white, color: C.black, fontSize: "0.78rem", padding: "0.5rem 0.875rem", fontFamily: FO }}
                            >
                                {sortOptions.map((o) => <option key={o}>{o}</option>)}
                            </select>
                        </div>

                        {/* Count */}
                        <p style={{ fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted, marginBottom: "1.5rem", fontFamily: FM }}>
                            {loading ? "Loading…" : `${sorted.length} ${sorted.length === 1 ? "product" : "products"} found`}
                        </p>

                        {/* Error */}
                        {error && (
                            <div style={{ textAlign: "center", padding: "4rem 0" }}>
                                <p style={{ color: "#b04000", fontFamily: FO, marginBottom: "0.75rem" }}>{error}</p>
                                <button onClick={() => window.location.reload()} style={{ background: "none", border: "none", color: C.black, fontSize: "0.875rem", fontFamily: FO, textDecoration: "underline", cursor: "pointer" }}>Retry</button>
                            </div>
                        )}

                        {/* Loading skeleton */}
                        {loading && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" style={{ gap: "1.5rem" }}>
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} style={{ background: C.white, aspectRatio: "3/4", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", animation: "pulse 1.5s ease-in-out infinite" }} />
                                ))}
                            </div>
                        )}

                        {/* Grid */}
                        {!loading && !error && (sorted.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "5rem 0" }}>
                                <p style={{ color: C.muted, fontFamily: FO, marginBottom: "0.75rem" }}>No products in this category yet.</p>
                                <p style={{ fontSize: "0.82rem", color: "#999", fontFamily: FO, marginBottom: "1.5rem" }}>Products will appear here as they are added to the store.</p>
                                <Link href="/shop" style={{ color: C.black, fontSize: "0.875rem", fontFamily: FO, textDecoration: "underline", fontWeight: 600 }}>Browse All Categories</Link>
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
                                <button
                                    onClick={() => setVisibleCount((c) => c + 6)}
                                    style={{
                                        padding: "0.9rem 3rem", background: C.dark, color: "#fff",
                                        fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.18em",
                                        textTransform: "uppercase", border: "none", cursor: "pointer",
                                        fontFamily: FM, transition: "background 0.2s",
                                    }}
                                >
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
                                <FilterPanel
                                    selectedPrice={selectedPrice} setSelectedPrice={setSelectedPrice}
                                    selectedFinish={selectedFinish} setSelectedFinish={setSelectedFinish}
                                    selectedAssembly={selectedAssembly} setSelectedAssembly={setSelectedAssembly}
                                    extraFilterValues={extraFilterValues} setExtraFilterValues={setExtraFilterValues}
                                    extraFilters={config.extraFilters}
                                    onReset={resetFilters}
                                />
                                <button
                                    onClick={() => setFilterDrawerOpen(false)}
                                    style={{
                                        width: "100%", marginTop: "0.75rem", padding: "0.875rem",
                                        background: C.dark, color: "#fff", fontSize: "0.72rem", fontWeight: 700,
                                        letterSpacing: "0.15em", textTransform: "uppercase", border: "none",
                                        cursor: "pointer", fontFamily: FM,
                                    }}
                                >
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
