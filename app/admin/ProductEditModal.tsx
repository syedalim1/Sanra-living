"use client";
import { useState, useMemo } from "react";
import { Product } from "./types";
import ImageUploader from "./components/ImageUploader";
import { FM, FO, CATEGORIES } from "./constants";

const TRUST_OPTIONS = [
    "Jindal Steel", "Rust Resistant", "3 Year Warranty",
    "Premium Finish", "Pan India Delivery", "Heavy Duty", "Easy Maintenance"
];

const PRODUCT_TYPES = ["SS", "MS", "Luxury", "Foldable", "Commercial"];
const BADGES = ["Bestseller", "New Arrival", "Premium Choice", "Limited Edition"];
const IMAGE_PRESETS = ["Studio White", "Luxury Interior", "Warm Minimal", "Dark Premium"];
const WATERMARK_OPTIONS = ["Soft", "Medium", "Strong"];

const TABS = [
    { id: "basic", label: "Basic Info", icon: "✏️" },
    { id: "media", label: "Media", icon: "📸" },
    { id: "details", label: "Details & Trust", icon: "🛡️" },
    { id: "faqs", label: "FAQs", icon: "❓" },
    { id: "seo", label: "SEO & Related", icon: "🔍" },
];

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
    const [activeTab, setActiveTab] = useState<"basic" | "media" | "details" | "faqs" | "seo">("basic");

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
            // Auto-generate slug from title if not custom set
            const autoSlug = (vals.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
            const payload = { ...vals, slug: autoSlug };
            await fetch(`/api/admin/products?id=${product.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
                body: JSON.stringify(payload),
            });
            onSaved({ ...product, ...payload } as Product);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const heroImage = vals.images?.[0] || vals.image_url || "";
    const fmtPrice = (n: number) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
    const discountPct = vals.compare_at_price && vals.price &&
        Number(vals.compare_at_price) > Number(vals.price)
            ? Math.round((1 - Number(vals.price) / Number(vals.compare_at_price)) * 100)
            : null;

    /* ── Mobile Preview ── */
    const MobilePreview = () => (
        <div style={{ width: "100%", maxWidth: 290 }}>
            <p style={{
                fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em",
                textTransform: "uppercase", color: "#9C9485", fontFamily: FM,
                marginBottom: "0.75rem", textAlign: "center"
            }}>📱 Live Storefront Preview</p>

            <div style={{
                background: "#FAF9F6", borderRadius: 28,
                border: "6px solid #1C1A17", overflow: "hidden",
                boxShadow: "0 16px 48px rgba(0,0,0,0.12)",
                position: "relative"
            }}>
                {/* Status bar */}
                <div style={{
                    background: "#1C1A17", padding: "0.45rem 1rem",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                    <span style={{ color: "#FAF9F6", fontSize: "0.55rem", fontWeight: 600 }}>9:41</span>
                    <div style={{ width: 44, height: 4, borderRadius: 99, background: "#373430" }} />
                    <div style={{ display: "flex", gap: 3 }}>
                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#FAF9F6" }} />
                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#FAF9F6" }} />
                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#C5A880" }} />
                    </div>
                </div>

                {/* Hero image area */}
                <div style={{ width: "100%", aspectRatio: "4/5", background: "#F5F4F0", overflow: "hidden", position: "relative" }}>
                    {heroImage ? (
                        <img src={heroImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                        <div style={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            height: "100%", flexDirection: "column", gap: "0.3rem",
                            color: "#C5A880",
                        }}>
                            <span style={{ fontSize: "1.8rem" }}>🛋️</span>
                            <span style={{ fontSize: "0.6rem", fontFamily: FO, letterSpacing: "0.05em", color: "#9C9485" }}>No image selected</span>
                        </div>
                    )}
                    
                    {/* Brand Badge */}
                    <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(28, 26, 23, 0.85)", backdropFilter: "blur(4px)", padding: "4px 8px", borderRadius: 4 }}>
                        <span style={{ fontSize: "0.42rem", color: "#FAF9F6", fontWeight: 700, fontFamily: FM, letterSpacing: "0.15em", textTransform: "uppercase" }}>SANRA</span>
                    </div>

                    {vals.badge && (
                        <span style={{
                            position: "absolute", top: 12, right: 12,
                            background: "#C5A880", color: "#FAF9F6",
                            fontSize: "0.45rem", fontWeight: 800, padding: "0.2rem 0.5rem",
                            borderRadius: "4px", fontFamily: FM, letterSpacing: "0.08em"
                        }}>
                            {(vals.badge as string).toUpperCase()}
                        </span>
                    )}
                </div>

                {/* Product info */}
                <div style={{ padding: "1rem", background: "#FAF9F6" }}>
                    <p style={{
                        fontSize: "0.85rem", fontWeight: 700, fontFamily: FM, color: "#1C1A17",
                        margin: "0 0 0.15rem", lineHeight: 1.25, letterSpacing: "-0.01em"
                    }}>{vals.title || "Luxury Specimen"}</p>

                    {vals.subtitle && (
                        <p style={{ fontSize: "0.6rem", color: "#9C9485", fontFamily: FO, margin: "0 0 0.5rem" }}>{vals.subtitle as string}</p>
                    )}

                    {/* Price */}
                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem", marginBottom: "0.75rem" }}>
                        <span style={{ fontSize: "1rem", fontWeight: 800, fontFamily: FM, color: "#1C1A17" }}>
                            {fmtPrice(vals.price || 0)}
                        </span>
                        {vals.compare_at_price && Number(vals.compare_at_price) > Number(vals.price || 0) && (
                            <>
                                <span style={{ fontSize: "0.65rem", color: "#C5A880", textDecoration: "line-through", fontFamily: FO }}>
                                    {fmtPrice(Number(vals.compare_at_price))}
                                </span>
                                {discountPct && (
                                    <span style={{ fontSize: "0.48rem", background: "rgba(16,185,129,0.08)", color: "#10B981", padding: "0.1rem 0.3rem", borderRadius: 4, fontWeight: 700, fontFamily: FM }}>
                                        {discountPct}% OFF
                                    </span>
                                )}
                            </>
                        )}
                    </div>

                    {/* Trust badges */}
                    {(vals.trust_features || []).length > 0 && (
                        <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                            {(vals.trust_features || []).slice(0, 3).map((f, i) => (
                                <span key={i} style={{
                                    fontSize: "0.42rem", background: "#F5F4F0", padding: "0.15rem 0.35rem",
                                    borderRadius: 4, fontFamily: FM, fontWeight: 600, color: "#1C1A17",
                                    border: "1px solid #E8E4DC"
                                }}>{f}</span>
                            ))}
                        </div>
                    )}

                    {/* Action buttons */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                        <div style={{
                            background: "#1C1A17", color: "#FAF9F6", textAlign: "center",
                            padding: "0.55rem", borderRadius: 8,
                            fontSize: "0.55rem", fontWeight: 700, fontFamily: FM,
                            letterSpacing: "0.1em", cursor: "pointer"
                        }}>ADD TO CART</div>
                        
                        <div style={{ display: "flex", gap: "0.35rem" }}>
                            <div style={{
                                flex: 1, background: "#FAF9F6", border: "1px solid #1C1A17", color: "#1C1A17",
                                textAlign: "center", padding: "0.5rem", borderRadius: 8,
                                fontSize: "0.5rem", fontWeight: 700, fontFamily: FM, letterSpacing: "0.05em"
                            }}>BUY NOW</div>
                            <div style={{
                                flex: 1, background: "#25D366", color: "#FAF9F6",
                                textAlign: "center", padding: "0.5rem", borderRadius: 8,
                                fontSize: "0.5rem", fontWeight: 700, fontFamily: FM, letterSpacing: "0.05em",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 3
                            }}>
                                <span>WHATSAPP</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Home indicator */}
                <div style={{ padding: "0.4rem 0", display: "flex", justifyContent: "center", background: "#FAF9F6" }}>
                    <div style={{ width: 44, height: 4, borderRadius: 99, background: "#E8E4DC" }} />
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", justifyContent: "flex-end" }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(6px)" }} onClick={onClose} />

            <div style={{ width: "min(820px, 100vw)", background: "#FAF9F6", height: "100vh", overflowY: "auto", display: "flex", flexDirection: "column", position: "relative", zIndex: 10, boxShadow: "-12px 0 48px rgba(0,0,0,0.08)" }} className="sanra-admin">
                <style>{`
                    .modal-layout {
                        display: grid;
                        grid-template-columns: 1fr 340px;
                        flex: 1;
                        min-height: 0;
                    }
                    .modal-form-panel {
                        padding: 2rem;
                        overflow-y: auto;
                    }
                    .modal-preview-panel {
                        border-left: 1px solid var(--ap-border-light);
                        background: #FAF9F6;
                        padding: 2rem 1.5rem;
                        overflow-y: auto;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    @media (max-width: 900px) {
                        .modal-layout {
                            grid-template-columns: 1fr;
                            height: auto;
                            overflow-y: visible;
                        }
                        .modal-form-panel {
                            padding: 1.5rem 1.25rem;
                        }
                        .modal-preview-panel {
                            border-left: none;
                            border-top: 1px solid var(--ap-border-light);
                            padding: 2rem 1.25rem;
                        }
                    }
                `}</style>
                
                {/* ── HEADER ── */}
                <div className="px-6 py-4 bg-white border-b border-[var(--ap-border-light)] flex justify-between items-center sticky top-0 z-35">
                    <div>
                        <h2 className="text-sm md:text-base font-extrabold text-[var(--ap-text)] font-[family-name:var(--ap-font-heading)] m-0 tracking-tight">Edit Product</h2>
                        <p className="text-[0.68rem] text-[var(--ap-muted)] font-[family-name:var(--ap-font-body)] m-0 mt-0.5">{product.title}</p>
                    </div>
                    <div className="flex gap-2.5 items-center">
                        <button onClick={onClose} className="px-4 py-2 bg-transparent text-[var(--ap-text)] border border-[var(--ap-border)] font-semibold text-xs rounded-lg cursor-pointer transition-colors hover:border-[var(--ap-accent)] font-[family-name:var(--ap-font-heading)]">Cancel</button>
                        <button onClick={save} disabled={saving} className="px-5 py-2 bg-[var(--ap-accent)] text-white font-bold text-xs rounded-lg border-none cursor-pointer transition-opacity disabled:opacity-50 font-[family-name:var(--ap-font-heading)]">
                            {saving ? "Saving…" : "Save Changes"}
                        </button>
                    </div>
                </div>

                {/* ── TAB BAR ── */}
                <div className="flex border-b border-[var(--ap-border-light)] bg-white sticky top-[68px] z-20 px-6 overflow-x-auto hide-scrollbar">
                    {TABS.map((t) => {
                        const isActive = activeTab === t.id;
                        return (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => setActiveTab(t.id as any)}
                                className={`py-3.5 px-4 bg-transparent border-none cursor-pointer text-[0.62rem] font-bold tracking-[0.12em] uppercase font-[family-name:var(--ap-font-heading)] border-b-2 transition-all duration-200 -mb-px whitespace-nowrap flex items-center gap-1.5 relative
                                    ${isActive
                                        ? "text-[var(--ap-text)] border-b-[var(--ap-accent)]"
                                        : "text-[var(--ap-muted)] border-b-transparent hover:text-[var(--ap-text)]"
                                    }`}
                            >
                                <span>{t.icon}</span>
                                {t.label}
                            </button>
                        );
                    })}
                </div>

                {/* ── CONTENT & PREVIEW GRID ── */}
                <div className="modal-layout">
                    {/* Form Fields */}
                    <div className="modal-form-panel">
                        <form onSubmit={(e) => { e.preventDefault(); save(); }} className="flex flex-col gap-5">
                            {activeTab === "basic" && (
                                <div className="bpi-grid bpi-grid-2">
                                    <div className="bpi-field bpi-full">
                                        <label className="bpi-label">Product Title</label>
                                        <input className="bpi-input" value={vals.title} onChange={e => set("title", e.target.value)} placeholder="Modern Stainless Steel Stool" />
                                    </div>
                                    <div className="bpi-field bpi-full">
                                        <label className="bpi-label">Subtitle</label>
                                        <input className="bpi-input" value={vals.subtitle as string} onChange={e => set("subtitle", e.target.value)} placeholder="Heavy Duty Everyday Use" />
                                    </div>
                                    <div className="bpi-field">
                                        <label className="bpi-label">Category</label>
                                        <div className="bpi-select-wrapper">
                                            <select className="bpi-select" value={vals.category} onChange={e => set("category", e.target.value)}>
                                                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="bpi-field">
                                        <label className="bpi-label">Product Type</label>
                                        <div className="bpi-select-wrapper">
                                            <select className="bpi-select" value={vals.product_type as string} onChange={e => set("product_type", e.target.value)}>
                                                <option value="">None</option>
                                                {PRODUCT_TYPES.map(t => <option key={t}>{t}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="bpi-field">
                                        <label className="bpi-label">Badge</label>
                                        <div className="bpi-select-wrapper">
                                            <select className="bpi-select" value={vals.badge as string} onChange={e => set("badge", e.target.value)}>
                                                <option value="">None</option>
                                                {BADGES.map(b => <option key={b}>{b}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="bpi-field">
                                        <label className="bpi-label">Stock Status</label>
                                        <div className="bpi-select-wrapper">
                                            <select className="bpi-select" value={vals.stock_status} onChange={e => set("stock_status", e.target.value)}>
                                                <option>In Stock</option>
                                                <option>Out of Stock</option>
                                                <option>Pre Order</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="bpi-field">
                                        <label className="bpi-label">Stock Qty</label>
                                        <input className="bpi-input" type="number" value={vals.stock_qty} onChange={e => set("stock_qty", Number(e.target.value))} />
                                    </div>
                                    <div className="bpi-field">
                                        <label className="bpi-label">Current Price (₹)</label>
                                        <div className="bpi-price-wrapper">
                                            <span className="bpi-currency">₹</span>
                                            <input className="bpi-input bpi-input-price" type="number" value={vals.price} onChange={e => set("price", Number(e.target.value))} />
                                        </div>
                                    </div>
                                    <div className="bpi-field">
                                        <label className="bpi-label">Compare Price (₹)</label>
                                        <div className="bpi-price-wrapper">
                                            <span className="bpi-currency bpi-currency-muted">₹</span>
                                            <input className="bpi-input bpi-input-price bpi-input-compare" type="number" value={vals.compare_at_price || ""} onChange={e => set("compare_at_price", Number(e.target.value))} />
                                        </div>
                                    </div>
                                    <div className="bpi-field bpi-full">
                                        <label className="bpi-label">WhatsApp Enquiry Link (Override)</label>
                                        <input className="bpi-input" value={vals.whatsapp_link || ""} onChange={e => set("whatsapp_link", e.target.value)} placeholder="https://wa.me/..." />
                                    </div>
                                </div>
                            )}

                            {activeTab === "media" && (
                                <div className="bpi-grid bpi-grid-full">
                                    <div className="bpi-field">
                                        <label className="bpi-label">Product Images</label>
                                        <p style={{ fontSize: "0.75rem", color: "#9CA3AF", fontFamily: FO, marginBottom: "0.75rem" }}>
                                            First image becomes the main product image. Drag to reorder. Max 8 images.
                                        </p>
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
                                    <div className="bpi-grid bpi-grid-2" style={{ marginTop: "1rem" }}>
                                        <div className="bpi-field">
                                            <label className="bpi-label">Image Style Preset</label>
                                            <div className="bpi-select-wrapper">
                                                <select className="bpi-select" value={vals.image_style_preset as string} onChange={e => set("image_style_preset", e.target.value)}>
                                                    {IMAGE_PRESETS.map(p => <option key={p}>{p}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="bpi-field">
                                            <label className="bpi-label">Watermark Strength</label>
                                            <div className="bpi-select-wrapper">
                                                <select className="bpi-select" value={vals.watermark_strength as string} onChange={e => set("watermark_strength", e.target.value)}>
                                                    {WATERMARK_OPTIONS.map(w => <option key={w}>{w}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "details" && (
                                <div className="bpi-grid bpi-grid-full">
                                    <div className="bpi-field">
                                        <label className="bpi-label">Short Description (2-3 lines)</label>
                                        <textarea className="bpi-input" value={vals.description} onChange={e => set("description", e.target.value)} rows={3} style={{ resize: "vertical" }} />
                                    </div>
                                    <div className="bpi-field">
                                        <label className="bpi-label">Key Highlights (one per line)</label>
                                        <textarea className="bpi-input" value={(vals.highlights || []).join("\n")} onChange={e => set("highlights", e.target.value.split("\n").map(s => s.trim()).filter(Boolean))} rows={4} style={{ resize: "vertical" }} placeholder={"Rust Resistant\nJindal Steel\nHeavy Duty"} />
                                    </div>
                                    <div className="bpi-grid bpi-grid-2">
                                        <div className="bpi-field">
                                            <label className="bpi-label">Material</label>
                                            <input className="bpi-input" value={vals.material} onChange={e => set("material", e.target.value)} />
                                        </div>
                                        <div className="bpi-field">
                                            <label className="bpi-label">Pipe Type</label>
                                            <input className="bpi-input" value={vals.pipe_type || ""} onChange={e => set("pipe_type", e.target.value)} placeholder="e.g. 1.2mm Jindal SS" />
                                        </div>
                                        <div className="bpi-field">
                                            <label className="bpi-label">Finish</label>
                                            <input className="bpi-input" value={vals.finish} onChange={e => set("finish", e.target.value)} />
                                        </div>
                                        <div className="bpi-field">
                                            <label className="bpi-label">Dimensions</label>
                                            <input className="bpi-input" value={vals.dimensions} onChange={e => set("dimensions", e.target.value)} placeholder="H: 45cm × W: 35cm" />
                                        </div>
                                        <div className="bpi-field">
                                            <label className="bpi-label">Weight (kg)</label>
                                            <input className="bpi-input" type="number" value={vals.weight_kg ?? ""} onChange={e => set("weight_kg", Number(e.target.value))} />
                                        </div>
                                        <div className="bpi-field">
                                            <label className="bpi-label">Warranty</label>
                                            <div className="bpi-select-wrapper">
                                                <select className="bpi-select" value={vals.warranty} onChange={e => set("warranty", e.target.value)}>
                                                    <option>No Warranty</option>
                                                    <option>1 Year Warranty</option>
                                                    <option>3 Year Warranty</option>
                                                    <option>5 Year Warranty</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bpi-field">
                                        <label className="bpi-label">Delivery Information</label>
                                        <input className="bpi-input" value={vals.delivery_info} onChange={e => set("delivery_info", e.target.value)} placeholder="Pan India Delivery Available" />
                                    </div>
                                    <div className="bpi-field">
                                        <label className="bpi-label">Care Instructions</label>
                                        <textarea className="bpi-input" value={vals.care_instructions as string} onChange={e => set("care_instructions", e.target.value)} rows={2} style={{ resize: "vertical" }} placeholder="Wipe clean with a damp cloth." />
                                    </div>
                                    
                                    <div className="bpi-field" style={{ marginTop: "1rem" }}>
                                        <label className="bpi-label">Trust & Premium Features</label>
                                        <p style={{ fontSize: "0.75rem", color: "#9CA3AF", fontFamily: FO, marginBottom: "1rem" }}>Select up to 6 features that appear on the product page.</p>
                                        <div className="bpi-grid bpi-grid-2" style={{ gap: "0.75rem" }}>
                                            {TRUST_OPTIONS.map(feat => {
                                                const active = (vals.trust_features || []).includes(feat);
                                                const atMax = (vals.trust_features || []).length >= 6 && !active;
                                                return (
                                                    <button
                                                        key={feat}
                                                        type="button"
                                                        onClick={() => handleTrust(feat)}
                                                        disabled={atMax}
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "0.75rem",
                                                            padding: "0.85rem 1rem",
                                                            background: active ? "#111" : "#fff",
                                                            color: active ? "#fff" : atMax ? "#D1D5DB" : "#374151",
                                                            border: `1px solid ${active ? "#111" : "#E5E7EB"}`,
                                                            borderRadius: "8px",
                                                            cursor: atMax ? "not-allowed" : "pointer",
                                                            fontFamily: FO,
                                                            fontSize: "0.85rem",
                                                            fontWeight: active ? 700 : 500,
                                                            textAlign: "left",
                                                            transition: "all 0.15s ease"
                                                        }}
                                                    >
                                                        <span style={{
                                                            width: 20,
                                                            height: 20,
                                                            borderRadius: "4px",
                                                            border: `2px solid ${active ? "#fff" : "#D1D5DB"}`,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            flexShrink: 0
                                                        }}>
                                                            {active && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                                        </span>
                                                        {feat}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <p style={{ fontSize: "0.7rem", color: "#9CA3AF", fontFamily: FO, marginTop: "0.75rem" }}>{(vals.trust_features || []).length}/6 selected</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === "faqs" && (
                                <div className="bpi-grid bpi-grid-full">
                                    <p style={{ fontSize: "0.75rem", color: "#9CA3AF", fontFamily: FO, marginBottom: "1rem" }}>Max 3 FAQs to build customer trust.</p>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                        {[0, 1, 2].map(i => (
                                            <div key={i} style={{ background: "#FAFAF8", borderRadius: "8px", padding: "1.25rem", border: "1px solid var(--ap-border-light)" }}>
                                                <div className="bpi-field" style={{ marginBottom: "0.75rem" }}>
                                                    <label className="bpi-label">Question {i + 1}</label>
                                                    <input className="bpi-input" value={faqList[i].question} onChange={e => setFaq(i, "question", e.target.value)} placeholder="Is this product rust proof?" />
                                                </div>
                                                <div className="bpi-field">
                                                    <label className="bpi-label">Answer {i + 1}</label>
                                                    <textarea className="bpi-input" value={faqList[i].answer} onChange={e => setFaq(i, "answer", e.target.value)} rows={2} style={{ resize: "vertical" }} placeholder="Yes, it is 100% rust proof and weather resistant." />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === "seo" && (
                                <div className="bpi-grid bpi-grid-full">
                                    <div className="bpi-field">
                                        <label className="bpi-label">SEO Title</label>
                                        <input className="bpi-input" value={vals.seo_title} onChange={e => set("seo_title", e.target.value)} placeholder="Buy Premium Stainless Steel Stool Online" />
                                    </div>
                                    <div className="bpi-field">
                                        <label className="bpi-label">SEO Description</label>
                                        <textarea className="bpi-input" value={vals.seo_description} onChange={e => set("seo_description", e.target.value)} rows={2} style={{ resize: "vertical" }} placeholder="Shop premium quality furniture..." />
                                    </div>
                                    
                                    <div className="bpi-field" style={{ marginTop: "1rem" }}>
                                        <label className="bpi-label">Related Products</label>
                                        <p style={{ fontSize: "0.75rem", color: "#9CA3AF", fontFamily: FO, marginBottom: "1rem" }}>Add up to 4 related product slugs.</p>
                                        <div className="bpi-grid bpi-grid-2" style={{ gap: "1rem" }}>
                                            {[0, 1, 2, 3].map(i => (
                                                <div className="bpi-field" key={i}>
                                                    <label className="bpi-label">Slot {i + 1}</label>
                                                    <input className="bpi-input" value={relatedSlots[i]} onChange={e => setRelatedSlot(i, e.target.value)} placeholder="product-slug" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* ── Bottom Actions ── */}
                            <div className="flex justify-between items-center pt-5 border-t border-[var(--ap-border-light)] mt-4">
                                <label className="flex items-center gap-2 text-sm cursor-pointer select-none font-[family-name:var(--ap-font-body)] text-[var(--ap-text)]">
                                    <input type="checkbox" checked={vals.is_active} onChange={e => set("is_active", e.target.checked)} className="w-4 h-4 accent-[var(--ap-accent)] rounded" />
                                    Product Active
                                </label>
                                <div className="flex gap-2">
                                    <button type="button" onClick={onClose} className="px-4 py-2 bg-transparent text-[var(--ap-danger)] font-bold text-xs border-none cursor-pointer font-[family-name:var(--ap-font-heading)]">Discard</button>
                                    <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[var(--ap-accent)] text-white font-bold text-xs rounded-lg border-none cursor-pointer disabled:opacity-50 font-[family-name:var(--ap-font-heading)]">
                                        {saving ? "Saving…" : "Publish Changes"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    
                    {/* Live Preview Panel */}
                    <div className="modal-preview-panel">
                        <MobilePreview />
                    </div>
                </div>
            </div>
        </div>
    );
}
