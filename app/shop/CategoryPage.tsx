"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { ProductCard, FilterSection, Product, sortOptions } from "./ShopComponents";

/* ═══════════════════════════════════════════════════════════════
   CATEGORY CONFIG
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
    dbCategories: string[];
    heroImage?: string;
    extraFilters?: CategoryFilterDef[];
}

/* ── Global filters ───────────────────────────────────────── */
const priceRanges = ["All", "Under ₹2,000", "₹2,000 – ₹5,000", "₹5,000 – ₹10,000", "₹10,000+"];
const finishes = ["All", "Matte Black", "Graphite Grey"];

/* ── FilterPanel ──────────────────────────────────────────── */
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
                className="w-full mt-5 py-3 text-[0.58rem] font-medium tracking-[0.2em] uppercase cursor-pointer font-montserrat border border-black/10 bg-transparent text-black/55 hover:text-black hover:bg-black/5 transition-all duration-300 rounded-full"
            >
                Clear Filters
            </button>
        </div>
    );
}

/* ── Active filter chip ───────────────────────────────────── */
function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
    return (
        <button
            onClick={onRemove}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1A1917] text-white text-[0.55rem] font-medium tracking-[0.15em] uppercase font-montserrat transition-all duration-200 hover:bg-black"
        >
            {label}
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
        </button>
    );
}

