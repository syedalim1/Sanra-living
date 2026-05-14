"use client";
import { useState, useMemo } from "react";
import { Product } from "./types";
import ImageUploader from "./components/ImageUploader";

const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

const TRUST_OPTIONS = [
    "Jindal Steel", "Rust Resistant", "3 Year Warranty",
    "Premium Finish", "Pan India Delivery", "Heavy Duty", "Easy Maintenance"
];

const CATEGORIES = ["Seating", "Tables", "Dining Sets", "Storage", "Bedroom", "Workspace", "Balcony & Outdoor", "Commercial", "Other"];
const PRODUCT_TYPES = ["SS", "MS", "Luxury", "Foldable", "Commercial"];
const BADGES = ["Bestseller", "New Arrival", "Premium Choice", "Limited Edition"];
const IMAGE_PRESETS = ["Studio White", "Luxury Interior", "Warm Minimal", "Dark Premium"];
const WATERMARK_OPTIONS = ["Soft", "Medium", "Strong"];

/* ── Reusable Styles ── */
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

export default function ProductEditModal({
    product, adminKey, onClose, onSaved,
}: {
    product: Product; adminKey: string;
    onClose: () => void; onSaved: (updated: Product) => void;
}) {
    const [vals, setVals] = useState<Partial<Product>>({
        title: product.title || "",
        subtitle: product.subtitle || "",
        category: product.category || "Seating",
        product_type: product.product_type || "",
        badge: product.badge || "",
        price: product.price || 0,
        compare_at_price: product.compare_at_price || 0,
        stock_status: product.stock_status || "In Stock",
        stock_qty: product.stock_qty || 0,
        image_url: product.image_url || "",
        hover_image_url: product.hover_image_url || "",
        lifestyle_image: product.lifestyle_image || "",
        mobile_thumbnail: product.mobile_thumbnail || "",
        images: product.images || [],
        image_style_preset: product.image_style_preset || "Studio White",
        watermark_strength: product.watermark_strength || "Medium",
        description: product.description || "",
        highlights: product.highlights || [],
        material: product.material || "",
        pipe_type: product.pipe_type || "",
        finish: product.finish || "",
        color: product.color || "",
        dimensions: product.dimensions || "",
        weight_kg: product.weight_kg || 0,
        warranty: product.warranty || "No Warranty",
        delivery_info: product.delivery_info || "Pan India Delivery Available",
        care_instructions: product.care_instructions || "",
        trust_features: product.trust_features || [],
        related_products: product.related_products || "",
        seo_title: product.seo_title || "",
        seo_description: product.seo_description || "",
        faqs: product.faqs || [],
        whatsapp_link: product.whatsapp_link || "",
        is_active: product.is_active ?? true,
    });
    const [saving, setSaving] = useState(false);
    const [openSection, setOpenSection] = useState<string>("basic");

    /* ── Helpers ── */
    const set = (field: string, value: unknown) => setVals(v => ({ ...v, [field]: value }));

    const handleTrust = (feat: string) => {
        const cur = vals.trust_features || [];
        if (cur.includes(feat)) {
            set("trust_features", cur.filter(f => f !== feat));
        } else if (cur.length < 6) {
            set("trust_features", [...cur, feat]);
        }
    };

    const relatedSlots = useMemo(() => {
        const slugs = (vals.related_products || "").split(",").map(s => s.trim()).filter(Boolean);
        return [slugs[0] || "", slugs[1] || "", slugs[2] || "", slugs[3] || ""];
    }, [vals.related_products]);

    const setRelatedSlot = (idx: number, val: string) => {
        const slots = [...relatedSlots];
        slots[idx] = val.trim();
        set("related_products", slots.filter(Boolean).join(", "));
    };

    const faqList = useMemo(() => {
        const f = vals.faqs || [];
        return [f[0] || { question: "", answer: "" }, f[1] || { question: "", answer: "" }, f[2] || { question: "", answer: "" }];
    }, [vals.faqs]);

    const setFaq = (idx: number, field: "question" | "answer", val: string) => {
        const updated = [...faqList];
        updated[idx] = { ...updated[idx], [field]: val };
        set("faqs", updated.filter(f => f.question || f.answer));
    };

    const save = async () => {
        setSaving(true);
        try {
            // Auto-generate slug from title
            const autoSlug = (vals.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
            const payload = { ...vals, slug: autoSlug };
            await fetch(`/api/admin/products?id=${product.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
                body: JSON.stringify(payload),
            });
            onSaved({ ...product, ...payload } as Product);
        } catch (err) { console.error(err); }
        finally { setSaving(false); }
    };

    /* ── Accordion Section ── */
    const Section = ({ id, num, title, children }: { id: string; num: number; title: string; children: React.ReactNode }) => {
        const isOpen = openSection === id;
        return (
            <div style={{ background: "#fff", borderRadius: "12px", marginBottom: "0.75rem", border: "1px solid #E5E7EB", overflow: "hidden", transition: "box-shadow 0.2s", boxShadow: isOpen ? "0 4px 20px rgba(0,0,0,0.04)" : "none" }}>
                <button onClick={() => setOpenSection(isOpen ? "" : id)} style={{ width: "100%", textAlign: "left", padding: "1.25rem 1.5rem", background: "#fff", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
                {/* Status Bar */}
                <div style={{ background: "#111", padding: "0.4rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#fff", fontSize: "0.6rem", fontWeight: 600 }}>9:41</span>
                    <span style={{ color: "#fff", fontSize: "0.6rem" }}>●●●</span>
                </div>
                {/* Image */}
                <div style={{ width: "100%", aspectRatio: "4/5", background: "#F3F4F6", position: "relative", overflow: "hidden" }}>
                    {vals.image_url ? <img src={vals.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#D1D5DB", fontSize: "0.8rem", fontFamily: FO }}>No image</div>}
                    {vals.badge && <span style={{ position: "absolute", top: 12, left: 12, background: "#111", color: "#fff", fontSize: "0.5rem", fontWeight: 800, padding: "0.2rem 0.5rem", borderRadius: "4px", fontFamily: FM }}>{(vals.badge as string).toUpperCase()}</span>}
                </div>
                {/* Info */}
                <div style={{ padding: "1rem" }}>
                    <p style={{ fontSize: "0.9rem", fontWeight: 600, fontFamily: FM, color: "#111", margin: "0 0 0.15rem", lineHeight: 1.2 }}>{vals.title || "Product Title"}</p>
                    {vals.subtitle && <p style={{ fontSize: "0.65rem", color: "#6B7280", fontFamily: FO, margin: "0 0 0.5rem" }}>{vals.subtitle as string}</p>}
                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem", marginBottom: "0.75rem" }}>
                        <span style={{ fontSize: "1rem", fontWeight: 800, fontFamily: FM, color: "#111" }}>₹{(vals.price || 0).toLocaleString("en-IN")}</span>
                        {vals.compare_at_price ? <span style={{ fontSize: "0.7rem", color: "#9CA3AF", textDecoration: "line-through" }}>₹{Number(vals.compare_at_price).toLocaleString("en-IN")}</span> : null}
                    </div>
                    {/* Trust icons */}
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                        {(vals.trust_features || []).slice(0, 4).map((f, i) => (
                            <span key={i} style={{ fontSize: "0.45rem", background: "#F3F4F6", padding: "0.15rem 0.35rem", borderRadius: "4px", fontFamily: FM, fontWeight: 600, color: "#374151" }}>{f}</span>
                        ))}
                    </div>
                    {/* Buttons */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                        <div style={{ background: "#111", color: "#fff", textAlign: "center", padding: "0.5rem", borderRadius: "6px", fontSize: "0.55rem", fontWeight: 700, fontFamily: FM }}>ADD TO CART</div>
                        <div style={{ background: "#25D366", color: "#fff", textAlign: "center", padding: "0.5rem", borderRadius: "6px", fontSize: "0.55rem", fontWeight: 700, fontFamily: FM }}>BUY ON WHATSAPP</div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", justifyContent: "flex-end" }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(6px)" }} onClick={onClose} />

            <div style={{ width: "min(820px, 100vw)", background: "#F9FAFB", height: "100vh", overflowY: "auto", display: "flex", flexDirection: "column", position: "relative", zIndex: 10, boxShadow: "-12px 0 48px rgba(0,0,0,0.08)" }}>
                {/* ── HEADER ── */}
                <div style={{ padding: "1.25rem 2rem", background: "#fff", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 20 }}>
                    <div>
                        <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111", fontFamily: FM, margin: 0 }}>Edit Product</h2>
                        <p style={{ fontSize: "0.75rem", color: "#9CA3AF", fontFamily: FO, margin: "0.2rem 0 0" }}>{product.title}</p>
                    </div>
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                        <button onClick={onClose} style={{ padding: "0.6rem 1.25rem", background: "transparent", color: "#111", fontWeight: 600, fontSize: "0.8rem", border: "1px solid #E5E7EB", cursor: "pointer", borderRadius: "8px", fontFamily: FM }}>Cancel</button>
                        <button onClick={save} disabled={saving} style={{ padding: "0.6rem 1.5rem", background: "#111", color: "#fff", fontWeight: 700, fontSize: "0.8rem", border: "none", cursor: saving ? "not-allowed" : "pointer", borderRadius: "8px", fontFamily: FM, opacity: saving ? 0.7 : 1 }}>{saving ? "Saving…" : "Publish Changes"}</button>
                    </div>
                </div>

                <div style={{ padding: "1.5rem 2rem", flex: 1 }}>
                    {/* ── 1. BASIC INFO ── */}
                    <Section id="basic" num={1} title="Basic Product Info">
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                            <div style={{ gridColumn: "1/-1" }}><label style={lbl}>Product Title</label><input value={vals.title} onChange={e => set("title", e.target.value)} style={inp} placeholder="Modern Stainless Steel Stool" /></div>
                            <div style={{ gridColumn: "1/-1" }}><label style={lbl}>Subtitle</label><input value={vals.subtitle as string} onChange={e => set("subtitle", e.target.value)} style={inp} placeholder="Heavy Duty Everyday Use" /></div>
                            <div><label style={lbl}>Category</label><select value={vals.category} onChange={e => set("category", e.target.value)} style={inp}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
                            <div><label style={lbl}>Product Type</label><select value={vals.product_type as string} onChange={e => set("product_type", e.target.value)} style={inp}><option value="">None</option>{PRODUCT_TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
                            <div><label style={lbl}>Badge</label><select value={vals.badge as string} onChange={e => set("badge", e.target.value)} style={inp}><option value="">None</option>{BADGES.map(b => <option key={b}>{b}</option>)}</select></div>
                            <div><label style={lbl}>Stock Status</label><select value={vals.stock_status} onChange={e => set("stock_status", e.target.value)} style={inp}><option>In Stock</option><option>Out of Stock</option><option>Pre Order</option></select></div>
                            <div><label style={lbl}>Current Price (₹)</label><input type="number" value={vals.price} onChange={e => set("price", Number(e.target.value))} style={inp} /></div>
                            <div><label style={lbl}>Compare Price (₹)</label><input type="number" value={vals.compare_at_price || ""} onChange={e => set("compare_at_price", Number(e.target.value))} style={inp} /></div>
                        </div>
                    </Section>

                    {/* ── 2. MEDIA ── */}
                    <Section id="media" num={2} title="Product Media">
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                            <div>
                                <label style={lbl}>Product Images (Drag & Drop or Click to Upload)</label>
                                <p style={{ fontSize: "0.75rem", color: "#9CA3AF", fontFamily: FO, marginBottom: "0.75rem" }}>First image becomes the main product image. Drag to reorder. Max 8 images.</p>
                                <ImageUploader
                                    images={(vals.images || []) as string[]}
                                    onImagesChange={(imgs) => {
                                        set("images", imgs);
                                        if (imgs.length > 0) set("image_url", imgs[0]);
                                    }}
                                    adminKey={adminKey}
                                    maxImages={8}
                                />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                                <div><label style={lbl}>Image Style Preset</label><select value={vals.image_style_preset as string} onChange={e => set("image_style_preset", e.target.value)} style={inp}>{IMAGE_PRESETS.map(p => <option key={p}>{p}</option>)}</select></div>
                                <div><label style={lbl}>Watermark Strength</label><select value={vals.watermark_strength as string} onChange={e => set("watermark_strength", e.target.value)} style={inp}>{WATERMARK_OPTIONS.map(w => <option key={w}>{w}</option>)}</select></div>
                            </div>
                        </div>
                    </Section>

                    {/* ── 3. DESCRIPTION ── */}
                    <Section id="desc" num={3} title="Product Description">
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                            <div><label style={lbl}>Short Description (2-3 lines)</label><textarea value={vals.description} onChange={e => set("description", e.target.value)} rows={3} style={{ ...inp, resize: "vertical" }} /></div>
                            <div><label style={lbl}>Key Highlights (one per line)</label><textarea value={(vals.highlights || []).join("\n")} onChange={e => set("highlights", e.target.value.split("\n").map(s => s.trim()).filter(Boolean))} rows={4} style={{ ...inp, resize: "vertical" }} placeholder={"Rust Resistant\nJindal Steel\nHeavy Duty"} /></div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                                <div><label style={lbl}>Material</label><input value={vals.material} onChange={e => set("material", e.target.value)} style={inp} /></div>
                                <div><label style={lbl}>Finish</label><input value={vals.finish} onChange={e => set("finish", e.target.value)} style={inp} /></div>
                                <div><label style={lbl}>Dimensions</label><input value={vals.dimensions} onChange={e => set("dimensions", e.target.value)} style={inp} placeholder="H: 45cm × W: 35cm" /></div>
                                <div><label style={lbl}>Color</label><input value={vals.color} onChange={e => set("color", e.target.value)} style={inp} /></div>
                            </div>
                            <div><label style={lbl}>Warranty</label><select value={vals.warranty} onChange={e => set("warranty", e.target.value)} style={inp}><option>No Warranty</option><option>1 Year Warranty</option><option>3 Year Warranty</option><option>5 Year Warranty</option></select></div>
                            <div><label style={lbl}>Delivery Information</label><input value={vals.delivery_info} onChange={e => set("delivery_info", e.target.value)} style={inp} placeholder="Pan India Delivery Available" /></div>
                            <div><label style={lbl}>Care Instructions</label><textarea value={vals.care_instructions as string} onChange={e => set("care_instructions", e.target.value)} rows={2} style={{ ...inp, resize: "vertical" }} placeholder="Wipe clean with a damp cloth." /></div>
                        </div>
                    </Section>

                    {/* ── 4. TRUST FEATURES ── */}
                    <Section id="trust" num={4} title="Trust & Premium Features">
                        <p style={{ fontSize: "0.75rem", color: "#9CA3AF", fontFamily: FO, marginBottom: "1rem" }}>Select up to 6 features that appear on the product page.</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                            {TRUST_OPTIONS.map(feat => {
                                const active = (vals.trust_features || []).includes(feat);
                                const atMax = (vals.trust_features || []).length >= 6 && !active;
                                return (
                                    <button key={feat} onClick={() => handleTrust(feat)} disabled={atMax} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.85rem 1rem", background: active ? "#111" : "#fff", color: active ? "#fff" : atMax ? "#D1D5DB" : "#374151", border: `1px solid ${active ? "#111" : "#E5E7EB"}`, borderRadius: "8px", cursor: atMax ? "not-allowed" : "pointer", fontFamily: FO, fontSize: "0.85rem", fontWeight: active ? 700 : 500, textAlign: "left", transition: "all 0.15s ease" }}>
                                        <span style={{ width: 20, height: 20, borderRadius: "4px", border: `2px solid ${active ? "#fff" : "#D1D5DB"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            {active && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                        </span>
                                        {feat}
                                    </button>
                                );
                            })}
                        </div>
                        <p style={{ fontSize: "0.7rem", color: "#9CA3AF", fontFamily: FO, marginTop: "0.75rem" }}>{(vals.trust_features || []).length}/6 selected</p>
                    </Section>

                    {/* ── 5. RELATED ── */}
                    <Section id="related" num={5} title="Related Products">
                        <p style={{ fontSize: "0.75rem", color: "#9CA3AF", fontFamily: FO, marginBottom: "1rem" }}>Add up to 4 related product slugs.</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                            {[0, 1, 2, 3].map(i => (
                                <div key={i}><label style={lbl}>Slot {i + 1}</label><input value={relatedSlots[i]} onChange={e => setRelatedSlot(i, e.target.value)} style={inp} placeholder="product-slug" /></div>
                            ))}
                        </div>
                    </Section>

                    {/* ── 6. SEO ── */}
                    <Section id="seo" num={6} title="SEO">
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                            <div><label style={lbl}>SEO Title</label><input value={vals.seo_title} onChange={e => set("seo_title", e.target.value)} style={inp} placeholder="Buy Premium Stainless Steel Stool Online" /></div>
                            <div><label style={lbl}>SEO Description</label><textarea value={vals.seo_description} onChange={e => set("seo_description", e.target.value)} rows={2} style={{ ...inp, resize: "vertical" }} placeholder="Shop premium quality furniture..." /></div>
                        </div>
                    </Section>

                    {/* ── 7. FAQ ── */}
                    <Section id="faq" num={7} title="FAQ">
                        <p style={{ fontSize: "0.75rem", color: "#9CA3AF", fontFamily: FO, marginBottom: "1rem" }}>Max 3 FAQs to build customer trust.</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                            {[0, 1, 2].map(i => (
                                <div key={i} style={{ background: "#F9FAFB", borderRadius: "8px", padding: "1rem", border: "1px solid #F3F4F6" }}>
                                    <label style={lbl}>Question {i + 1}</label>
                                    <input value={faqList[i].question} onChange={e => setFaq(i, "question", e.target.value)} style={{ ...inp, marginBottom: "0.75rem" }} placeholder="Is this product rust proof?" />
                                    <label style={lbl}>Answer {i + 1}</label>
                                    <textarea value={faqList[i].answer} onChange={e => setFaq(i, "answer", e.target.value)} rows={2} style={{ ...inp, resize: "vertical" }} placeholder="Yes, it is 100% rust proof and weather resistant." />
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* ── 8. MOBILE PREVIEW ── */}
                    <MobilePreview />

                    {/* ── Bottom Actions ── */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem 0 0", borderTop: "1px solid #E5E7EB", marginTop: "0.5rem" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", fontFamily: FO, color: "#111", cursor: "pointer" }}>
                            <input type="checkbox" checked={vals.is_active} onChange={e => set("is_active", e.target.checked)} style={{ width: 18, height: 18, accentColor: "#111" }} />
                            Product Active
                        </label>
                        <div style={{ display: "flex", gap: "0.75rem" }}>
                            <button onClick={onClose} style={{ padding: "0.7rem 1.5rem", background: "transparent", color: "#EF4444", fontWeight: 600, fontSize: "0.8rem", border: "none", cursor: "pointer", fontFamily: FM }}>Discard</button>
                            <button onClick={save} disabled={saving} style={{ padding: "0.7rem 2rem", background: "#111", color: "#fff", fontWeight: 700, fontSize: "0.85rem", border: "none", cursor: saving ? "not-allowed" : "pointer", borderRadius: "8px", fontFamily: FM, opacity: saving ? 0.7 : 1 }}>{saving ? "Saving…" : "Publish Changes"}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
