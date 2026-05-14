"use client";

import React from "react";
import { FM, FO } from "../constants";

/* ─────────────────────────────────────────────────────────────
   LUXURY TRUST & PREMIUM FEATURES SECTION
   Apple + IKEA inspired · Beige / Black · Ultra-premium SaaS
   ───────────────────────────────────────────────────────────── */

export interface TrustFeaturesSectionProps {
    /** Currently selected trust feature labels */
    trustFeatures: string[];
    /** Called when a feature card is toggled */
    onToggle: (feat: string) => void;
    /** Currently selected badge label (Featured Product / Best Seller / New Arrival) */
    isFeatured?: boolean;
    isBestSeller?: boolean;
    isNewArrival?: boolean;
    onBadgeToggle?: (badge: "featured" | "best_seller" | "new_arrival") => void;
    /** Max selectable trust features (default 8) */
    maxFeatures?: number;
    /** Section number shown in accordion header */
    sectionNum?: number;
}

/* ── Trust feature definitions ── */
const TRUST_CARDS: { label: string; icon: string; desc: string }[] = [
    { label: "Jindal Steel",       icon: "🏭", desc: "Premium certified raw material" },
    { label: "Rust Resistant",     icon: "🛡️", desc: "Anti-corrosion coating" },
    { label: "3 Year Warranty",    icon: "📋", desc: "Full product coverage" },
    { label: "Pan India Delivery", icon: "🚚", desc: "Delivered across all states" },
    { label: "Premium Finish",     icon: "✨", desc: "Flawless surface treatment" },
    { label: "Heavy Duty",         icon: "💪", desc: "Built for intensive use" },
    { label: "Easy Maintenance",   icon: "🧹", desc: "Wipe clean, zero upkeep" },
    { label: "Made in Coimbatore", icon: "🏙️", desc: "Crafted locally with pride" },
    { label: "10+ Years Lifespan", icon: "⏳", desc: "Engineered for decades" },
    { label: "Commercial Grade",   icon: "🏢", desc: "Hotel & office approved" },
];

/* ── Premium badge definitions ── */
const BADGE_CARDS: { key: "featured" | "best_seller" | "new_arrival"; label: string; icon: string; color: string; gradient: string }[] = [
    {
        key: "featured",
        label: "Featured Product",
        icon: "⭐",
        color: "#B8860B",
        gradient: "linear-gradient(135deg, #fdf6e3 0%, #faebd7 100%)",
    },
    {
        key: "best_seller",
        label: "Best Seller",
        icon: "🔥",
        color: "#8B2500",
        gradient: "linear-gradient(135deg, #fff5f0 0%, #ffe4d6 100%)",
    },
    {
        key: "new_arrival",
        label: "New Arrival",
        icon: "🌿",
        color: "#1a4a2e",
        gradient: "linear-gradient(135deg, #f0faf4 0%, #d4f0de 100%)",
    },
];

