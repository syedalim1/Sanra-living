"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// ─── DATA ────────────────────────────────────────────────────────────────────

type StockStatus = "In Stock" | "Only 12 Left" | "Only 3 Left" | "New" | "Limited";

interface Product {
    id: number;
    title: string;
    subtitle: string;
    price: number;
    priceDisplay: string;
    category: string;
    finish: string;
    stock: StockStatus;
    image: string;
    hoverImage: string;
    warranty: string;
    isNew?: boolean;
}

const products: Product[] = [
    {
        id: 1,
        title: "SL Edge",
        subtitle: "Entryway Steel Organizer",
        price: 2499,
        priceDisplay: "₹2,499",
        category: "Entryway Storage",
        finish: "Matte Black",
        stock: "In Stock",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
        hoverImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
        warranty: "10 Year Warranty Included",
    },
    {
        id: 2,
        title: "SL Apex",
        subtitle: "Wall-Mount Study Desk",
        price: 5499,
        priceDisplay: "₹5,499",
        category: "Study Desks",
        finish: "Graphite Grey",
        stock: "Only 12 Left",
        image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80",
        hoverImage: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600&q=80",
        warranty: "10 Year Warranty Included",
    },
    {
        id: 3,
        title: "SL Vault",
        subtitle: "Modular Wall Storage System",
        price: 8999,
        priceDisplay: "₹8,999",
        category: "Wall Storage",
        finish: "Matte Black",
        stock: "In Stock",
        image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&q=80",
        hoverImage: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&q=80",
        warranty: "10 Year Warranty Included",
        isNew: true,
    },
    {
        id: 4,
        title: "SL Crest",
        subtitle: "Steel Magazine & Key Holder",
        price: 1299,
        priceDisplay: "₹1,299",
        category: "Entryway Storage",
        finish: "Graphite Grey",
        stock: "New",
        image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&q=80",
        hoverImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
        warranty: "10 Year Warranty Included",
        isNew: true,
    },
    {
        id: 5,
        title: "SL Slate",
        subtitle: "Standing Study Desk – Height Adjust",
        price: 12999,
        priceDisplay: "₹12,999",
        category: "Study Desks",
        finish: "Matte Black",
        stock: "Only 3 Left",
        image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80",
        hoverImage: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80",
        warranty: "10 Year Warranty Included",
    },
    {
        id: 6,
        title: "SL Grid",
        subtitle: "Pegboard Wall Storage",
        price: 3499,
        priceDisplay: "₹3,499",
        category: "Wall Storage",
        finish: "Graphite Grey",
        stock: "In Stock",
        image: "https://images.unsplash.com/photo-1493663284031-b7e3aaa4e00f?w=600&q=80",
        hoverImage: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&q=80",
        warranty: "10 Year Warranty Included",
    },
    {
        id: 7,
        title: "SL Mono",
        subtitle: "Minimalist Entryway Shelf",
        price: 1899,
        priceDisplay: "₹1,899",
        category: "Entryway Storage",
        finish: "Matte Black",
        stock: "Limited",
        image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80",
        hoverImage: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80",
        warranty: "10 Year Warranty Included",
    },
    {
        id: 8,
        title: "SL Frame",
        subtitle: "Wall Display Frame Storage",
        price: 6299,
        priceDisplay: "₹6,299",
        category: "Wall Storage",
        finish: "Graphite Grey",
        stock: "In Stock",
        image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&q=80",
        hoverImage: "https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=600&q=80",
        warranty: "10 Year Warranty Included",
    },
    {
        id: 9,
        title: "SL Pro Desk",
        subtitle: "Corner Steel Study Station",
        price: 9499,
        priceDisplay: "₹9,499",
        category: "Study Desks",
        finish: "Matte Black",
        stock: "New",
        image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=600&q=80",
        hoverImage: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600&q=80",
        warranty: "10 Year Warranty Included",
        isNew: true,
    },
];

const categories = ["All", "Entryway Storage", "Study Desks", "Wall Storage"];
const priceRanges = ["All", "₹999 – ₹2999", "₹3000 – ₹7999", "₹8000+"];
const finishes = ["All", "Matte Black", "Graphite Grey"];
const availability = ["All", "In Stock", "Limited Stock"];
const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low", "Newest"];

// ─── STOCK BADGE ─────────────────────────────────────────────────────────────

