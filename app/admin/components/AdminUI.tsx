"use client";

import React from "react";
import { C, FM, STATUS_COLORS, STATUS_LABELS, FO } from "../constants";

// ── Badge ─────────────────────────────────────────────────────────────
export function Badge({ status }: { status: string }) {
    const color = STATUS_COLORS[status] ?? "#555";
    return (
        <span style={{
            display: "inline-block", padding: "0.2rem 0.6rem", borderRadius: 4,
            fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
            background: `${color}22`, color, fontFamily: FM,
        }}>
            {STATUS_LABELS[status] ?? status}
        </span>
    );
}

// ── StatCard ──────────────────────────────────────────────────────────
export function StatCard({
    label, value, sub, color,
}: { label: string; value: string | number; sub?: string; color?: string }) {
    return (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: "1.25rem 1.5rem", borderRadius: 10 }}>
            <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.muted, fontFamily: FM, marginBottom: "0.5rem" }}>{label}</p>
            <p style={{ fontSize: "1.65rem", fontWeight: 900, color: color ?? C.accent, fontFamily: FM, lineHeight: 1 }}>{value}</p>
            {sub && <p style={{ fontSize: "0.7rem", color: C.muted, fontFamily: FO, marginTop: "0.375rem" }}>{sub}</p>}
        </div>
    );
}

// ── Table helpers ─────────────────────────────────────────────────────
export function Th({ children }: { children: React.ReactNode }) {
    return (
        <th style={{
            padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.6rem", fontWeight: 700,
            letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, fontFamily: FM,
            borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap", background: C.panel,
        }}>
            {children}
        </th>
    );
}

export function Td({
    children, style, onClick,
}: {
    children: React.ReactNode;
    style?: React.CSSProperties;
    onClick?: (e: React.MouseEvent<HTMLTableCellElement>) => void;
}) {
    return (
        <td onClick={onClick} style={{ padding: "0.875rem 1rem", verticalAlign: "middle", ...style }}>
            {children}
        </td>
    );
}

// ── Shared input/select styles factory ───────────────────────────────
export const inputStyle: React.CSSProperties = {
    background: "#0F0F0F", border: `1px solid ${C.border}`, color: C.text,
    fontSize: "0.82rem", fontFamily: FO, borderRadius: 4, padding: "0.35rem 0.6rem", width: "100%",
};
export const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer" };
