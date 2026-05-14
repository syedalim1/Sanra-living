"use client";

import React, { useState, useEffect, useCallback } from "react";
import { C, FM, FO, CATEGORIES } from "../constants";
import VideoUploader from "../components/VideoUploader";
import BasicProductInfo from "../components/BasicProductInfo";
import ProductMediaSection from "../components/ProductMediaSection";
import type { Product } from "../types";

interface AplusBlock {
    title: string;
    description: string;
    image_url: string;
}

interface Props {
    product: Product;
    adminKey: string;
    onSaved: (updated: Product) => void;
    onCancel: () => void;
    onDelete: (id: string) => void;
}

const FINISHES = ["Matte Black", "Graphite Grey", "White", "Bronze", "Natural Wood", "Walnut"];
const STOCK_STATUSES = ["In Stock", "Only 12 Left", "Only 3 Left", "New", "Limited", "Out of Stock"];

/* ── Static styles (defined outside to avoid re-creation on every render) ── */
const inp: React.CSSProperties = {
    background: "#fff",
    border: `1px solid ${C.border}`,
    color: C.text,
    fontSize: "0.85rem",
    fontFamily: FO,
    borderRadius: 6,
    padding: "0.75rem 1rem",
    width: "100%",
    boxSizing: "border-box",
};

const lbl: React.CSSProperties = {
    display: "block",
    fontSize: "0.6rem",
    fontWeight: 700,
    color: C.muted,
    fontFamily: FM,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    marginBottom: "0.4rem",
};

const sectionTitle: React.CSSProperties = {
    fontSize: "0.65rem",
    fontWeight: 700,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: C.accent,
    fontFamily: FM,
    marginBottom: "1rem",
};

