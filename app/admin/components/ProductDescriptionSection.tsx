"use client";

import React, { useState, useEffect } from "react";
import { C, FM, FO } from "../constants";

interface ProductDescriptionProps {
    form: {
        title: string;
        image_url: string;
        price: string;
        compare_at_price: string;
        description: string;
        highlights: string[];
        material: string;
        finish: string;
        height: string;
        width: string;
        depth: string;
        warranty: string;
        delivery_info: string;
        care_instructions: string;
        assembly_required: boolean;
        usage_environment: string;
        weight_capacity: string;
        premium_finish: string;
        [key: string]: any;
    };
    onChange: (field: string, value: any) => void;
    sectionNum: number;
    defaultOpen?: boolean;
}

const MATERIALS = ["SS Jindal Steel", "MS CR Steel", "Wood + Steel", "Cushion + Steel"];
const WARRANTIES = ["No Warranty", "1 Year Warranty", "3 Year Warranty", "5 Year Warranty"];
const DELIVERY_SUGGESTIONS = ["Pan India Delivery", "Fast Dispatch", "Secure Packaging", "Installation Support"];
const USAGE_OPTIONS = ["Indoor", "Outdoor", "Indoor & Outdoor"];

const inp: React.CSSProperties = {
    background: "#F9FAFB",
    border: "1px solid #E5E7EB",
    color: "#111",
    fontSize: "0.85rem",
    fontFamily: FO,
    borderRadius: "10px",
    padding: "0.85rem 1rem",
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    transition: "all 0.2s ease",
};

const lbl: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.68rem",
    fontWeight: 700,
    color: "#374151",
    fontFamily: FM,
    marginBottom: "0.5rem",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
};

