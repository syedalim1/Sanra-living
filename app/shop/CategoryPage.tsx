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

/* ── FilterPanel OUTSIDE CategoryPage to prevent input remount on state change ── */
function FilterPanel({
    selectedPrice, setSelectedPrice,
    selectedFinish, setSelectedFinish,
    extraFilterValues, setExtraFilterValues,
    extraFilters,
    onReset,
}: {
    selectedPrice: string; setSelectedPrice: (v: string) => void;
    selectedFinish: string; setSelectedFinish: (v: string) => void;
    extraFilterValues: Record<string, string>;
    setExtraFilterValues: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    extraFilters?: CategoryFilterDef[];
    onReset: () => void;
}) {
    return (
        <>
            <FilterSection title="Price Range" options={priceRanges} selected={selectedPrice} onSelect={setSelectedPrice} />
            <FilterSection title="Finish" options={finishes} selected={selectedFinish} onSelect={setSelectedFinish} />
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
                    letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer",
                    marginTop: "1.5rem", border: "1px solid #EBEBEB", background: "transparent",
                    color: "#000", fontFamily: FM, transition: "all 0.3s",
                    borderRadius: "0.5rem"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#F9F9F9"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
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
        const resetExtras: Record<string, string> = {};
        config.extraFilters?.forEach((f) => { resetExtras[f.key] = "All"; });
        setExtraFilterValues(resetExtras);
    };



    return (
        <main style={{ background: C.bg, minHeight: "100vh", fontFamily: FO }}>
            <SiteHeader />

            <section className="bg-white border-b border-black/5 py-10 lg:py-16 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        {/* Breadcrumb */}
                        <p className="text-[0.65rem] tracking-[0.2em] uppercase text-gray-400 font-montserrat mb-4">
                            <Link href="/" className="hover:text-black transition-colors">Home</Link>
                            <span className="mx-2">/</span>
                            <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
                            <span className="mx-2">/</span>
                            <span className="text-black font-semibold">{config.name}</span>
                        </p>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-black tracking-tight font-montserrat mb-3 leading-tight">
                            {config.name}
                        </h1>
                        <p className="text-sm md:text-base text-gray-500 font-outfit max-w-xl font-light">
                            {config.description}
                        </p>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto py-10 lg:py-16 px-6 lg:px-8">
                <div className="flex gap-10 lg:gap-14 items-start">

                    {/* ── SIDEBAR – desktop only ────────────────────────── */}
                    <aside className="hidden lg:block w-[240px] shrink-0 sticky top-28">
                        <div>
                            <h3 className="text-xs font-black tracking-[0.2em] uppercase text-black font-montserrat pb-4 border-b border-black mb-4">
                                Filters
                            </h3>
                            <FilterPanel
                                selectedPrice={selectedPrice} setSelectedPrice={setSelectedPrice}
                                selectedFinish={selectedFinish} setSelectedFinish={setSelectedFinish}
                                extraFilterValues={extraFilterValues} setExtraFilterValues={setExtraFilterValues}
                                    extraFilters={config.extraFilters}
                                    onReset={resetFilters}
                                />
                            </div>

                            {/* Back to shop */}
                            <Link
                                href="/shop"
                                className="inline-flex items-center gap-2 mt-8 text-[0.7rem] font-semibold text-gray-500 font-montserrat tracking-widest hover:text-black transition-colors uppercase"
                            >
                                ← All Categories
                            </Link>
                    </aside>

                    {/* ── PRODUCT AREA ─────────────────────────────────── */}
                    <div className="flex-1 min-w-0">

                        {/* Header Row: Count & Sort */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setFilterDrawerOpen(true)}
                                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-black/10 bg-white text-[0.7rem] font-bold tracking-[0.15em] uppercase text-black font-montserrat rounded-full"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="3" y1="6" x2="21" y2="6" /><line x1="7" y1="12" x2="17" y2="12" /><line x1="10" y1="18" x2="14" y2="18" />
                                    </svg>
                                    Filters
                                </button>
                                <p className="text-[0.7rem] tracking-[0.15em] uppercase text-gray-400 font-montserrat">
                                    {loading ? "Loading…" : `${sorted.length} ${sorted.length === 1 ? "product" : "products"} found`}
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <span className="text-[0.65rem] font-bold tracking-[0.2em] uppercase text-gray-400 font-montserrat hidden sm:inline-block">Sort By</span>
                                <select
                                    value={selectedSort}
                                    onChange={(e) => setSelectedSort(e.target.value)}
                                    className="border border-black/10 bg-transparent text-black text-[0.75rem] font-outfit px-3 py-2 outline-none cursor-pointer rounded-md focus:border-black transition-colors"
                                >
                                    {sortOptions.map((o) => <option key={o}>{o}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Loading skeleton */}
                        {loading && (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 lg:gap-10">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="bg-gray-100 aspect-[4/5] rounded-2xl animate-pulse" />
                                ))}
                            </div>
                        )}

                        {/* Grid */}
                        {!loading && !error && (sorted.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-gray-500 font-outfit mb-2">No products in this category yet.</p>
                                <Link href="/shop" className="text-black text-sm font-semibold font-outfit underline underline-offset-4">Browse All Categories</Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
                                {visible.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
                            </div>
                        ))}

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