export default function EditProductPage({ product, adminKey, onSaved, onCancel, onDelete }: Props) {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    const [form, setForm] = useState({
        title: product.title ?? "",
        price: String(product.price ?? ""),
        compare_at_price: product.compare_at_price ? String(product.compare_at_price) : "",
        category: product.category ?? "",
        finish: product.finish ?? FINISHES[0],
        stock_status: product.stock_status ?? STOCK_STATUSES[0],
        stock_qty: String(product.stock_qty ?? 0),
        images: product.images?.length
            ? [...product.images]
            : [product.image_url, product.hover_image_url].filter(Boolean) as string[],
        video_url: product.video_url ?? "",
        video_thumbnail: product.video_thumbnail ?? "",
        description: product.description ?? "",
        weight_kg: product.weight_kg ? String(product.weight_kg) : "",
        dimensions: product.dimensions ?? "",
        tags: product.tags ?? [],
        is_new: product.is_new ?? false,
        is_active: product.is_active ?? true,
        sku: product.sku ?? "",
        highlights: product.highlights ?? [],
        material: product.material ?? "",
        steel_thickness: product.steel_thickness ?? "",
        warranty: product.warranty ?? "",
        dispatch_time: product.dispatch_time ?? "2-5 Business Days",
        badges: product.badges ?? [],
        seo_title: product.seo_title ?? "",
        seo_description: product.seo_description ?? "",
        seo_keywords: product.seo_keywords ?? "",
        faqs: product.faqs ?? [],
        whatsapp_message: product.whatsapp_message ?? "",
        collection: product.collection ?? "",
        is_featured: product.is_featured ?? false,
        is_best_seller: product.is_best_seller ?? false,
        subtitle: product.subtitle ?? "",
    });


    const [badgeInput, setBadgeInput] = useState("");
    const [success, setSuccess] = useState(false);
    const [showKeywords, setShowKeywords] = useState(false);

    useEffect(() => {
        const draft = localStorage.getItem(`sanra_draft_${product.id}`);
        if (draft) {
            try { setForm(JSON.parse(draft)); } catch (e) {}
        }
    }, [product.id]);

    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.setItem(`sanra_draft_${product.id}`, JSON.stringify(form));
        }, 5000);
        return () => clearTimeout(timer);
    }, [form, product.id]);

    /* ── A+ Content State ── */
    const [aplusBlocks, setAplusBlocks] = useState<AplusBlock[]>([]);
    const [aplusLoading, setAplusLoading] = useState(true);
    const [aplusSaving, setAplusSaving] = useState(false);
    const [aplusError, setAplusError] = useState("");
    const [aplusSaved, setAplusSaved] = useState(false);

    /* ── Fetch existing A+ blocks ── */
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(`/api/admin/aplus?product_id=${product.id}`, {
                    headers: { "x-admin-key": adminKey },
                });
                if (!res.ok) throw new Error("Failed to load A+ content");
                const data = await res.json();
                if (!cancelled && data.blocks?.length > 0) {
                    setAplusBlocks(
                        data.blocks.map((b: AplusBlock) => ({
                            title: b.title ?? "",
                            description: b.description ?? "",
                            image_url: b.image_url ?? "",
                        }))
                    );
                }
            } catch {
                /* silent — non-critical */
            } finally {
                if (!cancelled) setAplusLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [product.id, adminKey]);

    /* ── A+ helpers ── */
    const addAplusBlock = useCallback(() => {
        if (aplusBlocks.length >= 7) return;
        setAplusBlocks(prev => [...prev, { title: "", description: "", image_url: "" }]);
        setAplusSaved(false);
    }, [aplusBlocks.length]);

    const updateAplusBlock = useCallback((index: number, field: keyof AplusBlock, value: string) => {
        setAplusBlocks(prev =>
            prev.map((b, i) => (i === index ? { ...b, [field]: value } : b))
        );
        setAplusSaved(false);
    }, []);

    const removeAplusBlock = useCallback((index: number) => {
        setAplusBlocks(prev => prev.filter((_, i) => i !== index));
        setAplusSaved(false);
    }, []);

    const saveAplusContent = async () => {
        if (aplusBlocks.length > 0 && aplusBlocks.length < 3) {
            setAplusError(`Need ${3 - aplusBlocks.length} more block(s). Minimum 3 required.`);
            return;
        }
        setAplusSaving(true);
        setAplusError("");
        setAplusSaved(false);
        try {
            const res = await fetch("/api/admin/aplus", {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
                body: JSON.stringify({ product_id: product.id, blocks: aplusBlocks }),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body?.error ?? "Failed to save A+ content");
            }
            setAplusSaved(true);
        } catch (err) {
            setAplusError(err instanceof Error ? err.message : "Failed to save");
        } finally {
            setAplusSaving(false);
        }
    };

    /* ── Tag helpers ── */
    const addTag = useCallback(() => {
        if (form.tags.length >= 10) return;
        const t = tagInput.trim();
        if (!t) return;
        setForm(f => {
            if (f.tags.includes(t)) return f;
            return { ...f, tags: [...f.tags, t] };
        });
        setTagInput("");
    }, [tagInput]);

    const removeTag = useCallback((tag: string) => {
        setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));
    }, []);

    const addHighlight = useCallback(() => {
        setForm(f => ({ ...f, highlights: [...f.highlights, ""] }));
    }, []);
    const updateHighlight = useCallback((index: number, value: string) => {
        setForm(f => {
            const h = [...f.highlights];
            h[index] = value;
            return { ...f, highlights: h };
        });
    }, []);
    const removeHighlight = useCallback((index: number) => {
        setForm(f => ({ ...f, highlights: f.highlights.filter((_, i) => i !== index) }));
    }, []);

    const addBadge = useCallback(() => {
        const b = badgeInput.trim();
        if (!b) return;
        setForm(f => f.badges.includes(b) ? f : { ...f, badges: [...f.badges, b] });
        setBadgeInput("");
    }, [badgeInput]);
    const removeBadge = useCallback((b: string) => {
        setForm(f => ({ ...f, badges: f.badges.filter(x => x !== b) }));
    }, []);

    const addFaq = useCallback(() => {
        if (form.faqs.length >= 3) return;
        setForm(f => ({ ...f, faqs: [...f.faqs, { question: "", answer: "" }] }));
    }, [form.faqs.length]);
    const updateFaq = useCallback((index: number, field: "question" | "answer", value: string) => {
        setForm(f => {
            const newFaqs = [...f.faqs];
            newFaqs[index][field] = value;
            return { ...f, faqs: newFaqs };
        });
    }, []);
    const removeFaq = useCallback((index: number) => {
        setForm(f => ({ ...f, faqs: f.faqs.filter((_, i) => i !== index) }));
    }, []);

    /* ── Main product save ── */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim()) { setError("Title is required."); return; }
        if (!form.price || isNaN(Number(form.price))) { setError("A valid price is required."); return; }
        if (form.compare_at_price && Number(form.compare_at_price) <= Number(form.price)) {
            setError("Compare-at price must be higher than the selling price.");
            return;
        }

        setSaving(true);
        setError("");
        try {
            const body = {
                title: form.title.trim(),
                price: Number(form.price),
                compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
                category: form.category,
                finish: form.finish,
                stock_status: form.stock_status,
                stock_qty: Number(form.stock_qty) || 0,
                image_url: form.images[0] ?? product.image_url ?? "",
                hover_image_url: form.images[1] ?? product.hover_image_url ?? "",
                images: form.images,
                video_url: form.video_url || null,
                video_thumbnail: form.video_thumbnail || null,
                description: form.description.trim(),
                weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
                dimensions: form.dimensions.trim() || null,
                tags: form.tags,
                is_new: form.is_new,
                is_active: form.is_active,
                sku: form.sku,
                highlights: form.highlights,
                material: form.material,
                steel_thickness: form.steel_thickness,
                warranty: form.warranty,
                dispatch_time: form.dispatch_time,
                badges: form.badges,
                seo_title: form.seo_title,
                seo_description: form.seo_description,
                seo_keywords: form.seo_keywords,
                faqs: form.faqs,
                whatsapp_message: form.whatsapp_message,
                collection: form.collection || null,
                is_featured: form.is_featured,
                is_best_seller: form.is_best_seller,
                subtitle: form.subtitle,
            };

            const res = await fetch(`/api/admin/products?id=${product.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update product");
            }

            // ── Auto-save A+ content alongside the product ──
            if (aplusBlocks.length >= 3) {
                try {
                    const aplusRes = await fetch("/api/admin/aplus", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
                        body: JSON.stringify({ product_id: product.id, blocks: aplusBlocks }),
                    });
                    if (!aplusRes.ok) {
                        console.warn("A+ content save failed, but product was saved.");
                    } else {
                        setAplusSaved(true);
                    }
                } catch {
                    console.warn("A+ content save error (product saved OK).");
                }
            } else if (aplusBlocks.length === 0) {
                // If all blocks removed, also clear from DB
                try {
                    await fetch("/api/admin/aplus", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
                        body: JSON.stringify({ product_id: product.id, blocks: [] }),
                    });
                } catch { /* silent */ }
            }

            localStorage.removeItem(`sanra_draft_${product.id}`);
            const updatedProduct = await res.json();
            
            onSaved(updatedProduct.product || updatedProduct);
            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    /* ── Discount % ── */
    const discountPct =
        form.compare_at_price &&
        form.price &&
        Number(form.compare_at_price) > Number(form.price)
            ? Math.round((1 - Number(form.price) / Number(form.compare_at_price)) * 100)
            : null;

    if (success) {
        return (
            <div style={{ maxWidth: 600, margin: "4rem auto", textAlign: "center", background: C.card, border: `1px solid ${C.border}`, padding: "3rem 2rem", borderRadius: 12 }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: C.text, fontFamily: FM, marginBottom: "0.5rem" }}>Product Updated Successfully</h2>
                <p style={{ color: C.muted, fontFamily: FO, fontSize: "0.9rem", marginBottom: "2rem" }}>Changes have been published to the store.</p>
                <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                    <button onClick={onCancel} style={{ padding: "0.75rem 1.5rem", background: "transparent", border: `1px solid ${C.border}`, color: C.text, fontWeight: 700, borderRadius: 6, cursor: "pointer", fontFamily: FM }}>← Back to Products</button>
                    <button onClick={() => window.open(`/shop`, "_blank")} style={{ padding: "0.75rem 1.5rem", background: C.accent, border: "none", color: "#111", fontWeight: 900, borderRadius: 6, cursor: "pointer", fontFamily: FM }}>View Product ↗</button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <style>{`
                @media (max-width: 768px) {
                    .admin-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
                <div>
                    <button
                        type="button"
                        onClick={onCancel}
                        style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontFamily: FM, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: 0, marginBottom: "0.5rem", display: "block" }}
                    >
                        ← Back to Products
                    </button>
                    <h2 style={{ fontSize: "1.4rem", fontWeight: 900, color: C.text, fontFamily: FM }}>Edit Product</h2>
                    <p style={{ fontSize: "0.78rem", color: C.muted, fontFamily: FO, marginTop: "0.25rem" }}>ID: {product.id}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{
                        display: "inline-block", padding: "0.3rem 0.8rem", borderRadius: 6,
                        fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: FM,
                        background: form.is_active ? `${C.green}22` : `${C.red}22`,
                        color: form.is_active ? C.green : C.red,
                    }}>
                        {form.is_active ? "● Live" : "○ Hidden"}
                    </span>
                    <button
                        type="button"
                        onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                        style={{
                            padding: "0.5rem 1rem", background: "transparent",
                            border: `1px solid ${form.is_active ? C.red : C.green}`,
                            color: form.is_active ? C.red : C.green,
                            fontSize: "0.68rem", fontWeight: 700, fontFamily: FM,
                            cursor: "pointer", borderRadius: 6, letterSpacing: "0.08em", textTransform: "uppercase",
                        }}
                    >
                        {form.is_active ? "Hide" : "Publish"}
                    </button>
                </div>
            </div>

            {/* Global error */}
            {error && (
                <div style={{ background: `${C.red}15`, border: `1px solid ${C.red}44`, padding: "0.75rem 1rem", borderRadius: 8, marginBottom: "1.25rem", fontSize: "0.82rem", color: C.red, fontFamily: FO }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                {/* ── BASIC INFO — Premium Component ── */}
                <BasicProductInfo
                    title={form.title}
                    subtitle={form.subtitle ?? ""}
                    category={form.category}
                    stockStatus={form.stock_status}
                    price={form.price}
                    comparePrice={form.compare_at_price}
                    collection={form.collection}
                    isFeatured={form.is_featured}
                    isBestSeller={form.is_best_seller}
                    onChange={(field, value) => setForm(f => ({ ...f, [field]: value }))}
                    sectionNum={1}
                    defaultOpen={true}
                />

                {/* ── PRICING ── */}
                <section style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "1.25rem" }}>
                    <p style={sectionTitle}>Pricing</p>
                    <div className="admin-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div>
                            <label style={lbl}>Selling Price (₹) *</label>
                            <input
                                type="number"
                                value={form.price}
                                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                                placeholder="2499"
                                style={inp}
                                required
                            />
                        </div>
                        <div>
                            <label style={lbl}>Compare-at Price (₹)</label>
                            <input
                                type="number"
                                value={form.compare_at_price}
                                onChange={e => setForm(f => ({ ...f, compare_at_price: e.target.value }))}
                                placeholder="e.g. 3999"
                                style={inp}
                            />
                            {discountPct !== null && discountPct > 0 && (
                                <p style={{ fontSize: "0.68rem", color: C.green, fontFamily: FM, marginTop: "0.4rem" }}>
                                    💰 {discountPct}% OFF
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                {/* ── PRODUCT MEDIA — Premium Component ── */}
                <ProductMediaSection
                    images={form.images}
                    onImagesChange={(imgs) => {
                        setForm(f => ({
                            ...f,
                            images: imgs,
                            image_url: imgs.length > 0 ? imgs[0] : "",
                        }));
                    }}
                    imageStylePreset={form.image_style_preset}
                    watermarkStrength={form.watermark_strength}
                    onSettingsChange={(field, val) => setForm(f => ({ ...f, [field]: val }))}
                    adminKey={adminKey}
                    sectionNum={2}
                />

                {/* ── PRODUCT VIDEO ── */}
                <section style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "1.25rem" }}>
                    <p style={sectionTitle}>Product Video (optional)</p>
                    <p style={{ fontSize: "0.72rem", color: C.muted, fontFamily: FO, marginBottom: "1rem" }}>
                        Upload a product showcase video. It will autoplay (muted) on the product page.
                    </p>
                    <VideoUploader
                        videoUrl={form.video_url}
                        videoThumbnail={form.video_thumbnail}
                        onVideoChange={(url, thumb) =>
                            setForm(f => ({ ...f, video_url: url, video_thumbnail: thumb }))
                        }
                        adminKey={adminKey}
                    />
                </section>

                {/* ── INVENTORY ── */}
                <section style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "1.25rem" }}>
                    <p style={sectionTitle}>Inventory</p>
                    <div className="admin-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                        <div>
                            <label style={lbl}>Stock Qty</label>
                            <input
                                type="number"
                                min={0}
                                value={form.stock_qty}
                                onChange={e => setForm(f => ({ ...f, stock_qty: e.target.value }))}
                                style={inp}
                            />
                        </div>
                        <div>
                            <label style={lbl}>Stock Status</label>
                            <select
                                value={form.stock_status}
                                onChange={e => setForm(f => ({ ...f, stock_status: e.target.value }))}
                                style={{ ...inp, cursor: "pointer" }}
                            >
                                {STOCK_STATUSES.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", paddingTop: "1.5rem" }}>
                            <input
                                type="checkbox"
                                id="is_new"
                                checked={form.is_new}
                                onChange={e => setForm(f => ({ ...f, is_new: e.target.checked }))}
                                style={{ width: 18, height: 18, accentColor: C.accent }}
                            />
                            <label htmlFor="is_new" style={{ fontSize: "0.82rem", color: C.text, fontFamily: FO, cursor: "pointer" }}>
                                Mark as New Arrival
                            </label>
                        </div>
                    </div>
                </section>

                {/* ── DESCRIPTION ── */}
                <section style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "1.25rem" }}>
                    <p style={sectionTitle}>Description</p>
                    <textarea
                        value={form.description}
                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                        rows={6}
                        placeholder="Detailed product description…"
                        style={{ ...inp, resize: "vertical", lineHeight: 1.7 }}
                    />
                </section>

                {/* ── HIGHLIGHTS ── */}
                <section style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "1.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <p style={sectionTitle}>Product Highlights</p>
                        <button type="button" onClick={addHighlight} style={{ padding: "0.5rem 1.25rem", background: "transparent", border: `1px solid ${C.accent}`, color: C.accent, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", borderRadius: 6, fontFamily: FM, whiteSpace: "nowrap" }}>
                            + Add Bullet
                        </button>
                    </div>
                    {form.highlights.length === 0 ? (
                        <p style={{ fontSize: "0.85rem", color: C.muted, fontFamily: FO, textAlign: "center", padding: "1rem 0" }}>No highlights added.</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            {form.highlights.map((h, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <span style={{ color: C.accent, fontSize: "1.2rem" }}>•</span>
                                    <input value={h} onChange={e => updateHighlight(i, e.target.value)} placeholder="e.g. Heavy Duty Steel Frame" style={{ ...inp, flex: 1 }} />
                                    <button type="button" onClick={() => removeHighlight(i)} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: "0.82rem", fontWeight: 700, padding: "0.5rem" }}>✕</button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* ── SHIPPING & SPECS ── */}
                <section style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "1.25rem" }}>
                    <p style={sectionTitle}>Specifications & Shipping</p>
                    <div className="admin-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div>
                            <label style={lbl}>Material</label>
                            <input value={form.material} onChange={e => setForm(f => ({ ...f, material: e.target.value }))} placeholder="e.g. Jindal Stainless Steel" style={inp} />
                        </div>
                        <div>
                            <label style={lbl}>Steel Thickness</label>
                            <input value={form.steel_thickness} onChange={e => setForm(f => ({ ...f, steel_thickness: e.target.value }))} placeholder="e.g. 1.2mm" style={inp} />
                        </div>
                        <div>
                            <label style={lbl}>Weight (kg)</label>
                            <input
                                type="number"
                                min={0}
                                step="0.1"
                                value={form.weight_kg}
                                onChange={e => setForm(f => ({ ...f, weight_kg: e.target.value }))}
                                placeholder="e.g. 4.5"
                                style={inp}
                            />
                        </div>
                        <div>
                            <label style={lbl}>Dimensions (L × W × H cm)</label>
                            <input
                                value={form.dimensions}
                                onChange={e => setForm(f => ({ ...f, dimensions: e.target.value }))}
                                placeholder="e.g. 18 x 18 x 36 Inches"
                                style={inp}
                            />
                        </div>
                        <div>
                            <label style={lbl}>Warranty (Optional)</label>
                            <input value={form.warranty} onChange={e => setForm(f => ({ ...f, warranty: e.target.value }))} placeholder="e.g. 3 Years Replacement" style={inp} />
                        </div>
                        <div>
                            <label style={lbl}>Dispatch Time</label>
                            <input value={form.dispatch_time} onChange={e => setForm(f => ({ ...f, dispatch_time: e.target.value }))} placeholder="e.g. 2-5 Business Days" style={inp} />
                        </div>
                    </div>
                </section>

                {/* ── TAGS ── */}
                <section style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "1.25rem" }}>
                    <p style={sectionTitle}>Tags</p>
                    {form.tags.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.875rem" }}>
                            {form.tags.map(tag => (
                                <span
                                    key={tag}
                                    style={{
                                        display: "inline-flex", alignItems: "center", gap: "0.4rem",
                                        padding: "0.3rem 0.7rem", background: `${C.accent}15`,
                                        border: `1px solid ${C.accent}33`, borderRadius: 20,
                                        fontSize: "0.72rem", color: C.accent, fontFamily: FM, fontWeight: 600,
                                    }}
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: "0.72rem", padding: 0, lineHeight: 1 }}
                                        aria-label={`Remove tag ${tag}`}
                                    >
                                        ✕
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <input
                            value={tagInput}
                            onChange={e => setTagInput(e.target.value)}
                            placeholder="Add tag and press Enter"
                            onKeyDown={e => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addTag();
                                }
                            }}
                            style={{ ...inp, flex: 1, fontSize: "0.82rem" }}
                        />
                        <button
                            type="button"
                            onClick={addTag}
                            style={{
                                padding: "0 1.25rem", background: "transparent",
                                border: `1px solid ${C.accent}`, color: C.accent,
                                fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.1em",
                                textTransform: "uppercase", cursor: "pointer", borderRadius: 6,
                                fontFamily: FM, whiteSpace: "nowrap",
                            }}
                        >
                            + Tag
                        </button>
                    </div>
                </section>

                {/* ── A+ CONTENT ── */}
                <section style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "1.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <div>
                            <p style={sectionTitle}>A+ Content</p>
                            <p style={{ fontSize: "0.75rem", color: C.muted, fontFamily: FO, marginTop: "-0.5rem" }}>
                                Manage rich content blocks below the product. Min 3 blocks.
                            </p>
                        </div>
                        <button type="button" disabled={aplusBlocks.length >= 7} onClick={addAplusBlock} style={{ padding: "0.5rem 1.25rem", background: aplusBlocks.length >= 7 ? "#ccc" : C.accent, color: aplusBlocks.length >= 7 ? "#666" : "#fff", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: aplusBlocks.length >= 7 ? "not-allowed" : "pointer", borderRadius: 6, fontFamily: FM, border: "none", whiteSpace: "nowrap" }}>
                            + Add Block
                        </button>
                    </div>

                    {aplusError && (
                        <div style={{ background: `${C.red}15`, border: `1px solid ${C.red}44`, padding: "0.6rem 1rem", borderRadius: 6, marginBottom: "1rem", fontSize: "0.8rem", color: C.red, fontFamily: FO }}>
                            {aplusError}
                        </div>
                    )}

                    {aplusLoading ? (
                        <p style={{ fontSize: "0.85rem", color: C.muted, fontFamily: FO, padding: "2rem 0", textAlign: "center" }}>
                            Loading A+ content…
                        </p>
                    ) : aplusBlocks.length === 0 ? (
                        <p style={{ fontSize: "0.85rem", color: C.muted, fontFamily: FO, padding: "2rem 0", textAlign: "center" }}>
                            No A+ blocks yet. Click &quot;+ Add Block&quot; to start.
                        </p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {aplusBlocks.map((block, i) => (
                                <div
                                    key={i}
                                    style={{ background: "#fafafa", border: `1px solid ${C.border}`, borderRadius: 8, padding: "1.25rem" }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                                        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: C.muted, fontFamily: FM, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                                            Block {i + 1}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeAplusBlock(i)}
                                            style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: "0.75rem", fontWeight: 700, fontFamily: FM }}
                                        >
                                            ✕ Remove
                                        </button>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                        <div>
                                            <label style={lbl}>Title</label>
                                            <input
                                                value={block.title}
                                                onChange={e => updateAplusBlock(i, "title", e.target.value)}
                                                placeholder="e.g. Heavy Duty Steel Frame"
                                                style={inp}
                                            />
                                        </div>
                                        <div>
                                            <label style={lbl}>Description</label>
                                            <textarea
                                                value={block.description}
                                                onChange={e => updateAplusBlock(i, "description", e.target.value)}
                                                rows={2}
                                                placeholder="Short description for this feature…"
                                                style={{ ...inp, resize: "vertical" }}
                                            />
                                        </div>

                                        <div>
                                            <label style={lbl}>Block Image</label>
                                            <ImageUploader
                                                images={block.image_url ? [block.image_url] : []}
                                                onImagesChange={imgs =>
                                                    updateAplusBlock(i, "image_url", imgs[0] ?? "")
                                                }
                                                maxImages={1}
                                                adminKey={adminKey}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {aplusBlocks.length > 0 && (
                        <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
                            <button
                                type="button"
                                onClick={saveAplusContent}
                                disabled={aplusSaving}
                                style={{
                                    padding: "0.65rem 1.5rem", background: aplusSaved ? C.green : C.accent,
                                    color: "#fff", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.1em",
                                    textTransform: "uppercase", cursor: aplusSaving ? "not-allowed" : "pointer",
                                    borderRadius: 6, fontFamily: FM, border: "none",
                                    opacity: aplusSaving ? 0.7 : 1, transition: "background 0.2s",
                                }}
                            >
                                {aplusSaving
                                    ? "Saving…"
                                    : aplusSaved
                                    ? `✓ Saved (${aplusBlocks.length} blocks)`
                                    : `Save A+ Content (${aplusBlocks.length} blocks)`}
                            </button>
                            <span style={{ fontSize: "0.75rem", color: aplusBlocks.length < 3 ? C.red : C.green, fontFamily: FO }}>
                                {aplusBlocks.length < 3
                                    ? `⚠ Need ${3 - aplusBlocks.length} more block(s)`
                                    : "✓ Ready to save"}
                            </span>
                        </div>
                    )}
                </section>

                {/* ── BADGES ── */}
                <section style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "1.25rem" }}>
                    <p style={sectionTitle}>Product Badges</p>
                    <p style={{ fontSize: "0.75rem", color: C.muted, fontFamily: FO, marginBottom: "1rem" }}>e.g. Best Seller, Premium, Commercial Grade</p>
                    {form.badges.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.875rem" }}>
                            {form.badges.map(b => (
                                <span key={b} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.3rem 0.7rem", background: `${C.black}`, borderRadius: 4, fontSize: "0.72rem", color: "#fff", fontFamily: FM, fontWeight: 600 }}>
                                    {b}
                                    <button type="button" onClick={() => removeBadge(b)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: "0.72rem", padding: 0, lineHeight: 1 }}>✕</button>
                                </span>
                            ))}
                        </div>
                    )}
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <select value={badgeInput} onChange={e => setBadgeInput(e.target.value)} style={{ ...inp, flex: 1, cursor: "pointer" }}>
                            <option value="">Select a badge...</option>
                            <option value="Best Seller">Best Seller</option>
                            <option value="New Arrival">New Arrival</option>
                            <option value="Premium">Premium</option>
                            <option value="Commercial Grade">Commercial Grade</option>
                            <option value="Luxury Collection">Luxury Collection</option>
                        </select>
                        <button type="button" onClick={addBadge} style={{ padding: "0 1.25rem", background: "transparent", border: `1px solid ${C.accent}`, color: C.accent, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", borderRadius: 6, fontFamily: FM, whiteSpace: "nowrap" }}>+ Add</button>
                    </div>
                </section>

                {/* ── SEO ── */}
                <section style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "1.25rem" }}>
                    <p style={sectionTitle}>Search Engine Optimization</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <div>
                            <label style={lbl}>SEO Title</label>
                            <input value={form.seo_title} onChange={e => setForm(f => ({ ...f, seo_title: e.target.value }))} placeholder="Title for Google Search" style={inp} />
                        </div>
                        <div>
                            <label style={lbl}>SEO Meta Description</label>
                            <textarea value={form.seo_description} onChange={e => setForm(f => ({ ...f, seo_description: e.target.value }))} rows={2} placeholder="Brief summary of the product for search results..." style={{ ...inp, resize: "vertical" }} />
                        </div>
                        
                        <div style={{ marginTop: "0.5rem" }}>
                            <button type="button" onClick={() => setShowKeywords(!showKeywords)} style={{ background: "none", border: "none", color: C.accent, fontWeight: 700, fontSize: "0.72rem", cursor: "pointer", fontFamily: FM, textTransform: "uppercase", letterSpacing: "0.1em", padding: 0 }}>
                                {showKeywords ? "− Hide Advanced Keywords" : "+ Show Advanced Keywords"}
                            </button>
                            {showKeywords && (
                                <div style={{ marginTop: "1rem" }}>
                                    <label style={lbl}>SEO Keywords</label>
                                    <input value={form.seo_keywords} onChange={e => setForm(f => ({ ...f, seo_keywords: e.target.value }))} placeholder="e.g. steel chair, banquet chair, hotel furniture" style={inp} />
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* ── FAQS ── */}
                <section style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "1.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <p style={sectionTitle}>FAQ Section (Max 3)</p>
                        <button type="button" disabled={form.faqs.length >= 3} onClick={addFaq} style={{ padding: "0.5rem 1.25rem", background: "transparent", border: `1px solid ${form.faqs.length >= 3 ? "#ccc" : C.accent}`, color: form.faqs.length >= 3 ? "#999" : C.accent, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: form.faqs.length >= 3 ? "not-allowed" : "pointer", borderRadius: 6, fontFamily: FM, whiteSpace: "nowrap" }}>
                            + Add FAQ
                        </button>
                    </div>
                    {form.faqs.length === 0 ? (
                        <p style={{ fontSize: "0.85rem", color: C.muted, fontFamily: FO, textAlign: "center", padding: "1rem 0" }}>No FAQs added.</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {form.faqs.map((faq, i) => (
                                <div key={i} style={{ background: "#fdfdfd", border: `1px solid ${C.border}`, borderRadius: 8, padding: "1rem" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                                        <span style={lbl}>Q&A {i + 1}</span>
                                        <button type="button" onClick={() => removeFaq(i)} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: "0.7rem", fontWeight: 700, fontFamily: FM }}>✕ Remove</button>
                                    </div>
                                    <input value={faq.question} onChange={e => updateFaq(i, "question", e.target.value)} placeholder="Question" style={{ ...inp, marginBottom: "0.5rem" }} />
                                    <textarea value={faq.answer} onChange={e => updateFaq(i, "answer", e.target.value)} placeholder="Answer" rows={2} style={{ ...inp, resize: "vertical" }} />
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* ── MARKETING ── */}
                <section style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "1.25rem" }}>
                    <p style={sectionTitle}>Marketing & Enquiries</p>
                    <div>
                        <label style={lbl}>WhatsApp Custom Message</label>
                        <p style={{ fontSize: "0.75rem", color: C.muted, fontFamily: FO, marginBottom: "0.5rem" }}>Pre-filled message when a customer clicks WhatsApp CTA</p>
                        <input value={form.whatsapp_message} onChange={e => setForm(f => ({ ...f, whatsapp_message: e.target.value }))} placeholder="e.g. Hi SANRA Living, I need this chair." style={inp} />
                    </div>
                </section>

                {/* ── DANGER ZONE ── */}
                <section style={{ background: `${C.red}08`, border: `1px solid ${C.red}22`, borderRadius: 10, padding: "1.25rem" }}>
                    <p style={{ ...sectionTitle, color: C.red }}>Danger Zone</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <p style={{ fontSize: "0.85rem", color: C.text, fontFamily: FM, fontWeight: 700 }}>Delete Product</p>
                            <p style={{ fontSize: "0.75rem", color: C.muted, fontFamily: FO, marginTop: "0.2rem" }}>This action cannot be undone. All product data will be lost.</p>
                        </div>
                        {!deleteConfirm ? (
                            <button type="button" onClick={() => setDeleteConfirm(true)} style={{ padding: "0.6rem 1rem", background: "transparent", border: `1px solid ${C.red}44`, color: C.red, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", borderRadius: 6, fontFamily: FM, whiteSpace: "nowrap" }}>
                                Delete
                            </button>
                        ) : (
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button type="button" onClick={() => onDelete(product.id)} style={{ padding: "0.6rem 1rem", background: C.red, border: "none", color: "#fff", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", borderRadius: 6, fontFamily: FM, whiteSpace: "nowrap" }}>
                                    Confirm Delete
                                </button>
                                <button type="button" onClick={() => setDeleteConfirm(false)} style={{ padding: "0.6rem 1rem", background: "transparent", border: `1px solid ${C.border}`, color: C.muted, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", borderRadius: 6, fontFamily: FM, whiteSpace: "nowrap" }}>
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* ── STICKY SUBMIT ── */}
                <div style={{ display: "flex", gap: "0.75rem", position: "sticky", bottom: 0, background: C.bg, padding: "1.25rem 0", borderTop: `1px solid ${C.border}`, zIndex: 10 }}>
                    <button type="submit" disabled={saving} style={{
                        flex: 1, padding: "1rem", background: C.accent, color: "#fff", fontWeight: 900,
                        fontSize: "0.85rem", letterSpacing: "0.12em", textTransform: "uppercase",
                        border: "none", cursor: saving ? "not-allowed" : "pointer", borderRadius: 8,
                        fontFamily: FM, opacity: saving ? 0.7 : 1, transition: "all 0.2s",
                    }}>
                        {saving ? "Saving Changes…" : "✓ Save Changes"}
                    </button>
                    <button type="button" onClick={() => window.open(`/shop/preview?draft=true&id=${product.id}`, "_blank")} style={{
                        padding: "1rem 1.5rem", background: "transparent", color: C.accent,
                        fontWeight: 900, fontSize: "0.85rem", border: `1px solid ${C.accent}`,
                        cursor: "pointer", borderRadius: 8, fontFamily: FM, textTransform: "uppercase", letterSpacing: "0.05em",
                    }}>
                        Preview
                    </button>
                    <button type="button" onClick={onCancel} style={{
                        padding: "1rem 1.5rem", background: "transparent", color: C.muted,
                        fontWeight: 700, fontSize: "0.85rem", border: `1px solid ${C.border}`,
                        cursor: "pointer", borderRadius: 8, fontFamily: FM,
                    }}>
                        Cancel
                    </button>
                </div>

            </form>
        </div>
    );
}
