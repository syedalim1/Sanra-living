"use client";

import React from "react";
import Link from "next/link";

const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

const CATEGORIES = [
    {
        name: "Steel Chairs",
        desc: "Strong, durable chairs for home & commercial use",
        href: "/shop/seating",
        icon: (
            <svg width="36" height="36" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 24v4M24 24v4M6 16v8h20v-8M10 16V8a2 2 0 012-2h8a2 2 0 012 2v8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        name: "Steel Tables",
        desc: "Dining, study, computer & work tables",
        href: "/shop/tables",
        icon: (
            <svg width="36" height="36" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="4" y="12" width="24" height="3" rx="1" strokeLinecap="round" />
                <path d="M7 15v12M25 15v12M4 12h24" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        name: "Chair Table Sets",
        desc: "Complete dining & workspace furniture sets",
        href: "/shop/commercial",
        icon: (
            <svg width="36" height="36" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="4" y="6" width="24" height="20" rx="1.5" />
                <path d="M4 12h24M12 12v14M20 12v14" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        name: "Hotel Furniture",
        desc: "Institutional-grade furniture for hotels & hostels",
        href: "/shop/commercial",
        icon: (
            <svg width="36" height="36" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 24V14a2 2 0 012-2h20a2 2 0 012 2v10M4 24v3M28 24v3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 12V8a2 2 0 012-2h12a2 2 0 012 2v4" strokeLinecap="round" />
                <path d="M4 19h24" strokeLinecap="round" />
            </svg>
        ),
    },
];

export default function CategoryArchitecture() {
    return (
        <section
            id="categories"
            style={{
                background: "#fff",
                padding: "clamp(3.5rem, 8vw, 5.5rem) 1.5rem",
                borderTop: "1px solid #E6E6E6",
            }}
        >
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                {/* Section Header */}
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <p
                        style={{
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            letterSpacing: "0.22em",
                            textTransform: "uppercase",
                            color: "#888",
                            fontFamily: FM,
                            marginBottom: "0.75rem",
                        }}
                    >
                        Our Products
                    </p>
                    <h2
                        style={{
                            fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                            fontWeight: 900,
                            color: "#111",
                            letterSpacing: "-0.02em",
                            lineHeight: 1.15,
                            fontFamily: FM,
                            marginBottom: "0.75rem",
                        }}
                    >
                        Browse by Category
                    </h2>
                    <p
                        style={{
                            fontSize: "0.95rem",
                            color: "#666",
                            fontFamily: FO,
                            maxWidth: 460,
                            margin: "0 auto",
                            lineHeight: 1.7,
                        }}
                    >
                        Quality steel furniture — built to last a lifetime.
                    </p>
                </div>

                {/* Category Grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                        gap: "1.25rem",
                    }}
                >
                    {CATEGORIES.map((cat) => (
                        <Link
                            key={cat.name}
                            href={cat.href}
                            className="hp-cat-card"
                            style={{ textDecoration: "none" }}
                        >
                            <div className="hp-cat-icon">{cat.icon}</div>
                            <p className="hp-cat-name" style={{ fontFamily: FM }}>
                                {cat.name}
                            </p>
                            <p className="hp-cat-desc" style={{ fontFamily: FO }}>
                                {cat.desc}
                            </p>
                            <span className="hp-cat-arrow">→</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
