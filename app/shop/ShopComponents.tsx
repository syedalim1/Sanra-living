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
    subtitle: string;
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

/* ── PRODUCT CARD ──────────────────────────────────────────── */
export function ProductCard({ product, index, badge, buttonText = "View Details" }: { product: Product; index: number; badge?: string; buttonText?: string }) {
    const [hovered, setHovered] = useState(false);
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
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={handleCardClick}
            style={{
                background: C.white,
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                boxShadow: hovered
                    ? "0 12px 48px rgba(0,0,0,0.15)"
                    : "0 2px 12px rgba(0,0,0,0.06)",
                transition: "box-shadow 0.3s ease, transform 0.3s ease",
                transform: hovered ? "translateY(-6px)" : "translateY(0)",
            }}
        >
            {/* Image Area */}
            <div
                style={{
                    position: "relative",
                    aspectRatio: "1/1",
                    overflow: "hidden",
                    background: "#F5F5F3",
                }}
            >
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
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: "brightness(0.96) contrast(1.02) saturate(1.05)",
                        opacity: hovered ? 0 : 1,
                        transition: "opacity 0.6s ease, transform 0.6s ease",
                        transform: hovered ? "scale(1.03)" : "scale(1)",
                    }}
                />
                <img
                    src={
                        optimizeImage(product.hover_image_url, 600) ||
                        optimizeImage(product.image_url, 600) ||
                        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80"
                    }
                    alt=""
                    loading="lazy"
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: "brightness(0.96) contrast(1.02) saturate(1.05)",
                        opacity: hovered ? 1 : 0,
                        transition: "opacity 0.6s ease, transform 0.6s ease",
                        transform: hovered ? "scale(1.03)" : "scale(1)",
                    }}
                />
            </div>

            {/* Card Body */}
            <div
                style={{
                    padding: "1.25rem 1.25rem 1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                }}
            >
                <p
                    style={{
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        letterSpacing: "0.18em",
                        color: C.muted,
                        textTransform: "uppercase",
                        marginBottom: "0.375rem",
                        fontFamily: FM,
                    }}
                >
                    {product.category}
                </p>
                <h3
                    style={{
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: C.black,
                        letterSpacing: "0.02em",
                        fontFamily: FM,
                        marginBottom: "0.25rem",
                        lineHeight: 1.3,
                    }}
                >
                    {product.title}
                </h3>
                <p
                    style={{
                        fontSize: "0.8rem",
                        color: C.mid,
                        fontWeight: 400,
                        marginBottom: "1rem",
                        fontFamily: FO,
                        lineHeight: 1.4,
                    }}
                >
                    {product.subtitle}
                </p>

                <div style={{ marginTop: "auto" }}>
                    <p
                        style={{
                            fontSize: "1.45rem",
                            fontWeight: 900,
                            color: "#000",
                            letterSpacing: "-0.02em",
                            fontFamily: FM,
                            marginBottom: "0.25rem",
                        }}
                    >
                        {priceDisplay}
                    </p>
                    <p
                        style={{
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            letterSpacing: "0.14em",
                            color: "#000",
                            textTransform: "uppercase",
                            marginBottom: "0.25rem",
                            fontFamily: FM,
                        }}
                    >
                        Strong Steel • Long Lasting
                    </p>
                    <p
                        style={{
                            fontSize: "0.63rem",
                            fontWeight: 600,
                            letterSpacing: "0.14em",
                            color: C.muted,
                            textTransform: "uppercase",
                            marginBottom: "1rem",
                            fontFamily: FM,
                        }}
                    >
                        10 Year Warranty Included
                    </p>

                    <div style={{ display: "flex", gap: "0.5rem", flexDirection: "column" }}>
                        <button
                            onClick={handleAddToCart}
                            style={{
                                width: "100%",
                                padding: "0.8rem",
                                fontSize: "0.75rem",
                                fontWeight: 800,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                cursor: "pointer",
                                fontFamily: FM,
                                background: C.black,
                                color: "#fff",
                                border: `1.5px solid ${C.black}`,
                                transition: "all 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#333";
                                e.currentTarget.style.borderColor = "#333";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = C.black;
                                e.currentTarget.style.borderColor = C.black;
                            }}
                        >
                            Add To Cart
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCardClick();
                            }}
                            style={{
                                width: "100%",
                                padding: "0.8rem",
                                fontSize: "0.75rem",
                                fontWeight: 800,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                cursor: "pointer",
                                fontFamily: FM,
                                background: "transparent",
                                color: C.black,
                                border: `1.5px solid #E8E8E8`,
                                transition: "all 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = C.black;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "#E8E8E8";
                            }}
                        >
                            View Product
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
