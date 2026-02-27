"use client";

import React, { useState } from "react";
import { C, FM, FO } from "../constants";
import type { StoreSetting } from "../types";

interface Props {
    settings: StoreSetting[];
    adminKey: string;
    onSaved: () => void;
}

const SETTING_LABELS: Record<string, { label: string; description: string; type: "text" | "number" | "textarea" }> = {
    whatsapp_number: { label: "WhatsApp Number", description: "Include country code (e.g. 919876543210)", type: "text" },
    shipping_charges: { label: "Shipping Charges (₹)", description: "Default shipping fee for orders", type: "number" },
    free_shipping_threshold: { label: "Free Shipping Above (₹)", description: "Orders above this amount get free shipping", type: "number" },
    business_hours: { label: "Business Hours", description: "Displayed in footer and contact page", type: "text" },
    store_announcement: { label: "Store Announcement", description: "Banner text shown at top of website (leave empty to hide)", type: "textarea" },
    support_email: { label: "Support Email", description: "Customer support email address", type: "text" },
};

const SETTING_ORDER = ["whatsapp_number", "support_email", "shipping_charges", "free_shipping_threshold", "business_hours", "store_announcement"];

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
            const res = await fetch("/api/admin/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
                body: JSON.stringify({ settings: updates }),
            });
            if (!res.ok) throw new Error("Failed");
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
            onSaved();
        } catch (err) { console.error(err); }
        finally { setSaving(false); }
    };

    const inp: React.CSSProperties = {
        background: "#0F0F0F", border: `1px solid ${C.border}`, color: C.text,
        fontSize: "0.85rem", fontFamily: FO, borderRadius: 6,
        padding: "0.75rem 1rem", width: "100%", boxSizing: "border-box",
    };

    // Sort by predefined order
    const sortedKeys = SETTING_ORDER.filter(k => vals[k] !== undefined);
    // Add any keys not in SETTING_ORDER
    for (const s of settings) {
        if (!sortedKeys.includes(s.key)) sortedKeys.push(s.key);
    }

    return (
        <div style={{ maxWidth: 720 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                    <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.accent, fontFamily: FM, marginBottom: "0.25rem" }}>Store Settings</p>
                    <p style={{ fontSize: "0.78rem", color: C.muted, fontFamily: FO }}>Configure your store preferences and details</p>
                </div>
                {saved && (
                    <span style={{ fontSize: "0.72rem", color: C.green, fontFamily: FM, fontWeight: 700 }}>✓ Settings saved!</span>
                )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {sortedKeys.map(key => {
                    const meta = SETTING_LABELS[key] ?? { label: key, description: "", type: "text" as const };
                    return (
                        <div key={key} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "1.25rem 1.5rem" }}>
                            <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: C.text, fontFamily: FM, letterSpacing: "0.08em", marginBottom: "0.25rem" }}>
                                {meta.label}
                            </label>
                            {meta.description && (
                                <p style={{ fontSize: "0.68rem", color: C.muted, fontFamily: FO, marginBottom: "0.75rem" }}>{meta.description}</p>
                            )}
                            {meta.type === "textarea" ? (
                                <textarea
                                    value={vals[key] ?? ""}
                                    onChange={e => setVals(v => ({ ...v, [key]: e.target.value }))}
                                    rows={3}
                                    style={{ ...inp, resize: "vertical", lineHeight: 1.6 }}
                                />
                            ) : (
                                <input
                                    type={meta.type}
                                    value={vals[key] ?? ""}
                                    onChange={e => setVals(v => ({ ...v, [key]: e.target.value }))}
                                    style={inp}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Save Button */}
            <div style={{ position: "sticky", bottom: 0, background: C.bg, paddingTop: "1.25rem", paddingBottom: "1.25rem", marginTop: "1.5rem", borderTop: `1px solid ${C.border}` }}>
                <button
                    onClick={handleSave}
                    disabled={saving || !hasChanges}
                    style={{
                        padding: "0.875rem 2.5rem", background: hasChanges ? C.accent : "#333",
                        color: hasChanges ? "#111" : "#666", fontWeight: 900, fontSize: "0.8rem",
                        letterSpacing: "0.12em", textTransform: "uppercase", border: "none",
                        cursor: hasChanges ? "pointer" : "not-allowed", borderRadius: 6, fontFamily: FM,
                        opacity: saving ? 0.7 : 1, transition: "all 0.2s",
                    }}
                >
                    {saving ? "Saving…" : saved ? "✓ Saved!" : "Save Settings"}
                </button>
                {hasChanges && (
                    <span style={{ fontSize: "0.68rem", color: C.orange, fontFamily: FO, marginLeft: "1rem" }}>
                        You have unsaved changes
                    </span>
                )}
            </div>
        </div>
    );
}
