"use client";

import React from "react";
import Link from "next/link";
import { FM, FO } from "../../shop/ShopComponents";

export default function HeroSection() {
    return (
        <section
            className="sl-hero"
            style={{
                position: "relative",
                backgroundImage: "url('/images/HERO_IMAGE.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "80vh",
            }}
        >
            <div className="sl-hero-overlay" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} />
            <div className="sl-container sl-hero-content" style={{ position: "relative", zIndex: 1, width: "100%", paddingBottom: "4rem" }}>
                <div
                    className="flex flex-col items-start text-left"
                    style={{ maxWidth: 650, gap: "1.5rem" }}
                >
                    <h1
                        style={{
                            fontSize: "clamp(2.5rem, 6vw, 4rem)",
                            fontWeight: 900,
                            lineHeight: 1,
                            letterSpacing: "-0.02em",
                            color: "#ffffff",
                            fontFamily: FM,
                            textShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.25rem"
                        }}
                    >
                        <span>Luxury Steel Furniture</span>
                        <span style={{ fontWeight: 400, fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}>Built for Modern Indian Spaces.</span>
                    </h1>

                    <ul style={{ 
                        display: "flex", 
                        flexDirection: "column", 
                        gap: "0.5rem", 
                        color: "#f5f5f5", 
                        fontSize: "clamp(1rem, 2vw, 1.15rem)", 
                        fontFamily: FO,
                        marginTop: "0.5rem",
                        listStyle: "none",
                        padding: 0
                    }}>
                        <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><span style={{ color: "#25D366" }}>✓</span> Premium Powder-Coated Steel</li>
                        <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><span style={{ color: "#25D366" }}>✓</span> Long-Lasting Durability</li>
                        <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><span style={{ color: "#25D366" }}>✓</span> Unmatched Build Quality</li>
                    </ul>

                    <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", flexWrap: "wrap" }}>
                        <Link
                            href="/shop"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "1.25rem 3rem",
                                background: "#fff",
                                color: "#111",
                                fontWeight: 800,
                                fontSize: "1rem",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                textDecoration: "none",
                                fontFamily: FM,
                                transition: "all 0.2s ease",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#f0f0f0";
                                e.currentTarget.style.transform = "translateY(-2px)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "#fff";
                                e.currentTarget.style.transform = "translateY(0)";
                            }}
                        >
                            Shop Products
                        </Link>
                        <Link
                            href="/shop"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "1.25rem 3rem",
                                background: "rgba(0,0,0,0.4)",
                                color: "#fff",
                                fontWeight: 800,
                                fontSize: "1rem",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                textDecoration: "none",
                                fontFamily: FM,
                                transition: "all 0.2s ease",
                                border: "2px solid rgba(255,255,255,0.8)",
                                backdropFilter: "blur(4px)",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                                e.currentTarget.style.borderColor = "#fff";
                                e.currentTarget.style.transform = "translateY(-2px)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "rgba(0,0,0,0.4)";
                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.8)";
                                e.currentTarget.style.transform = "translateY(0)";
                            }}
                        >
                            View Best Sellers
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
