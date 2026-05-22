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
    const map: Record<string, { label: string; bg: string; color: string; border?: string }> = {
        "In Stock": { label: "Ships Fast", bg: "rgba(26, 25, 23, 0.95)", color: "#C5A880", border: "1px solid rgba(197, 168, 128, 0.15)" },
        "Only 12 Left": { label: "Selling Fast", bg: "#1A1917", color: "#FFFFFF" },
        "Only 3 Left": { label: "Only 3 Left", bg: "#8E7557", color: "#FFFFFF" },
        New: { label: "New Arrival", bg: "#C5A880", color: "#1A1917" },
        Limited: { label: "Best Seller", bg: "#1A1917", color: "#C5A880", border: "1px solid rgba(197, 168, 128, 0.2)" },
    };
    const cfg = map[status] ?? { label: status, bg: "rgba(26, 25, 23, 0.9)", color: "#FAF9F6", border: "1px solid rgba(17,17,17,0.06)" };
    return (
        <span
            className="absolute top-4 left-4 z-10 text-[0.52rem] font-medium tracking-[0.2em] uppercase px-3 py-1.5 rounded-full shadow-sm font-montserrat backdrop-blur-md transition-all duration-300"
            style={{
                background: cfg.bg,
                color: cfg.color,
                border: cfg.border ?? "none",
            }}
        >
            {cfg.label}
        </span>
    );
}

export function ProductCard({ product, index, badge, buttonText = "Quick Add" }: { product: Product; index: number; badge?: string; buttonText?: string }) {
    const priceDisplay = `₹${product.price.toLocaleString("en-IN")}`;
    const mrpDisplay = `₹${Math.floor(product.price * 1.35).toLocaleString("en-IN")}`;
    const router = useRouter();

    const handleCardClick = () => {
        router.push(`/shop/${product.id}`);
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Custom event or dispatch for Add to Cart
        const event = new CustomEvent("add-to-cart", { detail: product });
        window.dispatchEvent(event);
        console.log("Added to cart:", product.id);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
            onClick={handleCardClick}
            className="group flex flex-col cursor-pointer bg-transparent overflow-hidden h-full transition-all duration-500"
        >
            {/* Image Area: Floating on soft background */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#F5F4F0] border border-black/[0.015] p-8 md:p-12 flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-[#EFECE6]">
                {badge ? (
                    <StockBadge status={badge} />
                ) : (
                    <StockBadge status={product.stock_status} />
                )}
                
                {/* Heart Icon (Top Right) */}
                <button 
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-[#FAF9F6]/85 backdrop-blur-md text-[#1A1917]/40 hover:text-red-500 hover:bg-[#FAF9F6] hover:scale-105 transition-all shadow-sm duration-300"
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>

                <img
                    src={
                        optimizeImage(product.image_url, 600) ||
                        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80"
                    }
                    alt={product.title}
                    loading="lazy"
                    className="w-full h-full object-contain object-center scale-[0.92] transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[0.96] group-hover:opacity-0"
                />
                <img
                    src={
                        optimizeImage(product.hover_image_url, 600) ||
                        optimizeImage(product.image_url, 600) ||
                        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80"
                    }
                    alt=""
                    loading="lazy"
                    className="absolute w-full h-full object-contain object-center scale-[0.92] opacity-0 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:scale-[0.96] p-8 md:p-12"
                />

                {/* Quick Add Hover Bar */}
                <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-20 hidden md:block">
                    <button 
                        onClick={handleAddToCart}
                        className="w-full py-3.5 bg-[#1A1917] hover:bg-black text-[#C5A880] text-[0.6rem] font-medium tracking-[0.22em] uppercase font-montserrat rounded-full shadow-lg transition-all duration-300"
                    >
                        {buttonText}
                    </button>
                </div>
            </div>

            {/* Card Body */}
            <div className="flex flex-col flex-1 pt-4 pb-2 px-1">
                {/* Category & Finish Tags */}
                <p className="text-[0.58rem] text-black/40 font-outfit mb-1.5 uppercase tracking-[0.15em] font-light flex items-center gap-2">
                    {product.category}
                    <span className="w-1 h-1 rounded-full bg-[#C5A880]/35"></span>
                    <span className="text-[#C5A880] font-normal tracking-wide capitalize">{product.finish || 'Engineered Steel'}</span>
                </p>

                {/* Title */}
                <h3 className="text-[0.92rem] font-light text-[#111] font-montserrat mb-2.5 line-clamp-1 leading-normal tracking-tight group-hover:text-[#C5A880] transition-colors duration-300">
                    {product.title}
                </h3>

                {/* Price and Swatches */}
                <div className="mt-auto flex items-center justify-between">
                    <div>
                        <p className="flex items-baseline gap-2 m-0">
                            <span className="text-[0.95rem] font-semibold text-[#111] font-montserrat tracking-tight">
                                {priceDisplay}
                            </span>
                            <span className="text-[0.75rem] text-black/30 font-outfit font-light line-through decoration-black/15">
                                {mrpDisplay}
                            </span>
                        </p>
                    </div>
                    
                    {/* Premium Finished Swatches */}
                    <div className="flex gap-1.5">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#1A1917] border border-black/10 shadow-sm cursor-pointer hover:scale-110 transition-transform duration-300" title="Carbon Matte"></span>
                        <span className="w-3.5 h-3.5 rounded-full bg-[#E5E2DA] border border-black/10 shadow-sm cursor-pointer hover:scale-110 transition-transform duration-300" title="Satin Stainless"></span>
                        <span className="w-3.5 h-3.5 rounded-full bg-[#C5A880] border border-black/10 shadow-sm cursor-pointer hover:scale-110 transition-transform duration-300" title="Champagne Gold"></span>
                    </div>
                </div>

                {/* Mobile Add to Cart (shows only on mobile) */}
                <button 
                    onClick={handleAddToCart}
                    className="w-full mt-4 py-3 bg-[#1A1917] hover:bg-black text-[#C5A880] text-[0.6rem] font-medium tracking-[0.2em] uppercase font-montserrat rounded-full transition-all duration-300 md:hidden border-none"
                >
                    {buttonText}
                </button>
            </div>
        </motion.div>
    );
}

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
                    className={`text-black/40 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                >
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>
            <div className="grid transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
                <div className="overflow-hidden">
                    <div className={`flex flex-col gap-1 transition-all duration-400 ${isOpen ? 'mt-3.5 pb-1' : 'mt-0'}`}>
                        {options.map((opt) => {
                            const active = selected === opt;
                            return (
                                <button
                                    key={opt}
                                    onClick={() => onSelect(opt)}
                                    className={`w-full text-left py-1.5 text-[0.78rem] font-outfit cursor-pointer border-none flex items-center gap-2.5 transition-all duration-200
                                        ${active ? 'text-[#111]' : 'text-black/45 hover:text-black/75 bg-transparent'}
                                    `}
                                    style={{ background: "transparent" }}
                                >
                                    <span className={`inline-flex w-[4px] h-[4px] rounded-full flex-shrink-0 border transition-all duration-300 ${active ? 'bg-[#C5A880] border-[#C5A880] scale-125' : 'bg-transparent border-black/15'}`} />
                                    <span className={`leading-[1.3] ${active ? 'font-medium' : 'font-light'}`}>{opt}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
