"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/shop" },
    { label: "Bulk Orders", href: "/bulk-orders" },
    { label: "Contact", href: "/contact" },
];

export default function SiteHeader() {
    const [scrolled, setScrolled] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<{ id: string; title: string; category: string }[]>([]);
    const searchRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
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

    // Close search on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setSearchOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Debounced search suggestions
    useEffect(() => {
        if (searchQuery.length < 2) { setSuggestions([]); return; }
        const t = setTimeout(async () => {
            try {
                const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}`);
                const data = await res.json();
                setSuggestions((data.products || []).slice(0, 5).map((p: { id: string; title: string; category: string }) => ({
                    id: p.id, title: p.title, category: p.category,
                })));
            } catch { setSuggestions([]); }
        }, 300);
        return () => clearTimeout(t);
    }, [searchQuery]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchOpen(false);
            setSearchQuery("");
        }
    };

    const handleSuggestionClick = (id: string) => {
        router.push(`/shop/${id}`);
        setSearchOpen(false);
        setSearchQuery("");
    };

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

                    {/* ── LEFT: LOGO ──── */}
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

                    {/* ── RIGHT: SEARCH + CART + WHATSAPP ────────── */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        
                        {/* Search Toggle */}
                        <button
                            onClick={() => setSearchOpen(!searchOpen)}
                            aria-label="Search"
                            style={{ background: "none", border: "none", cursor: "pointer", padding: "0.4rem", color: "#333" }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                            </svg>
                        </button>

                        {/* Cart Icon */}
                        <Link href="/cart" style={{ position: "relative", color: "#333", textDecoration: "none", padding: "0.4rem" }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                            </svg>
                            {totalItems > 0 && (
                                <span style={{
                                    position: "absolute", top: -2, right: -4,
                                    background: "#111", color: "#fff",
                                    fontSize: "0.6rem", fontWeight: 800,
                                    width: 18, height: 18, borderRadius: "50%",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontFamily: FM,
                                }}>
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {/* WhatsApp CTA (desktop) */}
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
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            WhatsApp
                        </a>
                    </div>
                </div>

                {/* ── SEARCH BAR (Dropdown) ──────────────────────────── */}
                {searchOpen && (
                    <div ref={searchRef} style={{
                        position: "absolute", top: "100%", left: 0, right: 0,
                        background: "#fff", borderBottom: "1px solid #E6E6E6",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.08)", padding: "1rem 1.5rem",
                        zIndex: 100,
                    }}>
                        <form onSubmit={handleSearch} style={{ maxWidth: 600, margin: "0 auto", position: "relative" }}>
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search products, categories…"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                style={{
                                    width: "100%", padding: "0.875rem 1rem 0.875rem 2.75rem",
                                    border: "1px solid #ccc", borderRadius: "6px",
                                    fontSize: "1rem", fontFamily: FO, outline: "none",
                                    boxSizing: "border-box",
                                }}
                            />
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
                                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                            </svg>

                            {/* Suggestions */}
                            {suggestions.length > 0 && (
                                <div style={{
                                    position: "absolute", top: "100%", left: 0, right: 0,
                                    background: "#fff", border: "1px solid #E6E6E6",
                                    borderRadius: "0 0 6px 6px", boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                                    marginTop: 2,
                                }}>
                                    {suggestions.map((s) => (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => handleSuggestionClick(s.id)}
                                            style={{
                                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                                width: "100%", padding: "0.75rem 1rem",
                                                background: "none", border: "none", borderBottom: "1px solid #f5f5f5",
                                                cursor: "pointer", textAlign: "left",
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                                            onMouseLeave={e => e.currentTarget.style.background = "none"}
                                        >
                                            <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#111", fontFamily: FO }}>{s.title}</span>
                                            <span style={{ fontSize: "0.75rem", color: "#999", fontFamily: FM }}>{s.category}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </form>
                    </div>
                )}
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
                    {NAV_LINKS.map((link) => (
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
                    <Link href="/cart" onClick={() => setDrawerOpen(false)}
                        style={{
                            display: "flex", alignItems: "center", gap: "0.5rem",
                            padding: "0.9rem 1.5rem",
                            fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.1em",
                            textTransform: "uppercase", color: "#111", textDecoration: "none",
                            fontFamily: FM, borderBottom: "1px solid #F5F5F5",
                        }}>
                        🛒 Cart {totalItems > 0 && `(${totalItems})`}
                    </Link>
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
