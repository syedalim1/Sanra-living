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
            <header className={`sticky top-0 z-50 w-full backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${scrolled ? 'bg-white/95 border-b border-black/[0.04] shadow-[0_8px_30px_rgba(0,0,0,0.03)]' : 'bg-white/80 border-b border-black/[0.02]'}`}>
                <div className={`max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${scrolled ? 'h-[50px] md:h-[56px] lg:h-[60px]' : 'h-[54px] md:h-[60px] lg:h-[64px]'}`}>

                    {/* ── LEFT: HAMBURGER (mobile) ─────────────────── */}
                    <div className="md:hidden flex items-center justify-start w-[80px]">
                        <button
                            onClick={() => setDrawerOpen(true)}
                            aria-label="Open menu"
                            className="flex flex-col gap-[4px] items-start justify-center w-10 h-10 -ml-2 active:scale-90 transition-transform duration-300"
                        >
                            <span className="block w-[18px] h-[1px] bg-[#111] rounded-full" />
                            <span className="block w-[18px] h-[1px] bg-[#111] rounded-full" />
                            <span className="block w-[12px] h-[1px] bg-[#111] rounded-full" />
                        </button>
                    </div>

                    {/* ── CENTER / LEFT: LOGO ──── */}
                    <Link href="/" className="flex flex-col justify-center items-center md:items-start group flex-shrink-0 active:scale-95 transition-transform duration-300">
                        <div className={`font-montserrat font-medium tracking-widest text-[#111] uppercase leading-none transition-all duration-500 ${scrolled ? 'text-[1.1rem] md:text-[1.15rem]' : 'text-[1.15rem] md:text-[1.2rem]'}`}>
                            SANRA LIVING
                        </div>
                        <div className="font-montserrat text-[0.42rem] font-light tracking-[0.28em] text-[#111] opacity-40 uppercase mt-[3px] leading-none transition-all duration-500">
                            Engineered Steel
                        </div>
                    </Link>

                    {/* ── CENTER: DESKTOP NAV ──────────────────────── */}
                    <nav className="hidden md:flex items-center gap-8 lg:gap-12 md:ml-6 lg:ml-12">
                        {NAV_LINKS.map((link) => (
                            <Link key={link.href} href={link.href} className="font-montserrat text-[0.7rem] lg:text-xs font-medium tracking-[0.15em] text-gray-500 hover:text-black uppercase transition-colors duration-300 relative group py-2">
                                {link.label}
                                <span className="absolute left-0 bottom-0 w-full h-[1px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                            </Link>
                        ))}
                    </nav>

                    {/* ── RIGHT: SEARCH + CART + WHATSAPP ────────── */}
                    <div className="flex items-center justify-end gap-1 md:gap-3 lg:gap-5 w-[80px] md:w-auto">
                        
                        {/* Search Toggle */}
                        <button
                            onClick={() => setSearchOpen(!searchOpen)}
                            aria-label="Search"
                            className="text-[#111] hover:text-black active:scale-90 transition-all duration-300 w-10 h-10 flex items-center justify-center"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                            </svg>
                        </button>

                        {/* Cart Icon */}
                        <Link href="/cart" className="relative text-[#111] hover:text-black active:scale-90 transition-all duration-300 w-10 h-10 flex items-center justify-center -mr-2 md:mr-0">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                            </svg>
                            {totalItems > 0 && (
                                <span className="absolute top-[6px] right-[4px] bg-black text-white text-[0.55rem] font-bold w-[14px] h-[14px] rounded-full flex items-center justify-center font-montserrat shadow-sm">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {/* WhatsApp CTA (desktop) */}
                        <a
                            href="https://wa.me/8300904920?text=Hi!%20I'm%20interested%20in%20SANRA%20LIVING%20steel%20furniture."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden md:flex items-center gap-2 h-10 px-5 ml-2 rounded-xl border border-black/20 text-[#111] font-montserrat text-[0.7rem] lg:text-xs font-semibold tracking-widest uppercase transition-all duration-300 hover:bg-black hover:text-white hover:border-black shadow-sm active:scale-95"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            WhatsApp
                        </a>
                    </div>
                </div>

                {/* ── SEARCH BAR (Dropdown) ──────────────────────────── */}
                {searchOpen && (
                    <div ref={searchRef} className="absolute top-full left-0 right-0 bg-white border-b border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] py-6 px-4 z-40">
                        <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative">
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search premium furniture…"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-[#F9F9F9] border border-black/10 rounded-xl font-outfit text-base outline-none focus:border-black/30 transition-colors"
                            />
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2">
                                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                            </svg>

                            {/* Suggestions */}
                            {suggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 bg-white border border-black/5 rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.05)] mt-2 overflow-hidden">
                                    {suggestions.map((s) => (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => handleSuggestionClick(s.id)}
                                            className="w-full flex justify-between items-center px-4 py-3 border-b border-black/5 last:border-none hover:bg-[#F9F9F9] transition-colors text-left"
                                        >
                                            <span className="font-outfit font-medium text-black text-sm">{s.title}</span>
                                            <span className="font-montserrat text-xs text-gray-500 uppercase tracking-wide">{s.category}</span>
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
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[250] transition-opacity duration-300"
                />
            )}

            {/* ── MOBILE SLIDE DRAWER ───────────────────────────────── */}
            <div 
                className={`fixed top-0 left-0 bottom-0 w-[82%] max-w-[320px] bg-white z-[300] flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-y-auto ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Drawer header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.04]">
                    <div className="flex flex-col">
                        <div className="font-montserrat text-[0.95rem] font-medium tracking-widest text-black uppercase leading-none">SANRA LIVING</div>
                        <div className="font-montserrat text-[0.42rem] font-light tracking-[0.25em] text-black/40 uppercase mt-1.5 leading-none">Engineered Steel</div>
                    </div>
                    <button onClick={() => setDrawerOpen(false)} aria-label="Close menu" className="text-black/30 hover:text-black transition-colors p-1">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                {/* Drawer links */}
                <nav className="flex flex-col pt-2 flex-1">
                    {NAV_LINKS.map((link) => (
                        <Link 
                            key={link.href} 
                            href={link.href} 
                            onClick={() => setDrawerOpen(false)}
                            className="font-montserrat text-[0.68rem] font-light tracking-[0.22em] uppercase text-black/70 py-4 px-5 hover:text-black hover:bg-black/[0.02] transition-all duration-300"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link 
                        href="/cart" 
                        onClick={() => setDrawerOpen(false)}
                        className="flex items-center justify-between font-montserrat text-[0.68rem] font-light tracking-[0.22em] uppercase text-black/70 py-4 px-5 hover:text-black hover:bg-black/[0.02] transition-all duration-300"
                    >
                        <span>Cart</span>
                        {totalItems > 0 && (
                            <span className="bg-black text-white text-[0.65rem] font-bold px-2 py-0.5 rounded-full">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                </nav>

                {/* Drawer WhatsApp CTA */}
                <div className="p-5 border-t border-black/[0.04]">
                    <a
                        href="https://wa.me/8300904920?text=Hi!%20I'm%20interested%20in%20SANRA%20LIVING%20steel%20furniture."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-[#111] hover:bg-black text-white font-montserrat text-[0.6rem] font-medium tracking-[0.2em] uppercase py-3.5 rounded-full transition-all duration-500 active:scale-[0.97]"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Chat on WhatsApp
                    </a>
                </div>

                {/* Drawer footer */}
                <div className="px-5 pb-6 pt-2">
                    <p className="text-[0.65rem] text-gray-400 font-montserrat tracking-widest uppercase text-center">
                        © {new Date().getFullYear()} SANRA LIVING™
                    </p>
                </div>
            </div>
        </>
    );
}
