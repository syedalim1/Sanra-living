"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

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

    useEffect(() => {
        document.body.style.overflow = drawerOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [drawerOpen]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setSearchOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

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
            <header
                className={`sticky top-0 z-50 w-full transition-all duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                    scrolled
                        ? "bg-white/97 border-b border-black/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.04)] backdrop-blur-xl"
                        : "bg-white/90 border-b border-black/[0.02] backdrop-blur-md"
                }`}
            >
                <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-400 ${scrolled ? "h-[52px] md:h-[58px]" : "h-[56px] md:h-[64px]"}`}>

                    {/* ── LEFT: HAMBURGER (mobile) ───────────────── */}
                    <div className="md:hidden flex items-center justify-start" style={{ minWidth: 64 }}>
                        <button
                            onClick={() => setDrawerOpen(true)}
                            aria-label="Open menu"
                            className="flex flex-col gap-[5px] items-center justify-center w-11 h-11 -ml-2 rounded-full active:bg-black/5 transition-all duration-200"
                        >
                            <span className="block w-[20px] h-[1.5px] bg-[#111] rounded-full" />
                            <span className="block w-[20px] h-[1.5px] bg-[#111] rounded-full" />
                            <span className="block w-[14px] h-[1.5px] bg-[#111] rounded-full self-start ml-0" />
                        </button>
                    </div>

                    {/* ── CENTER / LEFT: LOGO ───────────────────── */}
                    <Link
                        href="/"
                        className="flex flex-col justify-center items-center md:items-start group flex-shrink-0 active:scale-95 transition-transform duration-300"
                    >
                        <div className={`font-montserrat font-semibold tracking-[0.2em] text-[#111] uppercase leading-none transition-all duration-400 ${scrolled ? "text-[1rem] md:text-[1.05rem]" : "text-[1.05rem] md:text-[1.1rem]"}`}>
                            SANRA LIVING
                        </div>
                        <div className="font-montserrat text-[0.38rem] font-light tracking-[0.28em] text-[#111] opacity-35 uppercase mt-[3px] leading-none">
                            Engineered Steel
                        </div>
                    </Link>

                    {/* ── CENTER: DESKTOP NAV ───────────────────── */}
                    <nav className="hidden md:flex items-center gap-8 lg:gap-12 ml-8 lg:ml-14">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="font-montserrat text-[0.68rem] lg:text-[0.72rem] font-medium tracking-[0.14em] text-black/55 hover:text-black uppercase transition-colors duration-300 relative group py-2"
                            >
                                {link.label}
                                <span className="absolute left-0 bottom-0 w-full h-[1.5px] bg-[#C5A880] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
                            </Link>
                        ))}
                    </nav>

                    {/* ── RIGHT: SEARCH + CART + WHATSAPP ──────── */}
                    <div className="flex items-center justify-end gap-1 md:gap-2 lg:gap-4" style={{ minWidth: 64 }}>

                        {/* Search */}
                        <button
                            onClick={() => setSearchOpen(!searchOpen)}
                            aria-label="Search"
                            className="text-[#111] hover:text-black active:scale-90 transition-all duration-300 w-11 h-11 flex items-center justify-center rounded-full hover:bg-black/[0.04]"
                        >
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </button>

                        {/* Cart */}
                        <Link
                            href="/cart"
                            className="relative text-[#111] hover:text-black active:scale-90 transition-all duration-300 w-11 h-11 flex items-center justify-center rounded-full hover:bg-black/[0.04]"
                            aria-label="Cart"
                        >
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
                            </svg>
                            {totalItems > 0 && (
                                <span className="absolute top-[8px] right-[8px] bg-[#C5A880] text-white text-[0.5rem] font-bold w-[13px] h-[13px] rounded-full flex items-center justify-center font-montserrat shadow-sm">
                                    {totalItems > 9 ? "9+" : totalItems}
                                </span>
                            )}
                        </Link>

                        {/* WhatsApp CTA (desktop only) */}
                        <a
                            href="https://wa.me/8300904920?text=Hi!%20I'm%20interested%20in%20SANRA%20LIVING%20steel%20furniture."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden lg:flex items-center gap-2 h-10 px-5 ml-1 rounded-xl border border-black/15 text-[#111] font-montserrat text-[0.65rem] font-semibold tracking-[0.12em] uppercase transition-all duration-300 hover:bg-black hover:text-white hover:border-black shadow-sm active:scale-95"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            WhatsApp
                        </a>
                    </div>
                </div>

                {/* ── SEARCH BAR DROPDOWN ───────────────────────── */}
                {searchOpen && (
                    <div ref={searchRef} className="absolute top-full left-0 right-0 bg-white border-b border-black/5 shadow-[0_12px_40px_rgba(0,0,0,0.08)] py-5 px-4 z-40">
                        <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative">
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search premium furniture…"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-[#F9F9F8] border border-black/[0.08] rounded-xl font-outfit text-[0.9rem] outline-none focus:border-black/20 transition-colors placeholder:text-black/30"
                            />
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>

                            {suggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 bg-white border border-black/5 rounded-xl shadow-[0_12px_24px_rgba(0,0,0,0.06)] mt-2 overflow-hidden z-10">
                                    {suggestions.map((s) => (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => handleSuggestionClick(s.id)}
                                            className="w-full flex justify-between items-center px-4 py-3.5 border-b border-black/[0.04] last:border-none hover:bg-[#FAFAF8] transition-colors text-left"
                                        >
                                            <span className="font-outfit font-medium text-black text-[0.85rem]">{s.title}</span>
                                            <span className="font-montserrat text-[0.6rem] text-black/40 uppercase tracking-wide">{s.category}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </form>
                    </div>
                )}
            </header>

            {/* ── MOBILE OVERLAY ──────────────────────────────────── */}
            {drawerOpen && (
                <div
                    onClick={() => setDrawerOpen(false)}
                    className="fixed inset-0 bg-black/45 backdrop-blur-sm z-[250] transition-opacity duration-300"
                />
            )}

            {/* ── MOBILE DRAWER ────────────────────────────────────── */}
            <div
                className={`fixed top-0 left-0 bottom-0 w-[82%] max-w-[320px] bg-white z-[300] flex flex-col transition-transform duration-350 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-y-auto ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                {/* Drawer header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.04]">
                    <div>
                        <div className="font-montserrat text-[0.92rem] font-semibold tracking-[0.2em] text-black uppercase leading-none">
                            SANRA LIVING
                        </div>
                        <div className="font-montserrat text-[0.38rem] font-light tracking-[0.25em] text-black/35 uppercase mt-1.5 leading-none">
                            Engineered Steel
                        </div>
                    </div>
                    <button
                        onClick={() => setDrawerOpen(false)}
                        aria-label="Close menu"
                        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 text-black/40 hover:text-black transition-all duration-200"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Nav links */}
                <nav className="flex flex-col pt-3 flex-1">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setDrawerOpen(false)}
                            className="font-montserrat text-[0.72rem] font-medium tracking-[0.2em] uppercase text-black/65 py-4 px-5 hover:text-black hover:bg-black/[0.025] transition-all duration-200 border-b border-black/[0.03]"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/cart"
                        onClick={() => setDrawerOpen(false)}
                        className="flex items-center justify-between font-montserrat text-[0.72rem] font-medium tracking-[0.2em] uppercase text-black/65 py-4 px-5 hover:text-black hover:bg-black/[0.025] transition-all duration-200 border-b border-black/[0.03]"
                    >
                        <span>Cart</span>
                        {totalItems > 0 && (
                            <span className="bg-[#C5A880] text-white text-[0.6rem] font-bold px-2 py-0.5 rounded-full font-montserrat">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                </nav>

                {/* WhatsApp CTA */}
                <div className="p-5 border-t border-black/[0.04]">
                    <a
                        href="https://wa.me/8300904920?text=Hi!%20I'm%20interested%20in%20SANRA%20LIVING%20steel%20furniture."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-[#1A1917] hover:bg-black text-white font-montserrat text-[0.62rem] font-semibold tracking-[0.18em] uppercase py-4 rounded-full transition-all duration-400 active:scale-[0.97]"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Chat on WhatsApp
                    </a>
                </div>

                <div className="px-5 pb-6 pt-2">
                    <p className="text-[0.58rem] text-black/25 font-montserrat tracking-[0.2em] uppercase text-center">
                        © {new Date().getFullYear()} SANRA LIVING™
                    </p>
                </div>
            </div>
        </>
    );
}
