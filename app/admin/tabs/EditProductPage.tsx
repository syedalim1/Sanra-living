"use client";

import React, { useState } from "react";
import { C, FM, FO, CATEGORIES } from "../constants";
import ImageUploader from "../components/ImageUploader";
import VideoUploader from "../components/VideoUploader";
import type { Product } from "../types";

interface Props {
    product: Product;
    adminKey: string;
    onSaved: (updated: Product) => void;
    onCancel: () => void;
    onDelete: (id: string) => void;
}

const FINISHES = ["Matte Black", "Graphite Grey", "White", "Bronze", "Natural Wood", "Walnut"];
const STOCK_STATUSES = ["In Stock", "Only 12 Left", "Only 3 Left", "New", "Limited", "Out of Stock"];

export default function EditProductPage({ product, adminKey, onSaved, onCancel, onDelete }: Props) {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    const [form, setForm] = useState({
        title: product.title,
        subtitle: product.subtitle,
        price: String(product.price),
        compare_at_price: product.compare_at_price ? String(product.compare_at_price) : "",
        category: product.category,
        finish: product.finish,
        stock_status: product.stock_status,
        stock_qty: String(product.stock_qty),
        images: product.images?.length ? [...product.images] : [product.image_url, product.hover_image_url].filter(Boolean),
        video_url: product.video_url ?? "",
        video_thumbnail: product.video_thumbnail ?? "",
        description: product.description ?? "",
        weight_kg: product.weight_kg ? String(product.weight_kg) : "",
        dimensions: product.dimensions ?? "",
        tags: product.tags ?? [],
        is_new: product.is_new,
        is_active: product.is_active,
    });

    const inp: React.CSSProperties = {
        background: "#0F0F0F", border: `1px solid ${C.border}`, color: C.text,
        fontSize: "0.85rem", fontFamily: FO, borderRadius: 6,
        padding: "0.75rem 1rem", width: "100%", boxSizing: "border-box",
    };
    const lbl: React.CSSProperties = {
        display: "block", fontSize: "0.6rem", fontWeight: 700, color: C.muted,
        fontFamily: FM, letterSpacing: "0.12em", textTransform: "uppercase",
        marginBottom: "0.4rem",
    };
    const sectionTitle: React.CSSProperties = {
        fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em",
        textTransform: "uppercase", color: C.accent, fontFamily: FM, marginBottom: "1rem",
    };

    const addTag = () => {
        const t = tagInput.trim();
        if (!t || form.tags.includes(t)) return;
        setForm(f => ({ ...f, tags: [...f.tags, t] }));
        setTagInput("");
    };
    const removeTag = (tag: string) => {
        setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || !form.price) {
            setError("Title and Price are required.");
            return;
        }
        setSaving(true);
        setError("");
        try {
            const body = {
                title: form.title,
                subtitle: form.subtitle,
                price: Number(form.price),
                compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
                category: form.category,
                finish: form.finish,
                stock_status: form.stock_status,
                stock_qty: Number(form.stock_qty),
                image_url: form.images[0] ?? product.image_url,
                hover_image_url: form.images[1] ?? product.hover_image_url,
                images: form.images,
                video_url: form.video_url,
                video_thumbnail: form.video_thumbnail,
                description: form.description,
                weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
                dimensions: form.dimensions,
                tags: form.tags,
                is_new: form.is_new,
                is_active: form.is_active,
            };
            const res = await fetch(`/api/admin/products?id=${product.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
                body: JSON.stringify(body),
            });
            if (!res.ok) throw new Error("Failed to update product");
            onSaved({ ...product, ...body } as Product);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
                <div>
                    <button onClick={onCancel} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontFamily: FM, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: 0, marginBottom: "0.5rem", display: "block" }}>
                        ← Back to Products
                    </button>
                    <h2 style={{ fontSize: "1.4rem", fontWeight: 900, color: C.text, fontFamily: FM }}>Edit Product</h2>
                    <p style={{ fontSize: "0.78rem", color: C.muted, fontFamily: FO, marginTop: "0.25rem" }}>ID: {product.id}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ display: "inline-block", padding: "0.3rem 0.8rem", borderRadius: 6, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: FM, background: form.is_active ? `${C.green}22` : `${C.red}22`, color: form.is_active ? C.green : C.red }}>
                        {form.is_active ? "● Live" : "○ Hidden"}
                    </span>
                    <button type="button" onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))} style={{ padding: "0.5rem 1rem", background: "transparent", border: `1px solid ${form.is_active ? C.red : C.green}`, color: form.is_active ? C.red : C.green, fontSize: "0.68rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        {form.is_active ? "Hide" : "Publish"}
                    </button>
                </div>
            </div>

            {error && (
                <div style={{ background: `${C.red}15`, border: `1px solid ${C.red}44`, padding: "0.75rem 1rem", borderRadius: 8, marginBottom: "1.5rem", fontSize: "0.82rem", color: C.red, fontFamily: FO }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                {/* BASIC INFO */}
                <section style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "1.5rem" }}>
                    <p style={sectionTitle}>Basic Information</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div style={{ gridColumn: "1/-1" }}>
                            <label style={lbl}>Title *</label>
                            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={inp} required />
                        </div>
                        <div style={{ gridColumn: "1/-1" }}>
                            <label style={lbl}>Subtitle</label>
                            <input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} style={inp} />
                        </div>
                        <div>
                            <label style={lbl}>Category</label>
                            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ ...inp, cursor: "pointer" }}>
                                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={lbl}>Finish</label>
                            <select value={form.finish} onChange={e => setForm(f => ({ ...f, finish: e.target.value }))} style={{ ...inp, cursor: "pointer" }}>
                                {FINISHES.map(f => <option key={f}>{f}</option>)}
                            </select>
                        </div>
                    </div>
                </section>

                {/* PRICING */}
                <section style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "1.5rem" }}>
                    <p style={sectionTitle}>Pricing</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div>
                            <label style={lbl}>Selling Price (₹) *</label>
                            <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} style={inp} required />
                        </div>
                        <div>
                            <label style={lbl}>Compare-at Price (₹)</label>
                            <input type="number" value={form.compare_at_price} onChange={e => setForm(f => ({ ...f, compare_at_price: e.target.value }))} placeholder="Original price (strikethrough)" style={inp} />
                            {form.compare_at_price && form.price && Number(form.compare_at_price) > Number(form.price) && (
                                <p style={{ fontSize: "0.68rem", color: C.green, fontFamily: FM, marginTop: "0.4rem" }}>
                                    💰 {Math.round((1 - Number(form.price) / Number(form.compare_at_price)) * 100)}% OFF
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                {/* IMAGES — CLOUDINARY UPLOAD */}
                <section style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "1.5rem" }}>
                    <p style={sectionTitle}>Product Images</p>
                    <ImageUploader
                        images={form.images}
                        onImagesChange={(imgs) => setForm(f => ({ ...f, images: imgs }))}
                        adminKey={adminKey}
                    />
                </section>

                {/* PRODUCT VIDEO */}
                <section style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "1.5rem" }}>
                    <p style={sectionTitle}>Product Video (optional)</p>
                    <p style={{ fontSize: "0.72rem", color: C.muted, fontFamily: FO, marginBottom: "1rem" }}>Upload a product showcase video. It will autoplay (muted) on the product page.</p>
                    <VideoUploader
                        videoUrl={form.video_url}
                        videoThumbnail={form.video_thumbnail}
                        onVideoChange={(url, thumb) => setForm(f => ({ ...f, video_url: url, video_thumbnail: thumb }))}
                        adminKey={adminKey}
                    />
                </section>

                {/* INVENTORY */}
                <section style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "1.5rem" }}>
                    <p style={sectionTitle}>Inventory</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                        <div>
                            <label style={lbl}>Stock Qty</label>
                            <input type="number" value={form.stock_qty} onChange={e => setForm(f => ({ ...f, stock_qty: e.target.value }))} style={inp} />
                        </div>
                        <div>
                            <label style={lbl}>Stock Status</label>
                            <select value={form.stock_status} onChange={e => setForm(f => ({ ...f, stock_status: e.target.value }))} style={{ ...inp, cursor: "pointer" }}>
                                {STOCK_STATUSES.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", paddingTop: "1.5rem" }}>
                            <input type="checkbox" id="is_new_edit" checked={form.is_new} onChange={e => setForm(f => ({ ...f, is_new: e.target.checked }))} style={{ width: 18, height: 18, accentColor: C.accent }} />
                            <label htmlFor="is_new_edit" style={{ fontSize: "0.82rem", color: C.text, fontFamily: FO, cursor: "pointer" }}>New Arrival</label>
                        </div>
                    </div>
                </section>

                {/* DESCRIPTION */}
                <section style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "1.5rem" }}>
                    <p style={sectionTitle}>Description</p>
                    <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={6} placeholder="Detailed product description…" style={{ ...inp, resize: "vertical", lineHeight: 1.7 }} />
                </section>

                {/* SHIPPING & SPECS */}
                <section style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "1.5rem" }}>
                    <p style={sectionTitle}>Shipping & Specifications</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div>
                            <label style={lbl}>Weight (kg)</label>
                            <input type="number" step="0.1" value={form.weight_kg} onChange={e => setForm(f => ({ ...f, weight_kg: e.target.value }))} placeholder="e.g. 4.5" style={inp} />
                        </div>
                        <div>
                            <label style={lbl}>Dimensions (L × W × H cm)</label>
                            <input value={form.dimensions} onChange={e => setForm(f => ({ ...f, dimensions: e.target.value }))} placeholder="e.g. 60 × 30 × 45" style={inp} />
                        </div>
                    </div>
                </section>

                {/* TAGS */}
                <section style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "1.5rem" }}>
                    <p style={sectionTitle}>Tags</p>
                    {form.tags.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.875rem" }}>
                            {form.tags.map(tag => (
                                <span key={tag} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.3rem 0.7rem", background: `${C.accent}15`, border: `1px solid ${C.accent}33`, borderRadius: 20, fontSize: "0.72rem", color: C.accent, fontFamily: FM, fontWeight: 600 }}>
                                    {tag}
                                    <button type="button" onClick={() => removeTag(tag)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: "0.72rem", padding: 0, lineHeight: 1 }}>✕</button>
                                </span>
                            ))}
                        </div>
                    )}
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <input value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="Add tag" onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())} style={{ ...inp, flex: 1, fontSize: "0.82rem" }} />
                        <button type="button" onClick={addTag} style={{ padding: "0 1.25rem", background: "transparent", border: `1px solid ${C.accent}`, color: C.accent, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", borderRadius: 6, fontFamily: FM, whiteSpace: "nowrap" }}>+ Tag</button>
                    </div>
                </section>

                {/* DANGER ZONE */}
                <section style={{ background: `${C.red}08`, border: `1px solid ${C.red}22`, borderRadius: 10, padding: "1.5rem" }}>
                    <p style={{ ...sectionTitle, color: C.red }}>Danger Zone</p>
                    <p style={{ fontSize: "0.78rem", color: C.muted, fontFamily: FO, marginBottom: "1rem" }}>Permanently delete this product. This action cannot be undone.</p>
                    {deleteConfirm ? (
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button type="button" onClick={() => onDelete(product.id)} style={{ padding: "0.6rem 1.5rem", background: C.red, border: "none", color: "#fff", fontWeight: 900, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", borderRadius: 6, fontFamily: FM }}>Yes, Delete Forever</button>
                            <button type="button" onClick={() => setDeleteConfirm(false)} style={{ padding: "0.6rem 1.5rem", background: "transparent", border: `1px solid ${C.border}`, color: C.muted, fontWeight: 700, fontSize: "0.72rem", cursor: "pointer", borderRadius: 6, fontFamily: FM }}>Cancel</button>
                        </div>
                    ) : (
                        <button type="button" onClick={() => setDeleteConfirm(true)} style={{ padding: "0.6rem 1.5rem", background: "transparent", border: `1px solid ${C.red}`, color: C.red, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", borderRadius: 6, fontFamily: FM }}>Delete Product</button>
                    )}
                </section>

                {/* SUBMIT */}
                <div style={{ display: "flex", gap: "0.75rem", position: "sticky", bottom: 0, background: C.bg, padding: "1.25rem 0", borderTop: `1px solid ${C.border}` }}>
                    <button type="submit" disabled={saving} style={{
                        flex: 1, padding: "1rem", background: C.accent, color: "#111", fontWeight: 900,
                        fontSize: "0.85rem", letterSpacing: "0.12em", textTransform: "uppercase",
                        border: "none", cursor: saving ? "not-allowed" : "pointer", borderRadius: 8,
                        fontFamily: FM, opacity: saving ? 0.7 : 1, transition: "all 0.2s",
                    }}>
                        {saving ? "Saving…" : "✓ Save Changes"}
                    </button>
                    <button type="button" onClick={onCancel} style={{
                        padding: "1rem 2rem", background: "transparent", color: C.muted,
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
