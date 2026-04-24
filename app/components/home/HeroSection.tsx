"use client";

import React from "react";
import Link from "next/link";

export default function HeroSection() {
    const waLink = "https://wa.me/8300904920?text=Hi!%20I%20want%20to%20know%20the%20price%20of%20your%20steel%20furniture.";

    return (
        <section
            className="sl-hero"
            style={{
                backgroundImage: "url('/images/HERO_BACKGROUND.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="sl-hero-overlay" />
            <div className="sl-container sl-hero-content" style={{ width: "100%" }}>
                <div
                    className="flex flex-col items-center md:items-start text-center md:text-left"
                    style={{ maxWidth: 700, gap: "1.75rem" }}
                >
                    {/* Label */}
                    <div className="flex items-center" style={{ gap: "0.75rem" }}>
                        <div
                            style={{
                                width: "2.5rem",
                                height: "1.5px",
                                background: "rgba(255,255,255,0.5)",
                            }}
                        />
                        <span
                            style={{
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                letterSpacing: "0.22em",
                                color: "rgba(255,255,255,0.65)",
                                textTransform: "uppercase",
                            }}
                        >
                            Direct from Manufacturer
                        </span>
                    </div>

                    {/* Headline */}
                    <h1
                        style={{
                            fontSize: "clamp(2.25rem, 5.5vw, 3.75rem)",
                            fontWeight: 900,
                            lineHeight: 1.08,
                            letterSpacing: "-0.025em",
                            color: "#ffffff",
                        }}
                    >
                        Steel Chairs & Tables
                        <br />
                        <span style={{ color: "rgba(255,255,255,0.85)" }}>
                            Direct from Manufacturer.
                        </span>
                    </h1>

                    {/* Subtext */}
                    <p
                        style={{
                            fontSize: "1.125rem",
                            lineHeight: 1.7,
                            color: "rgba(255,255,255,0.8)",
                            maxWidth: "520px",
                        }}
                    >
                        Strong. Long-lasting. Bulk & Retail Available.
                    </p>

                    {/* CTAs */}
                    <div
                        className="flex flex-col sm:flex-row"
                        style={{ gap: "1rem", width: "100%", maxWidth: "460px" }}
                    >
                        <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                flex: 1,
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "0.5rem",
                                padding: "1rem 2rem",
                                background: "#25D366",
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: "0.875rem",
                                letterSpacing: "0.04em",
                                textTransform: "uppercase",
                                textDecoration: "none",
                                borderRadius: 4,
                                transition: "background 0.2s, transform 0.2s",
                            }}
                        >
                            Get Price on WhatsApp 🔥
                        </a>
                        <Link
                            href="/shop"
                            className="sl-btn sl-btn-outline-white"
                            style={{ flex: 1 }}
                        >
                            View Products
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
