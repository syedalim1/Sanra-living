"use client";

import React, { useState, useCallback, useMemo } from "react";
import { FM, FO } from "../constants";

/* ─────────────────────────────────────────────────────────────
   LUXURY FAQ SECTION
   Apple + IKEA · Accordion cards · Auto-suggestions · Max 3
   ───────────────────────────────────────────────────────────── */

interface Faq {
    question: string;
    answer: string;
}

export interface FaqSectionProps {
    faqs: Faq[];
    onChange: (faqs: Faq[]) => void;
    category?: string;
    sectionNum?: number;
}

const SUGGESTED_FAQS: Record<string, Faq[]> = {
    _default: [
        { question: "Is it rust resistant?", answer: "Yes, our products are treated with an anti-corrosion coating that ensures long-lasting durability in all weather conditions." },
        { question: "What is the warranty?", answer: "This product comes with a 3-year manufacturer warranty covering all structural defects." },
        { question: "Do you provide Pan India delivery?", answer: "Yes, we deliver across all Indian states. Shipping is free on orders above ₹2,999." },
        { question: "Is installation required?", answer: "Minimal assembly may be required. All necessary hardware and instructions are included in the package." },
    ],
    Seating: [
        { question: "What is the weight capacity?", answer: "This chair supports up to 150 kg with its heavy-duty steel frame construction." },
        { question: "Is the seat comfortable for long hours?", answer: "Yes, the ergonomic design ensures maximum comfort even during extended use." },
    ],
    Commercial: [
        { question: "Is this suitable for hotels and restaurants?", answer: "Absolutely. This is commercial-grade furniture designed for high-traffic hospitality environments." },
        { question: "Can I order in bulk?", answer: "Yes, we offer special bulk pricing for orders of 20+ units. Contact us on WhatsApp for a custom quote." },
    ],
    "Balcony & Outdoor": [
        { question: "Can I leave it outdoors in rain?", answer: "Yes, this product is treated with weather-resistant coating and is safe for outdoor use in all conditions." },
    ],
    Storage: [
        { question: "What is the shelf capacity?", answer: "Each shelf supports up to 30 kg of evenly distributed weight." },
    ],
};

