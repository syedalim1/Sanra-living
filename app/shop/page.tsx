"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import WhatsAppFloat from "../components/WhatsAppFloat";
import { ProductCard, Product, QuickViewModal, sortOptions, FilterSection } from "./ShopComponents";
import { useCart } from "../context/CartContext";

const priceRanges = ["All", "Under ₹2,000", "₹2,000 – ₹5,000", "₹5,000 – ₹10,000", "₹10,000+"];

const SHOP_CATEGORIES_NAV = [
    { name: "Tables", slug: "tables" },
    { name: "Seating", slug: "seating" },
    { name: "Dining", slug: "dining-furniture" },
    { name: "Storage", slug: "storage" },
    { name: "Bedroom", slug: "bedroom" },
    { name: "Workspace", slug: "workspace" },
    { name: "Modular", slug: "modular" },
    { name: "Commercial", slug: "commercial" },
    { name: "Balcony & Outdoor", slug: "balcony-outdoor" },
    { name: "CNC Decor", slug: "cnc-decor" },
];

const CATEGORY_MAPPING: Record<string, string[]> = {
    "Seating": ["Seating"],
    "Tables": ["Tables", "Study Desks"],
    "Bedroom": ["Bedroom"],
    "Storage": ["Storage", "Entryway Storage", "Wall Storage"],
    "Workspace": ["Workspace"],
    "Modular": ["Modular", "Modular Systems"],
    "Commercial": ["Commercial"],
    "Balcony & Outdoor": ["Balcony & Outdoor", "Outdoor"],
    "CNC & Decor": ["CNC & Decor", "CNC & Custom", "CNC"]
};

const CATEGORIES_OPTIONS = ["All", ...Object.keys(CATEGORY_MAPPING)];

function checkProductCategoryMatch(p: Product, selectedCategory: string): boolean {
    if (selectedCategory === "All") return true;
    const dbCats = CATEGORY_MAPPING[selectedCategory];
    if (!dbCats) return false;
    return dbCats.some(c => p.category?.toLowerCase() === c.toLowerCase());
}

/* ── FilterPanel ──────────────────────────────────────────── */
function FilterPanel({
    selectedCategory, setSelectedCategory, categoryCounts,
    selectedPrice, setSelectedPrice, priceCounts,
    selectedFinish, setSelectedFinish, finishCounts,
    onReset,
    finishOptions,
}: {
    selectedCategory: string; setSelectedCategory: (v: string) => void; categoryCounts: Record<string, number>;
    selectedPrice: string; setSelectedPrice: (v: string) => void; priceCounts: Record<string, number>;
    selectedFinish: string; setSelectedFinish: (v: string) => void; finishCounts: Record<string, number>;
    onReset: () => void;
    finishOptions: string[];
}) {
    return (
        <div className="flex flex-col">
            <FilterSection title="Category" options={CATEGORIES_OPTIONS} selected={selectedCategory} onSelect={setSelectedCategory} counts={categoryCounts} />
            <FilterSection title="Price Range" options={priceRanges} selected={selectedPrice} onSelect={setSelectedPrice} counts={priceCounts} />
            <FilterSection title="Finish" options={finishOptions} selected={selectedFinish} onSelect={setSelectedFinish} counts={finishCounts} />
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

export default function ShopPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
                <div className="w-6 h-6 border-2 border-black/10 border-t-black rounded-full animate-spin" />
            </div>
        }>
            <ShopPageContent />
        </Suspense>
    );
}

