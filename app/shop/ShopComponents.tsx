"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { optimizeImage } from "@/utils/cloudinary";

/* ── FONTS ─────────────────────────────────────────────────── */
export const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
export const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

/* ── TOKENS ────────────────────────────────────────────────── */
export const C = {
    black: "#111111",
    dark: "#1A1917",
    mid: "#4E4E4C",
    muted: "#8A8A87",
    border: "rgba(17, 17, 17, 0.05)",
    bg: "#FAF9F6",
    white: "#FFFFFF",
    gold: "#C5A880",
};

/* ── TYPES ─────────────────────────────────────────────────── */
export interface Product {
    id: string;
    title: string;
    subtitle?: string;
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

/* ── SORT OPTIONS ──────────────────────────────────────────── */
export const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low", "Newest"];

/* ── STOCK BADGE ───────────────────────────────────────────── */
export function StockBadge({ status }: { status: string }) {
    const map: Record<string, { label: string; bg: string; color: string }> = {
        "In Stock": { label: "Ships Fast", bg: "#1A1917", color: "#FFFFFF" },
        "Only 12 Left": { label: "Selling Fast", bg: "#1A1917", color: "#FFFFFF" },
        "Only 3 Left": { label: "Only 3 Left", bg: "#8E7557", color: "#FFFFFF" },
        "New Arrival": { label: "New Arrival", bg: "#1A1917", color: "#FFFFFF" },
        "Best Seller": { label: "Best Seller", bg: "#1A1917", color: "#FFFFFF" },
        New: { label: "New Arrival", bg: "#1A1917", color: "#FFFFFF" },
        Limited: { label: "Best Seller", bg: "#1A1917", color: "#FFFFFF" },
    };
    const cfg = map[status] ?? { label: status, bg: "#1A1917", color: "#FFFFFF" };

    return (
        <span
            className="absolute top-3 left-3 z-10 text-[0.5rem] font-semibold tracking-[0.18em] uppercase px-3 py-1.5 rounded-full font-montserrat shadow-md"
            style={{ background: cfg.bg, color: cfg.color }}
        >
            {cfg.label}
        </span>
    );
}

/* ── PRODUCT CARD ──────────────────────────────────────────── */
export function ProductCard({
    product,
    index,
    badge,
    buttonText = "View Detail",
}: {
    product: Product;
    index: number;
    badge?: string;
    buttonText?: string;
}) {
    const priceDisplay = `₹${product.price.toLocaleString("en-IN")}`;
    const mrpDisplay = `₹${Math.floor(product.price * 1.35).toLocaleString("en-IN")}`;
    const router = useRouter();
    const [imgError, setImgError] = useState(false);

    const handleCardClick = () => router.push(`/shop/${product.id}`);

    const handleButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (buttonText.toLowerCase() === "view detail") {
            handleCardClick();
        } else {
            e.stopPropagation();
            const event = new CustomEvent("add-to-cart", { detail: product });
            window.dispatchEvent(event);
        }
    };

    const primaryImg =
        !imgError
            ? optimizeImage(product.image_url, 600) ||
              "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80"
            : "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80";

    const hoverImg =
        optimizeImage(product.hover_image_url, 600) ||
        optimizeImage(product.image_url, 600) ||
        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80";

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
            onClick={handleCardClick}
            className="group flex flex-col cursor-pointer bg-transparent h-full"
        >
            {/* ── IMAGE AREA ─────────────────────────────────────── */}
            <div
                className="sl-product-img-wrap relative w-full overflow-hidden"
                style={{ aspectRatio: "3/4", borderRadius: 14, background: "#F5F4F0" }}
            >
                {/* Stock Badge */}
                {badge ? <StockBadge status={badge} /> : <StockBadge status={product.stock_status} />}

