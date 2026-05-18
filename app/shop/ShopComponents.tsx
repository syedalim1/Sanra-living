"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { optimizeImage } from "@/utils/cloudinary";

/* ── FONTS ─────────────────────────────────────────────────── */
export const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
export const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

/* ── TOKENS ────────────────────────────────────────────────── */
export const C = {
    black: "#111111",
    dark: "#1C1C1C",
    mid: "#555555",
    muted: "#888888",
    border: "#E8E8E8",
    bg: "#F5F5F5",
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
type StockStatus = "In Stock" | "Only 12 Left" | "Only 3 Left" | "New" | "Limited";

export function StockBadge({ status }: { status: string }) {
    const map: Record<string, { label: string; bg: string; color: string; border?: string }> = {
        "In Stock": { label: "Ships Fast", bg: "rgba(255,255,255,0.95)", color: "#111", border: "1px solid rgba(0,0,0,0.08)" },
        "Only 12 Left": { label: "Selling Fast", bg: "rgba(30,30,30,0.9)", color: "#fff" },
        "Only 3 Left": { label: "Only 3 Left", bg: "rgba(200,50,50,0.9)", color: "#fff" },
        New: { label: "New Arrival", bg: "#111", color: "#fff" },
        Limited: { label: "Best Seller", bg: "rgba(180,140,80,0.9)", color: "#fff" },
    };
    const cfg = map[status] ?? { label: status, bg: "rgba(255,255,255,0.95)", color: "#111", border: "1px solid rgba(0,0,0,0.08)" };
    return (
        <span
            className="absolute top-3 left-3 z-10 text-[0.55rem] font-bold tracking-[0.12em] uppercase px-2 py-1 rounded-[4px] shadow-sm font-montserrat backdrop-blur-md"
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
        // Placeholder for Add to Cart logic
        console.log("Added to cart:", product.id);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
            onClick={handleCardClick}
            className="group flex flex-col cursor-pointer bg-white overflow-hidden h-full transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-1 hover:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.12)] border border-black/5 rounded-xl md:rounded-2xl"
        >
            {/* Image Area */}
            <div className="relative aspect-[4/5] overflow-hidden bg-white border-b border-black/5">
                {badge ? (
                    <StockBadge status={badge} />
                ) : (
                    <StockBadge status={product.stock_status} />
                )}
                
                {/* Heart Icon (Top Right) */}
                <button 
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/70 backdrop-blur-md text-black/40 hover:text-red-500 hover:bg-white transition-all shadow-sm"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                    className="absolute inset-0 w-full h-full object-contain object-center transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.05] p-2 md:p-4 bg-[#f8f8f8]"
                />
                <img
                    src={
                        optimizeImage(product.hover_image_url, 600) ||
                        optimizeImage(product.image_url, 600) ||
                        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80"
                    }
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-contain object-center opacity-0 transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:opacity-100 group-hover:scale-[1.05] p-2 md:p-4 bg-[#f8f8f8]"
                />

                {/* Quick Add Hover Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)] z-20 hidden md:block">
                    <button 
                        onClick={handleAddToCart}
                        className="w-full py-3 bg-black/95 text-white text-[0.65rem] font-bold tracking-[0.15em] uppercase font-montserrat rounded-lg shadow-lg hover:bg-black transition-colors"
                    >
                        {buttonText}
                    </button>
                </div>
            </div>

            {/* Card Body */}
            <div className="flex flex-col flex-1 p-4 md:p-5">
              

                {/* Title & Tags */}
                <h3 className="text-[0.95rem] md:text-[1.05rem] font-semibold text-[#111] font-montserrat mb-1 line-clamp-2 leading-[1.3] tracking-tight">
                    {product.title}
                </h3>
                <p className="text-[0.65rem] text-black/40 font-outfit mb-3 uppercase tracking-[0.1em] font-medium flex items-center gap-2">
                    {product.category}
                    <span className="w-1 h-1 rounded-full bg-black/20"></span>
                    <span className="text-black/60 capitalize tracking-normal">{product.finish || 'Engineered Steel'}</span>
                </p>

                {/* Price and Swatches */}
                <div className="mt-auto pt-2 flex items-end justify-between">
                    <div>
                        <p className="flex items-baseline gap-2">
                            <span className="text-[1rem] md:text-[1.1rem] font-bold text-[#111] font-montserrat tracking-tight">
                                {priceDisplay}
                            </span>
                            <span className="text-[0.75rem] text-black/30 font-outfit line-through decoration-black/20">
                                {mrpDisplay}
                            </span>
                        </p>
                    </div>
                    
                    {/* Swatches */}
                    <div className="flex gap-1.5 pb-1">
                        <span className="w-4 h-4 rounded-full bg-[#111] border border-black/10 shadow-inner"></span>
                        <span className="w-4 h-4 rounded-full bg-[#E5E5E5] border border-black/10 shadow-inner"></span>
                        <span className="w-4 h-4 rounded-full bg-[#8C8C8C] border border-black/10 shadow-inner"></span>
                    </div>
                </div>

                {/* Mobile Add to Cart (shows only on mobile) */}
                <button 
                    onClick={handleAddToCart}
                    className="w-full mt-4 py-2.5 bg-[#f5f5f5] text-black text-[0.65rem] font-bold tracking-[0.15em] uppercase font-montserrat rounded-lg hover:bg-black hover:text-white transition-colors md:hidden border border-black/5"
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
        <div className="border-b border-black/[0.035] py-3">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full flex justify-between items-center bg-transparent border-none cursor-pointer p-0 group"
            >
                <span className="font-medium font-montserrat text-[0.6rem] tracking-[0.16em] uppercase text-[#111]/80 group-hover:text-black/40 transition-colors duration-300">
                    {title}
                </span>
                <svg
                    width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                    className={`text-black/40 transition-transform duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                >
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>
            <div className="grid transition-all duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)]" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
                <div className="overflow-hidden">
                    <div className={`flex flex-col gap-0.5 transition-all duration-400 ${isOpen ? 'mt-2.5 pb-1' : 'mt-0'}`}>
                        {options.map((opt) => {
                            const active = selected === opt;
                            return (
                                <button
                                    key={opt}
                                    onClick={() => onSelect(opt)}
                                    className={`w-full text-left py-[5px] text-[0.75rem] font-outfit cursor-pointer border-none flex items-center gap-2.5 transition-all duration-200
                                        ${active ? 'text-[#111]' : 'text-black/38 hover:text-black/65 bg-transparent'}
                                    `}
                                    style={{ background: "transparent" }}
                                >
                                    <span className={`inline-flex w-[4px] h-[4px] rounded-full flex-shrink-0 border transition-all duration-300 ${active ? 'bg-black border-black scale-110' : 'bg-transparent border-black/20'}`} />
                                    <span className={`leading-[1.3] ${active ? 'font-[470]' : 'font-[380]'}`}>{opt}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
