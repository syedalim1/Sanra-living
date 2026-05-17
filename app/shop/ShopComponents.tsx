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
        "In Stock": { label: "In Stock", bg: "rgba(17,17,17,0.75)", color: "#fff" },
        "Only 12 Left": { label: "Only 12 Left", bg: "rgba(30,30,30,0.8)", color: "#fff" },
        "Only 3 Left": { label: "Only 3 Left", bg: "rgba(20,20,20,0.85)", color: "#fff" },
        New: { label: "New", bg: "rgba(255,255,255,0.9)", color: "#111", border: "1px solid rgba(0,0,0,0.12)" },
        Limited: { label: "Limited", bg: "rgba(60,60,60,0.8)", color: "#fff" },
    };
    const cfg = map[status] ?? { label: status, bg: "rgba(60,60,60,0.82)", color: "#fff" };
    return (
        <span
            style={{
                position: "absolute",
                top: 9,
                left: 9,
                zIndex: 10,
                fontSize: "0.48rem",
                fontWeight: 550,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "0.17rem 0.45rem",
                background: cfg.bg,
                color: cfg.color,
                border: cfg.border ?? "none",
                fontFamily: FM,
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                borderRadius: "3px",
                lineHeight: 1.6,
            }}
        >
            {cfg.label}
        </span>
    );
}

export function ProductCard({ product, index, badge, buttonText = "View Details" }: { product: Product; index: number; badge?: string; buttonText?: string }) {
    const priceDisplay = `₹${product.price.toLocaleString("en-IN")}`;
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
            className="group flex flex-col cursor-pointer bg-transparent overflow-hidden h-full transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-0.5"
        >
            {/* Image Area */}
            <div className="relative aspect-[4/5] overflow-hidden bg-[#f2f2f0] mb-3 rounded-xl md:rounded-2xl" style={{ boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04)" }}>
                {badge ? (
                    <StockBadge status={badge} />
                ) : (
                    <StockBadge status={product.stock_status} />
                )}
                <img
                    src={
                        optimizeImage(product.image_url, 600) ||
                        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80"
                    }
                    alt={product.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-contain object-center transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:opacity-0 group-hover:scale-[1.03] mix-blend-darken p-3 md:p-5"
                />
                <img
                    src={
                        optimizeImage(product.hover_image_url, 600) ||
                        optimizeImage(product.image_url, 600) ||
                        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80"
                    }
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-contain object-center opacity-0 transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:opacity-100 group-hover:scale-[1.03] mix-blend-darken p-3 md:p-5"
                />
            </div>

            {/* Card Body */}
            <div className="flex flex-col flex-1 px-0.5 pb-2">
                <h3 className="text-[0.78rem] md:text-[0.85rem] font-[430] text-[#111] font-montserrat mb-0.5 line-clamp-2 leading-[1.35] tracking-tight">
                    {product.title}
                </h3>
                <p className="text-[0.55rem] text-black/30 font-outfit mb-1.5 uppercase tracking-[0.16em]">
                    {product.category}
                </p>

                <div className="mt-auto">
                    <p className="text-[0.82rem] font-medium text-[#111] font-montserrat tracking-tight">
                        {priceDisplay}
                    </p>
                </div>
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