export default function TrustFeaturesSection({
    trustFeatures,
    onToggle,
    isFeatured = false,
    isBestSeller = false,
    isNewArrival = false,
    onBadgeToggle,
    maxFeatures = 8,
    sectionNum = 4,
}: TrustFeaturesSectionProps) {
    const selectedCount = trustFeatures.length;

    const badgeActive = (key: "featured" | "best_seller" | "new_arrival") => {
        if (key === "featured") return isFeatured;
        if (key === "best_seller") return isBestSeller;
        if (key === "new_arrival") return isNewArrival;
        return false;
    };

    return (
        <div style={{
            background: "#fff",
            borderRadius: "16px",
            border: "1px solid #E8E4DC",
            overflow: "hidden",
            boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
            marginBottom: "0.75rem",
        }}>
            {/* ── Inject hover/animation CSS ── */}
            <style>{`
                .trust-card {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    gap: 0.5rem;
                    padding: 1.25rem 0.75rem;
                    background: #FAFAF8;
                    border: 1.5px solid #E8E4DC;
                    border-radius: 14px;
                    cursor: pointer;
                    transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
                    user-select: none;
                    -webkit-tap-highlight-color: transparent;
                    overflow: hidden;
                }
                .trust-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: 13px;
                    opacity: 0;
                    transition: opacity 0.22s ease;
                    background: radial-gradient(circle at 50% 0%, rgba(180,160,100,0.10) 0%, transparent 70%);
                }
                .trust-card:hover::before { opacity: 1; }
                .trust-card:hover:not(.trust-card--active):not(.trust-card--disabled) {
                    border-color: #C8B89A;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 24px rgba(0,0,0,0.08);
                }
                .trust-card--active {
                    background: #111 !important;
                    border-color: #111 !important;
                    transform: translateY(-1px);
                    box-shadow: 0 8px 28px rgba(0,0,0,0.20) !important;
                }
                .trust-card--disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }
                .trust-card:active:not(.trust-card--disabled) {
                    transform: scale(0.97) translateY(0px);
                }
                .trust-icon {
                    font-size: 1.6rem;
                    line-height: 1;
                    transition: transform 0.22s ease;
                }
                .trust-card:hover .trust-icon { transform: scale(1.12); }
                .trust-card--active .trust-icon { filter: brightness(0) invert(1); }

                .trust-check {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.15);
                    border: 1.5px solid rgba(255,255,255,0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transform: scale(0.6);
                    transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .trust-card--active .trust-check {
                    opacity: 1;
                    transform: scale(1);
                    background: rgba(255,255,255,0.25);
                    border-color: rgba(255,255,255,0.6);
                }

                .badge-card {
                    position: relative;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1.1rem 1.25rem;
                    border-radius: 14px;
                    border: 1.5px solid transparent;
                    cursor: pointer;
                    transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
                    user-select: none;
                    -webkit-tap-highlight-color: transparent;
                    overflow: hidden;
                }
                .badge-card:hover:not(.badge-card--active) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.10);
                    filter: brightness(0.97);
                }
                .badge-card--active {
                    transform: translateY(-1px);
                    box-shadow: 0 8px 28px rgba(0,0,0,0.14) !important;
                }
                .badge-card:active { transform: scale(0.98); }

                .badge-check-ring {
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    border: 2px solid currentColor;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    transition: all 0.18s ease;
                }

                @media (max-width: 640px) {
                    .trust-features-grid { grid-template-columns: 1fr 1fr !important; }
                    .trust-badge-grid { grid-template-columns: 1fr !important; }
                    .trust-card { padding: 1.1rem 0.5rem; }
                    .trust-icon { font-size: 1.4rem; }
                }
                @media (min-width: 641px) and (max-width: 900px) {
                    .trust-features-grid { grid-template-columns: 1fr 1fr 1fr !important; }
                }
            `}</style>

            {/* ── Section Header ── */}
            <div style={{
                padding: "1.4rem 1.75rem",
                borderBottom: "1px solid #F0EDE8",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "linear-gradient(135deg, #FAFAF8 0%, #F5F2EC 100%)",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "#111",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        fontFamily: FM,
                        flexShrink: 0,
                    }}>{sectionNum}</div>
                    <div>
                        <p style={{
                            fontSize: "0.95rem",
                            fontWeight: 700,
                            fontFamily: FM,
                            color: "#111",
                            margin: 0,
                        }}>Trust &amp; Premium Features</p>
                        <p style={{
                            fontSize: "0.7rem",
                            color: "#9C9485",
                            fontFamily: FO,
                            margin: "0.15rem 0 0",
                        }}>Select features that appear on the product page</p>
                    </div>
                </div>

                {/* Counter pill */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                }}>
                    <span style={{
                        padding: "0.3rem 0.85rem",
                        borderRadius: 99,
                        background: selectedCount > 0 ? "#111" : "#F0EDE8",
                        color: selectedCount > 0 ? "#fff" : "#9C9485",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        fontFamily: FM,
                        letterSpacing: "0.06em",
                        transition: "all 0.2s",
                    }}>
                        {selectedCount} / {maxFeatures}
                    </span>
                </div>
            </div>

            <div style={{ padding: "1.75rem" }}>

                {/* ── Premium Badges ── */}
                <div style={{ marginBottom: "2rem" }}>
                    <p style={{
                        fontSize: "0.62rem",
                        fontWeight: 700,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "#9C9485",
                        fontFamily: FM,
                        marginBottom: "1rem",
                    }}>Premium Badges</p>

                    <div
                        className="trust-badge-grid"
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 1fr",
                            gap: "0.75rem",
                        }}
                    >
                        {BADGE_CARDS.map(({ key, label, icon, color, gradient }) => {
                            const active = badgeActive(key);
                            return (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => onBadgeToggle?.(key)}
                                    className={`badge-card${active ? " badge-card--active" : ""}`}
                                    style={{
                                        background: active
                                            ? gradient
                                            : "#FAFAF8",
                                        border: `1.5px solid ${active ? color + "66" : "#E8E4DC"}`,
                                        boxShadow: active ? `0 4px 20px ${color}22` : "none",
                                    }}
                                    aria-pressed={active}
                                    aria-label={`Toggle ${label} badge`}
                                    id={`badge-${key}`}
                                >
                                    <span style={{ fontSize: "1.5rem", lineHeight: 1 }}>{icon}</span>
                                    <div style={{ flex: 1, textAlign: "left" }}>
                                        <p style={{
                                            fontSize: "0.78rem",
                                            fontWeight: 700,
                                            fontFamily: FM,
                                            color: active ? color : "#111",
                                            margin: 0,
                                            transition: "color 0.2s",
                                        }}>{label}</p>
                                        <p style={{
                                            fontSize: "0.62rem",
                                            color: active ? color + "CC" : "#9C9485",
                                            fontFamily: FO,
                                            margin: "0.1rem 0 0",
                                            transition: "color 0.2s",
                                        }}>
                                            {active ? "Active on store" : "Tap to enable"}
                                        </p>
                                    </div>
                                    <div
                                        className="badge-check-ring"
                                        style={{
                                            color: active ? color : "#D5CFC5",
                                            background: active ? color + "18" : "transparent",
                                            borderColor: active ? color + "80" : "#D5CFC5",
                                        }}
                                    >
                                        {active && (
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3.5">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── Divider ── */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1.75rem",
                }}>
                    <div style={{ flex: 1, height: 1, background: "#F0EDE8" }} />
                    <span style={{
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "#9C9485",
                        fontFamily: FM,
                        whiteSpace: "nowrap",
                    }}>Feature Cards</span>
                    <div style={{ flex: 1, height: 1, background: "#F0EDE8" }} />
                </div>

                {/* ── Feature Grid ── */}
                <div
                    className="trust-features-grid"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(5, 1fr)",
                        gap: "0.75rem",
                        marginBottom: "1.25rem",
                    }}
                >
                    {TRUST_CARDS.map(({ label, icon, desc }) => {
                        const active = trustFeatures.includes(label);
                        const atMax = selectedCount >= maxFeatures && !active;
                        return (
                            <button
                                key={label}
                                type="button"
                                onClick={() => !atMax && onToggle(label)}
                                className={`trust-card${active ? " trust-card--active" : ""}${atMax ? " trust-card--disabled" : ""}`}
                                aria-pressed={active}
                                aria-label={`Toggle feature: ${label}`}
                                id={`trust-${label.replace(/\s+/g, "-").toLowerCase()}`}
                                title={atMax ? `Maximum ${maxFeatures} features selected` : desc}
                            >
                                {/* Check mark (shown when active) */}
                                <div className="trust-check">
                                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>

                                <span className="trust-icon">{icon}</span>

                                <p style={{
                                    fontSize: "0.7rem",
                                    fontWeight: 700,
                                    fontFamily: FM,
                                    color: active ? "#fff" : "#111",
                                    margin: 0,
                                    lineHeight: 1.2,
                                    transition: "color 0.2s",
                                }}>{label}</p>

                                <p style={{
                                    fontSize: "0.57rem",
                                    color: active ? "rgba(255,255,255,0.65)" : "#9C9485",
                                    fontFamily: FO,
                                    margin: 0,
                                    lineHeight: 1.3,
                                    transition: "color 0.2s",
                                }}>{desc}</p>
                            </button>
                        );
                    })}
                </div>

                {/* ── Helper text ── */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "0.75rem",
                    borderTop: "1px solid #F0EDE8",
                }}>
                    <p style={{
                        fontSize: "0.68rem",
                        color: "#9C9485",
                        fontFamily: FO,
                        margin: 0,
                    }}>
                        {selectedCount === 0
                            ? "No features selected yet"
                            : `${selectedCount} feature${selectedCount > 1 ? "s" : ""} selected`}
                    </p>
                    {selectedCount > 0 && (
                        <button
                            type="button"
                            onClick={() => trustFeatures.forEach(f => onToggle(f))}
                            style={{
                                background: "none",
                                border: "none",
                                color: "#9C9485",
                                fontSize: "0.65rem",
                                fontFamily: FM,
                                fontWeight: 700,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                cursor: "pointer",
                                textDecoration: "underline",
                                textUnderlineOffset: "3px",
                                padding: 0,
                            }}
                        >
                            Clear All
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
