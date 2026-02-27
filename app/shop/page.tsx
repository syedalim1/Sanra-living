"use client";

import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

/* ── FONTS ─────────────────────────────────────────────────── */
const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

/* ═══════════════════════════════════════════════════════════════
   CATEGORY DEFINITIONS
═══════════════════════════════════════════════════════════════ */
const categories = [
    {
        name: "Seating",
        desc: "Chairs, stools, benches & lounge systems",
        href: "/shop/seating",
        products: ["Dismantle Steel Chair", "Arm Chair", "Cushion Chair", "Bench"],
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 24v4M24 24v4M6 16v8h20v-8M10 16V8a2 2 0 012-2h8a2 2 0 012 2v8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        name: "Tables",
        desc: "Dining, coffee, side & work tables",
        href: "/shop/tables",
        products: ["Study Table", "Computer Table", "Work Desk", "Dining Table", "Coffee Table"],
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="4" y="12" width="24" height="3" rx="1" strokeLinecap="round" />
                <path d="M7 15v12M25 15v12M4 12h24" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        name: "Storage",
        desc: "Racks, shelves & organizers",
        href: "/shop/storage",
        products: ["Shoe Rack", "Utility Rack", "Wall Shelf", "Book Shelf", "Plant Stand"],
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="5" y="4" width="22" height="24" rx="1.5" />
                <path d="M5 12h22M5 20h22M16 4v24" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        name: "Bedroom",
        desc: "Beds, wardrobes & nightstands",
        href: "/shop/bedroom",
        products: ["Steel Wardrobe", "Open Wardrobe", "Cloth Rack", "Side Table"],
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 24V14a2 2 0 012-2h20a2 2 0 012 2v10M4 24v3M28 24v3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 12V8a2 2 0 012-2h12a2 2 0 012 2v4" strokeLinecap="round" />
                <path d="M4 19h24" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        name: "Workspace",
        desc: "Desks, stands & office systems",
        href: "/shop/workspace",
        products: ["Office Desk", "Meeting Table", "Monitor Stand", "Filing Rack"],
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="4" y="10" width="24" height="3" rx="1" />
                <path d="M8 13v12M24 13v12M12 13v6h8v-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        name: "Balcony & Outdoor",
        desc: "Garden, patio & terrace pieces",
        href: "/shop/balcony-outdoor",
        products: ["Balcony Table", "Planter Stand", "Drying Stand", "Outdoor Rack"],
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="16" cy="10" r="5" />
                <path d="M16 15v6M10 28l2-7h8l2 7M6 28h20" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        name: "Modular Systems",
        desc: "Expandable, configurable units",
        href: "/shop/modular",
        products: ["Modular Closet", "Kitchen Rack", "Wall Grid Panel", "Expandable Storage"],
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="4" y="4" width="10" height="10" rx="1.5" />
                <rect x="18" y="4" width="10" height="10" rx="1.5" />
                <rect x="4" y="18" width="10" height="10" rx="1.5" />
                <rect x="18" y="18" width="10" height="10" rx="1.5" strokeDasharray="3 2" />
            </svg>
        ),
    },
    {
        name: "CNC & Custom",
        desc: "Bespoke fabrication & design",
        href: "/shop/cnc-decor",
        products: ["CNC Wall Art", "CNC Name Plates", "Partition Panels", "Logo Boards"],
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M16 4v4M16 24v4M4 16h4M24 16h4" strokeLinecap="round" />
                <circle cx="16" cy="16" r="6" />
                <circle cx="16" cy="16" r="2" fill="currentColor" stroke="none" />
            </svg>
        ),
    },
    {
        name: "Commercial",
        desc: "Institutional-grade furniture",
        href: "/shop/commercial",
        products: ["Hostel Bunk Frame", "Library Rack", "Retail Display", "Institutional Desk"],
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="4" y="6" width="24" height="20" rx="1.5" />
                <path d="M4 12h24M12 12v14M20 12v14" strokeLinecap="round" />
            </svg>
        ),
    },
];

