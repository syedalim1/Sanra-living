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
                background: "#F8F6F2", // Premium light beige
                minHeight: "85vh",
                display: "flex",
                alignItems: "center",
                overflow: "hidden",
            }}
        >
            <div 
                className="sl-container" 
                style={{ 
                    maxWidth: 1280, 
                    margin: "0 auto", 
                    padding: "4rem 1.5rem", 
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    position: "relative",
                    zIndex: 2,
                }}
            >
                <div style={{ maxWidth: 800, marginBottom: "3rem" }}>
                    <h1
                        style={{
                            fontSize: "clamp(3rem, 8vw, 5.5rem)",
                            fontWeight: 800,
                            lineHeight: 1.05,
                            letterSpacing: "-0.03em",
                            color: "#111",
                            fontFamily: FM,
                            marginBottom: "1.5rem",
                        }}
                    >
                        Masterpiece in Steel.
                    </h1>

                    <p style={{ 
                        color: "#555", 
                        fontSize: "clamp(1.1rem, 2vw, 1.35rem)", 
                        fontFamily: FO,
                        maxWidth: 600,
                        margin: "0 auto 2.5rem",
                        lineHeight: 1.5,
                        fontWeight: 400,
                    }}>
                        Engineered for modern Indian spaces. <br className="hidden md:block" />
                        Built to last generations.
                    </p>

                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                        <Link
                            href="/shop"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "1rem 2.5rem",
                                background: "#111",
                                color: "#fff",
                                fontWeight: 600,
                                fontSize: "0.9rem",
                                letterSpacing: "0.05em",
                                textTransform: "uppercase",
                                textDecoration: "none",
                                fontFamily: FM,
                                transition: "all 0.3s ease",
                                borderRadius: "40px",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#333";
                                e.currentTarget.style.transform = "scale(1.02)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "#111";
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                        >
                            Shop Collection
                        </Link>
                        <Link
                            href="/shop/living"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "1rem 2.5rem",
                                background: "transparent",
                                color: "#111",
                                fontWeight: 600,
                                fontSize: "0.9rem",
                                letterSpacing: "0.05em",
                                textTransform: "uppercase",
                                textDecoration: "none",
                                fontFamily: FM,
                                transition: "all 0.3s ease",
                                border: "1px solid #111",
                                borderRadius: "40px",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "rgba(0,0,0,0.05)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "transparent";
                            }}
                        >
                            View Best Sellers
                        </Link>
                    </div>
                </div>

                {/* Hero Image Focus */}
                <div style={{ width: "100%", maxWidth: 1000, position: "relative" }}>
                    <div style={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "16/9",
                        borderRadius: "16px",
                        overflow: "hidden",
                        boxShadow: "0 24px 64px rgba(0,0,0,0.08)",
                    }}>
                        {/* Placeholder for a high-quality cinematic beige interior shot */}
                        <img 
                            src="https://images.unsplash.com/photo-1592078615290-033ee584e267?w=1600&q=80" 
                            alt="Luxury Steel Furniture"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                filter: "contrast(1.05) saturate(1.1)",
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