/* ═══════════════════════════════════════════════════════════════
   CATEGORY PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function CategoryPage({ config }: { config: CategoryConfig }) {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedPrice, setSelectedPrice] = useState("All");
    const [selectedFinish, setSelectedFinish] = useState("All");
    const [selectedSort, setSelectedSort] = useState("Featured");
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(12);
    const [extraFilterValues, setExtraFilterValues] = useState<Record<string, string>>({});

    useEffect(() => {
        const initExtras: Record<string, string> = {};
        config.extraFilters?.forEach((f) => { initExtras[f.key] = "All"; });
        setExtraFilterValues(initExtras);
    }, [config]);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`/api/products?category=${encodeURIComponent(config.dbCategories[0])}&limit=100`);
                if (!res.ok) throw new Error("Failed to load");
                const json = await res.json();
                let products: Product[] = json.products ?? json ?? [];

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

    const filtered = allProducts.filter((p) => {
        if (selectedPrice === "Under ₹2,000" && p.price >= 2000) return false;
        if (selectedPrice === "₹2,000 – ₹5,000" && (p.price < 2000 || p.price > 5000)) return false;
        if (selectedPrice === "₹5,000 – ₹10,000" && (p.price < 5000 || p.price > 10000)) return false;
        if (selectedPrice === "₹10,000+" && p.price < 10000) return false;
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

    const activeFilters: { label: string; reset: () => void }[] = [];
    if (selectedPrice !== "All") activeFilters.push({ label: selectedPrice, reset: () => setSelectedPrice("All") });
    if (selectedFinish !== "All") activeFilters.push({ label: selectedFinish, reset: () => setSelectedFinish("All") });

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

    const heroImage = config.heroImage ||
        "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1600&q=80";

    return (
        <main className="bg-[#FAF9F6] min-h-screen text-[#111111] font-outfit">
            <SiteHeader />

            {/* ── CATEGORY HERO ──────────────────────────────────── */}
            <section className="relative pt-[56px] md:pt-[64px] overflow-hidden">
                {/* Hero image — full bleed */}
                <div className="relative w-full" style={{ height: "clamp(200px, 35vw, 400px)" }}>
                    <img
                        src={heroImage}
                        alt={config.name}
                        className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1917]/80 via-[#1A1917]/30 to-transparent" />

                    {/* Breadcrumb + title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-6 md:pb-10">
                        <div className="max-w-7xl mx-auto">
                            <p className="text-[0.52rem] tracking-[0.25em] uppercase text-white/55 font-montserrat mb-2">
                                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                                <span className="mx-1.5 opacity-40">/</span>
                                <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
                                <span className="mx-1.5 opacity-40">/</span>
                                <span className="text-white/80">{config.name}</span>
                            </p>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-white tracking-tight font-montserrat leading-tight">
                                {config.name}
                            </h1>
                            <p className="text-[0.8rem] text-white/60 font-light mt-1.5 max-w-lg leading-relaxed hidden sm:block">
                                {config.description}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── MAIN CONTENT ───────────────────────────────────── */}
            <div className="max-w-7xl mx-auto py-6 lg:py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex gap-8 lg:gap-12 items-start">

                    {/* ── SIDEBAR desktop ────────────────────────── */}
                    <aside className="hidden lg:block w-[220px] shrink-0 sticky top-24">
                        <h3 className="text-[0.58rem] font-semibold tracking-[0.25em] uppercase text-black font-montserrat pb-4 border-b border-black/10 mb-5">
                            Refine By
                        </h3>
                        <FilterPanel
                            selectedPrice={selectedPrice} setSelectedPrice={setSelectedPrice}
                            selectedFinish={selectedFinish} setSelectedFinish={setSelectedFinish}
                            extraFilterValues={extraFilterValues} setExtraFilterValues={setExtraFilterValues}
                            extraFilters={config.extraFilters}
                            onReset={resetFilters}
                        />
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 mt-8 text-[0.56rem] font-medium text-black/40 font-montserrat tracking-[0.18em] hover:text-black transition-colors uppercase border-b border-black/10 pb-0.5"
                        >
                            ← All Series
                        </Link>
                    </aside>

                    {/* ── PRODUCT AREA ────────────────────────────── */}
                    <div className="flex-1 min-w-0">

                        {/* Top bar: filter trigger + count + sort */}
                        <div className="flex items-center justify-between gap-3 mb-5 sm:mb-8">
                            <div className="flex items-center gap-2.5 flex-wrap">
                                {/* Mobile filter button */}
                                <button
                                    onClick={() => setFilterDrawerOpen(true)}
                                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-black/15 bg-white text-[0.58rem] font-semibold tracking-[0.18em] uppercase text-[#1A1917] font-montserrat rounded-full transition-all duration-300 hover:border-black/25 active:scale-[0.97] shadow-sm"
                                >
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="3" y1="6" x2="21" y2="6" /><line x1="7" y1="12" x2="17" y2="12" /><line x1="10" y1="18" x2="14" y2="18" />
                                    </svg>
                                    Filters
                                    {activeFilters.length > 0 && (
                                        <span className="ml-0.5 w-4 h-4 rounded-full bg-[#C5A880] text-white text-[0.48rem] font-bold flex items-center justify-center">
                                            {activeFilters.length}
                                        </span>
                                    )}
                                </button>

                                <p className="text-[0.58rem] tracking-[0.2em] uppercase text-black/35 font-montserrat">
                                    {loading ? "Loading…" : `${sorted.length} ${sorted.length === 1 ? "design" : "designs"}`}
                                </p>
                            </div>

                            {/* Sort */}
                            <div className="flex items-center gap-2">
                                <span className="text-[0.58rem] font-medium tracking-[0.18em] uppercase text-black/35 font-montserrat hidden sm:inline-block">Sort</span>
                                <div className="relative">
                                    <select
                                        value={selectedSort}
                                        onChange={(e) => setSelectedSort(e.target.value)}
                                        className="border border-black/10 bg-white text-[#1A1917] text-[0.68rem] font-montserrat font-medium tracking-[0.05em] px-4 py-2 outline-none cursor-pointer rounded-full focus:border-black/25 transition-all duration-300 appearance-none pr-8 shadow-sm"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='9' height='9' viewBox='0 0 24 24' fill='none' stroke='%231a1917' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: "right 0.75rem center",
                                        }}
                                    >
                                        {sortOptions.map((o) => <option key={o}>{o}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Active filter chips */}
                        {activeFilters.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-5">
                                {activeFilters.map((f) => (
                                    <FilterChip key={f.label} label={f.label} onRemove={f.reset} />
                                ))}
                                <button
                                    onClick={resetFilters}
                                    className="text-[0.55rem] font-medium tracking-[0.15em] uppercase text-black/45 font-montserrat hover:text-black transition-colors underline underline-offset-2"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}

                        {/* Loading skeleton */}
                        {loading && (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="sl-skeleton" style={{ aspectRatio: "3/4" }} />
                                ))}
                            </div>
                        )}

                        {/* Product grid */}
                        {!loading && !error && (sorted.length === 0 ? (
                            <div className="text-center py-20 bg-black/[0.015] rounded-2xl p-8 border border-black/[0.02]">
                                <p className="text-black/45 font-outfit text-sm mb-4 font-light leading-relaxed">
                                    No designs match the selected filters.
                                </p>
                                <button
                                    onClick={resetFilters}
                                    className="text-[#C5A880] text-[0.62rem] font-medium font-montserrat uppercase tracking-[0.2em] hover:text-[#1A1917] transition-colors duration-300 border-b border-[#C5A880] pb-0.5"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                                {visible.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
                            </div>
                        ))}

                        {/* Load more */}
                        {hasMore && (
                            <div className="flex justify-center mt-12 mb-4">
                                <button
                                    onClick={() => setVisibleCount((c) => c + 6)}
                                    className="px-10 py-4 bg-[#1A1917] hover:bg-black text-white text-[0.62rem] font-semibold tracking-[0.22em] uppercase font-montserrat rounded-full transition-all duration-500 hover:shadow-[0_12px_30px_rgba(0,0,0,0.14)] active:scale-[0.97]"
                                >
                                    Load More
                                </button>
                            </div>
                        )}

                        {/* WhatsApp help strip */}
                        <div className="mt-16 border-t border-black/[0.035] pt-6 text-center">
                            <p className="text-[0.78rem] text-black/45 font-outfit font-light leading-relaxed">
                                Need custom sizing, finish, or bulk pricing?{" "}
                                <a
                                    href="https://wa.me/918300904920?text=Hi!%20I'm%20interested%20in%20SANRA%20LIVING%20custom%20orders."
                                    className="text-[#1A1917] font-semibold underline underline-offset-4 hover:text-[#C5A880] transition-colors duration-300"
                                >
                                    Enquire on WhatsApp →
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MOBILE FILTER DRAWER ───────────────────────────── */}
            <AnimatePresence>
                {filterDrawerOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            onClick={() => setFilterDrawerOpen(false)}
                            className="fixed inset-0 bg-black/45 z-40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "tween", duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                            className="fixed top-0 left-0 h-full w-[88vw] max-w-[340px] bg-[#FAF9F6] z-50 overflow-y-auto border-r border-black/[0.04] flex flex-col"
                        >
                            <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.04]">
                                <h2 className="text-[0.62rem] font-semibold tracking-[0.25em] uppercase text-[#111] font-montserrat m-0">
                                    Refine By
                                </h2>
                                <button
                                    onClick={() => setFilterDrawerOpen(false)}
                                    className="p-2 rounded-full hover:bg-black/5 text-[#111]/60 transition-colors"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>

                            <div className="px-5 py-5 flex-1">
                                <FilterPanel
                                    selectedPrice={selectedPrice} setSelectedPrice={setSelectedPrice}
                                    selectedFinish={selectedFinish} setSelectedFinish={setSelectedFinish}
                                    extraFilterValues={extraFilterValues} setExtraFilterValues={setExtraFilterValues}
                                    extraFilters={config.extraFilters}
                                    onReset={resetFilters}
                                />
                            </div>

                            <div className="px-5 pb-8 pt-3 border-t border-black/[0.04]">
                                <button
                                    onClick={() => setFilterDrawerOpen(false)}
                                    className="w-full py-4 bg-[#1A1917] text-white text-[0.62rem] font-semibold tracking-[0.22em] uppercase border-none cursor-pointer font-montserrat rounded-full hover:bg-black transition-colors duration-300"
                                >
                                    View {sorted.length} Results
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
