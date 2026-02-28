"use client";

import React from "react";
import Link from "next/link";

const categoryPillars = [
    {
        name: "Seating",
        desc: "Chairs, stools & lounge systems",
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 24v4M24 24v4M6 16v8h20v-8M10 16V8a2 2 0 012-2h8a2 2 0 012 2v8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        href: "/shop/seating",
    },
    {
        name: "Tables",
        desc: "Dining, coffee & side tables",
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="4" y="12" width="24" height="3" rx="1" strokeLinecap="round" />
                <path d="M7 15v12M25 15v12M4 12h24" strokeLinecap="round" />
            </svg>
        ),
        href: "/shop/tables",
    },
    {
        name: "Storage",
        desc: "Racks, shelves & organizers",
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="5" y="4" width="22" height="24" rx="1.5" />
                <path d="M5 12h22M5 20h22M16 4v24" strokeLinecap="round" />
            </svg>
        ),
        href: "/shop/storage",
    },
    {
        name: "Bedroom",
        desc: "Beds, wardrobes & nightstands",
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 24V14a2 2 0 012-2h20a2 2 0 012 2v10M4 24v3M28 24v3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 12V8a2 2 0 012-2h12a2 2 0 012 2v4" strokeLinecap="round" />
                <path d="M4 19h24" strokeLinecap="round" />
            </svg>
        ),
        href: "/shop/bedroom",
    },
    {
        name: "Workspace",
        desc: "Desks, stands & office systems",
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="4" y="10" width="24" height="3" rx="1" />
                <path d="M8 13v12M24 13v12M12 13v6h8v-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        href: "/shop/workspace",
    },
    {
        name: "Balcony & Outdoor",
        desc: "Garden, patio & terrace pieces",
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="16" cy="10" r="5" />
                <path d="M16 15v6M10 28l2-7h8l2 7M6 28h20" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        href: "/shop/balcony-outdoor",
    },
    {
        name: "Modular Systems",
        desc: "Expandable, configurable units",
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="4" y="4" width="10" height="10" rx="1.5" />
                <rect x="18" y="4" width="10" height="10" rx="1.5" />
                <rect x="4" y="18" width="10" height="10" rx="1.5" />
                <rect x="18" y="18" width="10" height="10" rx="1.5" strokeDasharray="3 2" />
            </svg>
        ),
        href: "/shop/modular",
    },
    {
        name: "CNC & Custom",
        desc: "Bespoke fabrication & design",
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M16 4v4M16 24v4M4 16h4M24 16h4" strokeLinecap="round" />
                <circle cx="16" cy="16" r="6" />
                <circle cx="16" cy="16" r="2" fill="currentColor" stroke="none" />
            </svg>
        ),
        href: "/shop/cnc-decor",
    },
];

export default function CategoryArchitecture() {
    return (
        <section
            id="categories"
            className="sl-section"
            style={{ background: "#FFFFFF" }}
        >
            <div className="sl-container">
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
                    <div
                        className="flex items-center justify-center"
                        style={{ gap: "0.75rem", marginBottom: "1rem" }}
                    >
                        <div
                            style={{ width: "2rem", height: "1.5px", background: "#ccc" }}
                        />
                        <span className="sl-label">Our Ecosystem</span>
                        <div
                            style={{ width: "2rem", height: "1.5px", background: "#ccc" }}
                        />
                    </div>
                    <h2 className="sl-heading-lg">
                        Shop by Category
                    </h2>
                    <p
                        className="sl-body"
                        style={{ maxWidth: 520, margin: "1rem auto 0" }}
                    >
                        Eight foundational pillars — each designed to grow with your space
                        and evolve with your needs.
                    </p>
                </div>

                {/* 8 Pillars Grid */}
                <div
                    className="grid grid-cols-2 md:grid-cols-4"
                    style={{ gap: "1rem" }}
                >
                    {categoryPillars.map((cat) => (
                        <Link
                            key={cat.name}
                            href={cat.href}
                            className="hp-cat-card"
                            style={{ textDecoration: "none" }}
                        >
                            <div className="hp-cat-icon">{cat.icon}</div>
                            <h3 className="hp-cat-name">{cat.name}</h3>
                            <p className="hp-cat-desc">{cat.desc}</p>
                            <span className="hp-cat-arrow">→</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
