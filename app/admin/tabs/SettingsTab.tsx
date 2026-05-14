"use client";

import React, { useState } from "react";
import type { StoreSetting } from "../types";

interface Props { settings: StoreSetting[]; adminKey: string; onSaved: () => void; }

const SL: Record<string, { label: string; description: string; type: "text" | "number" | "textarea" }> = {
    whatsapp_number: { label: "WhatsApp Number", description: "Include country code (e.g. 918300904920)", type: "text" },
    shipping_charges: { label: "Shipping Charges (₹)", description: "Default shipping fee for orders", type: "number" },
    free_shipping_threshold: { label: "Free Shipping Above (₹)", description: "Orders above this amount get free shipping", type: "number" },
    business_hours: { label: "Business Hours", description: "Displayed in footer and contact page", type: "text" },
    store_announcement: { label: "Store Announcement", description: "Banner text shown at top of website (leave empty to hide)", type: "textarea" },
    support_email: { label: "Support Email", description: "Customer support email address", type: "text" },
};
const SO = ["whatsapp_number", "support_email", "shipping_charges", "free_shipping_threshold", "business_hours", "store_announcement"];

export default function SettingsTab({ settings, adminKey, onSaved }: Props) {
    const initial: Record<string, string> = {};
    for (const s of settings) initial[s.key] = s.value;
    const [vals, setVals] = useState<Record<string, string>>(initial);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const hasChanges = settings.some(s => vals[s.key] !== s.value);

    const handleSave = async () => {
        setSaving(true);
        try {
            const updates = Object.entries(vals).map(([key, value]) => ({ key, value }));
            const res = await fetch("/api/admin/settings", { method: "PATCH", headers: { "Content-Type": "application/json", "x-admin-key": adminKey }, body: JSON.stringify({ settings: updates }) });
            if (!res.ok) throw new Error("Failed");
            setSaved(true); setTimeout(() => setSaved(false), 3000); onSaved();
        } catch (err) { console.error(err); } finally { setSaving(false); }
    };

    const sortedKeys = SO.filter(k => vals[k] !== undefined);
    for (const s of settings) if (!sortedKeys.includes(s.key)) sortedKeys.push(s.key);

    return (
        <div className="max-w-[720px]">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-2">
                <div>
                    <p className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-[var(--ap-accent)] font-[family-name:var(--ap-font-heading)] mb-1">Store Settings</p>
                    <p className="text-sm text-[var(--ap-muted)]">Configure your store preferences and details</p>
                </div>
                {saved && <span className="text-xs text-[#10B981] font-[family-name:var(--ap-font-heading)] font-bold">✓ Settings saved!</span>}
            </div>

            <div className="flex flex-col gap-4 md:gap-5">
                {sortedKeys.map(key => {
                    const meta = SL[key] ?? { label: key, description: "", type: "text" as const };
                    return (
                        <div key={key} className="bg-white border border-[var(--ap-border)] rounded-xl p-4 md:p-5">
                            <label className="block text-xs font-bold text-[var(--ap-text)] font-[family-name:var(--ap-font-heading)] tracking-wider mb-1">{meta.label}</label>
                            {meta.description && <p className="text-[0.68rem] text-[var(--ap-muted)] mb-3">{meta.description}</p>}
                            {meta.type === "textarea" ? (
                                <textarea value={vals[key] ?? ""} onChange={e => setVals(v => ({ ...v, [key]: e.target.value }))} rows={3} className="w-full bg-[#fafaf8] border border-[var(--ap-border)] text-[var(--ap-text)] text-sm rounded-lg p-3 resize-y leading-relaxed outline-none focus:border-[var(--ap-accent)] transition-colors" />
                            ) : (
                                <input type={meta.type} value={vals[key] ?? ""} onChange={e => setVals(v => ({ ...v, [key]: e.target.value }))} className="w-full bg-[#fafaf8] border border-[var(--ap-border)] text-[var(--ap-text)] text-sm rounded-lg p-3 outline-none focus:border-[var(--ap-accent)] transition-colors" />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Save Bar */}
            <div className="sticky bottom-0 bg-[var(--ap-bg)] pt-5 pb-5 mt-6 border-t border-[var(--ap-border)] flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button onClick={handleSave} disabled={saving || !hasChanges} className={`px-8 py-3.5 font-black text-sm tracking-[0.12em] uppercase border-none cursor-pointer rounded-lg font-[family-name:var(--ap-font-heading)] transition-all w-full sm:w-auto ${hasChanges ? "bg-[var(--ap-accent)] text-white" : "bg-[#333] text-[#666] cursor-not-allowed"} ${saving ? "opacity-70" : ""}`}>
                    {saving ? "Saving…" : saved ? "✓ Saved!" : "Save Settings"}
                </button>
                {hasChanges && <span className="text-[0.68rem] text-[#F97316]">You have unsaved changes</span>}
            </div>
        </div>
    );
}
