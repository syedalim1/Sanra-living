"use client";

import React, { useState } from "react";
import Link from "next/link";

const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

const CheckIcon = () => (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <circle cx="8" cy="8" r="7" stroke="#1C1C1C" strokeWidth="1.3" />
        <path d="M5 8l2 2 4-4" stroke="#1C1C1C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const WhatsAppIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

interface Props {
    title: string;
    subtitle: string;
    category: string;
    price: number;
    description: string;
    defaultFinish: string;
    stockQty: number;
    isMobile: boolean;
    onAddToCart: (finish: string, qty: number) => void;
    onBuyNow: (finish: string, qty: number) => void;
    onWhatsApp: () => void;
    addedToCart: boolean;
}

export default function ProductInfo({
    title, subtitle, category, price, description,
    defaultFinish, stockQty, isMobile,
    onAddToCart, onBuyNow, onWhatsApp, addedToCart,
}: Props) {
    const [finish, setFinish] = useState(defaultFinish);
    const [qty, setQty] = useState(1);

    const stockLow = stockQty <= 5;

    const label = (extra?: object) => ({
        fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em",
        textTransform: "uppercase" as const, color: "#888", fontFamily: FM, ...extra,
    });

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.375rem" }}>
            <span style={label()}>{category}</span>

            <div>
                <h1 style={{ fontSize: isMobile ? "1.75rem" : "clamp(1.6rem,3vw,2.25rem)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.02em", color: "#111", marginBottom: "0.375rem", fontFamily: FM }}>
                    {title}
                </h1>
                <p style={{ fontSize: "1rem", color: "#666", fontFamily: FO }}>{subtitle}</p>
            </div>

            {/* Price */}
            <div>
                <div style={{ fontSize: isMobile ? "1.875rem" : "2.25rem", fontWeight: 900, color: "#111", letterSpacing: "-0.02em", lineHeight: 1, fontFamily: FM }}>
                    ₹{price.toLocaleString("en-IN")}
                </div>
                <p style={{ fontSize: "0.75rem", color: "#888", marginTop: "0.375rem", fontFamily: FO }}>Inclusive of GST · Free Shipping Available</p>
            </div>

            {/* Short desc */}
            <p style={{ fontSize: "0.9rem", color: "#555", lineHeight: 1.8, borderLeft: "2.5px solid #E6E6E6", paddingLeft: "1rem", fontFamily: FO }}>
                {description.split(".").slice(0, 2).join(". ") + "."}
            </p>

            {/* Finish selector */}
            <div>
                <p style={{ ...label({ marginBottom: "0.625rem", color: "#555" }) }}>
                    Finish: <span style={{ color: "#111", fontWeight: 700 }}>{finish}</span>
                </p>
                <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
                    {["Matte Charcoal Black", "Graphite Grey"].map((f) => (
                        <button key={f} onClick={() => setFinish(f)} style={{
                            padding: "0.5rem 1rem", fontSize: "0.78rem", fontFamily: FM,
                            border: finish === f ? "2px solid #111" : "1.5px solid #ddd",
                            background: finish === f ? "#111" : "#fff",
                            color: finish === f ? "#fff" : "#555",
                            cursor: "pointer", fontWeight: 600, transition: "all 0.2s",
                        }}>{f}</button>
                    ))}
                </div>
            </div>

            {/* Stock */}
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: stockLow ? "#b04000" : "#1a6b3a", fontFamily: FM }}>
                {stockLow ? `⚠ Only ${stockQty} units left` : "✓ In Stock – Ready to Ship"}
            </span>

            {/* Qty */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span style={label({ color: "#555" })}>Qty</span>
                <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #ddd" }}>
                    <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 42, height: 42, background: "none", border: "none", fontSize: "1.25rem", cursor: "pointer", color: "#111" }}>−</button>
                    <span style={{ width: 42, textAlign: "center", fontWeight: 700, color: "#111", fontFamily: FM }}>{qty}</span>
                    <button onClick={() => setQty(qty + 1)} style={{ width: 42, height: 42, background: "none", border: "none", fontSize: "1.25rem", cursor: "pointer", color: "#111" }}>+</button>
                </div>
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", gap: "0.75rem", flexDirection: isMobile ? "column" : "row" }}>
                <button onClick={() => onAddToCart(finish, qty)} style={{
                    flex: 1, padding: "1rem",
                    background: addedToCart ? "#2a7d4f" : "#1C1C1C",
                    color: "#fff", fontWeight: 700, fontSize: "0.82rem",
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    border: "none", cursor: "pointer", fontFamily: FM, transition: "background 0.3s",
                }}>
                    {addedToCart ? "✓ Added to Cart" : "Add to Cart"}
                </button>
                <button onClick={() => onBuyNow(finish, qty)} style={{
                    flex: 1, padding: "1rem", background: "transparent",
                    color: "#1C1C1C", fontWeight: 700, fontSize: "0.82rem",
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    border: "2px solid #1C1C1C", cursor: "pointer", fontFamily: FM,
                }}>
                    Buy Now
                </button>
            </div>

            {/* WhatsApp Enquiry */}
            <button
                onClick={onWhatsApp}
                style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
                    padding: "0.85rem 1rem", background: "#25D366", color: "#fff",
                    fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.08em",
                    textTransform: "uppercase", border: "none", cursor: "pointer", fontFamily: FM,
                    borderRadius: 2, transition: "background 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#1ebd58")}
                onMouseLeave={e => (e.currentTarget.style.background = "#25D366")}
            >
                <WhatsAppIcon />
                Enquire on WhatsApp
            </button>

            {/* Trust badges */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", paddingTop: "0.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", fontSize: "0.82rem", color: "#444", fontFamily: FO }}>
                    <CheckIcon />
                    <Link href="/warranty" style={{ color: "#111", fontWeight: 700, textDecoration: "underline", textUnderlineOffset: "3px" }}>
                        10 Year Structural Warranty Included
                    </Link>
                </div>
                {["10 Days Replacement", "COD Available Across India"].map((t) => (
                    <div key={t} style={{ display: "flex", alignItems: "center", gap: "0.625rem", fontSize: "0.82rem", color: "#444", fontFamily: FO }}>
                        <CheckIcon /> {t}
                    </div>
                ))}
            </div>
        </div>
    );
}
