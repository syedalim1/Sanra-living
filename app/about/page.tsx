"use client";

import Link from "next/link";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";

/* ── FONTS ───────────────────────────────────────────────────── */
const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

/* ── HELPERS ─────────────────────────────────────────────────── */
const Label = ({ children }: { children: React.ReactNode }) => (
    <p style={{
        fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.22em",
        textTransform: "uppercase", color: "#888", fontFamily: FM,
        marginBottom: "1.25rem",
    }}>
        {children}
    </p>
);

const Divider = () => (
    <div style={{ height: 1, background: "#E6E6E6", margin: "0 auto", maxWidth: 900 }} />
);

const BulletRow = ({ text }: { text: string }) => (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.625rem" }}>
        <span style={{ color: "#1C1C1C", fontWeight: 700, marginTop: "0.1rem", flexShrink: 0 }}>—</span>
        <p style={{ fontSize: "0.9375rem", color: "#444", lineHeight: 1.7, fontFamily: FO, margin: 0 }}>{text}</p>
    </div>
);

/* ── PAGE ────────────────────────────────────────────────────── */
export default function AboutPage() {
    return (
        <main style={{ background: "#F5F5F5", minHeight: "100vh", fontFamily: FO }}>

            <SiteHeader />

            {/* ── SECTION 1: HERO ──────────────────────────────────── */}
            <section style={{ background: "#fff", padding: "clamp(4rem, 10vw, 7rem) 1.5rem" }}>
                <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
                    <Label>About SANRA LIVING™</Label>
                    <h1 style={{
                        fontSize: "clamp(2rem, 5vw, 3.25rem)",
                        fontWeight: 900,
                        color: "#111",
                        lineHeight: 1.1,
                        letterSpacing: "-0.025em",
                        fontFamily: FM,
                        marginBottom: "1.75rem",
                    }}>
                        Engineered Steel.<br />Elevated Living.
                    </h1>
                    <p style={{
                        fontSize: "1rem",
                        color: "#555",
                        lineHeight: 1.9,
                        maxWidth: 640,
                        margin: "0 auto",
                        fontFamily: FO,
                    }}>
                        SANRA LIVING was created to redefine how modern homes experience steel furniture. We combine structural engineering with minimal design to deliver products that are built to last and crafted to complement contemporary spaces.
                    </p>
                </div>
            </section>

            <Divider />

            {/* ── SECTION 2: WHO WE ARE ────────────────────────────── */}
            <section style={{ background: "#fff", padding: "clamp(3rem, 8vw, 5rem) 1.5rem" }}>
                <div style={{ maxWidth: 900, margin: "0 auto" }}>
                    <Label>Our Identity</Label>
                    <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 900, color: "#111", letterSpacing: "-0.02em", fontFamily: FM, marginBottom: "2rem" }}>
                        Who We Are
                    </h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: 640 }}>
                        <p style={{ fontSize: "0.9375rem", color: "#444", lineHeight: 1.9, fontFamily: FO }}>
                            SANRA LIVING is a premium steel furniture brand backed by the manufacturing expertise of <strong style={{ color: "#111" }}>Indian Make Steel Industries</strong>.
                        </p>
                        <p style={{ fontSize: "0.9375rem", color: "#444", lineHeight: 1.9, fontFamily: FO }}>
                            Our foundation lies in precision fabrication, structural integrity, and long-term durability.
                        </p>
                        <div style={{ borderLeft: "3px solid #1C1C1C", paddingLeft: "1.25rem" }}>
                            <p style={{ fontSize: "0.9375rem", color: "#111", lineHeight: 1.9, fontFamily: FM, fontWeight: 700 }}>
                                We are not mass furniture manufacturers.<br />We engineer living solutions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Divider />

            {/* ── SECTION 3: PHILOSOPHY ────────────────────────────── */}
            <section style={{ background: "#F5F5F5", padding: "clamp(3rem, 8vw, 5rem) 1.5rem" }}>
                <div style={{
                    maxWidth: 900, margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "clamp(2rem, 5vw, 4rem)",
                    alignItems: "center",
                }}>
                    {/* Text */}
                    <div>
                        <Label>Design Principle</Label>
                        <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 900, color: "#111", letterSpacing: "-0.02em", fontFamily: FM, marginBottom: "1.75rem" }}>
                            Our Philosophy
                        </h2>
                        <p style={{ fontSize: "0.875rem", color: "#666", fontFamily: FO, marginBottom: "1.5rem", lineHeight: 1.8 }}>
                            We believe furniture should be:
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "1.75rem" }}>
                            {[
                                "Structurally Strong",
                                "Visually Minimal",
                                "Functionally Intelligent",
                                "Built for Long-Term Use",
                            ].map((item) => (
                                <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                    <div style={{ width: 6, height: 6, background: "#1C1C1C", flexShrink: 0 }} />
                                    <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#111", fontFamily: FM, margin: 0 }}>{item}</p>
                                </div>
                            ))}
                        </div>
                        <p style={{ fontSize: "0.875rem", color: "#666", fontFamily: FO, lineHeight: 1.9 }}>
                            Every SANRA LIVING product reflects this balance between engineering and elegance.
                        </p>
                    </div>

                    {/* Visual block */}
                    <div style={{ background: "#EBEBEB", padding: "2.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        {[
                            { icon: "⚙", title: "Engineering First", desc: "Every joint, every weld, every angle is calculated." },
                            { icon: "▪", title: "Minimal Aesthetic", desc: "Design serves function. Nothing unnecessary." },
                            { icon: "✦", title: "Lasting Quality", desc: "Steel built to outlast trends and time." },
                        ].map((item) => (
                            <div key={item.title} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                                <span style={{ fontSize: "1rem", color: "#1C1C1C", marginTop: "0.15rem", flexShrink: 0 }}>{item.icon}</span>
                                <div>
                                    <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111", fontFamily: FM, marginBottom: "0.25rem" }}>{item.title}</p>
                                    <p style={{ fontSize: "0.8rem", color: "#666", fontFamily: FO, lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Divider />

            {/* ── SECTION 4: MATERIAL & QUALITY ───────────────────── */}
            <section style={{ background: "#fff", padding: "clamp(3rem, 8vw, 5rem) 1.5rem" }}>
                <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
                    <Label>Material Standard</Label>
                    <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 900, color: "#111", letterSpacing: "-0.02em", fontFamily: FM, marginBottom: "1.25rem" }}>
                        Crafted in Structural-Grade Steel
                    </h2>
                    <p style={{ fontSize: "0.9375rem", color: "#555", lineHeight: 1.9, maxWidth: 580, margin: "0 auto 2.5rem", fontFamily: FO }}>
                        We use precision-cut steel frames and premium powder coating finishes to ensure:
                    </p>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: 1,
                        background: "#E6E6E6",
                        maxWidth: 720,
                        margin: "0 auto 2.5rem",
                    }}>
                        {[
                            { icon: "◼", title: "Rust Resistance", desc: "Premium powder coat over treated mild steel." },
                            { icon: "▲", title: "Structural Stability", desc: "CNC-bent frames with precision-welded joints." },
                            { icon: "✦", title: "Clean Aesthetics", desc: "Industrial finish, refined for modern interiors." },
                        ].map((item) => (
                            <div key={item.title} style={{ background: "#fff", padding: "2rem 1.5rem", textAlign: "left" }}>
                                <span style={{ fontSize: "1.125rem", color: "#1C1C1C", display: "block", marginBottom: "0.75rem" }}>{item.icon}</span>
                                <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111", fontFamily: FM, marginBottom: "0.375rem" }}>{item.title}</p>
                                <p style={{ fontSize: "0.78rem", color: "#777", fontFamily: FO, lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "1.25rem", background: "#111", padding: "1.25rem 2rem" }}>
                        <div style={{ fontSize: "2rem", fontWeight: 900, color: "#fff", fontFamily: FM, lineHeight: 1 }}>10</div>
                        <div style={{ textAlign: "left" }}>
                            <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#fff", fontFamily: FM, letterSpacing: "0.05em", margin: 0 }}>Year Structural Warranty</p>
                            <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", fontFamily: FO, marginTop: "0.2rem", margin: 0 }}>On all primary steel frame components</p>
                        </div>
                    </div>
                </div>
            </section>

            <Divider />

            {/* ── SECTION 5: MODERN HOMES ──────────────────────────── */}
            <section style={{ background: "#F5F5F5", padding: "clamp(3rem, 8vw, 5rem) 1.5rem" }}>
                <div style={{ maxWidth: 900, margin: "0 auto" }}>
                    <Label>Our Purpose</Label>
                    <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 900, color: "#111", letterSpacing: "-0.02em", fontFamily: FM, marginBottom: "2rem" }}>
                        Made for Modern Homes
                    </h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
                        <div>
                            <p style={{ fontSize: "0.9375rem", color: "#444", lineHeight: 1.9, fontFamily: FO, marginBottom: "1.5rem" }}>
                                Designed for compact urban spaces and contemporary interiors, SANRA LIVING products are modular, space-efficient, and easy to assemble.
                            </p>
                            <div style={{ borderLeft: "3px solid #1C1C1C", paddingLeft: "1.25rem" }}>
                                <p style={{ fontSize: "0.9375rem", color: "#111", lineHeight: 1.9, fontFamily: FM, fontWeight: 700, margin: 0 }}>
                                    We design with intention.<br />We build with strength.
                                </p>
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {[
                                ["Modular", "Configurable to your space"],
                                ["Space-Efficient", "Built for urban compact living"],
                                ["Self-Assembly", "15–20 minutes. Tools included."],
                                ["10-Day Returns", "No questions asked policy"],
                            ].map(([title, desc]) => (
                                <div key={title} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.875rem 1.25rem", background: "#fff", borderLeft: "2px solid #E6E6E6" }}>
                                    <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111", fontFamily: FM, margin: 0 }}>{title}</p>
                                    <p style={{ fontSize: "0.78rem", color: "#888", fontFamily: FO, margin: 0 }}>{desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION 6: BRAND STATEMENT (Dark) ───────────────── */}
            <section style={{ background: "#1C1C1C", padding: "clamp(4rem, 10vw, 7rem) 1.5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 680, margin: "0 auto" }}>
                    <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.22em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", fontFamily: FM, marginBottom: "1.75rem" }}>
                        SANRA LIVING™ Statement
                    </p>
                    <h2 style={{
                        fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                        fontWeight: 900,
                        color: "#fff",
                        lineHeight: 1.2,
                        letterSpacing: "-0.025em",
                        fontFamily: FM,
                        marginBottom: "2rem",
                    }}>
                        This Is Engineered Living.
                    </h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "3rem" }}>
                        {[
                            "Minimal by design.",
                            "Powerful in structure.",
                            "Built for everyday life.",
                        ].map((line) => (
                            <p key={line} style={{ fontSize: "1rem", color: "rgba(255,255,255,0.55)", fontFamily: FO, letterSpacing: "0.02em", margin: 0 }}>
                                {line}
                            </p>
                        ))}
                    </div>
                    <div style={{ height: 1, background: "rgba(255,255,255,0.1)", maxWidth: 200, margin: "0 auto" }} />
                </div>
            </section>

            {/* ── LEGAL & BUSINESS INFORMATION ──────────────────── */}
            <section style={{ background: "#fff", padding: "clamp(3rem, 8vw, 5rem) 1.5rem" }}>
                <div style={{ maxWidth: 900, margin: "0 auto" }}>
                    <Label>Compliance</Label>
                    <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 900, color: "#111", letterSpacing: "-0.02em", fontFamily: FM, marginBottom: "2rem" }}>
                        Legal &amp; Business Information
                    </h2>
                    <p style={{ fontSize: "0.9375rem", color: "#444", lineHeight: 1.9, fontFamily: FO, marginBottom: "1.5rem" }}>
                        SANRA LIVING is a premium steel furniture brand operated under <strong style={{ color: "#111" }}>Indian Make Steel Industries</strong>, a GST-registered manufacturing business based in Coimbatore, Tamil Nadu, India.
                    </p>
                    <p style={{ fontSize: "0.9375rem", color: "#444", lineHeight: 1.9, fontFamily: FO, marginBottom: "2rem" }}>
                        Indian Make Steel Industries is the legal billing entity responsible for manufacturing, taxation, invoicing, compliance, and financial operations.
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", padding: "1.5rem 1.75rem", background: "#F5F5F5", borderLeft: "3px solid #1C1C1C", maxWidth: 400 }}>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#888", fontFamily: FM, minWidth: 100 }}>Brand Name</span>
                            <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#111", fontFamily: FM }}>SANRA LIVING</span>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#888", fontFamily: FM, minWidth: 100 }}>Legal Entity</span>
                            <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#111", fontFamily: FM }}>Indian Make Steel Industries</span>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#888", fontFamily: FM, minWidth: 100 }}>GSTIN</span>
                            <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#111", fontFamily: FM }}>33FAXPM0581G1ZC</span>
                        </div>
                    </div>
                </div>
            </section>

            <Divider />

            {/* ── SECTION 7: CTA ────────────────────────────────────── */}
            <section style={{ background: "#F5F5F5", padding: "clamp(3rem, 8vw, 5rem) 1.5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 480, margin: "0 auto" }}>
                    <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.22em", color: "#888", textTransform: "uppercase", fontFamily: FM, marginBottom: "1.25rem" }}>
                        Explore Our Collection
                    </p>
                    <Link href="/shop" style={{
                        display: "inline-block",
                        padding: "1rem 2.75rem",
                        background: "#1C1C1C",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "0.78rem",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        textDecoration: "none",
                        fontFamily: FM,
                        transition: "background 0.2s",
                    }}>
                        Shop Now
                    </Link>
                </div>
            </section>

            <SiteFooter />

        </main>
    );
}