                {/* Wishlist */}
                <button
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-[#1A1917]/40 hover:text-red-500 transition-all shadow-sm duration-300 flex items-center justify-center"
                    aria-label="Add to wishlist"
                >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                </button>

                {/* Primary Image */}
                <img
                    src={primaryImg}
                    alt={product.title}
                    loading="lazy"
                    onError={() => setImgError(true)}
                    className="sl-product-img-primary"
                />

                {/* Hover Image */}
                <img
                    src={hoverImg}
                    alt=""
                    loading="lazy"
                    className="sl-product-img-hover"
                />

                {/* Desktop hover CTA bar */}
                <div className="absolute bottom-3 left-3 right-3 z-20 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-450 ease-[cubic-bezier(0.16,1,0.3,1)] hidden md:block">
                    <button
                        onClick={handleButtonClick}
                        className="w-full py-3 bg-[#1A1917] hover:bg-black text-white text-[0.58rem] font-semibold tracking-[0.22em] uppercase font-montserrat rounded-full shadow-lg transition-all duration-300 border-none cursor-pointer"
                    >
                        {buttonText}
                    </button>
                </div>
            </div>

            {/* ── CARD BODY ──────────────────────────────────────── */}
            <div className="flex flex-col flex-1 pt-3 pb-1 px-0.5">
                {/* Category & finish */}
                <p className="text-[0.55rem] font-montserrat mb-1 uppercase tracking-[0.18em] font-medium text-black/35 flex items-center gap-1.5 truncate">
                    <span className="text-[#C5A880] truncate">{product.category}</span>
                    <span className="text-black/20 flex-shrink-0">•</span>
                    <span className="text-[#C5A880] normal-case font-normal truncate">{product.finish || "Mirror Polish"}</span>
                </p>

                {/* Title */}
                <h3
                    className="text-[0.85rem] sm:text-[0.9rem] font-medium text-[#111] font-montserrat mb-2 leading-snug tracking-tight group-hover:text-[#C5A880] transition-colors duration-300"
                    style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                >
                    {product.title}
                </h3>

                {/* Price row */}
                <div className="mt-auto flex items-center justify-between gap-2">
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-[0.92rem] sm:text-[1rem] font-bold text-[#111] font-montserrat tracking-tight">
                            {priceDisplay}
                        </span>
                        <span className="text-[0.7rem] text-black/30 font-outfit font-light line-through">
                            {mrpDisplay}
                        </span>
                    </div>

                    {/* Colour swatches */}
                    <div className="flex gap-1 flex-shrink-0">
                        <span className="w-3 h-3 rounded-full bg-[#1A1917] border border-black/10 shadow-sm cursor-pointer hover:scale-110 transition-transform duration-300" title="Carbon Matte" />
                        <span className="w-3 h-3 rounded-full bg-[#E5E2DA] border border-black/10 shadow-sm cursor-pointer hover:scale-110 transition-transform duration-300" title="Satin Stainless" />
                        <span className="w-3 h-3 rounded-full bg-[#C5A880] border border-black/10 shadow-sm cursor-pointer hover:scale-110 transition-transform duration-300" title="Champagne Gold" />
                    </div>
                </div>

                {/* Mobile CTA — always visible */}
                <button
                    onClick={handleButtonClick}
                    className="w-full mt-3 py-2.5 bg-[#1A1917] hover:bg-black text-white text-[0.58rem] font-semibold tracking-[0.2em] uppercase font-montserrat rounded-full transition-all duration-300 md:hidden border-none cursor-pointer"
                >
                    {buttonText}
                </button>
            </div>
        </motion.div>
    );
}

/* ── FILTER SECTION ────────────────────────────────────────── */
export function FilterSection({
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
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-black/[0.035] py-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center bg-transparent border-none cursor-pointer p-0 group"
            >
                <span className="font-medium font-montserrat text-[0.62rem] tracking-[0.18em] uppercase text-[#111]/80 group-hover:text-black/55 transition-colors duration-300">
                    {title}
                </span>
                <svg
                    width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                    className={`text-black/40 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "rotate-180" : "rotate-0"}`}
                >
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>
            <div
                className="grid transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
                <div className="overflow-hidden">
                    <div className={`flex flex-col gap-1 transition-all duration-400 ${isOpen ? "mt-3.5 pb-1" : "mt-0"}`}>
                        {options.map((opt) => {
                            const active = selected === opt;
                            return (
                                <button
                                    key={opt}
                                    onClick={() => onSelect(opt)}
                                    className={`w-full text-left py-1.5 text-[0.78rem] font-outfit cursor-pointer border-none flex items-center gap-2.5 transition-all duration-200
                                        ${active ? "text-[#111]" : "text-black/45 hover:text-black/75 bg-transparent"}`}
                                    style={{ background: "transparent" }}
                                >
                                    <span className={`inline-flex w-[4px] h-[4px] rounded-full flex-shrink-0 border transition-all duration-300 ${active ? "bg-[#C5A880] border-[#C5A880] scale-125" : "bg-transparent border-black/15"}`} />
                                    <span className={`leading-[1.3] ${active ? "font-medium" : "font-light"}`}>{opt}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