function ShopPageContent() {
    const searchParams = useSearchParams();
    const q = searchParams.get("q") ?? "";

    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedPrice, setSelectedPrice] = useState("All");
    const [selectedFinish, setSelectedFinish] = useState("All");
    const [selectedSort, setSelectedSort] = useState("Featured");
    const [cols, setCols] = useState(3);
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [visibleCount, setVisibleCount] = useState(12);
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

    const { dispatch: cartDispatch } = useCart();
    
    const waLink = "https://wa.me/918300904920?text=Hi!%20I'm%20interested%20in%20SANRA%20LIVING%20steel%20furniture%20collections.";

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const url = q 
                    ? `/api/products?search=${encodeURIComponent(q)}&limit=250`
                    : `/api/products?limit=250`;
                const res = await fetch(url);
                if (!res.ok) throw new Error("Failed to load products");
                const json = await res.json();
                const fetchedProducts: Product[] = json.products ?? json ?? [];
                setAllProducts(fetchedProducts.filter(p => p.is_active));
                setVisibleCount(12);
            } catch (err) {
                setError("Could not load products. Please try again.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        })();
    }, [q]);

    useEffect(() => {
        document.body.style.overflow = filterDrawerOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [filterDrawerOpen]);

    // Reset filters
    const resetFilters = () => {
        setSelectedCategory("All");
        setSelectedPrice("All");
        setSelectedFinish("All");
    };

    // Extract unique finishes from all active products
    const uniqueFinishes = Array.from(new Set(allProducts.map(p => p.finish))).filter(Boolean).sort();
    const finishOptions = ["All", ...uniqueFinishes];

    // Apply client-side filters
    const filtered = allProducts.filter((p) => {
        // Category filter
        if (selectedCategory !== "All" && !checkProductCategoryMatch(p, selectedCategory)) return false;
        
        // Price filter
        if (selectedPrice === "Under ₹2,000" && p.price >= 2000) return false;
        if (selectedPrice === "₹2,000 – ₹5,000" && (p.price < 2000 || p.price > 5000)) return false;
        if (selectedPrice === "₹5,000 – ₹10,000" && (p.price < 5000 || p.price > 10000)) return false;
        if (selectedPrice === "₹10,000+" && p.price < 10000) return false;
        
        // Finish filter
        if (selectedFinish !== "All" && p.finish !== selectedFinish) return false;
        
        return true;
    });

    // Dynamic counts
    const categoryCounts: Record<string, number> = {};
    CATEGORIES_OPTIONS.forEach((cat) => {
        categoryCounts[cat] = allProducts.filter((p) => {
            if (selectedPrice !== "All") {
                if (selectedPrice === "Under ₹2,000" && p.price >= 2000) return false;
                if (selectedPrice === "₹2,000 – ₹5,000" && (p.price < 2000 || p.price > 5000)) return false;
                if (selectedPrice === "₹5,000 – ₹10,000" && (p.price < 5000 || p.price > 10000)) return false;
                if (selectedPrice === "₹10,000+" && p.price < 10000) return false;
            }
            if (selectedFinish !== "All" && p.finish !== selectedFinish) return false;
            if (cat === "All") return true;
            return checkProductCategoryMatch(p, cat);
        }).length;
    });

    const priceCounts: Record<string, number> = {};
    priceRanges.forEach((range) => {
        priceCounts[range] = allProducts.filter((p) => {
            if (selectedCategory !== "All" && !checkProductCategoryMatch(p, selectedCategory)) return false;
            if (selectedFinish !== "All" && p.finish !== selectedFinish) return false;
            if (range === "All") return true;
            if (range === "Under ₹2,000") return p.price < 2000;
            if (range === "₹2,000 – ₹5,000") return p.price >= 2000 && p.price <= 5000;
            if (range === "₹5,000 – ₹10,000") return p.price >= 5000 && p.price <= 10000;
            if (range === "₹10,000+") return p.price >= 10000;
            return true;
        }).length;
    });

    const finishCounts: Record<string, number> = {};
    finishOptions.forEach((fin) => {
        finishCounts[fin] = allProducts.filter((p) => {
            if (selectedCategory !== "All" && !checkProductCategoryMatch(p, selectedCategory)) return false;
            if (selectedPrice !== "All") {
                if (selectedPrice === "Under ₹2,000" && p.price >= 2000) return false;
                if (selectedPrice === "₹2,000 – ₹5,000" && (p.price < 2000 || p.price > 5000)) return false;
                if (selectedPrice === "₹5,000 – ₹10,000" && (p.price < 5000 || p.price > 10000)) return false;
                if (selectedPrice === "₹10,000+" && p.price < 10000) return false;
            }
            if (fin === "All") return true;
            return p.finish === fin;
        }).length;
    });

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
        if (selectedSort === "Price: Low to High") return a.price - b.price;
        if (selectedSort === "Price: High to Low") return b.price - a.price;
        if (selectedSort === "Newest") return (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0);
        return 0;
    });

    const visible = sorted.slice(0, visibleCount);
    const hasMore = visibleCount < sorted.length;

    const activeFilters: { label: string; reset: () => void }[] = [];
    if (selectedCategory !== "All") activeFilters.push({ label: `Category: ${selectedCategory}`, reset: () => setSelectedCategory("All") });
    if (selectedPrice !== "All") activeFilters.push({ label: selectedPrice, reset: () => setSelectedPrice("All") });
    if (selectedFinish !== "All") activeFilters.push({ label: `Finish: ${selectedFinish}`, reset: () => setSelectedFinish("All") });

    return (
        <main className="bg-[#FAF9F6] min-h-screen text-[#111111] font-outfit">
            <SiteHeader />

            {/* ── HERO HEADER ─────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-[#1A1917]" style={{ minHeight: "clamp(180px, 25vw, 280px)" }}>
                <div className="absolute inset-0 z-0">
                    <img
                        src={q 
                            ? "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80"
                            : "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=2000&q=80"
                        }
                        alt="Luxury Modern Dining Living Setup"
                        className={`w-full h-full object-cover mix-blend-luminosity ${q ? "opacity-20" : "opacity-40"}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1917] via-[#1A1917]/55 to-black/30" />
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center"
                    style={{ minHeight: "clamp(180px, 25vw, 280px)", paddingTop: "clamp(64px, 8vw, 90px)", paddingBottom: "clamp(24px, 4vw, 40px)" }}>
                    <p className="text-[0.52rem] tracking-[0.32em] uppercase text-[#C5A880] font-montserrat font-medium mb-2.5">
                        {q ? "Search Results" : "SANRA LIVING PORTFOLIO"}
                    </p>
                    <h1 className="font-light text-white font-montserrat tracking-tight leading-[1.1] mb-2"
                        style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}>
                        {q ? `Showing results for “${q}”` : "Curated Collections."}
                    </h1>
                    <p className="text-[0.8rem] text-white/55 font-light max-w-sm mx-auto leading-relaxed">
                        {q 
                            ? "Discover premium steel furniture designs matching your query."
                            : "Premium engineered steel furniture — designed for modern living, built to endure."
                        }
                    </p>
                </div>
            </section>

            {/* ── MAIN CONTENT ───────────────────────────────────── */}
            <section className="py-8 lg:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Related Categories Navigation Slider */}
                <div className="w-full overflow-x-auto pb-3 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
                    <div className="flex gap-2.5 w-max">
                        <Link
                            href="/shop"
                            className="px-5 py-2 rounded-full text-[0.6rem] font-semibold tracking-[0.18em] uppercase font-montserrat transition-all duration-300 border border-transparent shadow-sm bg-[#1A1917] text-white hover:bg-black"
                        >
                            All Products
                        </Link>
                        {SHOP_CATEGORIES_NAV.map((cat) => (
                            <Link
                                key={cat.slug}
                                href={`/shop/${cat.slug}`}
                                className="px-5 py-2 rounded-full text-[0.6rem] font-semibold tracking-[0.18em] uppercase font-montserrat transition-all duration-300 border border-black/[0.04] bg-white/50 backdrop-blur-md text-black/55 hover:text-black hover:border-black/20 hover:scale-[1.02] shadow-sm"
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex gap-8 lg:gap-12 items-start">

                    {/* ── SIDEBAR desktop ────────────────────────── */}
                    <aside className="hidden lg:block w-[220px] shrink-0 sticky top-24">
                        <h3 className="text-[0.55rem] font-semibold tracking-[0.2em] uppercase text-black font-montserrat pb-3 border-b border-black/[0.05] mb-4">
                            Refine By
                        </h3>
                        <FilterPanel
                            selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} categoryCounts={categoryCounts}
                            selectedPrice={selectedPrice} setSelectedPrice={setSelectedPrice} priceCounts={priceCounts}
                            selectedFinish={selectedFinish} setSelectedFinish={setSelectedFinish} finishCounts={finishCounts}
                            onReset={resetFilters}
                            finishOptions={finishOptions}
                        />
                    </aside>

                    {/* ── PRODUCT AREA ────────────────────────────── */}
                    <div className="flex-1 min-w-0">

                        {/* Top bar: filter trigger + count + sort + columns */}
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
                                    {loading ? "Loading…" : `${sorted.length} ${sorted.length === 1 ? "design" : "designs"} found`}
                                </p>
                            </div>

                            {/* Desktop controls: layout + sort */}
                            <div className="flex items-center gap-4">
                                {/* Columns switcher (desktop only) */}
                                <div className="hidden md:flex items-center gap-1 bg-white border border-black/10 p-0.5 rounded-full shadow-sm">
                                    <button
                                        onClick={() => setCols(3)}
                                        className={`p-1.5 rounded-full transition-all duration-300 ${cols === 3 ? "bg-[#1A1917] text-white" : "text-black/45 hover:text-black"}`}
                                        aria-label="3 Columns Grid"
                                    >
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="3" width="4" height="18" /><rect x="10" y="3" width="4" height="18" /><rect x="17" y="3" width="4" height="18" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setCols(4)}
                                        className={`p-1.5 rounded-full transition-all duration-300 ${cols === 4 ? "bg-[#1A1917] text-white" : "text-black/45 hover:text-black"}`}
                                        aria-label="4 Columns Grid"
                                    >
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="2" y="3" width="3" height="18" /><rect x="8" y="3" width="3" height="18" /><rect x="14" y="3" width="3" height="18" /><rect x="20" y="3" width="3" height="18" />
                                        </svg>
                                    </button>
                                </div>

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
                            <div className={`grid grid-cols-2 ${cols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-4 sm:gap-6 lg:gap-8`}>
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="sl-skeleton" style={{ aspectRatio: "3/4" }} />
                                ))}
                            </div>
                        )}

                        {/* Product grid or Empty state */}
                        {!loading && !error && (sorted.length === 0 ? (
                            <div className="text-center py-20 bg-black/[0.015] rounded-3xl p-12 border border-black/[0.02] max-w-xl mx-auto">
                                <p className="text-black/45 font-outfit text-sm mb-6 font-light leading-relaxed">
                                    {q 
                                        ? `No designs matched “${q}” or the selected filters. Explore our popular categories instead:`
                                        : "No designs match the selected filters."
                                    }
                                </p>
                                {q ? (
                                    <div className="flex flex-wrap justify-center gap-3">
                                        <Link href="/shop/tables" className="px-5 py-2.5 bg-white border border-black/10 hover:border-black/20 text-[0.62rem] font-semibold uppercase tracking-[0.18em] font-montserrat rounded-full transition-all hover:scale-102 shadow-sm">Tables</Link>
                                        <Link href="/shop/seating" className="px-5 py-2.5 bg-white border border-black/10 hover:border-black/20 text-[0.62rem] font-semibold uppercase tracking-[0.18em] font-montserrat rounded-full transition-all hover:scale-102 shadow-sm">Seating</Link>
                                        <Link href="/shop/bedroom" className="px-5 py-2.5 bg-white border border-black/10 hover:border-black/20 text-[0.62rem] font-semibold uppercase tracking-[0.18em] font-montserrat rounded-full transition-all hover:scale-102 shadow-sm">Bedroom</Link>
                                        <Link href="/shop/storage" className="px-5 py-2.5 bg-white border border-black/10 hover:border-black/20 text-[0.62rem] font-semibold uppercase tracking-[0.18em] font-montserrat rounded-full transition-all hover:scale-102 shadow-sm">Storage</Link>
                                    </div>
                                ) : (
                                    <button
                                        onClick={resetFilters}
                                        className="text-[#C5A880] text-[0.62rem] font-medium font-montserrat uppercase tracking-[0.2em] hover:text-[#1A1917] transition-colors duration-300 border-b border-[#C5A880] pb-0.5"
                                    >
                                        Reset Filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className={`grid grid-cols-2 ${cols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-4 sm:gap-6 lg:gap-8`}>
                                {visible.map((p, i) => (
                                    <motion.div key={p.id} layout transition={{ type: "spring", stiffness: 350, damping: 32 }}>
                                        <ProductCard key={p.id} product={p} index={i} onQuickViewClick={setQuickViewProduct} />
                                    </motion.div>
                                ))}
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
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Enquire on WhatsApp →
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── BOTTOM CTA ─────────────────────────────────── */}
                <div className="mt-14 lg:mt-20 p-8 sm:p-12 md:p-16 bg-white border border-black/[0.04] rounded-3xl text-center flex flex-col items-center shadow-sm">
                    <p className="text-[0.54rem] tracking-[0.3em] uppercase text-[#C5A880] font-montserrat font-medium mb-3">
                        TAILORED REQUISITIONS
                    </p>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-light text-black font-montserrat mb-3 tracking-tight">
                        Need Pricing or a Custom Quote?
                    </h3>
                    <p className="text-[0.85rem] text-black/45 font-light mb-8 max-w-md mx-auto leading-[1.8]">
                        Contact us for retail pricing, bulk commercial orders, and specialized project requirements.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                        <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-[#1A1917] hover:bg-black text-white text-[0.6rem] font-semibold tracking-[0.22em] uppercase font-montserrat rounded-full hover:shadow-[0_12px_30px_rgba(0,0,0,0.14)] transition-all duration-300 active:scale-[0.97]"
                        >
                            Chat on WhatsApp
                        </a>
                        <Link
                            href="/bulk-orders"
                            className="flex-1 inline-flex items-center justify-center px-7 py-4 border border-[#1A1917]/25 text-[#1A1917] text-[0.6rem] font-semibold tracking-[0.22em] uppercase font-montserrat rounded-full hover:bg-[#1A1917]/5 transition-all duration-300 active:scale-[0.97]"
                        >
                            Bulk Orders
                        </Link>
                    </div>
                </div>
            </section>

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
                                    selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} categoryCounts={categoryCounts}
                                    selectedPrice={selectedPrice} setSelectedPrice={setSelectedPrice} priceCounts={priceCounts}
                                    selectedFinish={selectedFinish} setSelectedFinish={setSelectedFinish} finishCounts={finishCounts}
                                    onReset={resetFilters}
                                    finishOptions={finishOptions}
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

            {/* ── GLASSMORPHIC QUICK VIEW MODAL ───────────────────── */}
            <AnimatePresence>
                {quickViewProduct && (
                    <QuickViewModal
                        product={quickViewProduct}
                        onClose={() => setQuickViewProduct(null)}
                        onAddToCart={(p, qty) => {
                            cartDispatch({
                                type: "ADD",
                                payload: {
                                    id: p.id,
                                    title: p.title,
                                    subtitle: p.subtitle,
                                    finish: p.finish || "Matte Black",
                                    price: p.price,
                                    image: p.image_url,
                                    qty: qty,
                                    stockQty: p.stock_qty || 99,
                                }
                            });
                        }}
                    />
                )}
            </AnimatePresence>

            <SiteFooter />
            <WhatsAppFloat />
        </main>
    );
}