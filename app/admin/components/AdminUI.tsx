"use client";

import React from "react";
import { STATUS_COLORS, STATUS_LABELS } from "../constants";

// ── Badge ─────────────────────────────────────────────────────────────
export function Badge({ status }: { status: string }) {
    const color = STATUS_COLORS[status] ?? "#555";
    return (
        <span
            className="inline-block px-2.5 py-1 rounded text-[0.65rem] font-bold tracking-wider uppercase font-[family-name:var(--ap-font-heading)]"
            style={{ background: `${color}18`, color }}
        >
            {STATUS_LABELS[status] ?? status}
        </span>
    );
}

// ── StatCard ──────────────────────────────────────────────────────────
export function StatCard({
    label, value, sub, color,
}: { label: string; value: string | number; sub?: string; color?: string }) {
    return (
        <div className="bg-white border border-[var(--ap-border)] p-5 md:p-6 rounded-xl">
            <p className="text-[0.75rem] font-bold tracking-[0.15em] uppercase text-[var(--ap-muted)] font-[family-name:var(--ap-font-heading)] mb-3">
                {label}
            </p>
            <p
                className="text-2xl md:text-3xl font-black font-[family-name:var(--ap-font-heading)] leading-none"
                style={{ color: color ?? "var(--ap-accent)" }}
            >
                {value}
            </p>
            {sub && (
                <p className="text-sm text-[var(--ap-muted)] font-[family-name:var(--ap-font-body)] mt-2">
                    {sub}
                </p>
            )}
        </div>
    );
}

// ── Table helpers ─────────────────────────────────────────────────────
export function Th({ children }: { children: React.ReactNode }) {
    return (
        <th className="py-3 px-4 text-left text-[0.7rem] font-bold tracking-[0.12em] uppercase text-[var(--ap-muted)] font-[family-name:var(--ap-font-heading)] border-b border-[var(--ap-border)] whitespace-nowrap bg-[#fafafa]">
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
        <td onClick={onClick} className="p-4 align-middle" style={style}>
            {children}
        </td>
    );
}
