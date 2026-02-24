"use client";

import Link from "next/link";
import { useState } from "react";

const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

const COL_SHOP = [
    { label: "All Products", href: "/shop" },
    { label: "Entryway Storage", href: "/shop?category=Entryway+Storage" },
    { label: "Study Desks", href: "/shop?category=Study+Desks" },
    { label: "Wall Storage", href: "/shop?category=Wall+Storage" },
];

const COL_SUPPORT = [
    { label: "Track Order", href: "/track-order" },
    { label: "Shipping & Replacement", href: "/shipping-policy" },
    { label: "Warranty", href: "/warranty" },
    { label: "Bulk Orders", href: "/bulk-orders" },
];

const COL_LEGAL = [
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy-policy" },
];

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link href={href} style={{ display: "block", fontSize: "0.82rem", color: "#aaa", fontFamily: FO, textDecoration: "none", marginBottom: "0.625rem", lineHeight: 1.6 }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "#aaa"; }}
    >
        {children}
    </Link>
);

const ColHead = ({ children }: { children: React.ReactNode }) => (
    <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#fff", fontFamily: FM, marginBottom: "1.25rem" }}>
        {children}
    </p>
);

/* Mobile accordion section */
function AccordionSection({ title, links }: { title: string; links: { label: string; href: string }[] }) {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <button
                onClick={() => setOpen(!open)}
                style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "1rem 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
                <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff", fontFamily: FM }}>{title}</span>
                <span style={{ fontSize: "1rem", color: "#777", transform: open ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.2s", display: "inline-block", lineHeight: 1 }}>+</span>
            </button>
            {open && (
                <div style={{ paddingBottom: "0.875rem" }}>
                    {links.map((l) => (
                        <Link key={l.href} href={l.href} style={{ display: "block", fontSize: "0.82rem", color: "#aaa", fontFamily: FO, textDecoration: "none", padding: "0.3rem 0" }}>
                            {l.label}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function SiteFooter() {
    return (
        <footer style={{ background: "#1C1C1C", color: "#fff", fontFamily: FM }}>
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(3.5rem, 8vw, 5rem) 1.5rem 0" }}>

                {/* ── DESKTOP: 5-column grid ─────────────────────────── */}
                <div className="sl-footer-grid">

                    {/* Col 1 – Brand */}
                    <div style={{ gridColumn: "span 2" }} className="sl-footer-brand">
                        <div style={{ fontSize: "1rem", fontWeight: 900, letterSpacing: "0.1em", color: "#fff", textTransform: "uppercase", marginBottom: "0.25rem" }}>SANRA LIVING</div>
                        <div style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.22em", color: "#666", textTransform: "uppercase", marginBottom: "1.25rem" }}>Engineered Steel Living</div>
                        <p style={{ fontSize: "0.84rem", color: "#777", fontFamily: FO, lineHeight: 1.8, maxWidth: 240, marginBottom: "1.5rem" }}>
                            Premium steel furniture designed for modern homes. Built to last. Backed by a 10-year structural warranty.
                        </p>
                        <a href="mailto:support@sanraliving.com" style={{ fontSize: "0.78rem", color: "#555", fontFamily: FO, textDecoration: "none" }}>
                            support@sanraliving.com
                        </a>
                    </div>

                    {/* Col 2 – Shop */}
                    <div>
                        <ColHead>Shop</ColHead>
                        {COL_SHOP.map((l) => <FooterLink key={l.href} href={l.href}>{l.label}</FooterLink>)}
                    </div>

                    {/* Col 3 – Support */}
                    <div>
                        <ColHead>Support</ColHead>
                        {COL_SUPPORT.map((l) => <FooterLink key={l.href} href={l.href}>{l.label}</FooterLink>)}
                    </div>

                    {/* Col 4 – Legal */}
                    <div>
                        <ColHead>Legal</ColHead>
                        {COL_LEGAL.map((l) => <FooterLink key={l.href} href={l.href}>{l.label}</FooterLink>)}
                        <div style={{ marginTop: "2rem" }}>
                            <ColHead>Contact</ColHead>
                            <p style={{ fontSize: "0.82rem", color: "#aaa", fontFamily: FO, lineHeight: 1.7, margin: 0 }}>
                                support@sanraliving.com<br />
                                <span style={{ fontSize: "0.75rem", color: "#555" }}>Response: 24–48 Working Hours</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── MOBILE: Accordion sections ─────────────────────── */}
                <div className="sl-footer-accordion">
                    <div style={{ marginBottom: "1.5rem" }}>
                        <div style={{ fontSize: "1rem", fontWeight: 900, letterSpacing: "0.1em", color: "#fff", textTransform: "uppercase", marginBottom: "0.25rem" }}>SANRA LIVING</div>
                        <div style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.22em", color: "#555", textTransform: "uppercase", marginBottom: "0.875rem" }}>Engineered Steel Living</div>
                        <p style={{ fontSize: "0.84rem", color: "#666", fontFamily: FO, lineHeight: 1.8, margin: 0 }}>Premium steel furniture for modern homes.</p>
                    </div>
                    <AccordionSection title="Shop" links={COL_SHOP} />
                    <AccordionSection title="Support" links={COL_SUPPORT} />
                    <AccordionSection title="Legal" links={COL_LEGAL} />
                    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "1rem 0" }}>
                        <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff", fontFamily: FM, marginBottom: "0.5rem" }}>Contact</p>
                        <p style={{ fontSize: "0.82rem", color: "#777", fontFamily: FO, margin: 0 }}>support@sanraliving.com</p>
                    </div>
                </div>

                {/* ── BOTTOM STRIP ──────────────────────────────────── */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", marginTop: "clamp(2.5rem, 5vw, 4rem)", padding: "1.5rem 0", display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ fontSize: "0.7rem", color: "#444", fontFamily: FM, letterSpacing: "0.05em", margin: 0 }}>
                        © {new Date().getFullYear()} SANRA LIVING. All Rights Reserved.
                    </p>
                    <p style={{ fontSize: "0.7rem", color: "#444", fontFamily: FM, letterSpacing: "0.03em", margin: 0, textAlign: "right" }}>
                        A Premium Steel Furniture Brand by Indian Make Steel Industries.
                    </p>
                </div>
            </div>

            {/* Grid / accordion responsive styles */}
            <style>{`
                .sl-footer-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr 1fr;
                    gap: 3rem;
                }
                .sl-footer-brand { display: block; }
                .sl-footer-accordion { display: none; }
                @media (max-width: 767px) {
                    .sl-footer-grid { display: none; }
                    .sl-footer-accordion { display: block; }
                }
            `}</style>
        </footer>
    );
}
