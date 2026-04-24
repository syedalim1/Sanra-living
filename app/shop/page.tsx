"use client";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import WhatsAppFloat from "../components/WhatsAppFloat";

/* ── FONTS ─────────────────────────────────────────────────── */
const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

/* ═══════════════════════════════════════════════════════════════
   CATEGORY DEFINITIONS – 4 CATEGORIES ONLY (NOW WITH IMAGES)
═══════════════════════════════════════════════════════════════ */
const categories = [
    {
        name: "Steel Chairs",
        desc: "Strong, durable chairs for home & commercial use",
        href: "/shop/seating",
        products: ["Dismantle Steel Chair", "Arm Chair", "Cushion Chair", "Bench"],
        image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&h=400&fit=crop&auto=format",
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 24v4M24 24v4M6 16v8h20v-8M10 16V8a2 2 0 012-2h8a2 2 0 012 2v8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        name: "Steel Tables",
        desc: "Dining, study, computer & work tables",
        href: "/shop/tables",
        products: ["Study Table", "Computer Table", "Work Desk", "Dining Table"],
        image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&h=400&fit=crop&auto=format",
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="4" y="12" width="24" height="3" rx="1" strokeLinecap="round" />
                <path d="M7 15v12M25 15v12M4 12h24" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        name: "Chair Table Sets",
        desc: "Complete dining & workspace furniture sets",
        href: "/shop/commercial",
        products: ["Dining Set", "Office Set", "Study Set", "Cafe Set"],
        image: "https://images.unsplash.com/photo-1616628188467-9a7e9c8f7ccb?w=600&h=400&fit=crop&auto=format",
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="4" y="6" width="24" height="20" rx="1.5" />
                <path d="M4 12h24M12 12v14M20 12v14" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        name: "Hotel Furniture",
        desc: "Institutional-grade furniture for hotels & hostels",
        href: "/shop/commercial",
        products: ["Hostel Bunk Frame", "Hotel Chair", "Canteen Table", "Lobby Furniture"],
        image: "https://images.unsplash.com/photo-1598928506311-c55e5bc7ad37?w=600&h=400&fit=crop&auto=format",
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 24V14a2 2 0 012-2h20a2 2 0 012 2v10M4 24v3M28 24v3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 12V8a2 2 0 012-2h12a2 2 0 012 2v4" strokeLinecap="round" />
                <path d="M4 19h24" strokeLinecap="round" />
            </svg>
        ),
    },
];

