"use client";

import React, { useState, useEffect, useRef } from "react";
import { C, FM, FO, CATEGORIES } from "../constants";
import BasicProductInfo from "../components/BasicProductInfo";
import ProductMediaSection from "../components/ProductMediaSection";
import ProductDescriptionSection from "../components/ProductDescriptionSection";
import TrustFeaturesSection from "../components/TrustFeaturesSection";
import RelatedProductsSection from "../components/RelatedProductsSection";
import SeoSection from "../components/SeoSection";
import FaqSection from "../components/FaqSection";
import MobilePreviewSection from "../components/MobilePreviewSection";

interface Props {
    adminKey: string;
    onSaved: () => void;
    onCancel: () => void;
}

export default function AddProductPage({ adminKey, onSaved, onCancel }: Props) {
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [openSection, setOpenSection] = useState<string>("basic");
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [hasUnsaved, setHasUnsaved] = useState(false);

    const [form, setForm] = useState({
        title: "", subtitle: "", category: CATEGORIES[0],
        badge: "", price: "", compare_at_price: "", stock_status: "In Stock",
        stock_qty: "99", image_url: "", images: [] as string[],
        image_style_preset: "Studio White", watermark_strength: "Medium",
        description: "", highlights: [] as string[],
        material: "", pipe_type: "", finish: "Matte Black",
        premium_finish: "", assembly_required: false, usage_environment: "", weight_capacity: "",
        height: "", width: "", depth: "",
        dimensions: "", weight_kg: "", warranty: "No Warranty",
        delivery_info: "Pan India Delivery Available", care_instructions: "",
        trust_features: [] as string[], related_products: ["", "", "", ""],
        seo_title: "", seo_description: "",
        faqs: [] as { question: string; answer: string }[],
        is_active: true,
        collection: "",
        is_featured: false,
        is_best_seller: false,
        is_new: false,
    });

    const formRef = useRef(form);
    formRef.current = form;

    const set = (field: string, value: unknown) => { setForm(f => ({ ...f, [field]: value })); setHasUnsaved(true); };

    const handleTrust = (feat: string) => {
        const cur = form.trust_features;
        if (cur.includes(feat)) set("trust_features", cur.filter(f => f !== feat));
        else if (cur.length < 8) set("trust_features", [...cur, feat]);
    };

    const handleBadgeToggle = (badge: "featured" | "best_seller" | "new_arrival") => {
        if (badge === "featured") set("is_featured", !form.is_featured);
        if (badge === "best_seller") set("is_best_seller", !form.is_best_seller);
        if (badge === "new_arrival") set("is_new", !form.is_new);
    };

    /* ── Auto-save draft every 3 seconds ── */
    useEffect(() => {
        const draft = localStorage.getItem("sanra_product_draft");
        if (draft) { try { setForm(JSON.parse(draft)); } catch {} }
    }, []);

    useEffect(() => {
        if (!hasUnsaved) return;
        const timer = setTimeout(() => {
            localStorage.setItem("sanra_product_draft", JSON.stringify(formRef.current));
            setLastSaved(new Date());
            setHasUnsaved(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, [form, hasUnsaved]);

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
                pipe_type: form.pipe_type, dimensions: form.dimensions,
                height: form.height, width: form.width, depth: form.depth,
                premium_finish: form.premium_finish, assembly_required: form.assembly_required,
                usage_environment: form.usage_environment, weight_capacity: form.weight_capacity,
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

    /* ── Success Screen ── */
    if (success) {
        return (
            <div className="admin-success">
                <div className="admin-success-icon" style={{ background: "rgba(16,185,129,0.08)", color: "#10B981" }}>✓</div>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#111", fontFamily: FM, margin: "0 0 0.5rem", letterSpacing: "-0.02em" }}>Product Published</h2>
                <p style={{ color: "#8C8C8C", fontFamily: FO, fontSize: "0.85rem", marginBottom: "2rem", lineHeight: 1.5 }}>Your product is now live on the store.</p>
                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                    <button onClick={onSaved} className="admin-btn-primary" style={{ padding: "0.75rem 1.5rem" }}>← Back to Products</button>
                    <button onClick={() => window.open("/shop", "_blank")} className="admin-btn-secondary" style={{ padding: "0.75rem 1.5rem" }}>View Store ↗</button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
                <div>
                    <button onClick={onCancel} style={{ background: "none", border: "none", color: "#B8B3AC", cursor: "pointer", fontFamily: FM, fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", padding: 0, marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "0.35rem", transition: "color 0.15s" }}
                        onMouseOver={e => (e.currentTarget.style.color = "#111")}
                        onMouseOut={e => (e.currentTarget.style.color = "#B8B3AC")}
                    >← Back to Products</button>
                    <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#111", fontFamily: FM, margin: 0, letterSpacing: "-0.02em" }}>Publish New Product</h2>
                </div>
                <button onClick={handleSubmit as any} disabled={saving} className="admin-btn-primary">
                    {saving ? "Publishing…" : "Publish Product"}
                </button>
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
                    defaultOpen={openSection === "desc"}
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
                    relatedProducts={form.related_products.filter(Boolean)}
                    onChange={(products) => set("related_products", [...products, ...Array(4 - products.length).fill("")])}
                    adminKey={adminKey}
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

                {/* Sticky Bottom Bar */}
                <div className="admin-sticky-bar" style={{ alignItems: "center" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", fontFamily: FO, color: "#111", cursor: "pointer", flex: 1 }}>
                        <input type="checkbox" checked={form.is_active} onChange={e => set("is_active", e.target.checked)} style={{ width: 18, height: 18, accentColor: "#111", borderRadius: 4 }} />
                        Publish immediately
                    </label>
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                        <button type="button" onClick={onCancel} style={{ background: "none", border: "none", color: "#EF4444", fontWeight: 600, fontSize: "0.75rem", cursor: "pointer", fontFamily: FM, padding: "0.7rem 1rem", transition: "opacity 0.15s" }}>Discard</button>
                        <button type="submit" disabled={saving} className="admin-btn-primary" style={{ padding: "0.75rem 2rem" }}>
                            {saving ? "Publishing…" : "Publish Product"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
