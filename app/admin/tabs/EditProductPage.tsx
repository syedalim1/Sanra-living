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

interface Props { product: Product; adminKey: string; onSaved: (updated: Product) => void; onCancel: () => void; onDelete: (id: string) => void; }

export default function EditProductPage({ product, adminKey, onSaved, onCancel, onDelete }: Props) {
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [hasUnsaved, setHasUnsaved] = useState(false);

    const [form, setForm] = useState({
        title: product.title ?? "", subtitle: product.subtitle ?? "", category: product.category ?? CATEGORIES[0], badge: (product as any).badge ?? "", price: String(product.price ?? ""), compare_at_price: product.compare_at_price ? String(product.compare_at_price) : "", stock_status: product.stock_status ?? "In Stock", stock_qty: String(product.stock_qty ?? 99), image_url: product.image_url ?? "", images: product.images?.length ? [...product.images] : [product.image_url, product.hover_image_url].filter(Boolean) as string[], image_style_preset: (product as any).image_style_preset ?? "Studio White", watermark_strength: (product as any).watermark_strength ?? "Medium", description: product.description ?? "", highlights: product.highlights ?? [], material: product.material ?? "", pipe_type: (product as any).pipe_type ?? "", finish: product.finish ?? "Matte Black", premium_finish: product.premium_finish ?? "", assembly_required: product.assembly_required ?? false, usage_environment: product.usage_environment ?? "", weight_capacity: product.weight_capacity ?? "", height: product.height ?? "", width: product.width ?? "", depth: product.depth ?? "", dimensions: product.dimensions ?? "", weight_kg: product.weight_kg ? String(product.weight_kg) : "", warranty: product.warranty ?? "No Warranty", delivery_info: product.delivery_info ?? "Pan India Delivery Available", care_instructions: product.care_instructions ?? "", trust_features: (product as any).trust_features ?? [], related_products: (() => { const rp = (product as any).related_products_ids ?? product.related_products; if (Array.isArray(rp)) return rp.filter(Boolean) as string[]; if (typeof rp === "string" && rp.trim()) return rp.split(",").map((s: string) => s.trim()).filter(Boolean); return [] as string[]; })(), seo_title: product.seo_title ?? "", seo_description: product.seo_description ?? "", faqs: product.faqs ?? [], is_active: product.is_active ?? true, collection: product.collection ?? "", is_featured: product.is_featured ?? false, is_best_seller: product.is_best_seller ?? false, is_new: product.is_new ?? false,
    });

    const formRef = useRef(form); formRef.current = form;
    const set = (field: string, value: unknown) => { setForm(f => ({ ...f, [field]: value })); setHasUnsaved(true); };

    const handleTrust = useCallback((feat: string) => { setForm(f => { const cur = f.trust_features ?? []; if (cur.includes(feat)) return { ...f, trust_features: cur.filter((x: string) => x !== feat) }; if (cur.length >= 8) return f; return { ...f, trust_features: [...cur, feat] }; }); setHasUnsaved(true); }, []);
    const handleBadgeToggle = useCallback((badge: "featured" | "best_seller" | "new_arrival") => { if (badge === "featured") setForm(f => ({ ...f, is_featured: !f.is_featured })); if (badge === "best_seller") setForm(f => ({ ...f, is_best_seller: !f.is_best_seller })); if (badge === "new_arrival") setForm(f => ({ ...f, is_new: !f.is_new })); setHasUnsaved(true); }, []);

    useEffect(() => { const d = localStorage.getItem(`sanra_draft_${product.id}`); if (d) { try { setForm(JSON.parse(d)); } catch {} } }, [product.id]);
    useEffect(() => { if (!hasUnsaved) return; const t = setTimeout(() => { localStorage.setItem(`sanra_draft_${product.id}`, JSON.stringify(formRef.current)); setLastSaved(new Date()); setHasUnsaved(false); }, 3000); return () => clearTimeout(t); }, [form, hasUnsaved, product.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim()) { setError("Title is required."); return; }
        if (!form.price || isNaN(Number(form.price))) { setError("A valid price is required."); return; }
        setSaving(true); setError("");
        try {
            const body = { title: form.title.trim(), subtitle: form.subtitle, price: Number(form.price), compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null, category: form.category, badge: form.badge, finish: form.finish, stock_status: form.stock_status, stock_qty: Number(form.stock_qty) || 0, image_url: form.images[0] ?? product.image_url ?? "", hover_image_url: form.images[1] ?? product.hover_image_url ?? "", images: form.images, image_style_preset: form.image_style_preset, watermark_strength: form.watermark_strength, description: form.description.trim(), highlights: form.highlights.filter(Boolean), material: form.material, pipe_type: form.pipe_type, premium_finish: form.premium_finish, assembly_required: form.assembly_required, usage_environment: form.usage_environment, weight_capacity: form.weight_capacity, height: form.height, width: form.width, depth: form.depth, dimensions: form.dimensions.trim() || null, weight_kg: form.weight_kg ? Number(form.weight_kg) : null, warranty: form.warranty, delivery_info: form.delivery_info, care_instructions: form.care_instructions, trust_features: form.trust_features ?? [], related_products: (form.related_products || []).filter(Boolean).join(", "), seo_title: form.seo_title, seo_description: form.seo_description, faqs: form.faqs.filter(f => f.question || f.answer), is_active: form.is_active, is_new: form.is_new, collection: form.collection || null, is_featured: form.is_featured, is_best_seller: form.is_best_seller };
            const res = await fetch(`/api/admin/products?id=${product.id}`, { method: "PATCH", headers: { "Content-Type": "application/json", "x-admin-key": adminKey }, body: JSON.stringify(body) });
            if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Failed to update product"); }
            localStorage.removeItem(`sanra_draft_${product.id}`);
            const updatedProduct = await res.json(); onSaved(updatedProduct.product || updatedProduct); setSuccess(true);
        } catch (err) { setError(err instanceof Error ? err.message : "Something went wrong."); } finally { setSaving(false); }
    };

    if (success) {
        return (
            <div className="max-w-[440px] mx-auto mt-24 text-center bg-white border border-[var(--ap-border-light)] p-10 rounded-2xl shadow-[var(--ap-shadow-md)] ap-animate-scaleIn">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-7 text-xl bg-[rgba(16,185,129,0.08)] text-[#10B981]">✓</div>
                <h2 className="text-xl font-extrabold text-[var(--ap-text)] font-[family-name:var(--ap-font-heading)] mb-2 tracking-tight">Product Updated</h2>
                <p className="text-sm text-[var(--ap-muted)] mb-8 leading-relaxed">Changes have been published to the store.</p>
                <div className="flex gap-3 justify-center flex-col sm:flex-row">
                    <button onClick={onCancel} className="px-6 py-3 bg-[var(--ap-accent)] text-white font-bold text-sm rounded-lg border-none cursor-pointer">← Back to Products</button>
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
                    <h2 className="text-xl md:text-2xl font-extrabold text-[var(--ap-text)] font-[family-name:var(--ap-font-heading)] m-0 tracking-tight">Edit Product</h2>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[0.6rem] font-bold tracking-wider uppercase font-[family-name:var(--ap-font-heading)] ${form.is_active ? "bg-[rgba(16,185,129,0.08)] text-[#10B981]" : "bg-[rgba(239,68,68,0.08)] text-[#EF4444]"}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {form.is_active ? "Live" : "Hidden"}
                    </span>
                    <button onClick={handleSubmit as any} disabled={saving} className="px-6 py-3 bg-[var(--ap-accent)] text-white font-bold text-sm rounded-lg border-none cursor-pointer font-[family-name:var(--ap-font-heading)] disabled:opacity-50">
                        {saving ? "Saving…" : "Save Changes"}
                    </button>
                </div>
            </div>

            {error && <div className="bg-[rgba(239,68,68,0.05)] border border-[rgba(239,68,68,0.15)] p-3.5 rounded-lg text-sm text-[var(--ap-danger)] flex items-center gap-2 mb-5 ap-animate-fadeIn"><span>⚠</span> {error}</div>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <BasicProductInfo title={form.title} subtitle={form.subtitle} category={form.category} stockStatus={form.stock_status} price={form.price} comparePrice={form.compare_at_price} collection={form.collection} isFeatured={form.is_featured} isBestSeller={form.is_best_seller} onChange={set} sectionNum={1} defaultOpen={true} />
                <ProductMediaSection images={form.images} onImagesChange={(imgs) => { set("images", imgs); if (imgs.length > 0) set("image_url", imgs[0]); else set("image_url", ""); }} imageStylePreset={form.image_style_preset} watermarkStrength={form.watermark_strength} onSettingsChange={(field, val) => set(field, val)} adminKey={adminKey} sectionNum={2} />
                <ProductDescriptionSection form={form} onChange={set} sectionNum={3} />
                <TrustFeaturesSection trustFeatures={form.trust_features} onToggle={handleTrust} isFeatured={form.is_featured} isBestSeller={form.is_best_seller} isNewArrival={form.is_new} onBadgeToggle={handleBadgeToggle} maxFeatures={8} sectionNum={4} />
                <RelatedProductsSection relatedProducts={(form.related_products || []).filter(Boolean)} onChange={(products) => set("related_products", products)} adminKey={adminKey} currentProductId={product.id} sectionNum={5} />
                <SeoSection seoTitle={form.seo_title} seoDescription={form.seo_description} productTitle={form.title} productPrice={form.price} onChange={(field, value) => set(field, value)} sectionNum={6} />
                <FaqSection faqs={form.faqs} onChange={(faqs) => set("faqs", faqs)} category={form.category} sectionNum={7} />
                <MobilePreviewSection form={form} lastSaved={lastSaved} hasUnsaved={hasUnsaved} />

                {/* Danger Zone */}
                <section className="bg-[rgba(239,68,68,0.03)] border border-[rgba(239,68,68,0.1)] rounded-2xl p-5 md:p-6">
                    <p className="text-[0.62rem] font-bold tracking-[0.18em] uppercase text-[var(--ap-danger)] font-[family-name:var(--ap-font-heading)] mb-5">Danger Zone</p>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                        <div>
                            <p className="text-sm text-[var(--ap-text)] font-[family-name:var(--ap-font-heading)] font-bold">Delete Product</p>
                            <p className="text-xs text-[var(--ap-muted)] mt-1">This action cannot be undone.</p>
                        </div>
                        {!deleteConfirm ? (
                            <button type="button" onClick={() => setDeleteConfirm(true)} className="px-4 py-2 bg-transparent border border-[rgba(239,68,68,0.3)] text-[var(--ap-danger)] text-[0.62rem] font-bold tracking-wider uppercase rounded-lg cursor-pointer w-full sm:w-auto">Delete</button>
                        ) : (
                            <div className="flex gap-2">
                                <button type="button" onClick={() => onDelete(product.id)} className="px-4 py-2 bg-[var(--ap-danger)] text-white text-[0.62rem] font-bold tracking-wider uppercase rounded-lg border-none cursor-pointer">Confirm Delete</button>
                                <button type="button" onClick={() => setDeleteConfirm(false)} className="px-4 py-2 bg-transparent border border-[var(--ap-border)] text-[var(--ap-text)] text-[0.62rem] font-bold tracking-wider uppercase rounded-lg cursor-pointer">Cancel</button>
                            </div>
                        )}
                    </div>
                </section>

                {/* Sticky Bottom Bar */}
                <div className="sticky bottom-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-gradient-to-t from-[var(--ap-bg)] via-[var(--ap-bg)] to-transparent pt-6 pb-2 z-20">
                    <label className="flex items-center gap-2 text-sm cursor-pointer flex-1">
                        <input type="checkbox" checked={form.is_active} onChange={e => set("is_active", e.target.checked)} className="w-[18px] h-[18px] accent-[var(--ap-accent)] rounded" />
                        Published
                    </label>
                    <div className="flex gap-3">
                        <button type="button" onClick={onCancel} className="bg-transparent border-none text-[var(--ap-muted)] font-semibold text-xs cursor-pointer font-[family-name:var(--ap-font-heading)] py-3 px-4">Cancel</button>
                        <button type="submit" disabled={saving} className="px-8 py-3 bg-[var(--ap-accent)] text-white font-bold text-sm rounded-lg border-none cursor-pointer disabled:opacity-50 w-full sm:w-auto">
                            {saving ? "Saving…" : "Save Changes"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