/* ═══════════════════════════════════════════════════════════════
   SHOP HUB PAGE – WITH ENGAGING IMAGES
═══════════════════════════════════════════════════════════════ */
export default function ShopPage() {
    const waLink = "https://wa.me/8300904920?text=Hi!%20I%20want%20to%20know%20about%20your%20steel%20furniture%20products.";

    return (
        <main style={{ background: "#F5F5F5", minHeight: "100vh", fontFamily: FO }}>
            <SiteHeader />

            {/* ── HERO HEADER WITH BACKGROUND IMAGE ────────────────── */}
            <section
                style={{
                    position: "relative",
                    padding: "5rem 1.5rem",
                    backgroundImage: `url(https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {/* Dark overlay for readability */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,0.55)",
                        zIndex: 0,
                    }}
                />
                <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>
                    {/* Breadcrumb (light) */}
                    <p
                        style={{
                            fontSize: "0.68rem",
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.45)",
                            marginBottom: "1.5rem",
                            fontFamily: FM,
                        }}
                    >
                        <Link href="/" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>Home</Link>
                        <span style={{ margin: "0 0.5rem" }}>/</span>
                        <span style={{ color: "#fff", fontWeight: 700 }}>Products</span>
                    </p>

                    <h1
                        style={{
                            fontSize: "clamp(2rem, 5vw, 3.2rem)",
                            fontWeight: 900,
                            color: "#fff",
                            letterSpacing: "-0.03em",
                            lineHeight: 1.1,
                            fontFamily: FM,
                            marginBottom: "0.75rem",
                        }}
                    >
                        Our Products
                    </h1>
                    <p style={{ fontSize: "0.9375rem", color: "rgba(255,255,255,0.75)", fontFamily: FO, maxWidth: 560 }}>
                        Quality steel furniture — strong, durable, and built to last. Contact us on WhatsApp for pricing.
                    </p>
                </div>
            </section>

            {/* ── CATEGORY GRID ────────────────────────────────────── */}
            <section style={{ maxWidth: 1200, margin: "0 auto", padding: "2.5rem 1.5rem 4rem" }}>
                <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "1.5rem" }}>
                    {categories.map((cat) => (
                        <Link
                            key={cat.name}
                            href={cat.href}
                            className="shop-hub-card group"
                            style={{
                                display: "block",
                                textDecoration: "none",
                                background: "#fff",
                                borderRadius: "0.75rem",
                                overflow: "hidden",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                                transition: "transform 0.3s, box-shadow 0.3s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-3px)";
                                e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.08)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
                            }}
                        >
                            {/* ── Category Image ────────────────────── */}
                            <div
                                style={{
                                    height: 200,
                                    overflow: "hidden",
                                    position: "relative",
                                    background: "#EAEAEA",
                                }}
                            >
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    loading="lazy"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        transition: "transform 0.5s",
                                    }}
                                    className="group-hover:scale-105"
                                />
                                {/* Subtle gradient at the bottom of the image */}
                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        height: "40%",
                                        background: "linear-gradient(to top, rgba(0,0,0,0.25), transparent)",
                                    }}
                                />
                            </div>

                            {/* ── Card Content ────────────────────── */}
                            <div style={{ padding: "1.25rem 1.25rem 1rem" }}>
                                {/* Icon + Title */}
                                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
                                    <div className="shop-hub-icon" style={{ color: "#555" }}>
                                        {cat.icon}
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111", fontFamily: FM, letterSpacing: "-0.01em" }}>
                                            {cat.name}
                                        </h2>
                                        <p style={{ fontSize: "0.78rem", color: "#888", fontFamily: FO, marginTop: "0.125rem" }}>
                                            {cat.desc}
                                        </p>
                                    </div>
                                </div>

                                {/* Product chips */}
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginBottom: "1rem" }}>
                                    {cat.products.map((p) => (
                                        <span
                                            key={p}
                                            style={{
                                                fontSize: "0.65rem",
                                                fontWeight: 600,
                                                color: "#666",
                                                padding: "0.25rem 0.625rem",
                                                background: "#F0F0F0",
                                                letterSpacing: "0.04em",
                                                fontFamily: FO,
                                                borderRadius: "999px",
                                            }}
                                        >
                                            {p}
                                        </span>
                                    ))}
                                </div>

                                {/* Browse arrow */}
                                <div
                                    className="shop-hub-arrow group"
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        color: "#111",
                                        paddingTop: "0.75rem",
                                        borderTop: "1px solid #F0F0F0",
                                    }}
                                >
                                    <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: FM }}>
                                        Browse {cat.name}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: "1.1rem",
                                            transition: "transform 0.3s",
                                            display: "inline-block",
                                        }}
                                        className="group-hover:translate-x-1"
                                    >
                                        →
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Bottom CTA (unchanged) */}
                <div style={{ textAlign: "center", marginTop: "3rem", padding: "2.5rem", background: "#1C1C1C", borderRadius: "0.75rem" }}>
                    <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontFamily: FM, marginBottom: "0.75rem" }}>
                        Need Pricing or Bulk Quote?
                    </p>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", fontFamily: FM, marginBottom: "0.75rem", letterSpacing: "-0.01em" }}>
                        Get Price on WhatsApp
                    </h3>
                    <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.55)", fontFamily: FO, marginBottom: "1.5rem", maxWidth: 480, margin: "0 auto 1.5rem" }}>
                        Contact us directly for retail pricing, bulk orders, and custom requirements.
                    </p>
                    <div className="flex flex-col sm:flex-row" style={{ gap: "0.75rem", justifyContent: "center" }}>
                        <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                                padding: "0.875rem 2rem", background: "#25D366", color: "#fff",
                                fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.1em", textTransform: "uppercase",
                                textDecoration: "none", fontFamily: FM, borderRadius: 4,
                            }}
                        >
                            💬 Chat on WhatsApp
                        </a>
                        <Link href="/bulk-orders" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0.875rem 2rem", border: "1.5px solid rgba(255,255,255,0.3)", color: "#fff", fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", fontFamily: FM, background: "transparent" }}>
                            Bulk Orders
                        </Link>
                    </div>
                </div>
            </section>

            <SiteFooter />
            <WhatsAppFloat />
        </main>
    );
}