"use client";

import React from "react";
import Link from "next/link";

export default function HeroSection() {
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
                    style={{ maxWidth: 680, gap: "1.75rem" }}
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
                            Precision Steel Furniture
                        </span>
                    </div>

                    {/* Headline */}
                    <h1
                        style={{
                            fontSize: "clamp(2.5rem, 5.5vw, 3.75rem)",
                            fontWeight: 900,
                            lineHeight: 1.08,
                            letterSpacing: "-0.025em",
                            color: "#ffffff",
                        }}
                    >
                        Modular Steel Living.
                        <br />
                        <span style={{ color: "rgba(255,255,255,0.8)" }}>
                            Engineered for Modern Spaces.
                        </span>
                    </h1>

                    {/* Subtext */}
                    <p
                        style={{
                            fontSize: "1.0625rem",
                            lineHeight: 1.7,
                            color: "rgba(255,255,255,0.75)",
                            maxWidth: "480px",
                        }}
                    >
                        Precision-crafted dismantlable steel furniture for homes,
                        workspaces, and commercial environments.
                    </p>

                    {/* CTAs */}
                    <div
                        className="flex flex-col sm:flex-row"
                        style={{ gap: "1rem", width: "100%", maxWidth: "400px" }}
                    >
                        <Link
                            href="/shop"
                            className="sl-btn sl-btn-primary"
                            style={{ flex: 1 }}
                        >
                            Explore Collection
                        </Link>
                        <Link
                            href="#categories"
                            className="sl-btn sl-btn-outline-white"
                            style={{ flex: 1 }}
                        >
                            View Categories
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
