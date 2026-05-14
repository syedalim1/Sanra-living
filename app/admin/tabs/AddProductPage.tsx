"use client";

import React, { useState, useMemo } from "react";
import { C, FM, FO, CATEGORIES } from "../constants";
import BasicProductInfo from "../components/BasicProductInfo";
import ProductMediaSection from "../components/ProductMediaSection";

interface Props {
    adminKey: string;
    onSaved: () => void;
    onCancel: () => void;
}

const PRODUCT_TYPES = ["SS", "MS", "Luxury", "Foldable", "Commercial"];
const BADGES = ["Bestseller", "New Arrival", "Premium Choice", "Limited Edition"];
const IMAGE_PRESETS = ["Studio White", "Luxury Interior", "Warm Minimal", "Dark Premium"];
const WATERMARK_OPTIONS = ["Soft", "Medium", "Strong"];
const TRUST_OPTIONS = [
    "Jindal Steel", "Rust Resistant", "3 Year Warranty",
    "Premium Finish", "Pan India Delivery", "Heavy Duty", "Easy Maintenance"
];

const inp: React.CSSProperties = {
    background: "#FFFFFF", border: "1px solid #E5E7EB", color: "#111",
    fontSize: "0.9rem", fontFamily: FO, borderRadius: "8px",
    padding: "0.75rem 1rem", width: "100%", boxSizing: "border-box",
    outline: "none", transition: "border-color 0.2s ease",
};
const lbl: React.CSSProperties = {
    display: "block", fontSize: "0.7rem", fontWeight: 700, color: "#374151",
    fontFamily: FM, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.04em",
};

