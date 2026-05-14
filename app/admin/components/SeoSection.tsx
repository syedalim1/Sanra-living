"use client";

import React, { useMemo, useState } from "react";
import { FM, FO } from "../constants";

/* ─────────────────────────────────────────────────────────────
   LUXURY SEO SECTION
   Google preview · Character counts · Quality score
   Auto-suggestions · Mobile preview · Premium design
   ───────────────────────────────────────────────────────────── */

export interface SeoSectionProps {
    seoTitle: string;
    seoDescription: string;
    /** Product title as fallback for preview */
    productTitle?: string;
    /** Product price for preview snippet */
    productPrice?: string;
    onChange: (field: "seo_title" | "seo_description", value: string) => void;
    sectionNum?: number;
}

/* ── Limits ── */
const TITLE_MIN = 30;
const TITLE_MAX = 60;
const TITLE_IDEAL = 55;
const DESC_MIN = 100;
const DESC_MAX = 160;
const DESC_IDEAL = 145;

export default function SeoSection({
    seoTitle,
    seoDescription,
    productTitle = "",
    productPrice = "",
    onChange,
    sectionNum = 6,
}: SeoSectionProps) {
    const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");

    /* ── Quality scoring ── */
    const { score, issues, suggestions } = useMemo(() => {
        let s = 0;
        const iss: string[] = [];
        const sug: string[] = [];

        // Title checks
        const tLen = seoTitle.length;
        if (tLen === 0) {
            iss.push("SEO title is empty");
            sug.push("Add a descriptive title with your primary keyword");
        } else if (tLen < TITLE_MIN) {
            iss.push(`Title too short (${tLen}/${TITLE_MIN} min)`);
            sug.push(`Add ${TITLE_MIN - tLen} more characters to your title`);
        } else if (tLen > TITLE_MAX) {
            iss.push(`Title too long — may be truncated in search (${tLen}/${TITLE_MAX})`);
            sug.push(`Remove ${tLen - TITLE_MAX} characters from title`);
        } else {
            s += 35;
        }

        // Description checks
        const dLen = seoDescription.length;
        if (dLen === 0) {
            iss.push("Meta description is empty");
            sug.push("Write a compelling description that summarizes the product");
        } else if (dLen < DESC_MIN) {
            iss.push(`Description too short (${dLen}/${DESC_MIN} min)`);
            sug.push(`Add ${DESC_MIN - dLen} more characters to description`);
        } else if (dLen > DESC_MAX) {
            iss.push(`Description may be truncated (${dLen}/${DESC_MAX})`);
            sug.push(`Shorten description by ${dLen - DESC_MAX} characters`);
        } else {
            s += 35;
        }

        // Keyword presence
        const title = seoTitle.toLowerCase();
        if (tLen > 0) {
            if (title.includes("buy") || title.includes("shop") || title.includes("online")) {
                s += 10;
            } else {
                sug.push("Consider adding action words like 'Buy', 'Shop', or 'Online'");
            }
            if (title.includes("steel") || title.includes("furniture") || title.includes("premium")) {
                s += 10;
            } else {
                sug.push("Include product keywords like 'Steel Furniture' or 'Premium'");
            }
        }

        // Both filled bonus
        if (tLen >= TITLE_MIN && dLen >= DESC_MIN) s += 10;

        return { score: Math.min(100, s), issues: iss, suggestions: sug };
    }, [seoTitle, seoDescription]);

    /* ── Score color ── */
    const scoreColor = score >= 70 ? "#10B981" : score >= 40 ? "#F59E0B" : "#EF4444";
    const scoreLabel = score >= 70 ? "Excellent" : score >= 40 ? "Needs Work" : "Poor";

    /* ── Character count bar ── */
    const CharBar = ({ value, min, ideal, max }: { value: number; min: number; ideal: number; max: number }) => {
        const pct = Math.min(100, (value / max) * 100);
        const barColor = value === 0 ? "#E8E4DC" : value < min ? "#EF4444" : value > max ? "#EF4444" : value <= ideal ? "#10B981" : "#F59E0B";
        return (
            <div style={{ height: 3, borderRadius: 99, background: "#F0EDE8", overflow: "hidden", marginTop: "0.5rem" }}>
                <div style={{ height: "100%", borderRadius: 99, background: barColor, width: `${pct}%`, transition: "width 0.3s ease, background 0.3s ease" }} />
            </div>
        );
    };

    /* ── Preview title ── */
    const previewTitle = seoTitle || productTitle || "Product Title — SANRA LIVING";
    const previewDesc = seoDescription || "Shop premium quality steel furniture handcrafted with precision. Pan India delivery available.";
    const previewUrl = "sanraliving.com › shop › product";

    return (
        <div style={{
            background: "#fff",
            borderRadius: "16px",
            border: "1px solid #E8E4DC",
            overflow: "hidden",
            boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
            marginBottom: "0.75rem",
        }}>
            <style>{`
                .seo-input {
                    width: 100%;
                    border: 1.5px solid #E8E4DC;
                    border-radius: 12px;
                    padding: 0.85rem 1rem;
                    font-size: 0.88rem;
                    font-family: ${FO};
                    color: #111;
                    background: #FAFAF8;
                    outline: none;
                    transition: all 0.2s ease;
                    box-sizing: border-box;
                }
                .seo-input:focus {
                    border-color: #111;
                    background: #fff;
                    box-shadow: 0 0 0 3px rgba(17,17,17,0.06);
                }
                .seo-input::placeholder { color: #C8B89A; }
                .seo-textarea {
                    resize: vertical;
                    min-height: 80px;
                }
                .seo-suggestion {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.6rem;
                    padding: 0.6rem 0.75rem;
                    background: #FAFAF8;
                    border: 1px solid #F0EDE8;
                    border-radius: 10px;
                    transition: background 0.15s;
                }
                .seo-suggestion:hover { background: #F5F2EC; }
                .seo-preview-toggle {
                    padding: 0.4rem 1rem;
                    border: 1.5px solid transparent;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 0.68rem;
                    font-weight: 700;
                    font-family: ${FM};
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    transition: all 0.15s;
                    background: transparent;
                    color: #9C9485;
                }
                .seo-preview-toggle--active {
                    background: #111 !important;
                    color: #fff !important;
                    border-color: #111 !important;
                }
                @media (max-width: 640px) {
                    .seo-fields-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>

            {/* ── Header ── */}
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
                        width: 32, height: 32, borderRadius: "50%", background: "#111", color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.75rem", fontWeight: 800, fontFamily: FM, flexShrink: 0,
                    }}>{sectionNum}</div>
                    <div>
                        <p style={{ fontSize: "0.95rem", fontWeight: 700, fontFamily: FM, color: "#111", margin: 0 }}>Search Engine Optimization</p>
                        <p style={{ fontSize: "0.7rem", color: "#9C9485", fontFamily: FO, margin: "0.15rem 0 0" }}>
                            Optimize how this product appears in Google
                        </p>
                    </div>
                </div>

                {/* SEO Score badge */}
                <div style={{
                    display: "flex", alignItems: "center", gap: "0.6rem",
                    padding: "0.35rem 0.85rem", borderRadius: 99,
                    background: `${scoreColor}12`, border: `1.5px solid ${scoreColor}33`,
                    transition: "all 0.3s",
                }}>
                    <div style={{
                        width: 28, height: 28, borderRadius: "50%",
                        background: `conic-gradient(${scoreColor} ${score * 3.6}deg, #F0EDE8 0deg)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <div style={{
                            width: 20, height: 20, borderRadius: "50%", background: "#fff",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "0.5rem", fontWeight: 800, fontFamily: FM, color: scoreColor,
                        }}>{score}</div>
                    </div>
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, fontFamily: FM, color: scoreColor, letterSpacing: "0.04em" }}>
                        {scoreLabel}
                    </span>
                </div>
            </div>

            <div style={{ padding: "1.75rem" }}>

                {/* ── SEO Title ── */}
                <div style={{ marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                        <label style={{
                            fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em",
                            textTransform: "uppercase", color: "#9C9485", fontFamily: FM,
                        }}>SEO Title</label>
                        <span style={{
                            fontSize: "0.65rem", fontWeight: 600, fontFamily: FM,
                            color: seoTitle.length === 0 ? "#C8B89A" : seoTitle.length > TITLE_MAX ? "#EF4444" : seoTitle.length < TITLE_MIN ? "#F59E0B" : "#10B981",
                            transition: "color 0.2s",
                        }}>
                            {seoTitle.length} / {TITLE_MAX}
                        </span>
                    </div>
                    <input
                        className="seo-input"
                        value={seoTitle}
                        onChange={e => onChange("seo_title", e.target.value)}
                        placeholder="Buy Premium Stainless Steel Stool Online | SANRA LIVING"
                        maxLength={70}
                        id="seo-title-input"
                    />
                    <CharBar value={seoTitle.length} min={TITLE_MIN} ideal={TITLE_IDEAL} max={TITLE_MAX} />
                    {seoTitle.length > 0 && seoTitle.length > TITLE_MAX && (
                        <p style={{ fontSize: "0.65rem", color: "#EF4444", fontFamily: FO, marginTop: "0.4rem" }}>
                            ⚠ Title exceeds {TITLE_MAX} characters — Google will truncate it
                        </p>
                    )}
                </div>

                {/* ── SEO Description ── */}
                <div style={{ marginBottom: "2rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                        <label style={{
                            fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em",
                            textTransform: "uppercase", color: "#9C9485", fontFamily: FM,
                        }}>Meta Description</label>
                        <span style={{
                            fontSize: "0.65rem", fontWeight: 600, fontFamily: FM,
                            color: seoDescription.length === 0 ? "#C8B89A" : seoDescription.length > DESC_MAX ? "#EF4444" : seoDescription.length < DESC_MIN ? "#F59E0B" : "#10B981",
                            transition: "color 0.2s",
                        }}>
                            {seoDescription.length} / {DESC_MAX}
                        </span>
                    </div>
                    <textarea
                        className="seo-input seo-textarea"
                        value={seoDescription}
                        onChange={e => onChange("seo_description", e.target.value)}
                        placeholder="Shop premium quality stainless steel furniture crafted in Coimbatore. Rust-free, heavy-duty & backed by 3 year warranty. Pan India delivery available."
                        maxLength={200}
                        rows={3}
                        id="seo-description-input"
                    />
                    <CharBar value={seoDescription.length} min={DESC_MIN} ideal={DESC_IDEAL} max={DESC_MAX} />
                    {seoDescription.length > 0 && seoDescription.length < DESC_MIN && (
                        <p style={{ fontSize: "0.65rem", color: "#F59E0B", fontFamily: FO, marginTop: "0.4rem" }}>
                            ⚠ Description too short — add {DESC_MIN - seoDescription.length} more characters for better ranking
                        </p>
                    )}
                </div>

                {/* ── Divider ── */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div style={{ flex: 1, height: 1, background: "#F0EDE8" }} />
                    <span style={{
                        fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.2em",
                        textTransform: "uppercase", color: "#9C9485", fontFamily: FM, whiteSpace: "nowrap",
                    }}>Search Preview</span>
                    <div style={{ flex: 1, height: 1, background: "#F0EDE8" }} />
                </div>

                {/* ── Preview mode toggle ── */}
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
                    <button
                        type="button"
                        className={`seo-preview-toggle${previewMode === "desktop" ? " seo-preview-toggle--active" : ""}`}
                        onClick={() => setPreviewMode("desktop")}
                        style={previewMode !== "desktop" ? { border: "1.5px solid #E8E4DC" } : {}}
                    >
                        🖥 Desktop
                    </button>
                    <button
                        type="button"
                        className={`seo-preview-toggle${previewMode === "mobile" ? " seo-preview-toggle--active" : ""}`}
                        onClick={() => setPreviewMode("mobile")}
                        style={previewMode !== "mobile" ? { border: "1.5px solid #E8E4DC" } : {}}
                    >
                        📱 Mobile
                    </button>
                </div>

                {/* ── Google Preview Card ── */}
                <div style={{
                    background: previewMode === "desktop" ? "#fff" : "#F9FAFB",
                    border: "1px solid #E8E4DC",
                    borderRadius: 14,
                    padding: previewMode === "desktop" ? "1.5rem" : "1rem",
                    maxWidth: previewMode === "desktop" ? "100%" : 380,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                    marginBottom: "1.5rem",
                }}>
                    {previewMode === "desktop" ? (
                        /* Desktop preview */
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
                                <div style={{
                                    width: 26, height: 26, borderRadius: "50%", background: "#F0EDE8",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "0.65rem", fontWeight: 700, fontFamily: FM, color: "#111",
                                }}>S</div>
                                <div>
                                    <p style={{ fontSize: "0.72rem", fontFamily: FO, color: "#111", margin: 0, fontWeight: 500 }}>SANRA LIVING</p>
                                    <p style={{ fontSize: "0.62rem", fontFamily: FO, color: "#9C9485", margin: "0.05rem 0 0" }}>{previewUrl}</p>
                                </div>
                            </div>
                            <p style={{
                                fontSize: "1.05rem", fontWeight: 500, color: "#1A0DAB", margin: "0.35rem 0 0.25rem",
                                fontFamily: "Arial, sans-serif", lineHeight: 1.3,
                                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                            }}>
                                {previewTitle.length > 60 ? previewTitle.slice(0, 57) + "..." : previewTitle}
                            </p>
                            {productPrice && (
                                <p style={{ fontSize: "0.78rem", color: "#111", fontWeight: 600, fontFamily: "Arial, sans-serif", margin: "0 0 0.2rem" }}>
                                    ₹{Number(productPrice).toLocaleString("en-IN")} — In stock
                                </p>
                            )}
                            <p style={{
                                fontSize: "0.82rem", color: "#4D5156", margin: 0,
                                fontFamily: "Arial, sans-serif", lineHeight: 1.5,
                                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                            }}>
                                {previewDesc.length > 160 ? previewDesc.slice(0, 157) + "..." : previewDesc}
                            </p>
                        </div>
                    ) : (
                        /* Mobile preview */
                        <div style={{
                            maxWidth: 340, margin: "0 auto",
                            background: "#fff", borderRadius: 16,
                            border: "2px solid #E8E4DC", overflow: "hidden",
                        }}>
                            {/* Notch bar */}
                            <div style={{ background: "#111", padding: "0.3rem 0.8rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ color: "#fff", fontSize: "0.55rem", fontWeight: 600 }}>9:41</span>
                                <div style={{ width: 50, height: 4, borderRadius: 99, background: "#333" }} />
                                <span style={{ color: "#fff", fontSize: "0.55rem" }}>●●●</span>
                            </div>
                            {/* Google mobile search bar */}
                            <div style={{ padding: "0.6rem 0.75rem", borderBottom: "1px solid #F0EDE8" }}>
                                <div style={{
                                    display: "flex", alignItems: "center", gap: "0.5rem",
                                    background: "#F3F0EB", borderRadius: 99, padding: "0.45rem 0.75rem",
                                }}>
                                    <span style={{ fontSize: "0.7rem" }}>🔍</span>
                                    <span style={{ fontSize: "0.68rem", color: "#9C9485", fontFamily: FO }}>sanra living furniture</span>
                                </div>
                            </div>
                            {/* Result card */}
                            <div style={{ padding: "0.85rem 0.75rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.35rem" }}>
                                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#F0EDE8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.45rem", fontWeight: 700 }}>S</div>
                                    <span style={{ fontSize: "0.58rem", color: "#9C9485", fontFamily: FO }}>{previewUrl}</span>
                                </div>
                                <p style={{
                                    fontSize: "0.88rem", fontWeight: 500, color: "#1A0DAB", margin: "0.15rem 0 0.2rem",
                                    fontFamily: "Arial, sans-serif", lineHeight: 1.25,
                                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                                }}>
                                    {previewTitle.length > 55 ? previewTitle.slice(0, 52) + "..." : previewTitle}
                                </p>
                                {productPrice && (
                                    <p style={{ fontSize: "0.68rem", color: "#111", fontWeight: 600, fontFamily: "Arial, sans-serif", margin: "0 0 0.15rem" }}>
                                        ₹{Number(productPrice).toLocaleString("en-IN")}
                                    </p>
                                )}
                                <p style={{
                                    fontSize: "0.72rem", color: "#4D5156", margin: 0,
                                    fontFamily: "Arial, sans-serif", lineHeight: 1.45,
                                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                                }}>
                                    {previewDesc.length > 120 ? previewDesc.slice(0, 117) + "..." : previewDesc}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Suggestions ── */}
                {(issues.length > 0 || suggestions.length > 0) && (
                    <div>
                        <p style={{
                            fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.2em",
                            textTransform: "uppercase", color: "#9C9485", fontFamily: FM,
                            marginBottom: "0.75rem",
                        }}>
                            {issues.length > 0 ? "Issues & Suggestions" : "Optimization Tips"}
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            {issues.map((iss, i) => (
                                <div key={`iss-${i}`} className="seo-suggestion">
                                    <span style={{ fontSize: "0.75rem", lineHeight: 1, flexShrink: 0, marginTop: "0.05rem" }}>⚠️</span>
                                    <p style={{ fontSize: "0.72rem", color: "#111", fontFamily: FO, margin: 0, lineHeight: 1.4 }}>{iss}</p>
                                </div>
                            ))}
                            {suggestions.map((sug, i) => (
                                <div key={`sug-${i}`} className="seo-suggestion">
                                    <span style={{ fontSize: "0.75rem", lineHeight: 1, flexShrink: 0, marginTop: "0.05rem" }}>💡</span>
                                    <p style={{ fontSize: "0.72rem", color: "#9C9485", fontFamily: FO, margin: 0, lineHeight: 1.4 }}>{sug}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── All clear ── */}
                {score >= 70 && issues.length === 0 && (
                    <div style={{
                        display: "flex", alignItems: "center", gap: "0.75rem",
                        padding: "1rem 1.25rem", background: "#10B98108",
                        border: "1px solid #10B98122", borderRadius: 12,
                    }}>
                        <span style={{ fontSize: "1.2rem" }}>✅</span>
                        <div>
                            <p style={{ fontSize: "0.78rem", fontWeight: 700, fontFamily: FM, color: "#10B981", margin: 0 }}>SEO looks great!</p>
                            <p style={{ fontSize: "0.65rem", color: "#9C9485", fontFamily: FO, margin: "0.1rem 0 0" }}>
                                Title and description are optimized for search
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