export default function ProductDescriptionSection({ form, onChange, sectionNum, defaultOpen = false }: ProductDescriptionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    // Auto-bullet formatting for highlights
    const handleHighlightsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        const lines = text.split("\n").map(s => s.trim().replace(/^•\s*/, "")).filter(Boolean);
        if (lines.length <= 6) {
            onChange("highlights", lines);
        } else {
            // Keep only first 6
            onChange("highlights", lines.slice(0, 6));
        }
    };

    const highlightsText = form.highlights.map(h => `• ${h}`).join("\n");

    const addDeliverySuggestion = (sug: string) => {
        const current = form.delivery_info || "";
        if (current.includes(sug)) return;
        const next = current ? `${current}, ${sug}` : sug;
        onChange("delivery_info", next);
    };

    return (
        <div style={{ background: "#fff", borderRadius: "16px", marginBottom: "0.75rem", border: "1px solid #E5E7EB", overflow: "hidden", boxShadow: isOpen ? "0 8px 30px rgba(0,0,0,0.04)" : "none", transition: "all 0.3s ease" }}>
            <button type="button" onClick={() => setIsOpen(!isOpen)} style={{ width: "100%", textAlign: "left", padding: "1.25rem 1.5rem", background: "#fff", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ width: 32, height: 32, borderRadius: "50%", background: isOpen ? "#111" : "#F3F4F6", color: isOpen ? "#fff" : "#6B7280", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 800, fontFamily: FM, transition: "all 0.3s" }}>
                        {sectionNum}
                    </span>
                    <div>
                        <span style={{ fontSize: "1.05rem", fontWeight: 800, fontFamily: FM, color: "#111", display: "block" }}>Product Details</span>
                        <span style={{ fontSize: "0.75rem", color: "#6B7280", fontFamily: FO, marginTop: "0.2rem", display: "block" }}>Description, specs, & shipping info</span>
                    </div>
                </div>
                <span style={{ fontSize: "1.2rem", color: "#9CA3AF", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}>▾</span>
            </button>

            <div style={{
                maxHeight: isOpen ? "2000px" : "0",
                opacity: isOpen ? 1 : 0,
                overflow: "hidden",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                borderTop: isOpen ? "1px solid #F3F4F6" : "none"
            }}>
                <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
                    
                    {/* Content Editor Split Layout */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "2rem", alignItems: "start" }}>
                        {/* LEFT: Inputs */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                            {/* Short Description */}
                            <div>
                                <label style={lbl}>
                                    <span>Short Description</span>
                                    <span style={{ color: form.description?.length > 150 ? "#EF4444" : "#9CA3AF" }}>
                                        {form.description?.length || 0} / 150
                                    </span>
                                </label>
                                <textarea
                                    value={form.description || ""}
                                    onChange={e => onChange("description", e.target.value)}
                                    rows={3}
                                    placeholder="A luxurious, modern piece designed to elevate any space..."
                                    style={{ ...inp, resize: "vertical", borderColor: form.description?.length > 150 ? "#FECACA" : "#E5E7EB" }}
                                />
                                <p style={{ fontSize: "0.7rem", color: "#6B7280", fontFamily: FO, marginTop: "0.4rem" }}>Appears below the price. Keep it to 2-3 lines for max conversion.</p>
                            </div>

                            {/* Key Highlights */}
                            <div>
                                <label style={lbl}>
                                    <span>Key Highlights</span>
                                    <span>{form.highlights?.length || 0} / 6</span>
                                </label>
                                <div style={{ position: "relative" }}>
                                    <textarea
                                        value={highlightsText}
                                        onChange={handleHighlightsChange}
                                        rows={5}
                                        placeholder="Rust Resistant&#10;Jindal Steel&#10;Heavy Duty Frame"
                                        style={{ ...inp, resize: "vertical", lineHeight: 1.6 }}
                                    />
                                </div>
                                <p style={{ fontSize: "0.7rem", color: "#6B7280", fontFamily: FO, marginTop: "0.4rem" }}>One highlight per line. Auto-formatted as luxury bullets.</p>
                            </div>
                        </div>

                        {/* RIGHT: Live Mobile Preview */}
                        <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "16px", padding: "1.25rem", position: "sticky", top: "1rem" }}>
                            <p style={{ fontSize: "0.65rem", fontWeight: 700, fontFamily: FM, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                <span style={{ width: 8, height: 8, background: "#22C55E", borderRadius: "50%", display: "inline-block", animation: "pulse 2s infinite" }}></span>
                                Live Preview
                            </p>
                            
                            <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #E5E7EB", padding: "1rem", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
                                <h4 style={{ fontSize: "0.95rem", fontWeight: 800, fontFamily: FM, margin: "0 0 0.5rem", lineHeight: 1.2 }}>{form.title || "Product Title"}</h4>
                                <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem", marginBottom: "0.75rem" }}>
                                    <span style={{ fontSize: "1rem", fontWeight: 800, fontFamily: FM, color: "#111" }}>₹{form.price ? Number(form.price).toLocaleString("en-IN") : "0"}</span>
                                    {form.compare_at_price && <span style={{ fontSize: "0.7rem", color: "#9CA3AF", textDecoration: "line-through" }}>₹{Number(form.compare_at_price).toLocaleString("en-IN")}</span>}
                                </div>

                                <p style={{ fontSize: "0.8rem", color: "#4B5563", fontFamily: FO, lineHeight: 1.5, margin: "0 0 1rem", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                    {form.description || "Your elegant description will appear here..."}
                                </p>

                                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                    {form.highlights?.map((h, i) => (
                                        <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                                            <svg style={{ width: 14, height: 14, color: "#111", flexShrink: 0, marginTop: 2 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            <span style={{ fontSize: "0.75rem", color: "#111", fontFamily: FO, fontWeight: 500 }}>{h}</span>
                                        </div>
                                    ))}
                                    {(!form.highlights || form.highlights.length === 0) && (
                                        <span style={{ fontSize: "0.75rem", color: "#9CA3AF", fontFamily: FO }}>Add highlights to see them here.</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr style={{ border: "none", borderTop: "1px dashed #E5E7EB", margin: 0 }} />

                    {/* Specifications Grid */}
                    <div>
                        <h3 style={{ fontSize: "0.9rem", fontWeight: 800, fontFamily: FM, color: "#111", marginBottom: "1.25rem" }}>Specifications</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
                            <div>
                                <label style={lbl}><span>Material</span></label>
                                <select value={form.material || ""} onChange={e => onChange("material", e.target.value)} style={{ ...inp, cursor: "pointer", appearance: "none" }}>
                                    <option value="" disabled>Select Material</option>
                                    {MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={lbl}><span>Finish</span></label>
                                <input value={form.finish || ""} onChange={e => onChange("finish", e.target.value)} placeholder="e.g. Matte Black" style={inp} />
                            </div>
                            <div>
                                <label style={lbl}><span>Premium Finish Option</span></label>
                                <input value={form.premium_finish || ""} onChange={e => onChange("premium_finish", e.target.value)} placeholder="e.g. PVD Gold Plating" style={inp} />
                            </div>
                            <div>
                                <label style={lbl}><span>Usage Environment</span></label>
                                <select value={form.usage_environment || ""} onChange={e => onChange("usage_environment", e.target.value)} style={{ ...inp, cursor: "pointer", appearance: "none" }}>
                                    <option value="" disabled>Select Usage</option>
                                    {USAGE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Dimensions Split */}
                    <div style={{ background: "#F9FAFB", padding: "1.25rem", borderRadius: "12px", border: "1px solid #E5E7EB" }}>
                        <h3 style={{ fontSize: "0.85rem", fontWeight: 800, fontFamily: FM, color: "#111", marginBottom: "1rem" }}>Dimensions (cm)</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                            <div>
                                <label style={{ ...lbl, color: "#6B7280" }}><span>Height</span></label>
                                <input type="number" value={form.height || ""} onChange={e => onChange("height", e.target.value)} placeholder="e.g. 45" style={inp} />
                            </div>
                            <div>
                                <label style={{ ...lbl, color: "#6B7280" }}><span>Width</span></label>
                                <input type="number" value={form.width || ""} onChange={e => onChange("width", e.target.value)} placeholder="e.g. 120" style={inp} />
                            </div>
                            <div>
                                <label style={{ ...lbl, color: "#6B7280" }}><span>Depth</span></label>
                                <input type="number" value={form.depth || ""} onChange={e => onChange("depth", e.target.value)} placeholder="e.g. 60" style={inp} />
                            </div>
                        </div>
                    </div>

                    {/* Extra details */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
                        <div>
                            <label style={lbl}><span>Weight Capacity</span></label>
                            <input value={form.weight_capacity || ""} onChange={e => onChange("weight_capacity", e.target.value)} placeholder="e.g. 150 kg" style={inp} />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", paddingTop: "1.2rem" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer" }}>
                                <div style={{ position: "relative", width: 44, height: 24 }}>
                                    <input type="checkbox" checked={form.assembly_required || false} onChange={e => onChange("assembly_required", e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
                                    <span style={{ position: "absolute", cursor: "pointer", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: form.assembly_required ? "#111" : "#D1D5DB", transition: ".4s", borderRadius: 24 }}>
                                        <span style={{ position: "absolute", content: '""', height: 18, width: 18, left: form.assembly_required ? 22 : 3, bottom: 3, backgroundColor: "white", transition: ".4s", borderRadius: "50%" }}></span>
                                    </span>
                                </div>
                                <span style={{ fontSize: "0.85rem", fontWeight: 600, fontFamily: FO, color: "#374151" }}>Assembly Required</span>
                            </label>
                        </div>
                        <div>
                            <label style={lbl}><span>Warranty</span></label>
                            <select value={form.warranty || ""} onChange={e => onChange("warranty", e.target.value)} style={{ ...inp, cursor: "pointer", appearance: "none" }}>
                                {WARRANTIES.map(w => <option key={w} value={w}>{w}</option>)}
                            </select>
                        </div>
                    </div>

                    <hr style={{ border: "none", borderTop: "1px dashed #E5E7EB", margin: 0 }} />

                    {/* Shipping & Care */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <div>
                            <label style={lbl}><span>Delivery Information</span></label>
                            <input value={form.delivery_info || ""} onChange={e => onChange("delivery_info", e.target.value)} placeholder="Standard dispatch times..." style={{ ...inp, marginBottom: "0.5rem" }} />
                            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                {DELIVERY_SUGGESTIONS.map(sug => (
                                    <button 
                                        key={sug} 
                                        type="button" 
                                        onClick={() => addDeliverySuggestion(sug)}
                                        style={{ background: "#F3F4F6", border: "1px solid #E5E7EB", borderRadius: "20px", padding: "0.3rem 0.75rem", fontSize: "0.7rem", fontFamily: FO, color: "#4B5563", cursor: "pointer", transition: "all 0.2s" }}
                                    >
                                        + {sug}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label style={lbl}><span>Care Instructions</span></label>
                            <textarea 
                                value={form.care_instructions || ""} 
                                onChange={e => onChange("care_instructions", e.target.value)} 
                                rows={2} 
                                placeholder="Wipe clean with a damp cloth. Avoid harsh chemicals..." 
                                style={{ ...inp, resize: "vertical" }} 
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
