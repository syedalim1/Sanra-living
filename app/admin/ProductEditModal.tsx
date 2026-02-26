"use client";
import { useState } from "react";

const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";
const C = {
    bg: "#0A0A0A", panel: "#141414", card: "#1A1A1A", border: "#252525",
    accent: "#F0C040", accentDim: "#F0C04018", text: "#EDEDEA", muted: "#777",
    green: "#10B981", red: "#EF4444", blue: "#3B82F6",
};

interface Product {
    id: string; title: string; subtitle: string; price: number; category: string;
    finish: string; stock_status: string; stock_qty: number; image_url: string;
    hover_image_url: string; images?: string[]; description?: string;
    is_new: boolean; is_active: boolean; created_at: string;
}

export default function ProductEditModal({
    product, adminKey, onClose, onSaved,
}: {
    product: Product; adminKey: string;
    onClose: () => void; onSaved: (updated: Product) => void;
}) {
    const [vals, setVals] = useState({
        title: product.title, subtitle: product.subtitle, price: product.price,
        category: product.category, finish: product.finish,
        stock_status: product.stock_status, stock_qty: product.stock_qty,
        is_new: product.is_new,
        images: product.images?.length ? [...product.images] : [product.image_url, product.hover_image_url].filter(Boolean),
        description: product.description ?? "",
    });
    const [saving, setSaving] = useState(false);
    const [newUrl, setNewUrl] = useState("");
    const [activeThumb, setActiveThumb] = useState(0);

    const inp: React.CSSProperties = {
        background: "#0F0F0F", border: `1px solid ${C.border}`, color: C.text,
        fontSize: "0.85rem", fontFamily: FO, borderRadius: 6,
        padding: "0.625rem 0.875rem", width: "100%", boxSizing: "border-box",
    };
    const lbl: React.CSSProperties = {
        display: "block", fontSize: "0.6rem", fontWeight: 700, color: C.muted,
        fontFamily: FM, letterSpacing: "0.12em", textTransform: "uppercase",
        marginBottom: "0.375rem",
    };

    const addImg = () => {
        const u = newUrl.trim();
        if (!u) return;
        setVals(v => ({ ...v, images: [...v.images, u] }));
        setNewUrl("");
        setActiveThumb(vals.images.length);
    };
    const removeImg = (i: number) => {
        setVals(v => ({ ...v, images: v.images.filter((_, idx) => idx !== i) }));
        setActiveThumb(0);
    };
    const moveImg = (from: number, to: number) => {
        const imgs = [...vals.images];
        const [m] = imgs.splice(from, 1);
        imgs.splice(to, 0, m);
        setVals(v => ({ ...v, images: imgs }));
        setActiveThumb(to);
    };

    const save = async () => {
        setSaving(true);
        try {
            await fetch(`/api/admin/products?id=${product.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
                body: JSON.stringify({
                    ...vals,
                    image_url: vals.images[0] ?? product.image_url,
                    hover_image_url: vals.images[1] ?? product.hover_image_url,
                }),
            });
            onSaved({
                ...product, ...vals,
                image_url: vals.images[0] ?? product.image_url,
                hover_image_url: vals.images[1] ?? product.hover_image_url,
            } as Product);
        } catch (err) { console.error(err); }
        finally { setSaving(false); }
    };

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex" }} onClick={onClose}>
            <div style={{ flex: 1, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(2px)" }} />
            <div onClick={e => e.stopPropagation()} style={{
                width: "min(680px, 100vw)", background: C.panel, height: "100vh",
                overflowY: "auto", display: "flex", flexDirection: "column",
                borderLeft: `1px solid ${C.border}`,
            }}>
                {/* Header */}
                <div style={{ padding: "1.5rem 2rem", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: C.panel, zIndex: 5 }}>
                    <div>
                        <p style={{ fontSize: "0.6rem", color: C.accent, fontFamily: FM, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Edit Product</p>
                        <h2 style={{ fontSize: "1.1rem", fontWeight: 900, color: C.text, fontFamily: FM }}>{product.title}</h2>
                    </div>
                    <button onClick={onClose} style={{ background: "none", border: `1px solid ${C.border}`, color: C.muted, cursor: "pointer", padding: "0.4rem 0.75rem", borderRadius: 6, fontSize: "0.85rem", fontFamily: FO }}>✕</button>
                </div>

                <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "2rem", flex: 1 }}>
                    {/* ── IMAGES ── */}
                    <section>
                        <p style={{ fontSize: "0.6rem", fontWeight: 700, color: C.accent, fontFamily: FM, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem" }}>Product Images</p>
                        {vals.images.length > 0 ? (
                            <div style={{ aspectRatio: "16/9", background: "#111", borderRadius: 8, overflow: "hidden", marginBottom: "1rem", border: `1px solid ${C.border}` }}>
                                <img src={vals.images[activeThumb]} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                            </div>
                        ) : (
                            <div style={{ aspectRatio: "16/9", background: "#111", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem", border: `1px dashed ${C.border}` }}>
                                <p style={{ color: C.muted, fontFamily: FO, fontSize: "0.875rem" }}>No images — add URLs below</p>
                            </div>
                        )}
                        {vals.images.length > 0 && (
                            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                                {vals.images.map((img, i) => (
                                    <div key={i} style={{ position: "relative" }}>
                                        <div onClick={() => setActiveThumb(i)} style={{ width: 64, height: 64, background: "#111", borderRadius: 6, overflow: "hidden", cursor: "pointer", border: i === activeThumb ? `2px solid ${C.accent}` : `2px solid ${C.border}` }}>
                                            <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        </div>
                                        <div style={{ display: "flex", gap: 2, marginTop: 3, justifyContent: "center" }}>
                                            {i > 0 && <button onClick={() => moveImg(i, i - 1)} style={{ background: "none", border: `1px solid ${C.border}`, color: C.muted, cursor: "pointer", fontSize: "0.55rem", padding: "1px 4px", borderRadius: 3 }}>←</button>}
                                            {i < vals.images.length - 1 && <button onClick={() => moveImg(i, i + 1)} style={{ background: "none", border: `1px solid ${C.border}`, color: C.muted, cursor: "pointer", fontSize: "0.55rem", padding: "1px 4px", borderRadius: 3 }}>→</button>}
                                            <button onClick={() => removeImg(i)} style={{ background: "none", border: `1px solid ${C.red}33`, color: C.red, cursor: "pointer", fontSize: "0.55rem", padding: "1px 4px", borderRadius: 3 }}>✕</button>
                                        </div>
                                        {i === 0 && <div style={{ position: "absolute", top: -5, left: -5, background: C.accent, color: "#111", fontSize: "0.45rem", fontWeight: 900, fontFamily: FM, padding: "1px 4px", borderRadius: 8 }}>PRIMARY</div>}
                                    </div>
                                ))}
                            </div>
                        )}
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            <input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="Paste image URL…" onKeyDown={e => e.key === "Enter" && addImg()} style={{ ...inp, flex: 1, fontSize: "0.8rem" }} />
                            <button onClick={addImg} style={{ padding: "0 1rem", background: C.accent, color: "#111", fontWeight: 900, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", border: "none", cursor: "pointer", borderRadius: 6, fontFamily: FM }}>+ Add</button>
                        </div>
                    </section>

                    {/* ── FIELDS ── */}
                    <section>
                        <p style={{ fontSize: "0.6rem", fontWeight: 700, color: C.accent, fontFamily: FM, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem" }}>Basic Info</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                            <div style={{ gridColumn: "1/-1" }}><label style={lbl}>Title</label><input value={vals.title} onChange={e => setVals(v => ({ ...v, title: e.target.value }))} style={inp} /></div>
                            <div style={{ gridColumn: "1/-1" }}><label style={lbl}>Subtitle</label><input value={vals.subtitle} onChange={e => setVals(v => ({ ...v, subtitle: e.target.value }))} style={inp} /></div>
                            <div><label style={lbl}>Price (₹)</label><input type="number" value={vals.price} onChange={e => setVals(v => ({ ...v, price: Number(e.target.value) }))} style={inp} /></div>
                            <div><label style={lbl}>Stock Qty</label><input type="number" value={vals.stock_qty} onChange={e => setVals(v => ({ ...v, stock_qty: Number(e.target.value) }))} style={inp} /></div>
                            <div><label style={lbl}>Category</label><select value={vals.category} onChange={e => setVals(v => ({ ...v, category: e.target.value }))} style={{ ...inp, cursor: "pointer" }}>{["Entryway Storage", "Study Desks", "Wall Storage", "Bedroom", "Living Room", "Other"].map(c => <option key={c}>{c}</option>)}</select></div>
                            <div><label style={lbl}>Finish</label><select value={vals.finish} onChange={e => setVals(v => ({ ...v, finish: e.target.value }))} style={{ ...inp, cursor: "pointer" }}>{["Matte Black", "Graphite Grey", "White", "Bronze"].map(f => <option key={f}>{f}</option>)}</select></div>
                            <div><label style={lbl}>Stock Status</label><select value={vals.stock_status} onChange={e => setVals(v => ({ ...v, stock_status: e.target.value }))} style={{ ...inp, cursor: "pointer" }}>{["In Stock", "Only 12 Left", "Only 3 Left", "New", "Limited", "Out of Stock"].map(s => <option key={s}>{s}</option>)}</select></div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", paddingTop: "1.5rem" }}>
                                <input type="checkbox" checked={vals.is_new} onChange={e => setVals(v => ({ ...v, is_new: e.target.checked }))} style={{ width: 16, height: 16, accentColor: C.accent }} />
                                <span style={{ fontSize: "0.82rem", color: C.text, fontFamily: FO }}>New Arrival</span>
                            </div>
                        </div>
                    </section>

                    {/* ── DESCRIPTION ── */}
                    <section>
                        <p style={{ fontSize: "0.6rem", fontWeight: 700, color: C.accent, fontFamily: FM, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem" }}>Description</p>
                        <textarea value={vals.description} onChange={e => setVals(v => ({ ...v, description: e.target.value }))} rows={5} placeholder="Product description…" style={{ ...inp, resize: "vertical", lineHeight: 1.7 }} />
                    </section>
                </div>

                {/* Footer */}
                <div style={{ padding: "1.5rem 2rem", borderTop: `1px solid ${C.border}`, display: "flex", gap: "0.75rem", background: C.panel, position: "sticky", bottom: 0 }}>
                    <button onClick={save} disabled={saving} style={{ flex: 1, padding: "0.875rem", background: C.accent, color: "#111", fontWeight: 900, fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase", border: "none", cursor: saving ? "not-allowed" : "pointer", borderRadius: 6, fontFamily: FM, opacity: saving ? 0.7 : 1 }}>
                        {saving ? "Saving…" : "✓ Save Changes"}
                    </button>
                    <button onClick={onClose} style={{ padding: "0.875rem 1.5rem", background: "transparent", color: C.muted, fontWeight: 700, fontSize: "0.8rem", border: `1px solid ${C.border}`, cursor: "pointer", borderRadius: 6, fontFamily: FM }}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
