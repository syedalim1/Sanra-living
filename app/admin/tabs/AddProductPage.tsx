"use client";

import React, { useState, useEffect, useRef } from "react";
import { CATEGORIES } from "../constants";
import BasicProductInfo from "../components/BasicProductInfo";
import ProductMediaSection from "../components/ProductMediaSection";
import ProductDescriptionSection from "../components/ProductDescriptionSection";
import TrustFeaturesSection from "../components/TrustFeaturesSection";
import RelatedProductsSection from "../components/RelatedProductsSection";
import SeoSection from "../components/SeoSection";
import FaqSection from "../components/FaqSection";
import MobilePreviewSection from "../components/MobilePreviewSection";

interface Props { adminKey: string; onSaved: () => void; onCancel: () => void; }

export default function AddProductPage({ adminKey, onSaved, onCancel }: Props) {
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [openSection, setOpenSection] = useState<string>("basic");
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [hasUnsaved, setHasUnsaved] = useState(false);

    const [form, setForm] = useState({
        title: "", subtitle: "", category: CATEGORIES[0], badge: "", price: "", compare_at_price: "", stock_status: "In Stock", stock_qty: "99", image_url: "", images: [] as string[], image_style_preset: "Studio White", watermark_strength: "Medium", description: "", highlights: [] as string[], material: "", pipe_type: "", finish: "Matte Black", premium_finish: "", assembly_required: false, usage_environment: "", weight_capacity: "", height: "", width: "", depth: "", dimensions: "", weight_kg: "", warranty: "No Warranty", delivery_info: "Pan India Delivery Available", care_instructions: "", trust_features: [] as string[], related_products: ["", "", "", ""], seo_title: "", seo_description: "", faqs: [] as { question: string; answer: string }[], is_active: true, collection: "", is_featured: false, is_best_seller: false, is_new: false,
    });

    const formRef = useRef(form); formRef.current = form;
    const set = (field: string, value: unknown) => { setForm(f => ({ ...f, [field]: value })); setHasUnsaved(true); };
    const handleTrust = (feat: string) => { const cur = form.trust_features; if (cur.includes(feat)) set("trust_features", cur.filter(f => f !== feat)); else if (cur.length < 8) set("trust_features", [...cur, feat]); };
    const handleBadgeToggle = (badge: "featured" | "best_seller" | "new_arrival") => { if (badge === "featured") set("is_featured", !form.is_featured); if (badge === "best_seller") set("is_best_seller", !form.is_best_seller); if (badge === "new_arrival") set("is_new", !form.is_new); };

    useEffect(() => { const d = localStorage.getItem("sanra_product_draft"); if (d) { try { setForm(JSON.parse(d)); } catch {} } }, []);
    useEffect(() => { if (!hasUnsaved) return; const t = setTimeout(() => { localStorage.setItem("sanra_product_draft", JSON.stringify(formRef.current)); setLastSaved(new Date()); setHasUnsaved(false); }, 3000); return () => clearTimeout(t); }, [form, hasUnsaved]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || !form.price || !form.category) { setError("Title, Price, and Category are required."); return; }
        setSaving(true); setError("");
        try {
            const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
            const body = { title: form.title, subtitle: form.subtitle, price: Number(form.price), compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null, category: form.category, badge: form.badge, finish: form.finish, stock_status: form.stock_status, stock_qty: Number(form.stock_qty), image_url: form.image_url || (form.images[0] ?? ""), collection: form.collection || null, is_featured: form.is_featured, is_best_seller: form.is_best_seller, hover_image_url: form.images[1] ?? "", images: form.images, image_style_preset: form.image_style_preset, watermark_strength: form.watermark_strength, description: form.description, highlights: form.highlights.filter(Boolean), material: form.material, pipe_type: form.pipe_type, dimensions: form.dimensions, height: form.height, width: form.width, depth: form.depth, premium_finish: form.premium_finish, assembly_required: form.assembly_required, usage_environment: form.usage_environment, weight_capacity: form.weight_capacity, weight_kg: form.weight_kg ? Number(form.weight_kg) : null, warranty: form.warranty, delivery_info: form.delivery_info, care_instructions: form.care_instructions, trust_features: form.trust_features, related_products: form.related_products.filter(Boolean).join(", "), seo_title: form.seo_title, seo_description: form.seo_description, faqs: form.faqs.filter(f => f.question || f.answer), is_active: form.is_active, is_new: true, slug };
            const res = await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-key": adminKey }, body: JSON.stringify(body) });
            if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed"); }
            localStorage.removeItem("sanra_product_draft"); setSuccess(true);
        } catch (err) { setError(err instanceof Error ? err.message : "Failed to create product"); } finally { setSaving(false); }
    };

    if (success) {
        return (
            <div className="max-w-[440px] mx-auto mt-24 text-center bg-white border border-[var(--ap-border-light)] p-10 rounded-2xl shadow-[var(--ap-shadow-md)] ap-animate-scaleIn">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-7 text-xl bg-[rgba(16,185,129,0.08)] text-[#10B981]">✓</div>
                <h2 className="text-xl font-extrabold text-[var(--ap-text)] font-[family-name:var(--ap-font-heading)] mb-2 tracking-tight">Product Published</h2>
                <p className="text-sm text-[var(--ap-muted)] mb-8 leading-relaxed">Your product is now live on the store.</p>
                <div className="flex gap-3 justify-center flex-col sm:flex-row">
                    <button onClick={onSaved} className="px-6 py-3 bg-[var(--ap-accent)] text-white font-bold text-sm rounded-lg border-none cursor-pointer">← Back to Products</button>
                    <button onClick={() => window.open("/shop", "_blank")} className="px-6 py-3 bg-transparent border border-[var(--ap-border)] text-[var(--ap-text)] font-semibold text-sm rounded-lg cursor-pointer">View Store ↗</button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[820px] mx-auto">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-3">
                <div>
                    <button onClick={onCancel} className="bg-transparent border-none text-[var(--ap-muted-light)] cursor-pointer font-[family-name:var(--ap-font-heading)] text-[0.65rem] tracking-[0.12em] uppercase p-0 mb-2 flex items-center gap-1 hover:text-[var(--ap-text)] transition-colors">← Back to Products</button>
                    <h2 className="text-xl md:text-2xl font-extrabold text-[var(--ap-text)] font-[family-name:var(--ap-font-heading)] m-0 tracking-tight">Publish New Product</h2>
                </div>
                <button onClick={handleSubmit as any} disabled={saving} className="px-6 py-3 bg-[var(--ap-accent)] text-white font-bold text-sm rounded-lg border-none cursor-pointer font-[family-name:var(--ap-font-heading)] disabled:opacity-50 w-full sm:w-auto">
                    {saving ? "Publishing…" : "Publish Product"}
                </button>
            </div>

            {error && <div className="bg-[rgba(239,68,68,0.05)] border border-[rgba(239,68,68,0.15)] p-3.5 rounded-lg text-sm text-[var(--ap-danger)] flex items-center gap-2 mb-5 ap-animate-fadeIn"><span>⚠</span> {error}</div>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <BasicProductInfo title={form.title} subtitle={form.subtitle} category={form.category} stockStatus={form.stock_status} price={form.price} comparePrice={form.compare_at_price} collection={form.collection} isFeatured={form.is_featured} isBestSeller={form.is_best_seller} onChange={set} sectionNum={1} defaultOpen={true} />
                <ProductMediaSection images={form.images} onImagesChange={(imgs) => { set("images", imgs); if (imgs.length > 0) set("image_url", imgs[0]); else set("image_url", ""); }} imageStylePreset={form.image_style_preset} watermarkStrength={form.watermark_strength} onSettingsChange={(field, val) => set(field, val)} adminKey={adminKey} sectionNum={2} />
                <ProductDescriptionSection form={form} onChange={set} sectionNum={3} defaultOpen={openSection === "desc"} />
                <TrustFeaturesSection trustFeatures={form.trust_features} onToggle={handleTrust} isFeatured={form.is_featured} isBestSeller={form.is_best_seller} isNewArrival={form.is_new} onBadgeToggle={handleBadgeToggle} maxFeatures={8} sectionNum={4} />
                <RelatedProductsSection relatedProducts={form.related_products.filter(Boolean)} onChange={(products) => set("related_products", [...products, ...Array(4 - products.length).fill("")])} adminKey={adminKey} sectionNum={5} />
                <SeoSection seoTitle={form.seo_title} seoDescription={form.seo_description} productTitle={form.title} productPrice={form.price} onChange={(field, value) => set(field, value)} sectionNum={6} />
                <FaqSection faqs={form.faqs} onChange={(faqs) => set("faqs", faqs)} category={form.category} sectionNum={7} />
                <MobilePreviewSection form={form} lastSaved={lastSaved} hasUnsaved={hasUnsaved} />

                {/* Sticky Bottom Bar */}
                <div className="sticky bottom-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-gradient-to-t from-[var(--ap-bg)] via-[var(--ap-bg)] to-transparent pt-6 pb-2 z-20">
                    <label className="flex items-center gap-2 text-sm cursor-pointer flex-1">
                        <input type="checkbox" checked={form.is_active} onChange={e => set("is_active", e.target.checked)} className="w-[18px] h-[18px] accent-[var(--ap-accent)] rounded" />
                        Publish immediately
                    </label>
                    <div className="flex gap-3">
                        <button type="button" onClick={onCancel} className="bg-transparent border-none text-[var(--ap-danger)] font-semibold text-xs cursor-pointer font-[family-name:var(--ap-font-heading)] py-3 px-4">Discard</button>
                        <button type="submit" disabled={saving} className="px-8 py-3 bg-[var(--ap-accent)] text-white font-bold text-sm rounded-lg border-none cursor-pointer disabled:opacity-50 w-full sm:w-auto">
                            {saving ? "Publishing…" : "Publish Product"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
