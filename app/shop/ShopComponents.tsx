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
            className="group flex flex-col cursor-pointer bg-transparent overflow-hidden h-full"
        >
            {/* Image Area */}
            <div className="relative aspect-[4/5] overflow-hidden bg-[#F9F9F9] rounded-2xl mb-5">
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
                    className="absolute inset-0 w-full h-full object-contain object-center transition-all duration-700 group-hover:opacity-0 group-hover:scale-105"
                />
                <img
                    src={
                        optimizeImage(product.hover_image_url, 600) ||
                        optimizeImage(product.image_url, 600) ||
                        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80"
                    }
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-contain object-center opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
                />
            </div>

            {/* Card Body */}
            <div className="flex flex-col flex-1 text-center px-2">
                <h3 className="text-sm md:text-base font-semibold text-black font-montserrat mb-1.5 line-clamp-2 leading-snug tracking-tight">
                    {product.title}
                </h3>
                <p className="text-[0.7rem] text-gray-500 font-outfit mb-4 uppercase tracking-[0.15em]">
                    {product.category}
                </p>

                <div className="mt-auto">
                    <p className="text-sm md:text-base font-bold text-black font-montserrat tracking-tight mb-5">
                        {priceDisplay}
                    </p>

                    <div className="flex justify-center opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <button
                            onClick={handleAddToCart}
                            className="w-fit px-8 h-9 text-[0.65rem] font-bold tracking-[0.2em] uppercase font-montserrat text-black border border-black rounded-full transition-all duration-300 hover:bg-black hover:text-white"
                        >
                            {buttonText}
                        </button>
                    </div>
                </div>
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
    return (
        <div style={{ marginBottom: "1.5rem" }}>
            <h4
                style={{
                    fontSize: "0.62rem",
                    fontWeight: 800,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: C.black,
                    fontFamily: FM,
                    paddingBottom: "0.625rem",
                    borderBottom: "1px solid #EBEBEB",
                    marginBottom: "0.75rem",
                }}
            >
                {title}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                {options.map((opt) => {
                    const active = selected === opt;
                    return (
                        <button
                            key={opt}
                            onClick={() => onSelect(opt)}
                            style={{
                                width: "100%",
                                textAlign: "left",
                                padding: "0.45rem 0.625rem",
                                fontSize: "0.82rem",
                                fontFamily: FO,
                                cursor: "pointer",
                                border: "none",
                                background: active ? "#F0F0F0" : "transparent",
                                color: active ? C.black : "#666",
                                fontWeight: active ? 700 : 400,
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                transition: "all 0.15s",
                            }}
                        >
                            {active && (
                                <span
                                    style={{
                                        display: "inline-block",
                                        width: 6,
                                        height: 6,
                                        borderRadius: "50%",
                                        background: C.black,
                                        flexShrink: 0,
                                    }}
                                />
                            )}
                            {opt}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