export default function FaqSection({
    faqs,
    onChange,
    category = "",
    sectionNum = 7,
}: FaqSectionProps) {
    const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const suggestions = useMemo(() => {
        const base = SUGGESTED_FAQS._default;
        const catSpecific = SUGGESTED_FAQS[category] ?? [];
        const all = [...catSpecific, ...base];
        return all.filter(s => !faqs.some(f => f.question === s.question)).slice(0, 4);
    }, [category, faqs]);

    const addFaq = useCallback(() => {
        if (faqs.length >= 3) return;
        onChange([...faqs, { question: "", answer: "" }]);
        setExpandedIdx(faqs.length);
    }, [faqs, onChange]);

    const updateFaq = useCallback((idx: number, field: "question" | "answer", value: string) => {
        const updated = faqs.map((f, i) => i === idx ? { ...f, [field]: value } : f);
        onChange(updated);
    }, [faqs, onChange]);

    const removeFaq = useCallback((idx: number) => {
        onChange(faqs.filter((_, i) => i !== idx));
        if (expandedIdx === idx) setExpandedIdx(null);
        else if (expandedIdx !== null && expandedIdx > idx) setExpandedIdx(expandedIdx - 1);
    }, [faqs, onChange, expandedIdx]);

    const useSuggestion = useCallback((suggestion: Faq) => {
        if (faqs.length >= 3) return;
        onChange([...faqs, { ...suggestion }]);
        setExpandedIdx(faqs.length);
    }, [faqs, onChange]);

    const filledCount = faqs.filter(f => f.question.trim() && f.answer.trim()).length;

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
                .faq-card {
                    background: #FAFAF8;
                    border: 1.5px solid #E8E4DC;
                    border-radius: 14px;
                    overflow: hidden;
                    transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .faq-card:hover { border-color: #C8B89A; }
                .faq-card--expanded {
                    border-color: #111 !important;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important;
                }
                .faq-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem 1.25rem;
                    cursor: pointer;
                    user-select: none;
                    -webkit-tap-highlight-color: transparent;
                    transition: background 0.15s ease;
                }
                .faq-header:hover { background: rgba(0,0,0,0.015); }
                .faq-body {
                    overflow: hidden;
                    transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                                opacity 0.25s ease, padding 0.25s ease;
                }
                .faq-body--open {
                    max-height: 500px;
                    opacity: 1;
                    padding: 0 1.25rem 1.25rem;
                }
                .faq-body--closed {
                    max-height: 0;
                    opacity: 0;
                    padding: 0 1.25rem;
                }
                .faq-input {
                    width: 100%;
                    border: 1.5px solid #E8E4DC;
                    border-radius: 10px;
                    padding: 0.75rem 1rem;
                    font-size: 0.85rem;
                    font-family: ${FO};
                    color: #111;
                    background: #fff;
                    outline: none;
                    transition: border-color 0.2s;
                    box-sizing: border-box;
                }
                .faq-input:focus {
                    border-color: #111;
                    box-shadow: 0 0 0 3px rgba(17,17,17,0.06);
                }
                .faq-input::placeholder { color: #C8B89A; }
                .faq-suggestion {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.75rem;
                    padding: 0.85rem 1rem;
                    background: #FAFAF8;
                    border: 1.5px solid #E8E4DC;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.18s ease;
                    text-align: left;
                    width: 100%;
                }
                .faq-suggestion:hover {
                    border-color: #C8B89A;
                    background: #F5F2EC;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
                }
                @media (max-width: 640px) {
                    .faq-suggestions-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>

            {/* Header */}
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
                        <p style={{ fontSize: "0.95rem", fontWeight: 700, fontFamily: FM, color: "#111", margin: 0 }}>Frequently Asked Questions</p>
                        <p style={{ fontSize: "0.7rem", color: "#9C9485", fontFamily: FO, margin: "0.15rem 0 0" }}>
                            Build trust with {filledCount > 0 ? `${filledCount} FAQ${filledCount > 1 ? "s" : ""}` : "up to 3 FAQs"}
                        </p>
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{
                        padding: "0.3rem 0.85rem", borderRadius: 99,
                        background: faqs.length > 0 ? "#111" : "#F0EDE8",
                        color: faqs.length > 0 ? "#fff" : "#9C9485",
                        fontSize: "0.68rem", fontWeight: 700, fontFamily: FM,
                        transition: "all 0.2s",
                    }}>{faqs.length} / 3</span>
                    {faqs.length < 3 && (
                        <button
                            type="button"
                            onClick={addFaq}
                            style={{
                                padding: "0.4rem 1rem", background: "#111", border: "none",
                                color: "#fff", fontSize: "0.65rem", fontWeight: 700,
                                fontFamily: FM, letterSpacing: "0.08em", textTransform: "uppercase",
                                borderRadius: 8, cursor: "pointer", transition: "opacity 0.15s",
                            }}
                        >+ Add FAQ</button>
                    )}
                </div>
            </div>

            <div style={{ padding: "1.75rem" }}>

                {/* FAQ Cards */}
                {faqs.length === 0 ? (
                    <div style={{
                        textAlign: "center", padding: "2rem 1rem",
                        border: "2px dashed #E8E4DC", borderRadius: 14,
                        marginBottom: "1.5rem",
                    }}>
                        <p style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>💬</p>
                        <p style={{ fontSize: "0.82rem", fontWeight: 600, fontFamily: FM, color: "#111", margin: "0 0 0.25rem" }}>
                            No FAQs added yet
                        </p>
                        <p style={{ fontSize: "0.7rem", color: "#9C9485", fontFamily: FO, margin: 0 }}>
                            Add questions to build customer confidence
                        </p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                        {faqs.map((faq, i) => {
                            const isExpanded = expandedIdx === i;
                            return (
                                <div
                                    key={i}
                                    className={`faq-card${isExpanded ? " faq-card--expanded" : ""}`}
                                >
                                    <div className="faq-header" onClick={() => setExpandedIdx(isExpanded ? null : i)}>
                                        <div style={{
                                            width: 28, height: 28, borderRadius: "50%",
                                            background: isExpanded ? "#111" : "#F0EDE8",
                                            color: isExpanded ? "#fff" : "#9C9485",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: "0.7rem", fontWeight: 800, fontFamily: FM,
                                            transition: "all 0.2s", flexShrink: 0,
                                        }}>{i + 1}</div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{
                                                fontSize: "0.82rem", fontWeight: 600, fontFamily: FM, color: "#111",
                                                margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                                            }}>
                                                {faq.question || "Untitled Question"}
                                            </p>
                                            {!isExpanded && faq.answer && (
                                                <p style={{
                                                    fontSize: "0.68rem", color: "#9C9485", fontFamily: FO,
                                                    margin: "0.15rem 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                                                }}>{faq.answer}</p>
                                            )}
                                        </div>
                                        <span style={{
                                            fontSize: "0.85rem", color: "#9C9485",
                                            transform: isExpanded ? "rotate(180deg)" : "none",
                                            transition: "transform 0.25s ease", flexShrink: 0,
                                        }}>▾</span>
                                    </div>
                                    <div className={`faq-body${isExpanded ? " faq-body--open" : " faq-body--closed"}`}>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                                            <div>
                                                <label style={{
                                                    display: "block", fontSize: "0.6rem", fontWeight: 700,
                                                    letterSpacing: "0.15em", textTransform: "uppercase",
                                                    color: "#9C9485", fontFamily: FM, marginBottom: "0.4rem",
                                                }}>Question</label>
                                                <input
                                                    className="faq-input"
                                                    value={faq.question}
                                                    onChange={e => updateFaq(i, "question", e.target.value)}
                                                    placeholder="What material is this product made of?"
                                                />
                                            </div>
                                            <div>
                                                <label style={{
                                                    display: "block", fontSize: "0.6rem", fontWeight: 700,
                                                    letterSpacing: "0.15em", textTransform: "uppercase",
                                                    color: "#9C9485", fontFamily: FM, marginBottom: "0.4rem",
                                                }}>Answer</label>
                                                <textarea
                                                    className="faq-input"
                                                    value={faq.answer}
                                                    onChange={e => updateFaq(i, "answer", e.target.value)}
                                                    placeholder="This product is crafted from premium-grade stainless steel..."
                                                    rows={3}
                                                    style={{ resize: "vertical", minHeight: 70 }}
                                                />
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFaq(i)}
                                                    style={{
                                                        background: "none", border: "none",
                                                        color: "#EF4444", fontSize: "0.65rem", fontWeight: 700,
                                                        fontFamily: FM, letterSpacing: "0.08em", textTransform: "uppercase",
                                                        cursor: "pointer", padding: "0.3rem 0",
                                                    }}
                                                >✕ Remove FAQ</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Suggestions */}
                {faqs.length < 3 && suggestions.length > 0 && (
                    <div>
                        <button
                            type="button"
                            onClick={() => setShowSuggestions(!showSuggestions)}
                            style={{
                                display: "flex", alignItems: "center", gap: "0.5rem",
                                background: "none", border: "none", cursor: "pointer",
                                fontSize: "0.65rem", fontWeight: 700, fontFamily: FM,
                                letterSpacing: "0.12em", textTransform: "uppercase",
                                color: "#9C9485", padding: 0, marginBottom: showSuggestions ? "1rem" : 0,
                                transition: "color 0.15s",
                            }}
                        >
                            <span style={{ fontSize: "0.8rem" }}>💡</span>
                            {showSuggestions ? "Hide Suggestions" : `${suggestions.length} Smart Suggestion${suggestions.length > 1 ? "s" : ""}`}
                            <span style={{ transform: showSuggestions ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
                        </button>

                        {showSuggestions && (
                            <div
                                className="faq-suggestions-grid"
                                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}
                            >
                                {suggestions.map((s, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        className="faq-suggestion"
                                        onClick={() => useSuggestion(s)}
                                        disabled={faqs.length >= 3}
                                    >
                                        <span style={{
                                            width: 22, height: 22, borderRadius: "50%",
                                            background: "#F0EDE8", display: "flex",
                                            alignItems: "center", justifyContent: "center",
                                            fontSize: "0.65rem", flexShrink: 0, marginTop: "0.05rem",
                                        }}>+</span>
                                        <div>
                                            <p style={{
                                                fontSize: "0.72rem", fontWeight: 600, fontFamily: FM,
                                                color: "#111", margin: "0 0 0.15rem", lineHeight: 1.3,
                                            }}>{s.question}</p>
                                            <p style={{
                                                fontSize: "0.6rem", color: "#9C9485", fontFamily: FO,
                                                margin: 0, lineHeight: 1.35,
                                                display: "-webkit-box", WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical", overflow: "hidden",
                                            }}>{s.answer}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