/* ═══════════════════════════════════════════════════════════════
   SHOP HUB PAGE
═══════════════════════════════════════════════════════════════ */
export default function ShopPage() {
    return (
        <main style={{ background: "#F5F5F5", minHeight: "100vh", fontFamily: FO }}>
            <SiteHeader />

            {/* ── HEADER ──────────────────────────────────────────── */}
            <section style={{ background: "#FFFFFF", borderBottom: "1px solid #E8E8E8", padding: "2.5rem 1.5rem" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    {/* Breadcrumb */}
                    <p style={{ fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#888", marginBottom: "1.5rem", fontFamily: FM }}>
                        <Link href="/" style={{ color: "#888", textDecoration: "none" }}>Home</Link>
                        <span style={{ margin: "0 0.5rem" }}>/</span>
                        <span style={{ color: "#111", fontWeight: 700 }}>Shop</span>
                    </p>

                    <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "#111", letterSpacing: "-0.03em", lineHeight: 1.1, fontFamily: FM, marginBottom: "0.75rem" }}>
                        Shop by Category
                    </h1>
                    <p style={{ fontSize: "0.9375rem", color: "#555", fontFamily: FO, maxWidth: 560 }}>
                        Nine foundational pillars of engineered steel living — each designed to expand infinitely as your space evolves.
                    </p>
                </div>
            </section>

            {/* ── CATEGORY GRID ────────────────────────────────────── */}
            <section style={{ maxWidth: 1200, margin: "0 auto", padding: "2.5rem 1.5rem 4rem" }}>
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    style={{ gap: "1.25rem" }}
                >
                    {categories.map((cat) => (
                        <Link
                            key={cat.name}
                            href={cat.href}
                            className="shop-hub-card"
                            style={{ textDecoration: "none" }}
                        >
                            {/* Icon + Title */}
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
                                <div className="shop-hub-icon">{cat.icon}</div>
                                <div>
                                    <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111", fontFamily: FM, letterSpacing: "-0.01em" }}>
                                        {cat.name}
                                    </h2>
                                    <p style={{ fontSize: "0.78rem", color: "#888", fontFamily: FO, marginTop: "0.125rem" }}>{cat.desc}</p>
                                </div>
                            </div>

                            {/* Product chips */}
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginBottom: "1rem" }}>
                                {cat.products.map((p) => (
                                    <span
                                        key={p}
                                        style={{
                                            fontSize: "0.65rem", fontWeight: 600, color: "#666",
                                            padding: "0.25rem 0.625rem", background: "#F0F0F0",
                                            letterSpacing: "0.04em", fontFamily: FO,
                                        }}
                                    >
                                        {p}
                                    </span>
                                ))}
                            </div>

                            {/* Arrow */}
                            <div className="shop-hub-arrow">
                                <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: FM }}>
                                    Browse {cat.name}
                                </span>
                                <span style={{ fontSize: "1.1rem", transition: "transform 0.3s" }}>→</span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div style={{ textAlign: "center", marginTop: "3rem", padding: "2.5rem", background: "#1C1C1C" }}>
                    <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontFamily: FM, marginBottom: "0.75rem" }}>
                        For Institutions & Bulk Buyers
                    </p>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", fontFamily: FM, marginBottom: "0.75rem", letterSpacing: "-0.01em" }}>
                        Need a Custom Quote?
                    </h3>
                    <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.55)", fontFamily: FO, marginBottom: "1.5rem", maxWidth: 480, margin: "0 auto 1.5rem" }}>
                        Outfit offices, hostels, co-working spaces and more. Direct from manufacturer — at scale.
                    </p>
                    <div className="flex flex-col sm:flex-row" style={{ gap: "0.75rem", justifyContent: "center" }}>
                        <Link href="/bulk-orders" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0.875rem 2rem", background: "#fff", color: "#111", fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", fontFamily: FM }}>
                            Request Bulk Quote
                        </Link>
                        <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0.875rem 2rem", border: "1.5px solid rgba(255,255,255,0.3)", color: "#fff", fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", fontFamily: FM, background: "transparent" }}>
                            Talk to Our Team
                        </Link>
                    </div>
                </div>
            </section>

            <SiteFooter />
        </main>
    );
}