export default function AddProductPage({ adminKey, onSaved, onCancel }: Props) {
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [openSection, setOpenSection] = useState<string>("basic");

    const [form, setForm] = useState({
        title: "", subtitle: "", category: CATEGORIES[0],
        badge: "", price: "", compare_at_price: "", stock_status: "In Stock",
        stock_qty: "99", image_url: "", images: [] as string[],
        image_style_preset: "Studio White", watermark_strength: "Medium",
        description: "", highlights: [] as string[],
        material: "", pipe_type: "", finish: "Matte Black", color: "",
        dimensions: "", weight_kg: "", warranty: "No Warranty",
        delivery_info: "Pan India Delivery Available", care_instructions: "",
        trust_features: [] as string[], related_products: ["", "", "", ""],
        seo_title: "", seo_description: "",
        faqs: [{ question: "", answer: "" }, { question: "", answer: "" }, { question: "", answer: "" }],
        is_active: true,
        collection: "",
        is_featured: false,
        is_best_seller: false,
    });

    const set = (field: string, value: unknown) => setForm(f => ({ ...f, [field]: value }));

    const handleTrust = (feat: string) => {
        const cur = form.trust_features;
        if (cur.includes(feat)) set("trust_features", cur.filter(f => f !== feat));
        else if (cur.length < 6) set("trust_features", [...cur, feat]);
    };

    const setRelatedSlot = (idx: number, val: string) => {
        const slots = [...form.related_products];
        slots[idx] = val.trim();
        set("related_products", slots);
    };

    const setFaq = (idx: number, field: "question" | "answer", val: string) => {
        const updated = [...form.faqs];
        updated[idx] = { ...updated[idx], [field]: val };
        set("faqs", updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || !form.price || !form.category) {
            setError("Title, Price, and Category are required.");
            return;
        }
        setSaving(true); setError("");
        try {
            const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
            const body = {
                title: form.title, subtitle: form.subtitle, price: Number(form.price),
                compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
                category: form.category, badge: form.badge,
                finish: form.finish, stock_status: form.stock_status, stock_qty: Number(form.stock_qty),
                image_url: form.image_url || (form.images[0] ?? ""),
                collection: form.collection || null,
                is_featured: form.is_featured,
                is_best_seller: form.is_best_seller,
                hover_image_url: form.images[1] ?? "",
                images: form.images, image_style_preset: form.image_style_preset,
                watermark_strength: form.watermark_strength, description: form.description,
                highlights: form.highlights.filter(Boolean), material: form.material,
                pipe_type: form.pipe_type, color: form.color, dimensions: form.dimensions,
                weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
                warranty: form.warranty, delivery_info: form.delivery_info,
                care_instructions: form.care_instructions, trust_features: form.trust_features,
                related_products: form.related_products.filter(Boolean).join(", "),
                seo_title: form.seo_title, seo_description: form.seo_description,
                faqs: form.faqs.filter(f => f.question || f.answer),
                is_active: form.is_active, is_new: true, slug,
            };
            const res = await fetch("/api/admin/products", {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
                body: JSON.stringify(body),
            });
            if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed"); }
            localStorage.removeItem("sanra_product_draft");
            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create product");
        } finally { setSaving(false); }
    };

    /* ── Accordion ── */
    const Section = ({ id, num, title, children }: { id: string; num: number; title: string; children: React.ReactNode }) => {
        const isOpen = openSection === id;
        return (
            <div style={{ background: "#fff", borderRadius: "12px", marginBottom: "0.75rem", border: "1px solid #E5E7EB", overflow: "hidden", boxShadow: isOpen ? "0 4px 20px rgba(0,0,0,0.04)" : "none" }}>
                <button type="button" onClick={() => setOpenSection(isOpen ? "" : id)} style={{ width: "100%", textAlign: "left", padding: "1.25rem 1.5rem", background: "#fff", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span style={{ width: 28, height: 28, borderRadius: "50%", background: isOpen ? "#111" : "#F3F4F6", color: isOpen ? "#fff" : "#6B7280", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800, fontFamily: FM, transition: "all 0.2s" }}>{num}</span>
                        <span style={{ fontSize: "0.95rem", fontWeight: 700, fontFamily: FM, color: "#111" }}>{title}</span>
                    </div>
                    <span style={{ fontSize: "1rem", color: "#9CA3AF", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
                </button>
                {isOpen && <div style={{ padding: "0 1.5rem 1.5rem", borderTop: "1px solid #F3F4F6" }}><div style={{ paddingTop: "1.5rem" }}>{children}</div></div>}
            </div>
        );
    };

    /* ── Mobile Preview ── */
    const MobilePreview = () => (
        <div style={{ background: "#F9FAFB", borderRadius: "12px", border: "1px solid #E5E7EB", padding: "1.5rem", marginBottom: "0.75rem" }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, fontFamily: FM, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1rem" }}>📱 Mobile Live Preview</p>
            <div style={{ width: "100%", maxWidth: 320, margin: "0 auto", background: "#fff", borderRadius: "24px", border: "3px solid #111", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
                <div style={{ background: "#111", padding: "0.4rem 1rem", display: "flex", justifyContent: "space-between" }}><span style={{ color: "#fff", fontSize: "0.6rem", fontWeight: 600 }}>9:41</span><span style={{ color: "#fff", fontSize: "0.6rem" }}>●●●</span></div>
                <div style={{ width: "100%", aspectRatio: "4/5", background: "#F3F4F6", overflow: "hidden" }}>
                    {form.image_url ? <img src={form.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#D1D5DB", fontSize: "0.8rem", fontFamily: FO }}>No image</div>}
                </div>
                <div style={{ padding: "1rem" }}>
                    <p style={{ fontSize: "0.9rem", fontWeight: 600, fontFamily: FM, color: "#111", margin: "0 0 0.15rem", lineHeight: 1.2 }}>{form.title || "Product Title"}</p>
                    {form.subtitle && <p style={{ fontSize: "0.65rem", color: "#6B7280", fontFamily: FO, margin: "0 0 0.5rem" }}>{form.subtitle}</p>}
                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem", marginBottom: "0.75rem" }}>
                        <span style={{ fontSize: "1rem", fontWeight: 800, fontFamily: FM, color: "#111" }}>₹{form.price ? Number(form.price).toLocaleString("en-IN") : "0"}</span>
                        {form.compare_at_price && <span style={{ fontSize: "0.7rem", color: "#9CA3AF", textDecoration: "line-through" }}>₹{Number(form.compare_at_price).toLocaleString("en-IN")}</span>}
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                        {form.trust_features.slice(0, 4).map((f, i) => (
                            <span key={i} style={{ fontSize: "0.45rem", background: "#F3F4F6", padding: "0.15rem 0.35rem", borderRadius: "4px", fontFamily: FM, fontWeight: 600, color: "#374151" }}>{f}</span>
                        ))}
                    </div>
                    <div style={{ background: "#111", color: "#fff", textAlign: "center", padding: "0.5rem", borderRadius: "6px", fontSize: "0.55rem", fontWeight: 700, fontFamily: FM, marginBottom: "0.35rem" }}>ADD TO CART</div>
                    <div style={{ background: "#25D366", color: "#fff", textAlign: "center", padding: "0.5rem", borderRadius: "6px", fontSize: "0.55rem", fontWeight: 700, fontFamily: FM }}>BUY ON WHATSAPP</div>
                </div>
            </div>
        </div>
    );

    if (success) {
        return (
            <div style={{ maxWidth: 500, margin: "5rem auto", textAlign: "center", background: "#fff", border: "1px solid #E5E7EB", padding: "3rem 2rem", borderRadius: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#10B98118", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "1.5rem" }}>✓</div>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#111", fontFamily: FM, margin: "0 0 0.5rem" }}>Product Published</h2>
                <p style={{ color: "#9CA3AF", fontFamily: FO, fontSize: "0.9rem", marginBottom: "2rem" }}>Your product is now live on the store.</p>
                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                    <button onClick={onSaved} style={{ padding: "0.75rem 1.5rem", background: "#111", border: "none", color: "#fff", fontWeight: 700, borderRadius: 8, cursor: "pointer", fontFamily: FM, fontSize: "0.85rem" }}>← Back to Products</button>
                    <button onClick={() => window.open("/shop", "_blank")} style={{ padding: "0.75rem 1.5rem", background: "transparent", border: "1px solid #E5E7EB", color: "#111", fontWeight: 600, borderRadius: 8, cursor: "pointer", fontFamily: FM, fontSize: "0.85rem" }}>View Store ↗</button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <div>
                    <button onClick={onCancel} style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", fontFamily: FM, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: 0, marginBottom: "0.5rem", display: "block" }}>← Back to Products</button>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#111", fontFamily: FM, margin: 0 }}>Publish New Product</h2>
                </div>
                <button onClick={handleSubmit as any} disabled={saving} style={{ padding: "0.7rem 2rem", background: "#111", color: "#fff", fontWeight: 700, fontSize: "0.85rem", border: "none", cursor: saving ? "not-allowed" : "pointer", borderRadius: "8px", fontFamily: FM, opacity: saving ? 0.7 : 1 }}>{saving ? "Publishing…" : "Publish Product"}</button>
            </div>

            {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", padding: "0.75rem 1rem", borderRadius: 8, marginBottom: "1rem", fontSize: "0.85rem", color: "#EF4444", fontFamily: FO }}>{error}</div>}

            <form onSubmit={handleSubmit}>
                {/* 1. BASIC INFO — Premium Component */}
                <BasicProductInfo
                    title={form.title}
                    subtitle={form.subtitle}
                    category={form.category}
                    stockStatus={form.stock_status}
                    price={form.price}
                    comparePrice={form.compare_at_price}
                    collection={form.collection}
                    isFeatured={form.is_featured}
                    isBestSeller={form.is_best_seller}
                    onChange={set}
                    sectionNum={1}
                    defaultOpen={true}
                />

                {/* 2. MEDIA — Premium Component */}
                <ProductMediaSection
                    images={form.images}
                    onImagesChange={(imgs) => {
                        set("images", imgs);
                        if (imgs.length > 0) set("image_url", imgs[0]);
                        else set("image_url", "");
                    }}
                    imageStylePreset={form.image_style_preset}
                    watermarkStrength={form.watermark_strength}
                    onSettingsChange={(field, val) => set(field, val)}
                    adminKey={adminKey}
                    sectionNum={2}
                />

                {/* 3. DESCRIPTION */}
                <Section id="desc" num={3} title="Product Description">
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <div><label style={lbl}>Short Description (2-3 lines)</label><textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3} style={{ ...inp, resize: "vertical" }} /></div>
                        <div><label style={lbl}>Key Highlights (one per line)</label><textarea value={form.highlights.join("\n")} onChange={e => set("highlights", e.target.value.split("\n").map(s => s.trim()))} rows={4} style={{ ...inp, resize: "vertical" }} placeholder={"Rust Resistant\nJindal Steel\nHeavy Duty"} /></div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                            <div><label style={lbl}>Material</label><input value={form.material} onChange={e => set("material", e.target.value)} style={inp} /></div>
                            <div><label style={lbl}>Finish</label><input value={form.finish} onChange={e => set("finish", e.target.value)} style={inp} /></div>
                            <div><label style={lbl}>Dimensions</label><input value={form.dimensions} onChange={e => set("dimensions", e.target.value)} style={inp} placeholder="H: 45cm × W: 35cm" /></div>
                            <div><label style={lbl}>Color</label><input value={form.color} onChange={e => set("color", e.target.value)} style={inp} /></div>
                        </div>
                        <div><label style={lbl}>Warranty</label><select value={form.warranty} onChange={e => set("warranty", e.target.value)} style={inp}><option>No Warranty</option><option>1 Year Warranty</option><option>3 Year Warranty</option><option>5 Year Warranty</option></select></div>
                        <div><label style={lbl}>Delivery Information</label><input value={form.delivery_info} onChange={e => set("delivery_info", e.target.value)} style={inp} /></div>
                        <div><label style={lbl}>Care Instructions</label><textarea value={form.care_instructions} onChange={e => set("care_instructions", e.target.value)} rows={2} style={{ ...inp, resize: "vertical" }} placeholder="Wipe clean with a damp cloth." /></div>
                    </div>
                </Section>

                {/* 4. TRUST FEATURES */}
                <Section id="trust" num={4} title="Trust & Premium Features">
                    <p style={{ fontSize: "0.75rem", color: "#9CA3AF", fontFamily: FO, marginBottom: "1rem" }}>Select up to 6 features that appear on the product page.</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                        {TRUST_OPTIONS.map(feat => {
                            const active = form.trust_features.includes(feat);
                            const atMax = form.trust_features.length >= 6 && !active;
                            return (
                                <button type="button" key={feat} onClick={() => handleTrust(feat)} disabled={atMax} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.85rem 1rem", background: active ? "#111" : "#fff", color: active ? "#fff" : atMax ? "#D1D5DB" : "#374151", border: `1px solid ${active ? "#111" : "#E5E7EB"}`, borderRadius: "8px", cursor: atMax ? "not-allowed" : "pointer", fontFamily: FO, fontSize: "0.85rem", fontWeight: active ? 700 : 500, textAlign: "left", transition: "all 0.15s ease" }}>
                                    <span style={{ width: 20, height: 20, borderRadius: "4px", border: `2px solid ${active ? "#fff" : "#D1D5DB"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        {active && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                    </span>
                                    {feat}
                                </button>
                            );
                        })}
                    </div>
                    <p style={{ fontSize: "0.7rem", color: "#9CA3AF", fontFamily: FO, marginTop: "0.75rem" }}>{form.trust_features.length}/6 selected</p>
                </Section>

                {/* 5. RELATED */}
                <Section id="related" num={5} title="Related Products">
                    <p style={{ fontSize: "0.75rem", color: "#9CA3AF", fontFamily: FO, marginBottom: "1rem" }}>Add up to 4 related product slugs.</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        {[0, 1, 2, 3].map(i => (
                            <div key={i}><label style={lbl}>Slot {i + 1}</label><input value={form.related_products[i]} onChange={e => setRelatedSlot(i, e.target.value)} style={inp} placeholder="product-slug" /></div>
                        ))}
                    </div>
                </Section>

                {/* 6. SEO */}
                <Section id="seo" num={6} title="SEO">
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <div><label style={lbl}>SEO Title</label><input value={form.seo_title} onChange={e => set("seo_title", e.target.value)} style={inp} placeholder="Buy Premium Stainless Steel Stool Online" /></div>
                        <div><label style={lbl}>SEO Description</label><textarea value={form.seo_description} onChange={e => set("seo_description", e.target.value)} rows={2} style={{ ...inp, resize: "vertical" }} placeholder="Shop premium quality furniture..." /></div>
                    </div>
                </Section>

                {/* 7. FAQ */}
                <Section id="faq" num={7} title="FAQ">
                    <p style={{ fontSize: "0.75rem", color: "#9CA3AF", fontFamily: FO, marginBottom: "1rem" }}>Max 3 FAQs to build customer trust.</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        {[0, 1, 2].map(i => (
                            <div key={i} style={{ background: "#F9FAFB", borderRadius: "8px", padding: "1rem", border: "1px solid #F3F4F6" }}>
                                <label style={lbl}>Question {i + 1}</label>
                                <input value={form.faqs[i].question} onChange={e => setFaq(i, "question", e.target.value)} style={{ ...inp, marginBottom: "0.75rem" }} placeholder="Is this product rust proof?" />
                                <label style={lbl}>Answer {i + 1}</label>
                                <textarea value={form.faqs[i].answer} onChange={e => setFaq(i, "answer", e.target.value)} rows={2} style={{ ...inp, resize: "vertical" }} placeholder="Yes, 100% rust proof." />
                            </div>
                        ))}
                    </div>
                </Section>

                {/* 8. MOBILE PREVIEW */}
                <MobilePreview />

                {/* Bottom Actions */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem 0", borderTop: "1px solid #E5E7EB", marginTop: "0.5rem", position: "sticky", bottom: 0, background: "#F5F5F5" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", fontFamily: FO, color: "#111", cursor: "pointer" }}>
                        <input type="checkbox" checked={form.is_active} onChange={e => set("is_active", e.target.checked)} style={{ width: 18, height: 18, accentColor: "#111" }} />
                        Publish immediately
                    </label>
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                        <button type="button" onClick={onCancel} style={{ padding: "0.7rem 1.5rem", background: "transparent", color: "#EF4444", fontWeight: 600, fontSize: "0.8rem", border: "none", cursor: "pointer", fontFamily: FM }}>Discard</button>
                        <button type="submit" disabled={saving} style={{ padding: "0.7rem 2rem", background: "#111", color: "#fff", fontWeight: 700, fontSize: "0.85rem", border: "none", cursor: saving ? "not-allowed" : "pointer", borderRadius: "8px", fontFamily: FM, opacity: saving ? 0.7 : 1 }}>{saving ? "Publishing…" : "Publish Product"}</button>
                    </div>
                </div>
            </form>
        </div>
    );
}
