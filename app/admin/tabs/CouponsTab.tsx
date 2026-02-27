"use client";

import React, { useState } from "react";
import { C, FM, FO, fmt, fmtDate, COUPON_TYPES } from "../constants";
import { inputStyle, selectStyle } from "../components/AdminUI";
import type { Coupon } from "../types";

interface Props {
    coupons: Coupon[];
    adminKey: string;
    onCouponCreated: () => void;
    onCouponUpdated: (updated: Coupon) => void;
    onCouponDeleted: (id: string) => void;
}

export default function CouponsTab({
    coupons, adminKey, onCouponCreated, onCouponUpdated, onCouponDeleted,
}: Props) {
    const [showAdd, setShowAdd] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [form, setForm] = useState({
        code: "", description: "", discount_type: "percentage",
        discount_value: "", min_order_amount: "0", max_discount: "",
        max_uses: "100", expires_at: "",
    });

    const headers = { "Content-Type": "application/json", "x-admin-key": adminKey };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/admin/coupons", {
                method: "POST", headers,
                body: JSON.stringify({
                    ...form,
                    discount_value: Number(form.discount_value),
                    min_order_amount: Number(form.min_order_amount),
                    max_discount: form.max_discount ? Number(form.max_discount) : null,
                    max_uses: Number(form.max_uses),
                    expires_at: form.expires_at || null,
                }),
            });
            if (!res.ok) throw new Error("Failed");
            setShowAdd(false);
            setForm({ code: "", description: "", discount_type: "percentage", discount_value: "", min_order_amount: "0", max_discount: "", max_uses: "100", expires_at: "" });
            onCouponCreated();
        } catch (err) { console.error(err); }
        finally { setSaving(false); }
    };

    const toggleActive = async (coupon: Coupon) => {
        await fetch(`/api/admin/coupons?id=${coupon.id}`, {
            method: "PATCH", headers,
            body: JSON.stringify({ is_active: !coupon.is_active }),
        });
        onCouponUpdated({ ...coupon, is_active: !coupon.is_active });
    };

    const deleteCoupon = async (id: string) => {
        await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE", headers: { "x-admin-key": adminKey } });
        onCouponDeleted(id);
        setDeleteConfirm(null);
    };

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const filtered = coupons.filter(c => {
        const q = searchQuery.toLowerCase();
        return !q || c.code.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
    });

    const isExpired = (c: Coupon) => c.expires_at && new Date(c.expires_at) < new Date();
    const isMaxed = (c: Coupon) => c.used_count >= c.max_uses;

    return (
        <div>
            {/* Toolbar */}
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
                <input placeholder="Search coupons…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ ...inputStyle, maxWidth: 280, padding: "0.5rem 0.875rem" }} />
                <span style={{ fontSize: "0.72rem", color: C.muted, fontFamily: FO }}>{filtered.length} coupons</span>
                <button
                    onClick={() => setShowAdd(v => !v)}
                    style={{ padding: "0.7rem 1.5rem", background: showAdd ? "transparent" : C.accent, color: showAdd ? C.muted : "#111", fontWeight: 900, fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", border: `1px solid ${showAdd ? C.border : C.accent}`, cursor: "pointer", borderRadius: 6, fontFamily: FM, marginLeft: "auto" }}
                >
                    {showAdd ? "✕ Cancel" : "+ Create Coupon"}
                </button>
            </div>

            {/* Add Form */}
            {showAdd && (
                <form onSubmit={handleAdd} style={{ background: C.card, border: `1px solid ${C.border}`, padding: "1.5rem", borderRadius: 10, marginBottom: "1.5rem" }}>
                    <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.accent, fontFamily: FM, marginBottom: "1.25rem" }}>New Coupon</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                        <div>
                            <label style={{ display: "block", fontSize: "0.6rem", fontWeight: 700, color: C.muted, fontFamily: FM, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Code *</label>
                            <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="e.g. WELCOME20" style={{ ...inputStyle, width: "100%", boxSizing: "border-box", padding: "0.625rem 0.875rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }} required />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "0.6rem", fontWeight: 700, color: C.muted, fontFamily: FM, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Description</label>
                            <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="20% off on first order" style={{ ...inputStyle, width: "100%", boxSizing: "border-box", padding: "0.625rem 0.875rem" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "0.6rem", fontWeight: 700, color: C.muted, fontFamily: FM, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Discount Type *</label>
                            <select value={form.discount_type} onChange={e => setForm(f => ({ ...f, discount_type: e.target.value }))} style={{ ...selectStyle, width: "100%", boxSizing: "border-box", padding: "0.625rem 0.875rem" }}>
                                <option value="percentage">Percentage (%)</option>
                                <option value="flat">Flat Amount (₹)</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "0.6rem", fontWeight: 700, color: C.muted, fontFamily: FM, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Discount Value *</label>
                            <input type="number" value={form.discount_value} onChange={e => setForm(f => ({ ...f, discount_value: e.target.value }))} placeholder={form.discount_type === "percentage" ? "e.g. 20" : "e.g. 500"} style={{ ...inputStyle, width: "100%", boxSizing: "border-box", padding: "0.625rem 0.875rem" }} required />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "0.6rem", fontWeight: 700, color: C.muted, fontFamily: FM, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Min Order Amount (₹)</label>
                            <input type="number" value={form.min_order_amount} onChange={e => setForm(f => ({ ...f, min_order_amount: e.target.value }))} style={{ ...inputStyle, width: "100%", boxSizing: "border-box", padding: "0.625rem 0.875rem" }} />
                        </div>
                        {form.discount_type === "percentage" && (
                            <div>
                                <label style={{ display: "block", fontSize: "0.6rem", fontWeight: 700, color: C.muted, fontFamily: FM, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Max Discount Cap (₹)</label>
                                <input type="number" value={form.max_discount} onChange={e => setForm(f => ({ ...f, max_discount: e.target.value }))} placeholder="e.g. 1000" style={{ ...inputStyle, width: "100%", boxSizing: "border-box", padding: "0.625rem 0.875rem" }} />
                            </div>
                        )}
                        <div>
                            <label style={{ display: "block", fontSize: "0.6rem", fontWeight: 700, color: C.muted, fontFamily: FM, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Max Uses</label>
                            <input type="number" value={form.max_uses} onChange={e => setForm(f => ({ ...f, max_uses: e.target.value }))} style={{ ...inputStyle, width: "100%", boxSizing: "border-box", padding: "0.625rem 0.875rem" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "0.6rem", fontWeight: 700, color: C.muted, fontFamily: FM, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Expires At</label>
                            <input type="datetime-local" value={form.expires_at} onChange={e => setForm(f => ({ ...f, expires_at: e.target.value }))} style={{ ...inputStyle, width: "100%", boxSizing: "border-box", padding: "0.625rem 0.875rem" }} />
                        </div>
                    </div>
                    <div style={{ marginTop: "1.25rem" }}>
                        <button type="submit" disabled={saving} style={{ padding: "0.75rem 2rem", background: C.accent, color: "#111", fontWeight: 900, fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", border: "none", cursor: "pointer", borderRadius: 6, fontFamily: FM }}>
                            {saving ? "Creating…" : "Create Coupon"}
                        </button>
                    </div>
                </form>
            )}

            {/* Coupons Grid */}
            {filtered.length === 0 ? (
                <p style={{ color: C.muted, fontFamily: FO, padding: "5rem", textAlign: "center" }}>No coupons yet. Create one above.</p>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1rem" }}>
                    {filtered.map(coupon => {
                        const expired = isExpired(coupon);
                        const maxed = isMaxed(coupon);
                        const statusColor = !coupon.is_active ? C.red : expired ? "#F59E0B" : maxed ? C.orange : C.green;
                        const statusText = !coupon.is_active ? "Inactive" : expired ? "Expired" : maxed ? "Maxed Out" : "Active";

                        return (
                            <div key={coupon.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "1.25rem 1.5rem", opacity: (!coupon.is_active || expired) ? 0.6 : 1, transition: "opacity 0.2s" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                                    <div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
                                            <span
                                                onClick={() => copyCode(coupon.code)}
                                                style={{ fontSize: "1.1rem", fontWeight: 900, color: C.accent, fontFamily: FM, letterSpacing: "0.1em", cursor: "pointer" }}
                                                title="Click to copy"
                                            >
                                                {coupon.code}
                                            </span>
                                            {copiedCode === coupon.code && (
                                                <span style={{ fontSize: "0.6rem", color: C.green, fontFamily: FM }}>COPIED!</span>
                                            )}
                                        </div>
                                        {coupon.description && (
                                            <p style={{ fontSize: "0.78rem", color: C.muted, fontFamily: FO }}>{coupon.description}</p>
                                        )}
                                    </div>
                                    <span style={{ display: "inline-block", padding: "0.2rem 0.6rem", borderRadius: 4, fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: FM, background: `${statusColor}22`, color: statusColor }}>
                                        {statusText}
                                    </span>
                                </div>

                                {/* Discount badge */}
                                <div style={{ display: "inline-block", padding: "0.5rem 1rem", background: `${C.accent}15`, border: `1px solid ${C.accent}44`, borderRadius: 8, marginBottom: "1rem" }}>
                                    <span style={{ fontSize: "1.4rem", fontWeight: 900, color: C.accent, fontFamily: FM }}>
                                        {coupon.discount_type === "percentage" ? `${coupon.discount_value}%` : fmt(coupon.discount_value)}
                                    </span>
                                    <span style={{ fontSize: "0.72rem", color: C.muted, fontFamily: FO, marginLeft: "0.5rem" }}>
                                        {COUPON_TYPES[coupon.discount_type]}
                                    </span>
                                </div>

                                {/* Details grid */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "1rem" }}>
                                    <div>
                                        <p style={{ fontSize: "0.55rem", color: C.muted, fontFamily: FM, letterSpacing: "0.12em", textTransform: "uppercase" }}>Min Order</p>
                                        <p style={{ fontSize: "0.82rem", color: C.text, fontFamily: FM, fontWeight: 700 }}>{fmt(coupon.min_order_amount)}</p>
                                    </div>
                                    {coupon.max_discount && (
                                        <div>
                                            <p style={{ fontSize: "0.55rem", color: C.muted, fontFamily: FM, letterSpacing: "0.12em", textTransform: "uppercase" }}>Max Discount</p>
                                            <p style={{ fontSize: "0.82rem", color: C.text, fontFamily: FM, fontWeight: 700 }}>{fmt(coupon.max_discount)}</p>
                                        </div>
                                    )}
                                    <div>
                                        <p style={{ fontSize: "0.55rem", color: C.muted, fontFamily: FM, letterSpacing: "0.12em", textTransform: "uppercase" }}>Usage</p>
                                        <p style={{ fontSize: "0.82rem", color: C.text, fontFamily: FM, fontWeight: 700 }}>{coupon.used_count} / {coupon.max_uses}</p>
                                    </div>
                                    {coupon.expires_at && (
                                        <div>
                                            <p style={{ fontSize: "0.55rem", color: C.muted, fontFamily: FM, letterSpacing: "0.12em", textTransform: "uppercase" }}>Expires</p>
                                            <p style={{ fontSize: "0.75rem", color: expired ? C.red : C.text, fontFamily: FO }}>{fmtDate(coupon.expires_at)}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div style={{ display: "flex", gap: "0.4rem", borderTop: `1px solid ${C.border}`, paddingTop: "0.875rem" }}>
                                    <button onClick={() => copyCode(coupon.code)} style={{ padding: "0.35rem 0.75rem", background: "transparent", border: `1px solid ${C.border}`, color: C.blue, fontSize: "0.65rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>Copy</button>
                                    <button onClick={() => toggleActive(coupon)} style={{ padding: "0.35rem 0.75rem", background: "transparent", border: `1px solid ${C.border}`, color: coupon.is_active ? C.red : C.green, fontSize: "0.65rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                                        {coupon.is_active ? "Deactivate" : "Activate"}
                                    </button>
                                    {deleteConfirm === coupon.id ? (
                                        <>
                                            <button onClick={() => deleteCoupon(coupon.id)} style={{ padding: "0.35rem 0.75rem", background: C.red, border: "none", color: "#fff", fontSize: "0.65rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4 }}>Confirm</button>
                                            <button onClick={() => setDeleteConfirm(null)} style={{ padding: "0.35rem 0.75rem", background: "transparent", border: `1px solid ${C.border}`, color: C.muted, fontSize: "0.65rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4 }}>✕</button>
                                        </>
                                    ) : (
                                        <button onClick={() => setDeleteConfirm(coupon.id)} style={{ padding: "0.35rem 0.75rem", background: "transparent", border: `1px solid ${C.border}`, color: C.red, fontSize: "0.65rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4, letterSpacing: "0.08em", textTransform: "uppercase", marginLeft: "auto" }}>Delete</button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
