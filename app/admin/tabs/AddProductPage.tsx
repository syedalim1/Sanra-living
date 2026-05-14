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

const PRODUCT_TYPES = ["SS", "MS", "Luxury", "Foldable", "Commercial"];
const BADGES = ["Bestseller", "New Arrival", "Premium Choice", "Limited Edition"];
const IMAGE_PRESETS = ["Studio White", "Luxury Interior", "Warm Minimal", "Dark Premium"];
const WATERMARK_OPTIONS = ["Soft", "Medium", "Strong"];
// TRUST_OPTIONS kept for reference — now driven by TrustFeaturesSection component

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

                {/* 3. DESCRIPTION & SPECS */}
                <ProductDescriptionSection
                    form={form}
                    onChange={set}
                    sectionNum={3}
                    defaultOpen={openSection === "desc"}
                />

                {/* 4. TRUST & PREMIUM FEATURES — Luxury card system */}
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

                {/* 5. RELATED PRODUCTS — Luxury searchable component */}
                <RelatedProductsSection
                    relatedProducts={form.related_products.filter(Boolean)}
                    onChange={(products) => set("related_products", [...products, ...Array(4 - products.length).fill("")])}
                    adminKey={adminKey}
                    sectionNum={5}
                />

                {/* 6. SEO — Premium component */}
                <SeoSection
                    seoTitle={form.seo_title}
                    seoDescription={form.seo_description}
                    productTitle={form.title}
                    productPrice={form.price}
                    onChange={(field, value) => set(field, value)}
                    sectionNum={6}
                />

                {/* 7. FAQ — Premium accordion component */}
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
