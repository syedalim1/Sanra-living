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
        "In Stock": { label: "In Stock", bg: "#111", color: "#fff" },
        "Only 12 Left": { label: "Only 12 Left", bg: "#3a3a3a", color: "#fff" },
        "Only 3 Left": { label: "Only 3 Left", bg: "#1C1C1C", color: "#fff" },
        New: { label: "New", bg: "#fff", color: "#111", border: "1px solid #111" },
        Limited: { label: "Limited", bg: "#555", color: "#fff" },
    };
    const cfg = map[status] ?? { label: status, bg: "#555", color: "#fff" };
    return (
        <span
            style={{
                position: "absolute",
                top: 12,
                left: 12,
                zIndex: 10,
                fontSize: "0.62rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "0.3rem 0.65rem",
                background: cfg.bg,
                color: cfg.color,
                border: cfg.border ?? "none",
                fontFamily: FM,
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
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
            onClick={handleCardClick}
            className="group flex flex-col cursor-pointer bg-transparent overflow-hidden h-full rounded-2xl transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1"
        >
            {/* Image Area */}
            <div className="relative aspect-[4/5] overflow-hidden bg-[#F9F9F9] mb-4">
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
                    className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 group-hover:opacity-0 group-hover:scale-105"
                />
                <img
                    src={
                        optimizeImage(product.hover_image_url, 600) ||
                        optimizeImage(product.image_url, 600) ||
                        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80"
                    }
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
                />
            </div>

            {/* Card Body */}
            <div className="flex flex-col flex-1 text-center px-4 pb-4">
                <h3 className="text-sm md:text-base font-medium text-black font-montserrat mb-1 line-clamp-2 leading-tight tracking-tight">
                    {product.title}
                </h3>
                <p className="text-[0.65rem] text-gray-400 font-outfit mb-3 uppercase tracking-widest">
                    {product.category}
                </p>

                <div className="mt-auto">
                    <p className="text-sm font-semibold text-black font-montserrat tracking-tight mb-4">
                        {priceDisplay}
                    </p>

                    <div className="flex justify-center opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <button
                            onClick={handleAddToCart}
                            className="w-fit px-6 h-8 text-[0.6rem] font-bold tracking-[0.2em] uppercase font-montserrat text-black border border-black/20 rounded-full transition-all duration-300 hover:bg-black hover:text-white hover:border-black"
                        >
                            {buttonText}
                        </button>
                    </div>
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
        <div className="border-b border-black/5 py-4">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full flex justify-between items-center bg-transparent border-none cursor-pointer p-0 group"
            >
                <span className="font-semibold font-montserrat text-xs tracking-wider uppercase text-black group-hover:text-black/70 transition-colors">
                    {title}
                </span>
                <span className={`text-lg text-black font-light transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>+</span>
            </button>
            <div className="grid transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
                <div className="overflow-hidden">
                    <div className={`flex flex-col gap-1 transition-all duration-300 ${isOpen ? 'mt-4' : 'mt-0'}`}>
                        {options.map((opt) => {
                            const active = selected === opt;
                            return (
                                <button
                                    key={opt}
                                    onClick={() => onSelect(opt)}
                                    className={`w-full text-left py-1.5 text-[0.8rem] font-outfit cursor-pointer border-none flex items-center gap-2 transition-all duration-200
                                        ${active ? 'text-black font-semibold' : 'text-gray-500 font-light hover:text-black bg-transparent'}
                                    `}
                                    style={{ background: "transparent" }}
                                >
                                    <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${active ? 'bg-black' : 'bg-transparent'}`} />
                                    {opt}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
