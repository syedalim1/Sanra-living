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
                className="w-full mt-5 py-2.5 text-[0.6rem] font-medium tracking-[0.2em] uppercase cursor-pointer font-montserrat border border-black/8 bg-transparent text-black/60 hover:text-black hover:border-black/20 transition-all duration-300 rounded-lg"
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

            <section className="bg-white border-b border-black/[0.04] py-8 lg:py-12 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        {/* Breadcrumb */}
                        <p className="text-[0.58rem] tracking-[0.22em] uppercase text-black/30 font-montserrat mb-3">
                            <Link href="/" className="hover:text-black transition-colors duration-300">Home</Link>
                            <span className="mx-1.5 opacity-50">/</span>
                            <Link href="/shop" className="hover:text-black transition-colors duration-300">Shop</Link>
                            <span className="mx-1.5 opacity-50">/</span>
                            <span className="text-black/70">{config.name}</span>
                        </p>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium text-black tracking-tight font-montserrat mb-2.5 leading-[1.15]">
                            {config.name}
                        </h1>
                        <p className="text-[0.85rem] md:text-[0.9rem] text-black/45 font-outfit max-w-xl font-light leading-[1.7]">
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
                        <div className="flex items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setFilterDrawerOpen(true)}
                                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-black/8 bg-white text-[0.6rem] font-medium tracking-[0.18em] uppercase text-black/70 font-montserrat rounded-full transition-all duration-300 hover:border-black/20 hover:text-black"
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="3" y1="6" x2="21" y2="6" /><line x1="7" y1="12" x2="17" y2="12" /><line x1="10" y1="18" x2="14" y2="18" />
                                    </svg>
                                    Filters
                                </button>
                                <p className="text-[0.6rem] tracking-[0.18em] uppercase text-black/30 font-montserrat">
                                    {loading ? "Loading…" : `${sorted.length} ${sorted.length === 1 ? "piece" : "pieces"}`}
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-2.5">
                                <span className="text-[0.58rem] font-medium tracking-[0.22em] uppercase text-black/30 font-montserrat hidden sm:inline-block">Sort</span>
                                <select
                                    value={selectedSort}
                                    onChange={(e) => setSelectedSort(e.target.value)}
                                    className="border border-black/8 bg-white text-black text-[0.72rem] font-outfit px-3 py-1.5 outline-none cursor-pointer rounded-lg focus:border-black/25 transition-colors duration-300 appearance-none pr-7"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.6rem center' }}
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
                                <p className="text-black/40 font-outfit text-sm mb-3 font-light">No products in this category yet.</p>
                                <Link href="/shop" className="text-black text-[0.75rem] font-medium font-montserrat uppercase tracking-[0.15em] underline underline-offset-4">Browse All Categories</Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 md:gap-x-6 md:gap-y-12">
                                {visible.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
                            </div>
                        ))}

                        {/* Load more */}
                        {hasMore && (
                            <div className="flex justify-center mt-12 mb-6">
                                <button
                                    onClick={() => setVisibleCount((c) => c + 6)}
                                    className="px-10 py-3 bg-[#111] text-white text-[0.62rem] font-medium tracking-[0.22em] uppercase font-montserrat rounded-full transition-all duration-500 hover:bg-black active:scale-[0.97]"
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
                            transition={{ duration: 0.25 }}
                            onClick={() => setFilterDrawerOpen(false)}
                            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 40, backdropFilter: "blur(2px)" }}
                        />
                        <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                            transition={{ type: "tween", duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            style={{ position: "fixed", top: 0, left: 0, height: "100%", width: 275, maxWidth: "82vw", background: "#FAFAFA", zIndex: 50, overflowY: "auto", borderRight: "1px solid rgba(0,0,0,0.04)" }}>
                            {/* Drawer header */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.1rem 1.4rem", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                                <h2 style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#111", fontFamily: FM, margin: 0 }}>Filters</h2>
                                <button onClick={() => setFilterDrawerOpen(false)}
                                    style={{ background: "none", border: "none", cursor: "pointer", padding: "0.35rem", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", transition: "background 0.2s" }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.04)"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                            <div style={{ padding: "1.25rem 1.4rem" }}>
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
                                        width: "100%", marginTop: "1rem", padding: "0.8rem",
                                        background: "#111", color: "#fff", fontSize: "0.6rem", fontWeight: 600,
                                        letterSpacing: "0.22em", textTransform: "uppercase", border: "none",
                                        cursor: "pointer", fontFamily: FM, borderRadius: "8px",
                                        transition: "background 0.3s",
                                    }}
                                >
                                    View Results
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
