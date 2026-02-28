"use client";

import Link from "next/link";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import WhatsAppFloat from "@/app/components/WhatsAppFloat";

const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

const articles = [
    {
        slug: "best-steel-furniture-modern-homes",
        title: "Best Steel Furniture for Modern Homes in 2025",
        excerpt:
            "Discover the top steel furniture picks that blend structural strength with contemporary design. From shoe racks to modular shelving, here's what every modern home needs.",
        category: "Buying Guide",
        readTime: "8 min read",
    },
    {
        slug: "why-steel-furniture-better-than-wood",
        title: "Why Steel Furniture is Better Than Wood",
        excerpt:
            "Durability, rust resistance, termite-proof design, and lower lifecycle costs — we break down why steel outperforms wood in every category that matters.",
        category: "Comparison",
        readTime: "6 min read",
    },
    {
        slug: "luxury-steel-interior-design-ideas",
        title: "Luxury Steel Interior Design Ideas",
        excerpt:
            "From industrial minimalism to premium modern aesthetics, explore how steel furniture transforms living spaces with structural elegance.",
        category: "Design Inspiration",
        readTime: "7 min read",
    },
    {
        slug: "modular-steel-furniture-buying-guide",
        title: "Modular Steel Furniture Buying Guide",
        excerpt:
            "Everything you need to know before investing in modular steel furniture — dimensions, finishes, assembly, and what to look for in quality manufacturing.",
        category: "Buying Guide",
        readTime: "10 min read",
    },
    {
        slug: "how-to-maintain-steel-furniture",
        title: "How to Maintain & Care for Steel Furniture",
        excerpt:
            "Simple tips to keep your powder-coated steel furniture looking brand new for years. Cleaning, scratch repair, and long-term maintenance advice.",
        category: "Care & Maintenance",
        readTime: "5 min read",
    },
];

const Label = ({ children }: { children: React.ReactNode }) => (
    <p
        style={{
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#888",
            fontFamily: FM,
            marginBottom: "1.25rem",
        }}
    >
        {children}
    </p>
);

export default function BlogPage() {
    return (
        <main style={{ background: "#F5F5F5", minHeight: "100vh", fontFamily: FO }}>
            <SiteHeader />

            {/* ── Hero ── */}
            <section
                style={{
                    background: "#fff",
                    padding: "clamp(3.5rem, 8vw, 5.5rem) 1.5rem",
                    textAlign: "center",
                }}
            >
                <div style={{ maxWidth: 640, margin: "0 auto" }}>
                    <Label>SANRA LIVING Blog</Label>
                    <h1
                        style={{
                            fontSize: "clamp(2rem, 5vw, 3rem)",
                            fontWeight: 900,
                            color: "#111",
                            lineHeight: 1.1,
                            letterSpacing: "-0.025em",
                            fontFamily: FM,
                            marginBottom: "1rem",
                        }}
                    >
                        Furniture Insights &amp; Design Guides
                    </h1>
                    <p
                        style={{
                            fontSize: "0.9375rem",
                            color: "#666",
                            lineHeight: 1.8,
                            fontFamily: FO,
                            margin: 0,
                        }}
                    >
                        Expert articles on modern steel furniture, interior design trends, buying guides &amp; care tips.
                    </p>
                </div>
            </section>

            {/* ── Articles Grid ── */}
            <section style={{ padding: "clamp(3rem, 7vw, 5rem) 1.5rem" }}>
                <div
                    style={{
                        maxWidth: 1040,
                        margin: "0 auto",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: "1.5rem",
                    }}
                >
                    {articles.map((article) => (
                        <article
                            key={article.slug}
                            style={{
                                background: "#fff",
                                border: "1px solid #E6E6E6",
                                padding: "2rem 1.75rem",
                                display: "flex",
                                flexDirection: "column",
                                gap: "1rem",
                                transition: "box-shadow 0.2s",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "0.68rem",
                                        fontWeight: 700,
                                        color: "#1C1C1C",
                                        fontFamily: FM,
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase",
                                        padding: "0.25rem 0.625rem",
                                        background: "#F5F5F5",
                                    }}
                                >
                                    {article.category}
                                </span>
                                <span
                                    style={{
                                        fontSize: "0.72rem",
                                        color: "#aaa",
                                        fontFamily: FO,
                                    }}
                                >
                                    {article.readTime}
                                </span>
                            </div>
                            <h2
                                style={{
                                    fontSize: "1.1rem",
                                    fontWeight: 800,
                                    color: "#111",
                                    lineHeight: 1.3,
                                    fontFamily: FM,
                                    letterSpacing: "-0.01em",
                                }}
                            >
                                {article.title}
                            </h2>
                            <p
                                style={{
                                    fontSize: "0.875rem",
                                    color: "#666",
                                    lineHeight: 1.7,
                                    fontFamily: FO,
                                    flex: 1,
                                }}
                            >
                                {article.excerpt}
                            </p>
                            <div
                                style={{
                                    padding: "0.85rem 1.25rem",
                                    background: "#F5F5F5",
                                    textAlign: "center",
                                    fontSize: "0.78rem",
                                    fontWeight: 700,
                                    color: "#888",
                                    fontFamily: FM,
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                }}
                            >
                                Coming Soon
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* ── CTA ── */}
            <section
                style={{
                    background: "#1C1C1C",
                    padding: "clamp(3rem, 7vw, 5rem) 1.5rem",
                    textAlign: "center",
                }}
            >
                <div style={{ maxWidth: 480, margin: "0 auto" }}>
                    <p
                        style={{
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            letterSpacing: "0.22em",
                            color: "rgba(255,255,255,0.3)",
                            textTransform: "uppercase",
                            fontFamily: FM,
                            marginBottom: "1.25rem",
                        }}
                    >
                        Explore Our Collection
                    </p>
                    <h2
                        style={{
                            fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                            fontWeight: 900,
                            color: "#fff",
                            lineHeight: 1.2,
                            fontFamily: FM,
                            marginBottom: "1.5rem",
                        }}
                    >
                        Ready to Upgrade Your Space?
                    </h2>
                    <Link
                        href="/shop"
                        style={{
                            display: "inline-block",
                            padding: "1rem 2.75rem",
                            background: "#fff",
                            color: "#111",
                            fontWeight: 700,
                            fontSize: "0.78rem",
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            textDecoration: "none",
                            fontFamily: FM,
                        }}
                    >
                        Shop Now
                    </Link>
                </div>
            </section>

            <SiteFooter />
            <WhatsAppFloat />
        </main>
    );
}
