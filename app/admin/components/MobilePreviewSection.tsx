"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import { FM, FO } from "../constants";

/* ─────────────────────────────────────────────────────────────
   LUXURY MOBILE PREVIEW + PRODUCT QUALITY SCORE + AUTO-SAVE
   Real-time live preview · Quality scoring · Draft indicator
   ───────────────────────────────────────────────────────────── */

interface FormData {
    title?: string;
    subtitle?: string;
    price?: string;
    compare_at_price?: string;
    image_url?: string;
    images?: string[];
    trust_features?: string[];
    description?: string;
    seo_title?: string;
    seo_description?: string;
    highlights?: string[];
    is_featured?: boolean;
    is_best_seller?: boolean;
    category?: string;
}

export interface MobilePreviewSectionProps {
    form: FormData;
    lastSaved?: Date | null;
    hasUnsaved?: boolean;
    sectionNum?: number;
    defaultOpen?: boolean;
}

export default function MobilePreviewSection({
    form,
    lastSaved,
    hasUnsaved = false,
    sectionNum = 8,
    defaultOpen = false,
}: MobilePreviewSectionProps) {
    const heroImage = form.images?.[0] || form.image_url || "";
    const fmtPrice = (n: string) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

    /* ── Quality Score ── */
    const { score, factors } = useMemo(() => {
        const f: { label: string; value: number; max: number; icon: string }[] = [];

        // Images (20)
        const imgCount = (form.images ?? []).filter(Boolean).length;
        const imgScore = Math.min(20, imgCount * 5);
        f.push({ label: "Product Images", value: imgScore, max: 20, icon: "📸" });

        // Title & Subtitle (15)
        const titleLen = (form.title ?? "").trim().length;
        const subLen = (form.subtitle ?? "").trim().length;
        let titleScore = 0;
        if (titleLen > 10) titleScore += 10;
        else if (titleLen > 0) titleScore += 5;
        if (subLen > 5) titleScore += 5;
        f.push({ label: "Title & Subtitle", value: titleScore, max: 15, icon: "✏️" });

        // Description (15)
        const descLen = (form.description ?? "").trim().length;
        let descScore = 0;
        if (descLen >= 100) descScore = 15;
        else if (descLen >= 50) descScore = 10;
        else if (descLen > 0) descScore = 5;
        f.push({ label: "Description", value: descScore, max: 15, icon: "📝" });

        // SEO (15)
        const seoT = (form.seo_title ?? "").length;
        const seoD = (form.seo_description ?? "").length;
        let seoScore = 0;
        if (seoT >= 30 && seoT <= 60) seoScore += 8;
        else if (seoT > 0) seoScore += 4;
        if (seoD >= 100 && seoD <= 160) seoScore += 7;
        else if (seoD > 0) seoScore += 3;
        f.push({ label: "SEO Quality", value: seoScore, max: 15, icon: "🔍" });

        // Trust Features (15)
        const trustCount = (form.trust_features ?? []).length;
        const trustScore = Math.min(15, trustCount * 3);
        f.push({ label: "Trust Features", value: trustScore, max: 15, icon: "🛡️" });

        // Pricing (10)
        const hasPrice = Number(form.price ?? 0) > 0;
        const hasCompare = Number(form.compare_at_price ?? 0) > Number(form.price ?? 0);
        let priceScore = 0;
        if (hasPrice) priceScore += 5;
        if (hasCompare) priceScore += 5;
        f.push({ label: "Pricing & Offers", value: priceScore, max: 10, icon: "💰" });

        // Highlights (10)
        const hlCount = (form.highlights ?? []).filter(Boolean).length;
        const hlScore = Math.min(10, hlCount * 2.5);
        f.push({ label: "Highlights", value: Math.round(hlScore), max: 10, icon: "⭐" });

        const total = f.reduce((a, b) => a + b.value, 0);
        return { score: total, factors: f };
    }, [form]);

    const scoreColor = score >= 70 ? "#10B981" : score >= 40 ? "#F59E0B" : "#EF4444";
    const scoreLabel = score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Needs Work" : "Incomplete";

    const discountPct = form.compare_at_price && form.price &&
        Number(form.compare_at_price) > Number(form.price)
            ? Math.round((1 - Number(form.price) / Number(form.compare_at_price)) * 100)
            : null;

    const [isOpen, setIsOpen] = useState(defaultOpen);
    const contentRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLButtonElement>(null);
    const [contentHeight, setContentHeight] = useState<number>(0);
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        if (contentRef.current) setContentHeight(contentRef.current.scrollHeight);
    }, [form, score, factors]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsSticky(!entry.isIntersecting && isOpen),
            { threshold: 0, rootMargin: "-1px 0px 0px 0px" }
        );
        const sentinel = document.getElementById(`mps-sentinel-${sectionNum}`);
        if (sentinel) observer.observe(sentinel);
        return () => observer.disconnect();
    }, [isOpen, sectionNum]);

    return (
        <>
            <div id={`mps-sentinel-${sectionNum}`} style={{ height: 0 }} />
            <div className={`bpi-section${isOpen ? " bpi-open" : ""}`}>
            <style>{`
                .mp-factor {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.55rem 0;
                }
                .mp-factor-bar {
                    flex: 1;
                    height: 4px;
                    border-radius: 99px;
                    background: #F0EDE8;
                    overflow: hidden;
                }
                .mp-factor-fill {
                    height: 100%;
                    border-radius: 99px;
                    transition: width 0.4s ease, background 0.3s ease;
                }
                @media (max-width: 640px) {
                    .mp-layout { flex-direction: column !important; }
                    .mp-phone { max-width: 100% !important; }
                }
            `}</style>

            {/* Header */}
            <button
                ref={headerRef}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`bpi-header${isSticky ? " bpi-header-sticky" : ""}`}
            >
                <div className="bpi-header-left">
                    <span className={`bpi-num${isOpen ? " bpi-num-active" : ""}`}>
                        {sectionNum}
                    </span>
                    <div>
                        <span className="bpi-title">Product Quality & Preview</span>
                        {!isOpen && (
                            <span className="bpi-title-preview">— Score: {score}/100</span>
                        )}
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    {/* Auto-save indicator */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        {hasUnsaved && (
                            <span style={{
                                width: 6, height: 6, borderRadius: "50%",
                                background: "#F59E0B", flexShrink: 0,
                            }} />
                        )}
                        <span style={{
                            fontSize: "0.62rem", fontWeight: 600, fontFamily: FM,
                            color: hasUnsaved ? "#F59E0B" : "#10B981",
                            letterSpacing: "0.04em",
                        }}>
                            {hasUnsaved ? "Unsaved changes" : lastSaved ? `Saved ${formatTimeAgo(lastSaved)}` : "Draft ready"}
                        </span>
                    </div>
                    <span className={`bpi-arrow${isOpen ? " bpi-arrow-open" : ""}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </span>
                </div>
            </button>

            <div
                className="bpi-body"
                style={{
                    maxHeight: isOpen ? `${contentHeight + 80}px` : "0px",
                    opacity: isOpen ? 1 : 0,
                }}
            >
                <div ref={contentRef} className="bpi-inner" style={{ padding: "1.75rem" }}>
                <div className="mp-layout" style={{ display: "flex", gap: "1.75rem" }}>

                    {/* ── Mobile Preview ── */}
                    <div className="mp-phone" style={{ flexShrink: 0, maxWidth: 280 }}>
                        <p style={{
                            fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em",
                            textTransform: "uppercase", color: "#9C9485", fontFamily: FM,
                            marginBottom: "0.75rem",
                        }}>📱 Live Mobile Preview</p>

                        <div style={{
                            background: "#fff", borderRadius: 24,
                            border: "3px solid #111", overflow: "hidden",
                            boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                        }}>
                            {/* Status bar */}
                            <div style={{
                                background: "#111", padding: "0.35rem 0.85rem",
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                            }}>
                                <span style={{ color: "#fff", fontSize: "0.55rem", fontWeight: 600 }}>9:41</span>
                                <div style={{ width: 40, height: 4, borderRadius: 99, background: "#333" }} />
                                <div style={{ display: "flex", gap: 3 }}>
                                    {[0,1,2].map(i => (
                                        <div key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: "#fff" }} />
                                    ))}
                                </div>
                            </div>

                            {/* Hero image */}
                            <div style={{ width: "100%", aspectRatio: "4/5", background: "#F3F0EB", overflow: "hidden" }}>
                                {heroImage ? (
                                    <img src={heroImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                    <div style={{
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        height: "100%", flexDirection: "column", gap: "0.3rem",
                                    }}>
                                        <span style={{ fontSize: "1.5rem", opacity: 0.3 }}>📦</span>
                                        <span style={{ fontSize: "0.6rem", color: "#C8B89A", fontFamily: FO }}>No image</span>
                                    </div>
                                )}
                            </div>

                            {/* Product info */}
                            <div style={{ padding: "0.85rem" }}>
                                {/* Badges */}
                                {(form.is_featured || form.is_best_seller) && (
                                    <div style={{ display: "flex", gap: "0.3rem", marginBottom: "0.4rem" }}>
                                        {form.is_best_seller && (
                                            <span style={{ fontSize: "0.4rem", background: "#FFF5F0", color: "#8B2500", padding: "0.1rem 0.3rem", borderRadius: 3, fontWeight: 700, fontFamily: FM, textTransform: "uppercase" }}>Best Seller</span>
                                        )}
                                        {form.is_featured && (
                                            <span style={{ fontSize: "0.4rem", background: "#FDF6E3", color: "#B8860B", padding: "0.1rem 0.3rem", borderRadius: 3, fontWeight: 700, fontFamily: FM, textTransform: "uppercase" }}>Featured</span>
                                        )}
                                    </div>
                                )}

                                <p style={{
                                    fontSize: "0.82rem", fontWeight: 700, fontFamily: FM, color: "#111",
                                    margin: "0 0 0.1rem", lineHeight: 1.25,
                                }}>{form.title || "Product Title"}</p>

                                {form.subtitle && (
                                    <p style={{ fontSize: "0.58rem", color: "#9C9485", fontFamily: FO, margin: "0 0 0.4rem" }}>{form.subtitle}</p>
                                )}

                                {/* Price */}
                                <div style={{ display: "flex", alignItems: "baseline", gap: "0.35rem", marginBottom: "0.5rem" }}>
                                    <span style={{ fontSize: "0.95rem", fontWeight: 800, fontFamily: FM, color: "#111" }}>
                                        {form.price ? fmtPrice(form.price) : "₹0"}
                                    </span>
                                    {form.compare_at_price && Number(form.compare_at_price) > Number(form.price ?? 0) && (
                                        <>
                                            <span style={{ fontSize: "0.6rem", color: "#C8B89A", textDecoration: "line-through", fontFamily: FO }}>
                                                {fmtPrice(form.compare_at_price)}
                                            </span>
                                            {discountPct && (
                                                <span style={{ fontSize: "0.45rem", background: "#10B98118", color: "#10B981", padding: "0.1rem 0.25rem", borderRadius: 3, fontWeight: 700, fontFamily: FM }}>{discountPct}% OFF</span>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Trust badges */}
                                {(form.trust_features ?? []).length > 0 && (
                                    <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                                        {(form.trust_features ?? []).slice(0, 4).map((f, i) => (
                                            <span key={i} style={{
                                                fontSize: "0.4rem", background: "#F3F0EB", padding: "0.12rem 0.3rem",
                                                borderRadius: 3, fontFamily: FM, fontWeight: 600, color: "#111",
                                            }}>{f}</span>
                                        ))}
                                        {(form.trust_features ?? []).length > 4 && (
                                            <span style={{ fontSize: "0.4rem", color: "#9C9485", fontFamily: FO, padding: "0.12rem 0" }}>
                                                +{(form.trust_features ?? []).length - 4} more
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* CTA buttons */}
                                <div style={{
                                    background: "#111", color: "#fff", textAlign: "center",
                                    padding: "0.45rem", borderRadius: 6,
                                    fontSize: "0.5rem", fontWeight: 700, fontFamily: FM,
                                    marginBottom: "0.3rem", letterSpacing: "0.08em",
                                }}>ADD TO CART</div>
                                <div style={{ display: "flex", gap: "0.25rem" }}>
                                    <div style={{
                                        flex: 1, background: "#F3F0EB", textAlign: "center",
                                        padding: "0.4rem", borderRadius: 6,
                                        fontSize: "0.45rem", fontWeight: 700, fontFamily: FM,
                                        color: "#111",
                                    }}>BUY NOW</div>
                                    <div style={{
                                        flex: 1, background: "#25D366", textAlign: "center",
                                        padding: "0.4rem", borderRadius: 6,
                                        fontSize: "0.45rem", fontWeight: 700, fontFamily: FM,
                                        color: "#fff",
                                    }}>WHATSAPP</div>
                                </div>
                            </div>

                            {/* Home indicator */}
                            <div style={{ padding: "0.35rem 0", display: "flex", justifyContent: "center" }}>
                                <div style={{ width: 40, height: 4, borderRadius: 99, background: "#E8E4DC" }} />
                            </div>
                        </div>
                    </div>

                    {/* ── Quality Score Panel ── */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                            fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em",
                            textTransform: "uppercase", color: "#9C9485", fontFamily: FM,
                            marginBottom: "1rem",
                        }}>Product Quality Score</p>

                        {/* Score ring */}
                        <div style={{
                            display: "flex", alignItems: "center", gap: "1.25rem",
                            padding: "1.25rem", background: "#FAFAF8",
                            border: "1.5px solid #E8E4DC", borderRadius: 14,
                            marginBottom: "1.25rem",
                        }}>
                            <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
                                <svg width="72" height="72" viewBox="0 0 72 72">
                                    <circle cx="36" cy="36" r="30" fill="none" stroke="#F0EDE8" strokeWidth="5" />
                                    <circle
                                        cx="36" cy="36" r="30" fill="none"
                                        stroke={scoreColor} strokeWidth="5"
                                        strokeLinecap="round"
                                        strokeDasharray={`${(score / 100) * 188.5} 188.5`}
                                        transform="rotate(-90 36 36)"
                                        style={{ transition: "stroke-dasharray 0.6s ease, stroke 0.3s ease" }}
                                    />
                                </svg>
                                <div style={{
                                    position: "absolute", inset: 0,
                                    display: "flex", flexDirection: "column",
                                    alignItems: "center", justifyContent: "center",
                                }}>
                                    <span style={{ fontSize: "1.2rem", fontWeight: 800, fontFamily: FM, color: scoreColor, lineHeight: 1 }}>{score}</span>
                                    <span style={{ fontSize: "0.45rem", color: "#9C9485", fontFamily: FO }}>/ 100</span>
                                </div>
                            </div>
                            <div>
                                <p style={{
                                    fontSize: "0.95rem", fontWeight: 700, fontFamily: FM, color: "#111", margin: "0 0 0.2rem",
                                }}>{scoreLabel}</p>
                                <p style={{ fontSize: "0.68rem", color: "#9C9485", fontFamily: FO, margin: 0, lineHeight: 1.4 }}>
                                    {score >= 80 ? "Your product listing is well-optimized for conversion."
                                        : score >= 60 ? "Good start! A few improvements will boost conversions."
                                        : score >= 40 ? "Several areas need attention for a premium listing."
                                        : "Add more details to create a compelling product page."}
                                </p>
                            </div>
                        </div>

                        {/* Factor breakdown */}
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            {factors.map((f, i) => {
                                const pct = (f.value / f.max) * 100;
                                const color = pct >= 80 ? "#10B981" : pct >= 50 ? "#F59E0B" : "#EF4444";
                                return (
                                    <div key={i} className="mp-factor">
                                        <span style={{ fontSize: "0.8rem", width: 20, textAlign: "center" }}>{f.icon}</span>
                                        <span style={{
                                            fontSize: "0.68rem", fontWeight: 600, fontFamily: FM, color: "#111",
                                            width: 100, flexShrink: 0,
                                        }}>{f.label}</span>
                                        <div className="mp-factor-bar">
                                            <div className="mp-factor-fill" style={{ width: `${pct}%`, background: color }} />
                                        </div>
                                        <span style={{
                                            fontSize: "0.6rem", fontWeight: 700, fontFamily: FM, color,
                                            width: 34, textAlign: "right", flexShrink: 0,
                                        }}>{f.value}/{f.max}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Improvement tips */}
                        {score < 80 && (
                            <div style={{
                                marginTop: "1.25rem", padding: "1rem 1.25rem",
                                background: "#FAFAF8", border: "1px solid #F0EDE8",
                                borderRadius: 12,
                            }}>
                                <p style={{
                                    fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em",
                                    textTransform: "uppercase", color: "#9C9485", fontFamily: FM,
                                    marginBottom: "0.6rem",
                                }}>💡 Quick Improvements</p>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                                    {factors.filter(f => f.value < f.max * 0.8).slice(0, 3).map((f, i) => (
                                        <p key={i} style={{
                                            fontSize: "0.68rem", color: "#111", fontFamily: FO, margin: 0,
                                            display: "flex", alignItems: "center", gap: "0.4rem",
                                        }}>
                                            <span style={{ color: "#F59E0B", fontSize: "0.5rem" }}>●</span>
                                            {getImprovementTip(f.label, f.value, f.max)}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {score >= 80 && (
                            <div style={{
                                marginTop: "1.25rem", padding: "1rem 1.25rem",
                                background: "#10B98108", border: "1px solid #10B98122",
                                borderRadius: 12, display: "flex", alignItems: "center", gap: "0.75rem",
                            }}>
                                <span style={{ fontSize: "1.2rem" }}>🏆</span>
                                <div>
                                    <p style={{ fontSize: "0.78rem", fontWeight: 700, fontFamily: FM, color: "#10B981", margin: 0 }}>Premium Quality Listing</p>
                                    <p style={{ fontSize: "0.62rem", color: "#9C9485", fontFamily: FO, margin: "0.1rem 0 0" }}>
                                        This product meets international CMS standards
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
                </div>
            </div>
        </>
    );
}

/* ── Helpers ── */
function formatTimeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 10) return "just now";
    if (seconds < 60) return `${seconds}s ago`;
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
}

function getImprovementTip(label: string, value: number, max: number): string {
    const tips: Record<string, string> = {
        "Product Images": "Add more product images for better engagement",
        "Title & Subtitle": "Add a subtitle to describe your product better",
        "Description": "Write a detailed description (100+ characters)",
        "SEO Quality": "Optimize SEO title and meta description",
        "Trust Features": "Select more trust features to boost confidence",
        "Pricing & Offers": "Add a compare-at price to show savings",
        "Highlights": "Add product highlights for quick scanning",
    };
    return tips[label] ?? `Improve ${label} for a better score`;
}
