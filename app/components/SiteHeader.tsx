"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/shop" },
    { label: "Bulk Orders", href: "/bulk-orders" },
    { label: "Contact", href: "/contact" },
];

const DRAWER_LINKS = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/shop" },
    { label: "Bulk Orders", href: "/bulk-orders" },
    { label: "Contact", href: "/contact" },
];

export default function SiteHeader() {
    const [scrolled, setScrolled] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Lock body scroll when drawer is open
    useEffect(() => {
        document.body.style.overflow = drawerOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [drawerOpen]);

    return (
        <>
            <header style={{
                position: "sticky",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 200,
                background: "#fff",
                borderBottom: "1px solid #E6E6E6",
                boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.07)" : "none",
                transition: "box-shadow 0.25s ease",
                fontFamily: FM,
            }}>
                <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 70 }}>

                    {/* ── LEFT: HAMBURGER (mobile) ─────────────────── */}
                    <button
                        onClick={() => setDrawerOpen(true)}
                        aria-label="Open menu"
                        style={{ background: "none", border: "none", cursor: "pointer", padding: "0.5rem", display: "flex", flexDirection: "column", gap: 5, alignItems: "center", justifyContent: "center" }}
                        className="sl-mobile-only"
                    >
                        <span style={{ display: "block", width: 22, height: 1.5, background: "#1C1C1C", borderRadius: 1 }} />
                        <span style={{ display: "block", width: 22, height: 1.5, background: "#1C1C1C", borderRadius: 1 }} />
                        <span style={{ display: "block", width: 14, height: 1.5, background: "#1C1C1C", borderRadius: 1, alignSelf: "flex-start" }} />
                    </button>

                    {/* ── LEFT: LOGO (desktop) / CENTER (mobile) ──── */}
                    <Link href="/" style={{ textDecoration: "none", lineHeight: 1 }}>
                        <div style={{ fontSize: "1.15rem", fontWeight: 900, letterSpacing: "0.08em", color: "#111", textTransform: "uppercase", fontFamily: FM }}>
                            SANRA LIVING
                        </div>
                        <div style={{ fontSize: "0.55rem", fontWeight: 600, letterSpacing: "0.22em", color: "#aaa", textTransform: "uppercase", fontFamily: FM, marginTop: "0.15rem" }}>
                            Engineered Steel Living
                        </div>
                    </Link>

                    {/* ── CENTER: DESKTOP NAV ──────────────────────── */}
                    <nav className="sl-desktop-only" style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
                        {NAV_LINKS.map((link) => (
                            <Link key={link.href} href={link.href} style={{
                                fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
                                color: "#333", textDecoration: "none", fontFamily: FM,
                                paddingBottom: "2px",
                                borderBottom: "1.5px solid transparent",
                                transition: "color 0.2s, border-color 0.2s",
                            }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = "#1C1C1C"; e.currentTarget.style.borderBottomColor = "#1C1C1C"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = "#333"; e.currentTarget.style.borderBottomColor = "transparent"; }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* ── RIGHT: WhatsApp CTA ─────────────────────── */}
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <a
                            href="https://wa.me/8300904920?text=Hi!%20I'm%20interested%20in%20SANRA%20LIVING%20steel%20furniture."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="sl-desktop-only"
                            style={{
                                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                                padding: "0.5rem 1.25rem",
                                background: "#25D366", color: "#fff",
                                fontSize: "0.72rem", fontWeight: 700,
                                letterSpacing: "0.08em", textTransform: "uppercase",
                                textDecoration: "none", fontFamily: FM,
                                borderRadius: 4,
                                transition: "background 0.2s",
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            WhatsApp
                        </a>
                    </div>
                </div>
            </header>

            {/* ── MOBILE DRAWER OVERLAY ─────────────────────────────── */}
            {drawerOpen && (
                <div
                    onClick={() => setDrawerOpen(false)}
                    style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 300, transition: "opacity 0.25s" }}
                />
            )}

            {/* ── MOBILE SLIDE DRAWER ───────────────────────────────── */}
            <div style={{
                position: "fixed", top: 0, left: 0, bottom: 0,
                width: 300,
                background: "#fff",
                zIndex: 400,
                transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
                transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex", flexDirection: "column",
                overflowY: "auto",
            }}>
                {/* Drawer header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderBottom: "1px solid #E6E6E6" }}>
                    <div>
                        <div style={{ fontSize: "0.875rem", fontWeight: 900, letterSpacing: "0.08em", color: "#111", textTransform: "uppercase", fontFamily: FM }}>SANRA LIVING</div>
                        <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.2em", color: "#aaa", textTransform: "uppercase", fontFamily: FM }}>Steel Furniture Manufacturer</div>
                    </div>
                    <button onClick={() => setDrawerOpen(false)} aria-label="Close menu" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.25rem", color: "#555", lineHeight: 1, padding: "0.25rem" }}>
                        ✕
                    </button>
                </div>

                {/* Drawer links */}
                <nav style={{ padding: "0.75rem 0", flex: 1 }}>
                    {DRAWER_LINKS.map((link) => (
                        <Link key={link.href} href={link.href} onClick={() => setDrawerOpen(false)}
                            style={{
                                display: "block", padding: "0.9rem 1.5rem",
                                fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.1em",
                                textTransform: "uppercase", color: "#111", textDecoration: "none",
                                fontFamily: FM, borderBottom: "1px solid #F5F5F5",
                            }}>
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Drawer WhatsApp CTA */}
                <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #E6E6E6" }}>
                    <a
                        href="https://wa.me/8300904920?text=Hi!%20I'm%20interested%20in%20SANRA%20LIVING%20steel%20furniture."
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                            padding: "0.875rem", width: "100%",
                            background: "#25D366", color: "#fff",
                            fontSize: "0.78rem", fontWeight: 700,
                            letterSpacing: "0.1em", textTransform: "uppercase",
                            textDecoration: "none", fontFamily: FM,
                            borderRadius: 4,
                        }}
                    >
                        💬 Chat on WhatsApp
                    </a>
                </div>

                {/* Drawer footer */}
                <div style={{ padding: "0.75rem 1.5rem", borderTop: "1px solid #E6E6E6" }}>
                    <p style={{ fontSize: "0.65rem", color: "#bbb", fontFamily: FM, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        © {new Date().getFullYear()} SANRA LIVING™
                    </p>
                </div>
            </div>

            {/* Responsive style injection */}
            <style>{`
                .sl-mobile-only { display: flex !important; }
                .sl-desktop-only { display: none !important; }
                @media (min-width: 768px) {
                    .sl-mobile-only { display: none !important; }
                    .sl-desktop-only { display: flex !important; }
                }
            `}
            </style>
        </>
    );
}
