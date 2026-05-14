"use client";

import React, { useState } from "react";
import { fmt, fmtDate, COUPON_TYPES } from "../constants";
import type { Coupon } from "../types";

interface Props {
    coupons: Coupon[];
    adminKey: string;
    onCouponCreated: () => void;
    onCouponUpdated: (updated: Coupon) => void;
    onCouponDeleted: (id: string) => void;
}

export default function CouponsTab({ coupons, adminKey, onCouponCreated, onCouponUpdated, onCouponDeleted }: Props) {
    const [showAdd, setShowAdd] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [form, setForm] = useState({ code: "", description: "", discount_type: "percentage", discount_value: "", min_order_amount: "0", max_discount: "", max_uses: "100", expires_at: "" });

    const hdrs = { "Content-Type": "application/json", "x-admin-key": adminKey };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault(); setSaving(true);
        try {
            const res = await fetch("/api/admin/coupons", { method: "POST", headers: hdrs, body: JSON.stringify({ ...form, discount_value: Number(form.discount_value), min_order_amount: Number(form.min_order_amount), max_discount: form.max_discount ? Number(form.max_discount) : null, max_uses: Number(form.max_uses), expires_at: form.expires_at || null }) });
            if (!res.ok) throw new Error("Failed");
            setShowAdd(false); setForm({ code: "", description: "", discount_type: "percentage", discount_value: "", min_order_amount: "0", max_discount: "", max_uses: "100", expires_at: "" }); onCouponCreated();
        } catch (err) { console.error(err); } finally { setSaving(false); }
    };

    const toggleActive = async (c: Coupon) => { await fetch(`/api/admin/coupons?id=${c.id}`, { method: "PATCH", headers: hdrs, body: JSON.stringify({ is_active: !c.is_active }) }); onCouponUpdated({ ...c, is_active: !c.is_active }); };
    const deleteCoupon = async (id: string) => { await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE", headers: { "x-admin-key": adminKey } }); onCouponDeleted(id); setDeleteConfirm(null); };
    const copyCode = (code: string) => { navigator.clipboard.writeText(code); setCopiedCode(code); setTimeout(() => setCopiedCode(null), 2000); };

    const filtered = coupons.filter(c => { const q = searchQuery.toLowerCase(); return !q || c.code.toLowerCase().includes(q) || c.description.toLowerCase().includes(q); });
    const isExpired = (c: Coupon) => c.expires_at && new Date(c.expires_at) < new Date();
    const isMaxed = (c: Coupon) => c.used_count >= c.max_uses;

    const lbl = "block text-[0.6rem] font-bold text-[var(--ap-muted)] font-[family-name:var(--ap-font-heading)] tracking-[0.12em] uppercase mb-1.5";
    const inp = "w-full px-3.5 py-2.5 bg-white border border-[var(--ap-border)] text-[var(--ap-text)] text-sm font-[family-name:var(--ap-font-body)] rounded-lg outline-none focus:border-[var(--ap-accent)] transition-colors";

    return (
        <div>
            <div className="flex flex-col sm:flex-row gap-3 mb-5 items-stretch sm:items-center">
                <input placeholder="Search coupons…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className={`${inp} sm:max-w-[280px]`} />
                <span className="text-xs text-[var(--ap-muted)]">{filtered.length} coupons</span>
                <button onClick={() => setShowAdd(v => !v)} className={`px-5 py-2.5 font-black text-xs tracking-[0.12em] uppercase border cursor-pointer rounded-lg font-[family-name:var(--ap-font-heading)] sm:ml-auto transition-colors ${showAdd ? "bg-transparent border-[var(--ap-border)] text-[var(--ap-muted)]" : "bg-[var(--ap-accent)] border-[var(--ap-accent)] text-white"}`}>
                    {showAdd ? "✕ Cancel" : "+ Create Coupon"}
                </button>
            </div>

            {showAdd && (
                <form onSubmit={handleAdd} className="bg-white border border-[var(--ap-border)] p-5 rounded-xl mb-6 ap-animate-fadeIn">
                    <p className="text-[0.65rem] font-bold tracking-[0.2em] uppercase text-[var(--ap-accent)] font-[family-name:var(--ap-font-heading)] mb-5">New Coupon</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div><label className={lbl}>Code *</label><input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="e.g. WELCOME20" className={`${inp} uppercase tracking-wider font-bold`} required /></div>
                        <div><label className={lbl}>Description</label><input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={inp} /></div>
                        <div><label className={lbl}>Type *</label><select value={form.discount_type} onChange={e => setForm(f => ({ ...f, discount_type: e.target.value }))} className={`${inp} cursor-pointer`}><option value="percentage">Percentage (%)</option><option value="flat">Flat (₹)</option></select></div>
                        <div><label className={lbl}>Value *</label><input type="number" value={form.discount_value} onChange={e => setForm(f => ({ ...f, discount_value: e.target.value }))} className={inp} required /></div>
                        <div><label className={lbl}>Min Order (₹)</label><input type="number" value={form.min_order_amount} onChange={e => setForm(f => ({ ...f, min_order_amount: e.target.value }))} className={inp} /></div>
                        {form.discount_type === "percentage" && <div><label className={lbl}>Max Cap (₹)</label><input type="number" value={form.max_discount} onChange={e => setForm(f => ({ ...f, max_discount: e.target.value }))} className={inp} /></div>}
                        <div><label className={lbl}>Max Uses</label><input type="number" value={form.max_uses} onChange={e => setForm(f => ({ ...f, max_uses: e.target.value }))} className={inp} /></div>
                        <div><label className={lbl}>Expires At</label><input type="datetime-local" value={form.expires_at} onChange={e => setForm(f => ({ ...f, expires_at: e.target.value }))} className={inp} /></div>
                    </div>
                    <button type="submit" disabled={saving} className="mt-5 px-6 py-3 bg-[var(--ap-accent)] text-white font-black text-xs tracking-[0.12em] uppercase border-none cursor-pointer rounded-lg disabled:opacity-70">{saving ? "Creating…" : "Create Coupon"}</button>
                </form>
            )}

            {filtered.length === 0 ? (
                <p className="text-[var(--ap-muted)] py-16 text-center">No coupons yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map(coupon => {
                        const expired = isExpired(coupon); const maxed = isMaxed(coupon);
                        const sc = !coupon.is_active ? "#EF4444" : expired ? "#F59E0B" : maxed ? "#F97316" : "#10B981";
                        const st = !coupon.is_active ? "Inactive" : expired ? "Expired" : maxed ? "Maxed" : "Active";
                        return (
                            <div key={coupon.id} className={`bg-white border border-[var(--ap-border)] rounded-xl p-5 ${(!coupon.is_active || expired) ? "opacity-60" : ""}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span onClick={() => copyCode(coupon.code)} className="text-lg font-black text-[var(--ap-accent)] font-[family-name:var(--ap-font-heading)] tracking-wider cursor-pointer">{coupon.code}</span>
                                            {copiedCode === coupon.code && <span className="text-[0.6rem] text-[#10B981]">COPIED!</span>}
                                        </div>
                                        {coupon.description && <p className="text-sm text-[var(--ap-muted)] truncate">{coupon.description}</p>}
                                    </div>
                                    <span className="px-2.5 py-1 rounded text-[0.6rem] font-bold tracking-wider uppercase shrink-0" style={{ background: `${sc}22`, color: sc }}>{st}</span>
                                </div>
                                <div className="inline-block px-4 py-2 rounded-lg mb-4" style={{ background: "rgba(17,17,17,0.06)", border: "1px solid rgba(17,17,17,0.15)" }}>
                                    <span className="text-2xl font-black text-[var(--ap-accent)] font-[family-name:var(--ap-font-heading)]">{coupon.discount_type === "percentage" ? `${coupon.discount_value}%` : fmt(coupon.discount_value)}</span>
                                    <span className="text-xs text-[var(--ap-muted)] ml-2">{COUPON_TYPES[coupon.discount_type]}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-4 text-[0.55rem]">
                                    <div><p className="text-[var(--ap-muted)] font-[family-name:var(--ap-font-heading)] tracking-[0.12em] uppercase">Min Order</p><p className="text-sm font-bold text-[var(--ap-text)]">{fmt(coupon.min_order_amount)}</p></div>
                                    {coupon.max_discount && <div><p className="text-[var(--ap-muted)] font-[family-name:var(--ap-font-heading)] tracking-[0.12em] uppercase">Max Disc</p><p className="text-sm font-bold text-[var(--ap-text)]">{fmt(coupon.max_discount)}</p></div>}
                                    <div><p className="text-[var(--ap-muted)] font-[family-name:var(--ap-font-heading)] tracking-[0.12em] uppercase">Usage</p><p className="text-sm font-bold text-[var(--ap-text)]">{coupon.used_count}/{coupon.max_uses}</p></div>
                                    {coupon.expires_at && <div><p className="text-[var(--ap-muted)] font-[family-name:var(--ap-font-heading)] tracking-[0.12em] uppercase">Expires</p><p className={`text-xs ${expired ? "text-[var(--ap-danger)]" : ""}`}>{fmtDate(coupon.expires_at)}</p></div>}
                                </div>
                                <div className="flex gap-1.5 flex-wrap border-t border-[var(--ap-border)] pt-3.5">
                                    <button onClick={() => copyCode(coupon.code)} className="px-3 py-1.5 bg-transparent border border-[var(--ap-border)] text-[#3B82F6] text-[0.65rem] font-bold cursor-pointer rounded tracking-wider uppercase">Copy</button>
                                    <button onClick={() => toggleActive(coupon)} className={`px-3 py-1.5 bg-transparent border border-[var(--ap-border)] text-[0.65rem] font-bold cursor-pointer rounded tracking-wider uppercase ${coupon.is_active ? "text-[var(--ap-danger)]" : "text-[#10B981]"}`}>{coupon.is_active ? "Deactivate" : "Activate"}</button>
                                    {deleteConfirm === coupon.id ? (<><button onClick={() => deleteCoupon(coupon.id)} className="px-3 py-1.5 bg-[var(--ap-danger)] border-none text-white text-[0.65rem] font-bold cursor-pointer rounded">Confirm</button><button onClick={() => setDeleteConfirm(null)} className="px-3 py-1.5 bg-transparent border border-[var(--ap-border)] text-[var(--ap-muted)] text-[0.65rem] font-bold cursor-pointer rounded">✕</button></>) : (<button onClick={() => setDeleteConfirm(coupon.id)} className="px-3 py-1.5 bg-transparent border border-[var(--ap-border)] text-[var(--ap-danger)] text-[0.65rem] font-bold cursor-pointer rounded tracking-wider uppercase ml-auto">Delete</button>)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