function StockBadge({ status }: { status: StockStatus }) {
    const config: Record<StockStatus, { label: string; cls: string }> = {
        "In Stock": { label: "In Stock", cls: "bg-[#111111] text-white" },
        "Only 12 Left": { label: "Only 12 Left", cls: "bg-[#4A4A4A] text-white" },
        "Only 3 Left": { label: "Only 3 Left", cls: "bg-[#2a2a2a] text-white" },
        "New": { label: "New", cls: "bg-white text-[#111111] border border-[#111111]" },
        "Limited": { label: "Limited", cls: "bg-[#3a3a3a] text-white" },
    };
    const { label, cls } = config[status];
    return (
        <span
            className={`absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-[0.12em] px-2.5 py-1 z-10 ${cls}`}
            style={{ fontFamily: "Montserrat, sans-serif" }}
        >
            {label}
        </span>
    );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────

function ProductCard({ product, index }: { product: Product; index: number }) {
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.07 }}
            className="bg-white group cursor-pointer flex flex-col"
            style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Image */}
            <div className="relative overflow-hidden aspect-square bg-[#F9F9F9]">
                <StockBadge status={product.stock} />

                {/* Primary Image */}
                <img
                    src={product.image}
                    alt={product.title}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${hovered ? "opacity-0" : "opacity-100"
                        }`}
                    loading="lazy"
                />
                {/* Hover Image */}
                <img
                    src={product.hoverImage}
                    alt={`${product.title} alternate view`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${hovered ? "opacity-100" : "opacity-0"
                        }`}
                    loading="lazy"
                />

                {/* Subtle overlay on hover */}
                <div
                    className={`absolute inset-0 bg-[#111111]/5 transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"
                        }`}
                />
            </div>

            {/* Card Body */}
            <div className="p-5 flex flex-col flex-1">
                <h3
                    className="text-[#111111] font-semibold text-base leading-tight tracking-wide"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                    {product.title}
                </h3>
                <p
                    className="text-[#555555] text-sm font-light mt-1 mb-3"
                    style={{ fontFamily: "Outfit, sans-serif" }}
                >
                    {product.subtitle}
                </p>

                <div className="mt-auto">
                    <p
                        className="text-[#111111] text-xl font-bold tracking-tight mb-1"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        {product.priceDisplay}
                    </p>
                    <p className="text-[#888888] text-[11px] tracking-wide uppercase mb-4">
                        {product.warranty}
                    </p>

                    <Link href={`/shop/${product.id}`}>
                        <button
                            className={`w-full py-3 text-sm font-semibold uppercase tracking-[0.15em] transition-all duration-400 border ${hovered
                                ? "bg-[#1C1C1C] text-white border-[#1C1C1C]"
                                : "bg-transparent text-[#1C1C1C] border-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-white"
                                }`}
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                            View Details
                        </button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}

// ─── FILTER SECTION ─────────────────────────────────────────────────────────

