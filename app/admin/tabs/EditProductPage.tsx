"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { FM, FO, CATEGORIES } from "../constants";
import BasicProductInfo from "../components/BasicProductInfo";
import ProductMediaSection from "../components/ProductMediaSection";
import ProductDescriptionSection from "../components/ProductDescriptionSection";
import TrustFeaturesSection from "../components/TrustFeaturesSection";
import RelatedProductsSection from "../components/RelatedProductsSection";
import SeoSection from "../components/SeoSection";
import FaqSection from "../components/FaqSection";
import MobilePreviewSection from "../components/MobilePreviewSection";
import type { Product } from "../types";

interface Props {
    product: Product;
    adminKey: string;
    onSaved: (updated: Product) => void;
    onCancel: () => void;
    onDelete: (id: string) => void;
}

export default function EditProductPage({ product, adminKey, onSaved, onCancel, onDelete }: Props) {
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [hasUnsaved, setHasUnsaved] = useState(false);

    /* ── Form state — mirrors AddProductPage fields exactly ── */
    const [form, setForm] = useState({
        title: product.title ?? "",
        subtitle: product.subtitle ?? "",
        category: product.category ?? CATEGORIES[0],
        badge: (product as any).badge ?? "",
        price: String(product.price ?? ""),
        compare_at_price: product.compare_at_price ? String(product.compare_at_price) : "",
        stock_status: product.stock_status ?? "In Stock",
        stock_qty: String(product.stock_qty ?? 99),
        image_url: product.image_url ?? "",
        images: product.images?.length
            ? [...product.images]
            : [product.image_url, product.hover_image_url].filter(Boolean) as string[],
        image_style_preset: (product as any).image_style_preset ?? "Studio White",
        watermark_strength: (product as any).watermark_strength ?? "Medium",
        description: product.description ?? "",
        highlights: product.highlights ?? [],
        material: product.material ?? "",
        pipe_type: (product as any).pipe_type ?? "",
        finish: product.finish ?? "Matte Black",
        premium_finish: product.premium_finish ?? "",
        assembly_required: product.assembly_required ?? false,
        usage_environment: product.usage_environment ?? "",
        weight_capacity: product.weight_capacity ?? "",
        height: product.height ?? "",
        width: product.width ?? "",
        depth: product.depth ?? "",
        dimensions: product.dimensions ?? "",
        weight_kg: product.weight_kg ? String(product.weight_kg) : "",
        warranty: product.warranty ?? "No Warranty",
        delivery_info: product.delivery_info ?? "Pan India Delivery Available",
        care_instructions: product.care_instructions ?? "",
        trust_features: (product as any).trust_features ?? [],
        related_products: (() => {
            const rp = (product as any).related_products_ids ?? product.related_products;
            if (Array.isArray(rp)) return rp.filter(Boolean) as string[];
            if (typeof rp === "string" && rp.trim()) return rp.split(",").map((s: string) => s.trim()).filter(Boolean);
            return [] as string[];
        })(),
        seo_title: product.seo_title ?? "",
        seo_description: product.seo_description ?? "",
        faqs: product.faqs ?? [],
        is_active: product.is_active ?? true,
        collection: product.collection ?? "",
        is_featured: product.is_featured ?? false,
        is_best_seller: product.is_best_seller ?? false,
        is_new: product.is_new ?? false,
    });

    const formRef = useRef(form);
    formRef.current = form;

    const set = (field: string, value: unknown) => { setForm(f => ({ ...f, [field]: value })); setHasUnsaved(true); };

    /* ── Trust & Badge handlers — identical to AddProductPage ── */
    const handleTrust = useCallback((feat: string) => {
        setForm(f => {
            const cur = f.trust_features ?? [];
            if (cur.includes(feat)) return { ...f, trust_features: cur.filter((x: string) => x !== feat) };
            if (cur.length >= 8) return f;
            return { ...f, trust_features: [...cur, feat] };
        });
        setHasUnsaved(true);
    }, []);

    const handleBadgeToggle = useCallback((badge: "featured" | "best_seller" | "new_arrival") => {
        if (badge === "featured") setForm(f => ({ ...f, is_featured: !f.is_featured }));
        if (badge === "best_seller") setForm(f => ({ ...f, is_best_seller: !f.is_best_seller }));
        if (badge === "new_arrival") setForm(f => ({ ...f, is_new: !f.is_new }));
        setHasUnsaved(true);
    }, []);

    /* ── Auto-save draft every 3 seconds ── */
    useEffect(() => {
        const draft = localStorage.getItem(`sanra_draft_${product.id}`);
        if (draft) { try { setForm(JSON.parse(draft)); } catch {} }
    }, [product.id]);

    useEffect(() => {
        if (!hasUnsaved) return;
        const timer = setTimeout(() => {
            localStorage.setItem(`sanra_draft_${product.id}`, JSON.stringify(formRef.current));
            setLastSaved(new Date());
            setHasUnsaved(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, [form, hasUnsaved, product.id]);

    /* ── Submit — PATCH product ── */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim()) { setError("Title is required."); return; }
        if (!form.price || isNaN(Number(form.price))) { setError("A valid price is required."); return; }

        setSaving(true);
        setError("");
        try {
            const body = {
                title: form.title.trim(),
                subtitle: form.subtitle,
                price: Number(form.price),
                compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
                category: form.category,
                badge: form.badge,
                finish: form.finish,
                stock_status: form.stock_status,
                stock_qty: Number(form.stock_qty) || 0,
                image_url: form.images[0] ?? product.image_url ?? "",
                hover_image_url: form.images[1] ?? product.hover_image_url ?? "",
                images: form.images,
                image_style_preset: form.image_style_preset,
                watermark_strength: form.watermark_strength,
                description: form.description.trim(),
                highlights: form.highlights.filter(Boolean),
                material: form.material,
                pipe_type: form.pipe_type,
                premium_finish: form.premium_finish,
                assembly_required: form.assembly_required,
                usage_environment: form.usage_environment,
                weight_capacity: form.weight_capacity,
                height: form.height,
                width: form.width,
                depth: form.depth,
                dimensions: form.dimensions.trim() || null,
                weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
                warranty: form.warranty,
                delivery_info: form.delivery_info,
                care_instructions: form.care_instructions,
                trust_features: form.trust_features ?? [],
                related_products: (form.related_products || []).filter(Boolean).join(", "),
                seo_title: form.seo_title,
                seo_description: form.seo_description,
                faqs: form.faqs.filter(f => f.question || f.answer),
                is_active: form.is_active,
                is_new: form.is_new,
                collection: form.collection || null,
                is_featured: form.is_featured,
                is_best_seller: form.is_best_seller,
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

            localStorage.removeItem(`sanra_draft_${product.id}`);
            const updatedProduct = await res.json();
            onSaved(updatedProduct.product || updatedProduct);
            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
        } finally { setSaving(false); }
    };

    /* ── Success Screen ── */
    if (success) {
        return (
            <div className="admin-success">
                <div className="admin-success-icon" style={{ background: "rgba(16,185,129,0.08)", color: "#10B981" }}>✓</div>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#111", fontFamily: FM, margin: "0 0 0.5rem", letterSpacing: "-0.02em" }}>Product Updated</h2>
                <p style={{ color: "#8C8C8C", fontFamily: FO, fontSize: "0.85rem", marginBottom: "2rem", lineHeight: 1.5 }}>Changes have been published to the store.</p>
                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                    <button onClick={onCancel} className="admin-btn-primary" style={{ padding: "0.75rem 1.5rem" }}>← Back to Products</button>
                    <button onClick={() => window.open("/shop", "_blank")} className="admin-btn-secondary" style={{ padding: "0.75rem 1.5rem" }}>View Store ↗</button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
            {/* Header — same layout as AddProductPage */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
                <div>
                    <button onClick={onCancel} style={{ background: "none", border: "none", color: "#B8B3AC", cursor: "pointer", fontFamily: FM, fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", padding: 0, marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "0.35rem", transition: "color 0.15s" }}
                        onMouseOver={e => (e.currentTarget.style.color = "#111")}
                        onMouseOut={e => (e.currentTarget.style.color = "#B8B3AC")}
                    >← Back to Products</button>
                    <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#111", fontFamily: FM, margin: 0, letterSpacing: "-0.02em" }}>Edit Product</h2>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{
                        display: "inline-flex", alignItems: "center", gap: "0.35rem",
                        padding: "0.35rem 0.85rem", borderRadius: 99,
                        fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: FM,
                        background: form.is_active ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
                        color: form.is_active ? "#10B981" : "#EF4444",
                    }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor" }} />
                        {form.is_active ? "Live" : "Hidden"}
                    </span>
                    <button onClick={handleSubmit as any} disabled={saving} className="admin-btn-primary">
                        {saving ? "Saving…" : "Save Changes"}
                    </button>
                </div>
            </div>

            {error && (
                <div className="admin-error" style={{ marginBottom: "1.25rem" }}>
                    <span style={{ fontSize: "0.85rem" }}>⚠</span> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                {/* 1. BASIC INFO */}
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

                {/* 2. MEDIA */}
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

                {/* 3. DESCRIPTION & SPECS */}
                <ProductDescriptionSection
                    form={form}
                    onChange={set}
                    sectionNum={3}
                />

                {/* 4. TRUST & PREMIUM FEATURES */}
                <TrustFeaturesSection
                    trustFeatures={form.trust_features}
                    onToggle={handleTrust}
                    isFeatured={form.is_featured}
                    isBestSeller={form.is_best_seller}
                    isNewArrival={form.is_new}
                    onBadgeToggle={handleBadgeToggle}
                    maxFeatures={8}
                    sectionNum={4}
                />

                {/* 5. RELATED PRODUCTS */}
                <RelatedProductsSection
                    relatedProducts={(form.related_products || []).filter(Boolean)}
                    onChange={(products) => set("related_products", products)}
                    adminKey={adminKey}
                    currentProductId={product.id}
                    sectionNum={5}
                />

                {/* 6. SEO */}
                <SeoSection
                    seoTitle={form.seo_title}
                    seoDescription={form.seo_description}
                    productTitle={form.title}
                    productPrice={form.price}
                    onChange={(field, value) => set(field, value)}
                    sectionNum={6}
                />

                {/* 7. FAQ */}
                <FaqSection
                    faqs={form.faqs}
                    onChange={(faqs) => set("faqs", faqs)}
                    category={form.category}
                    sectionNum={7}
                />

                {/* 8. QUALITY SCORE & MOBILE PREVIEW */}
                <MobilePreviewSection
                    form={form}
                    lastSaved={lastSaved}
                    hasUnsaved={hasUnsaved}
                />

                {/* Danger Zone */}
                <section style={{ background: "rgba(239,68,68,0.03)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: 14, padding: "1.5rem 1.75rem" }}>
                    <p style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#EF4444", fontFamily: FM, marginBottom: "1.25rem" }}>Danger Zone</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <p style={{ fontSize: "0.85rem", color: "#111", fontFamily: FM, fontWeight: 700 }}>Delete Product</p>
                            <p style={{ fontSize: "0.72rem", color: "#8C8C8C", fontFamily: FO, marginTop: "0.25rem" }}>This action cannot be undone.</p>
                        </div>
                        {!deleteConfirm ? (
                            <button type="button" onClick={() => setDeleteConfirm(true)} className="admin-btn-secondary" style={{ borderColor: "rgba(239,68,68,0.3)", color: "#EF4444", padding: "0.5rem 1rem", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                                Delete
                            </button>
                        ) : (
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button type="button" onClick={() => onDelete(product.id)} className="admin-btn-primary" style={{ background: "#EF4444", padding: "0.5rem 1rem", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                                    Confirm Delete
                                </button>
                                <button type="button" onClick={() => setDeleteConfirm(false)} className="admin-btn-secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* Sticky Bottom Bar — same as AddProductPage */}
                <div className="admin-sticky-bar" style={{ alignItems: "center" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", fontFamily: FO, color: "#111", cursor: "pointer", flex: 1 }}>
                        <input type="checkbox" checked={form.is_active} onChange={e => set("is_active", e.target.checked)} style={{ width: 18, height: 18, accentColor: "#111", borderRadius: 4 }} />
                        Published
                    </label>
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                        <button type="button" onClick={onCancel} style={{ background: "none", border: "none", color: "#8C8C8C", fontWeight: 600, fontSize: "0.75rem", cursor: "pointer", fontFamily: FM, padding: "0.7rem 1rem", transition: "opacity 0.15s" }}>Cancel</button>
                        <button type="submit" disabled={saving} className="admin-btn-primary" style={{ padding: "0.75rem 2rem" }}>
                            {saving ? "Saving…" : "Save Changes"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
