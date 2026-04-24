"use client";

import Link from "next/link";

const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

export default function SiteFooter() {
    const waLink = "https://wa.me/8300904920?text=Hi!%20I'm%20interested%20in%20SANRA%20LIVING%20steel%20furniture.";

    return (
        <footer style={{ background: "#1C1C1C", color: "#fff", fontFamily: FM }}>
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(3rem, 7vw, 4.5rem) 1.5rem 0" }}>

                {/* ── MAIN CONTENT ──────────────────────────────────── */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "clamp(2rem, 5vw, 3rem)",
                    marginBottom: "2.5rem",
                }}>

                    {/* Col 1 – Brand */}
                    <div>
                        <div style={{ fontSize: "1rem", fontWeight: 900, letterSpacing: "0.1em", color: "#fff", textTransform: "uppercase", marginBottom: "0.25rem" }}>SANRA LIVING</div>
                        <div style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.22em", color: "#666", textTransform: "uppercase", marginBottom: "1.25rem" }}>Steel Furniture Manufacturer</div>
                        <p style={{ fontSize: "0.84rem", color: "#777", fontFamily: FO, lineHeight: 1.8, maxWidth: 300, marginBottom: "1.25rem" }}>
                            Premium steel furniture brand owned and operated by <strong style={{ color: "#ccc" }}>Indian Make Steel Industries</strong>.
                        </p>
                    </div>

                    {/* Col 2 – Contact Info */}
                    <div>
                        <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#fff", fontFamily: FM, marginBottom: "1.25rem" }}>
                            Contact
                        </p>
                        <div style={{ fontSize: "0.84rem", color: "#aaa", fontFamily: FO, lineHeight: 2 }}>
                            <p style={{ margin: "0 0 0.25rem" }}>📞 9585745303 / 8300904920</p>
                            <p style={{ margin: "0 0 0.25rem" }}>✉ <a href="mailto:hello@sanraliving.com" style={{ color: "#aaa", textDecoration: "none" }}>hello@sanraliving.com</a></p>
                        </div>
                        <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                                marginTop: "1rem",
                                padding: "0.75rem 1.5rem",
                                background: "#25D366", color: "#fff",
                                fontSize: "0.75rem", fontWeight: 700,
                                letterSpacing: "0.1em", textTransform: "uppercase",
                                textDecoration: "none", fontFamily: FM,
                                borderRadius: 4,
                                transition: "background 0.2s",
                            }}
                        >
                            💬 Chat on WhatsApp
                        </a>
                    </div>

                    {/* Col 3 – Address */}
                    <div>
                        <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#fff", fontFamily: FM, marginBottom: "1.25rem" }}>
                            Address
                        </p>
                        <div style={{ fontSize: "0.82rem", color: "#777", fontFamily: FO, lineHeight: 1.9 }}>
                            <p style={{ margin: "0 0 0.25rem" }}>NO.K-6, SIDCO, Kurichi,</p>
                            <p style={{ margin: "0 0 0.25rem" }}>SIDCO Industrial Estate,</p>
                            <p style={{ margin: "0 0 0.25rem" }}>Coimbatore, Tamil Nadu – 641021</p>
                        </div>
                        <p style={{ fontSize: "0.72rem", color: "#555", fontFamily: FO, marginTop: "1rem" }}>
                            GSTIN: 33FAXPM0581G1ZC
                        </p>
                    </div>

                    {/* Col 4 – Quick Links */}
                    <div>
                        <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#fff", fontFamily: FM, marginBottom: "1.25rem" }}>
                            Quick Links
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            {[
                                { label: "Products", href: "/shop" },
                                { label: "Bulk Orders", href: "/bulk-orders" },
                                { label: "Privacy Policy", href: "/privacy-policy" },
                                { label: "Terms & Conditions", href: "/terms" },
                            ].map((l) => (
                                <Link key={l.href} href={l.href} style={{ fontSize: "0.82rem", color: "#aaa", fontFamily: FO, textDecoration: "none", lineHeight: 1.6 }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = "#aaa"; }}
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── LEGAL DISCLOSURE ──────────────────────────────── */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "1.25rem" }}>
                    <p style={{ fontSize: "0.75rem", color: "#555", fontFamily: FO, lineHeight: 1.8, maxWidth: 600, margin: "0 0 0.5rem" }}>
                        All GST invoices and billing are issued under <strong style={{ color: "#888" }}>Indian Make Steel Industries</strong> in compliance with Indian tax regulations.
                    </p>
                </div>

                {/* ── BOTTOM STRIP ──────────────────────────────────── */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", marginTop: "1rem", padding: "1.5rem 0", display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ fontSize: "0.7rem", color: "#444", fontFamily: FM, letterSpacing: "0.05em", margin: 0 }}>
                        © {new Date().getFullYear()} SANRA LIVING. All Rights Reserved.
                    </p>
                    <p style={{ fontSize: "0.7rem", color: "#444", fontFamily: FM, letterSpacing: "0.03em", margin: 0, textAlign: "right" }}>
                        A Steel Furniture Brand by Indian Make Steel Industries.
                    </p>
                </div>
            </div>
        </footer>
    );
}