function FilterSection({
    title,
    options,
    selected,
    onSelect,
}: {
    title: string;
    options: string[];
    selected: string;
    onSelect: (v: string) => void;
}) {
    return (
        <div className="mb-7">
            <h4
                className="text-[#111111] text-xs font-bold uppercase tracking-[0.2em] mb-3 pb-2 border-b border-[#E5E5E5]"
                style={{ fontFamily: "Montserrat, sans-serif" }}
            >
                {title}
            </h4>
            <ul className="space-y-2">
                {options.map((opt) => (
                    <li key={opt}>
                        <button
                            onClick={() => onSelect(opt)}
                            className={`w-full text-left text-sm py-1 px-2 transition-all duration-200 rounded-sm ${selected === opt
                                ? "text-[#111111] font-semibold bg-[#F0F0F0]"
                                : "text-[#666666] hover:text-[#111111] hover:bg-[#F5F5F5]"
                                }`}
                            style={{ fontFamily: "Outfit, sans-serif" }}
                        >
                            {selected === opt && (
                                <span className="inline-block w-2 h-2 bg-[#111111] rounded-full mr-2 align-middle" />
                            )}
                            {opt}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function ShopPage() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedPrice, setSelectedPrice] = useState("All");
    const [selectedFinish, setSelectedFinish] = useState("All");
    const [selectedAvailability, setSelectedAvailability] = useState("All");
    const [selectedSort, setSelectedSort] = useState("Featured");
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(9);

    // Filter logic
    const filtered = products.filter((p) => {
        if (selectedCategory !== "All" && p.category !== selectedCategory) return false;
        if (selectedFinish !== "All" && p.finish !== selectedFinish) return false;
        if (selectedAvailability === "In Stock" && p.stock !== "In Stock") return false;
        if (selectedAvailability === "Limited Stock" && p.stock !== "Only 12 Left" && p.stock !== "Only 3 Left" && p.stock !== "Limited") return false;
        if (selectedPrice === "₹999 – ₹2999" && (p.price < 999 || p.price > 2999)) return false;
        if (selectedPrice === "₹3000 – ₹7999" && (p.price < 3000 || p.price > 7999)) return false;
        if (selectedPrice === "₹8000+" && p.price < 8000) return false;
        return true;
    });

    // Sort logic
    const sorted = [...filtered].sort((a, b) => {
        if (selectedSort === "Price: Low to High") return a.price - b.price;
        if (selectedSort === "Price: High to Low") return b.price - a.price;
        if (selectedSort === "Newest") return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        return 0;
    });

    const visible = sorted.slice(0, visibleCount);
    const hasMore = visibleCount < sorted.length;

    // Lock body scroll when filter drawer open on mobile
    useEffect(() => {
        document.body.style.overflow = filterDrawerOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [filterDrawerOpen]);

    return (
        <main className="bg-[#F5F5F5] min-h-screen selection:bg-[#111111]/20">
            {/* ── SANRA LIVING MINI HEADER ── */}
            <div
                className="bg-[#111111] text-white py-3 px-6 flex items-center justify-between"
                style={{ fontFamily: "Montserrat, sans-serif" }}
            >
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 group-hover:text-white transition-colors">
                        ← Almond
                    </span>
                </Link>
                <span className="text-xs uppercase tracking-[0.4em] font-semibold text-white">
                    SANRA LIVING™
                </span>
                <Link href="/contact">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors">
                        Contact
                    </span>
                </Link>
            </div>

            {/* ── SECTION 1: SHOP HEADER ── */}
            <section className="bg-white border-b border-[#E8E8E8] px-6 md:px-10 lg:px-16 py-8">
                <div className="max-w-[1200px] mx-auto">
                    {/* Breadcrumb */}
                    <p className="text-[#888888] text-xs uppercase tracking-[0.2em] mb-5" style={{ fontFamily: "Outfit, sans-serif" }}>
                        <Link href="/" className="hover:text-[#111111] transition-colors">Home</Link>
                        <span className="mx-2">/</span>
                        <span className="text-[#111111]">Shop</span>
                    </p>

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <div>
                            <h1
                                className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#111111] leading-tight tracking-tight"
                                style={{ fontFamily: "Montserrat, sans-serif" }}
                            >
                                Shop Collection
                            </h1>
                            <p className="text-[#555555] text-sm md:text-base mt-2 font-light" style={{ fontFamily: "Outfit, sans-serif" }}>
                                Premium steel furniture engineered for modern homes.
                            </p>
                        </div>

                        {/* Sort (Desktop) */}
                        <div className="hidden md:flex items-center gap-3">
                            <label className="text-[#888888] text-xs uppercase tracking-[0.2em]" style={{ fontFamily: "Montserrat, sans-serif" }}>
                                Sort By
                            </label>
                            <select
                                value={selectedSort}
                                onChange={(e) => setSelectedSort(e.target.value)}
                                className="border border-[#DDDDDD] bg-white text-[#111111] text-sm px-4 py-2.5 focus:outline-none focus:border-[#111111] transition-colors"
                                style={{ fontFamily: "Outfit, sans-serif" }}
                            >
                                {sortOptions.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── MAIN CONTENT: FILTER + GRID ── */}
            <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 py-10">
                <div className="flex gap-8 lg:gap-10">

                    {/* ── SECTION 2: FILTER SIDEBAR (Desktop) ── */}
                    <aside className="hidden lg:block w-56 flex-shrink-0">
                        <div className="sticky top-6">
                            <div className="bg-white p-6" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                                <h3
                                    className="text-[#111111] text-xs font-black uppercase tracking-[0.3em] mb-6 pb-3 border-b border-[#E5E5E5]"
                                    style={{ fontFamily: "Montserrat, sans-serif" }}
                                >
                                    Filters
                                </h3>

                                <FilterSection
                                    title="Category"
                                    options={categories}
                                    selected={selectedCategory}
                                    onSelect={setSelectedCategory}
                                />
                                <FilterSection
                                    title="Price Range"
                                    options={priceRanges}
                                    selected={selectedPrice}
                                    onSelect={setSelectedPrice}
                                />
                                <FilterSection
                                    title="Finish"
                                    options={finishes}
                                    selected={selectedFinish}
                                    onSelect={setSelectedFinish}
                                />
                                <FilterSection
                                    title="Availability"
                                    options={availability}
                                    selected={selectedAvailability}
                                    onSelect={setSelectedAvailability}
                                />

                                {/* Reset */}
                                <button
                                    onClick={() => {
                                        setSelectedCategory("All");
                                        setSelectedPrice("All");
                                        setSelectedFinish("All");
                                        setSelectedAvailability("All");
                                    }}
                                    className="w-full mt-2 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] border border-[#DDDDDD] text-[#555555] hover:border-[#111111] hover:text-[#111111] transition-all duration-200"
                                    style={{ fontFamily: "Montserrat, sans-serif" }}
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* ── SECTION 3: PRODUCT GRID ── */}
                    <div className="flex-1 min-w-0">
                        {/* Mobile Top Bar: Filter + Sort */}
                        <div className="flex items-center justify-between mb-6 lg:hidden">
                            <button
                                onClick={() => setFilterDrawerOpen(true)}
                                className="flex items-center gap-2 border border-[#DDDDDD] bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#111111] hover:border-[#111111] transition-all"
                                style={{ fontFamily: "Montserrat, sans-serif" }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="3" y1="6" x2="21" y2="6" /><line x1="7" y1="12" x2="17" y2="12" /><line x1="10" y1="18" x2="14" y2="18" />
                                </svg>
                                Filters
                            </button>
                            <select
                                value={selectedSort}
                                onChange={(e) => setSelectedSort(e.target.value)}
                                className="border border-[#DDDDDD] bg-white text-[#111111] text-xs px-3 py-2.5 focus:outline-none focus:border-[#111111]"
                                style={{ fontFamily: "Outfit, sans-serif" }}
                            >
                                {sortOptions.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>

                        {/* Results count */}
                        <p className="text-[#888888] text-xs uppercase tracking-[0.15em] mb-6" style={{ fontFamily: "Outfit, sans-serif" }}>
                            {sorted.length} {sorted.length === 1 ? "product" : "products"} found
                        </p>

                        {/* Grid */}
                        {sorted.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-[#888888] text-base" style={{ fontFamily: "Outfit, sans-serif" }}>
                                    No products match your selected filters.
                                </p>
                                <button
                                    onClick={() => {
                                        setSelectedCategory("All");
                                        setSelectedPrice("All");
                                        setSelectedFinish("All");
                                        setSelectedAvailability("All");
                                    }}
                                    className="mt-4 text-[#111111] underline text-sm"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[30px]">
                                {visible.map((product, i) => (
                                    <ProductCard key={product.id} product={product} index={i} />
                                ))}
                            </div>
                        )}

                        {/* ── SECTION 4: LIMITED STOCK STRIP ── */}
                        {sorted.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="my-12 py-8 px-8 bg-white border border-[#E8E8E8] text-center"
                            >
                                <div className="w-6 h-[1px] bg-[#111111] mx-auto mb-4" />
                                <p
                                    className="text-[#111111] text-sm font-semibold uppercase tracking-[0.2em] mb-2"
                                    style={{ fontFamily: "Montserrat, sans-serif" }}
                                >
                                    Limited Production Runs.
                                </p>
                                <p className="text-[#666666] text-sm font-light leading-relaxed max-w-md mx-auto" style={{ fontFamily: "Outfit, sans-serif" }}>
                                    Each product is manufactured in controlled batches to maintain quality standards.
                                </p>
                                <div className="w-6 h-[1px] bg-[#111111] mx-auto mt-4" />
                            </motion.div>
                        )}

                        {/* ── SECTION 5: LOAD MORE / PAGINATION ── */}
                        {hasMore && (
                            <div className="flex justify-center mt-4 mb-8">
                                <button
                                    onClick={() => setVisibleCount((c) => c + 6)}
                                    className="px-10 py-3.5 bg-[#1C1C1C] text-white text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#111111] transition-all duration-300"
                                    style={{ fontFamily: "Montserrat, sans-serif" }}
                                >
                                    Load More
                                </button>
                            </div>
                        )}

                        {/* ── CONVERSION BOOST: BULK ORDERS ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mt-6 mb-2"
                        >
                            <p className="text-[#888888] text-xs" style={{ fontFamily: "Outfit, sans-serif" }}>
                                Need bulk orders or custom sizing?{" "}
                                <Link href="/contact" className="text-[#111111] font-semibold underline underline-offset-2 hover:opacity-70 transition-opacity">
                                    Contact Us
                                </Link>
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* ── MOBILE FILTER DRAWER ── */}
            <AnimatePresence>
                {filterDrawerOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 z-40"
                            onClick={() => setFilterDrawerOpen(false)}
                        />
                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "tween", duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="fixed top-0 left-0 h-full w-[300px] max-w-[85vw] bg-white z-50 overflow-y-auto"
                        >
                            <div className="flex items-center justify-between p-5 border-b border-[#E8E8E8]">
                                <h2
                                    className="text-[#111111] text-xs font-black uppercase tracking-[0.3em]"
                                    style={{ fontFamily: "Montserrat, sans-serif" }}
                                >
                                    Filters
                                </h2>
                                <button
                                    onClick={() => setFilterDrawerOpen(false)}
                                    className="w-8 h-8 flex items-center justify-center text-[#111111] hover:bg-[#F5F5F5] rounded-full transition-colors"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-5">
                                <FilterSection title="Category" options={categories} selected={selectedCategory} onSelect={setSelectedCategory} />
                                <FilterSection title="Price Range" options={priceRanges} selected={selectedPrice} onSelect={setSelectedPrice} />
                                <FilterSection title="Finish" options={finishes} selected={selectedFinish} onSelect={setSelectedFinish} />
                                <FilterSection title="Availability" options={availability} selected={selectedAvailability} onSelect={setSelectedAvailability} />

                                <button
                                    onClick={() => {
                                        setSelectedCategory("All");
                                        setSelectedPrice("All");
                                        setSelectedFinish("All");
                                        setSelectedAvailability("All");
                                    }}
                                    className="w-full py-3 text-[11px] font-semibold uppercase tracking-[0.2em] border border-[#DDDDDD] text-[#555555] hover:border-[#111111] hover:text-[#111111] transition-all duration-200 mb-3"
                                    style={{ fontFamily: "Montserrat, sans-serif" }}
                                >
                                    Clear Filters
                                </button>

                                <button
                                    onClick={() => setFilterDrawerOpen(false)}
                                    className="w-full py-3 text-[11px] font-semibold uppercase tracking-[0.2em] bg-[#1C1C1C] text-white hover:bg-[#111111] transition-all duration-200"
                                    style={{ fontFamily: "Montserrat, sans-serif" }}
                                >
                                    Apply & View Results
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ── FOOTER (SANRA LIVING MINI) ── */}
            <footer className="bg-[#111111] text-white mt-16 py-12 px-6 md:px-10 lg:px-16">
                <div className="max-w-[1200px] mx-auto">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
                        <div>
                            <h4
                                className="text-white font-bold text-base tracking-[0.2em] uppercase mb-2"
                                style={{ fontFamily: "Montserrat, sans-serif" }}
                            >
                                SANRA LIVING™
                            </h4>
                            <p className="text-gray-400 text-sm font-light max-w-xs leading-relaxed" style={{ fontFamily: "Outfit, sans-serif" }}>
                                Premium steel furniture. Engineered for lasting homes.
                                A SANRA Group Brand.
                            </p>
                        </div>

                        <div className="flex gap-12">
                            <div>
                                <h5 className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-4 font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Navigate</h5>
                                <ul className="space-y-2 text-sm text-gray-400 font-light" style={{ fontFamily: "Outfit, sans-serif" }}>
                                    {[["#", "Home"], ["/shop", "Shop"], ["/about", "About"], ["/contact", "Contact"]].map(([href, label]) => (
                                        <li key={label}>
                                            <Link href={href} className="hover:text-white transition-colors">{label}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h5 className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-4 font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Policies</h5>
                                <ul className="space-y-2 text-sm text-gray-400 font-light" style={{ fontFamily: "Outfit, sans-serif" }}>
                                    {[["#", "Warranty"], ["#", "Shipping"], ["#", "Returns"], ["#", "Privacy"]].map(([href, label]) => (
                                        <li key={label}>
                                            <Link href={href} className="hover:text-white transition-colors">{label}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
                        <p className="text-gray-600 text-[11px] uppercase tracking-[0.2em]" style={{ fontFamily: "Montserrat, sans-serif" }}>
                            © {new Date().getFullYear()} SANRA LIVING™. All Rights Reserved.
                        </p>
                        <p className="text-gray-600 text-[11px] uppercase tracking-[0.2em]" style={{ fontFamily: "Montserrat, sans-serif" }}>
                            10 Year Warranty · Made in India
                        </p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
