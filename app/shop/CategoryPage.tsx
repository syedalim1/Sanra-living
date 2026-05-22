"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { ProductCard, FilterSection, Product, sortOptions } from "./ShopComponents";

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
        <div className="flex flex-col">
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
                className="w-full mt-6 py-3 text-[0.58rem] font-medium tracking-[0.2em] uppercase cursor-pointer font-montserrat border border-black/10 bg-transparent text-black/55 hover:text-black hover:bg-black/5 transition-all duration-300 rounded-full"
            >
                Clear Filters
            </button>
        </div>
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
        <main className="bg-[#FAF9F6] min-h-screen text-[#111111] font-outfit">
            <SiteHeader />

            {/* Breadcrumbs and Page Title Header */}
            <section className="bg-[#FAF9F6] border-b border-black/[0.035] pt-24 pb-8 lg:pt-32 lg:pb-12 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        {/* Breadcrumb */}
                        <p className="text-[0.58rem] tracking-[0.22em] uppercase text-black/35 font-montserrat mb-3.5">
                            <Link href="/" className="hover:text-black transition-colors duration-300">Home</Link>
                            <span className="mx-2 opacity-50">/</span>
                            <Link href="/shop" className="hover:text-black transition-colors duration-300">Shop</Link>
                            <span className="mx-2 opacity-50">/</span>
                            <span className="text-black/80 font-normal">{config.name}</span>
                        </p>
                        <h1 className="text-2xl md:text-3.5xl lg:text-4xl font-light text-black tracking-tight font-montserrat mb-3 leading-[1.15]">
                            {config.name}
                        </h1>
                        <p className="text-[0.85rem] md:text-[0.9rem] text-black/45 max-w-xl font-light leading-[1.8]">
                            {config.description}
                        </p>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto py-8 lg:py-14 px-6 lg:px-8">
                <div className="flex gap-10 lg:gap-14 items-start">

                    {/* ── SIDEBAR – desktop only ────────────────────────── */}
                    <aside className="hidden lg:block w-[240px] shrink-0 sticky top-28 bg-[#FAF9F6]">
                        <div>
                            <h3 className="text-[0.58rem] font-medium tracking-[0.25em] uppercase text-black font-montserrat pb-4 border-b border-black/10 mb-5">
                                Refine By
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
                            className="inline-flex items-center gap-2 mt-10 text-[0.58rem] font-medium text-black/45 font-montserrat tracking-[0.2em] hover:text-black transition-colors uppercase border-b border-black/10 pb-0.5"
                        >
                            ← All Series
                        </Link>
                    </aside>

                    {/* ── PRODUCT AREA ─────────────────────────────────── */}
                    <div className="flex-1 min-w-0">

                        {/* Header Row: Count & Sort */}
                        <div className="flex items-center justify-between gap-3 mb-8">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setFilterDrawerOpen(true)}
                                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-black/10 bg-white/50 backdrop-blur-md text-[0.58rem] font-medium tracking-[0.2em] uppercase text-[#1A1917] font-montserrat rounded-full transition-all duration-300 hover:border-black/20 active:scale-[0.97]"
                                >
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="3" y1="6" x2="21" y2="6" /><line x1="7" y1="12" x2="17" y2="12" /><line x1="10" y1="18" x2="14" y2="18" />
                                    </svg>
                                    Filters
                                </button>
                                <p className="text-[0.58rem] tracking-[0.2em] uppercase text-black/35 font-montserrat">
                                    {loading ? "Loading…" : `${sorted.length} ${sorted.length === 1 ? "design" : "designs"}`}
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-2.5">
                                <span className="text-[0.58rem] font-medium tracking-[0.2em] uppercase text-black/35 font-montserrat hidden sm:inline-block">Sort by</span>
                                <div className="relative">
                                    <select
                                        value={selectedSort}
                                        onChange={(e) => setSelectedSort(e.target.value)}
                                        className="border border-black/10 bg-white/50 backdrop-blur-md text-[#1A1917] text-[0.7rem] font-montserrat font-medium tracking-[0.05em] px-4 py-2 outline-none cursor-pointer rounded-full focus:border-black/25 transition-all duration-300 appearance-none pr-8"
                                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='9' height='9' viewBox='0 0 24 24' fill='none' stroke='%231a1917' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.8rem center' }}
                                    >
                                        {sortOptions.map((o) => <option key={o}>{o}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Loading skeleton */}
                        {loading && (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="bg-black/[0.02] aspect-[4/5] rounded-2xl animate-pulse" />
                                ))}
                            </div>
                        )}

                        {/* Grid */}
                        {!loading && !error && (sorted.length === 0 ? (
                            <div className="text-center py-24 bg-black/[0.015] rounded-2xl p-8 border border-black/[0.01]">
                                <p className="text-black/45 font-outfit text-sm mb-4 font-light leading-relaxed">No designs match the selected filters.</p>
                                <button onClick={resetFilters} className="text-[#C5A880] text-[0.62rem] font-medium font-montserrat uppercase tracking-[0.2em] hover:text-[#1A1917] transition-colors duration-300 border-b border-[#C5A880] pb-0.5">Reset Filters</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 md:gap-x-8 md:gap-y-14">
                                {visible.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
                            </div>
                        ))}

                        {/* Load more */}
                        {hasMore && (
                            <div className="flex justify-center mt-16 mb-8">
                                <button
                                    onClick={() => setVisibleCount((c) => c + 6)}
                                    className="px-12 py-4 bg-[#1A1917] hover:bg-black text-[#C5A880] text-[0.62rem] font-medium tracking-[0.22em] uppercase font-montserrat rounded-full transition-all duration-500 hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] active:scale-[0.97]"
                                >
                                    Load More
                                </button>
                            </div>
                        )}

                        {/* Bottom Commercial Help Strip */}
                        <div className="mt-20 border-t border-black/[0.035] pt-8 text-center">
                            <p className="text-[0.78rem] text-black/45 font-outfit font-light m-0 leading-relaxed">
                                Seeking custom finishing, dimensions, or wholesale quotes?{" "}
                                <a 
                                    href="https://wa.me/918300904920?text=Hi!%20I'm%20interested%20in%20SANRA%20LIVING%20custom%20orders." 
                                    className="text-[#1A1917] font-semibold underline underline-offset-4 hover:text-[#C5A880] transition-colors duration-300"
                                >
                                    Enquire on WhatsApp
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MOBILE FILTER DRAWER ─────────────────────────────── */}
            <AnimatePresence>
                {filterDrawerOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setFilterDrawerOpen(false)}
                            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ x: "-100%" }} 
                            animate={{ x: 0 }} 
                            exit={{ x: "-100%" }}
                            transition={{ type: "tween", duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="fixed top-0 left-0 h-full w-[85vw] max-w-[320px] bg-[#FAF9F6] z-50 overflow-y-auto border-r border-black/[0.035]"
                        >
                            {/* Drawer header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-black/[0.035]">
                                <h2 className="text-[0.58rem] font-medium tracking-[0.25em] uppercase text-[#111] font-montserrat m-0">Filters</h2>
                                <button 
                                    onClick={() => setFilterDrawerOpen(false)}
                                    className="p-2 rounded-full hover:bg-black/5 text-[#111]/60 transition-colors duration-300"
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                            <div className="px-6 py-6">
                                <FilterPanel
                                    selectedPrice={selectedPrice} setSelectedPrice={setSelectedPrice}
                                    selectedFinish={selectedFinish} setSelectedFinish={setSelectedFinish}
                                    extraFilterValues={extraFilterValues} setExtraFilterValues={setExtraFilterValues}
                                    extraFilters={config.extraFilters}
                                    onReset={resetFilters}
                                />
                                <button
                                    onClick={() => setFilterDrawerOpen(false)}
                                    className="w-full mt-6 py-3.5 bg-[#1A1917] text-[#C5A880] text-[0.6rem] font-medium tracking-[0.22em] uppercase border-none cursor-pointer font-montserrat rounded-full hover:bg-black transition-colors duration-300"
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
