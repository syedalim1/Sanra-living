"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

const NAV_LINKS = [
    { label: "Shop", href: "/shop" },
    { label: "About", href: "/about" },
    { label: "Bulk Orders", href: "/bulk-orders" },
    { label: "Track Order", href: "/track-order" },
    { label: "Contact", href: "/contact" },
];

const DRAWER_LINKS = [
    { label: "Shop", href: "/shop" },
    { label: "About", href: "/about" },
    { label: "Bulk Orders", href: "/bulk-orders" },
    { label: "Track Order", href: "/track-order" },
    { label: "Warranty", href: "/warranty" },
    { label: "Shipping & Replacement", href: "/shipping-policy" },
    { label: "Contact", href: "/contact" },
];

/* Cart icon */
const CartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
    </svg>
);

/* Search icon */
const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

export default function SiteHeader() {
    const [scrolled, setScrolled] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { totalItems } = useCart();

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

                    {/* ── RIGHT: ICONS ─────────────────────────────── */}
                    <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                        {/* Search — desktop only */}
                        <button className="sl-desktop-only" aria-label="Search" style={{ background: "none", border: "none", cursor: "pointer", color: "#333", display: "flex", padding: "0.25rem" }}>
                            <SearchIcon />
                        </button>

                        {/* Auth */}
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button style={{ background: "none", border: "1px solid #ddd", cursor: "pointer", color: "#333", fontSize: "0.68rem", fontWeight: 700, fontFamily: FM, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.4rem 0.875rem", borderRadius: 4, whiteSpace: "nowrap" }}>
                                    Login
                                </button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>

                        {/* Cart */}
                        <Link href="/cart" aria-label="Cart" style={{ color: "#1C1C1C", position: "relative", display: "flex", alignItems: "center" }}>
                            <CartIcon />
                            {totalItems > 0 && (
                                <span style={{
                                    position: "absolute", top: -6, right: -6,
                                    width: 16, height: 16, background: "#1C1C1C", color: "#fff",
                                    fontSize: "0.6rem", fontWeight: 700, fontFamily: FM,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    borderRadius: "50%",
                                }}>
                                    {totalItems}
                                </span>
                            )}
                        </Link>
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
                        <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.2em", color: "#aaa", textTransform: "uppercase", fontFamily: FM }}>Engineered Steel Living</div>
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

                {/* Drawer footer */}
                <div style={{ padding: "1.25rem 1.5rem", borderTop: "1px solid #E6E6E6" }}>
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
            `}</style>
        </>
    );
}
