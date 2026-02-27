"use client";

import React, { useState } from "react";
import { C, FM, FO, fmt } from "../constants";
import { selectStyle } from "../components/AdminUI";
import type { DailyRevenue, TopProduct } from "../types";

interface Props {
    daily: DailyRevenue[];
    topProducts: TopProduct[];
    period: number;
    onPeriodChange: (days: number) => void;
}

export default function AnalyticsTab({ daily, topProducts, period, onPeriodChange }: Props) {
    const [hoveredBar, setHoveredBar] = useState<number | null>(null);

    const totalRevenue = daily.reduce((s, d) => s + d.revenue, 0);
    const totalOrders = daily.reduce((s, d) => s + d.order_count, 0);
    const maxRevenue = Math.max(...daily.map(d => d.revenue), 1);
    const avgDaily = totalRevenue / Math.max(daily.length, 1);

    const formatShortDate = (d: string) => {
        const dt = new Date(d);
        return dt.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Period Selector + Summary */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                    <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.muted, fontFamily: FM, marginBottom: "0.5rem" }}>Revenue Overview</p>
                    <div style={{ display: "flex", gap: "1.5rem", alignItems: "baseline" }}>
                        <span style={{ fontSize: "2rem", fontWeight: 900, color: C.accent, fontFamily: FM }}>{fmt(totalRevenue)}</span>
                        <span style={{ fontSize: "0.82rem", color: C.muted, fontFamily: FO }}>{totalOrders} orders · {daily.length} days</span>
                    </div>
                </div>
                <select
                    value={period}
                    onChange={e => onPeriodChange(Number(e.target.value))}
                    style={{ ...selectStyle, maxWidth: 160, padding: "0.5rem 0.875rem" }}
                >
                    <option value={7}>Last 7 Days</option>
                    <option value={30}>Last 30 Days</option>
                    <option value={90}>Last 90 Days</option>
                </select>
            </div>

            {/* Quick Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.75rem" }}>
                {[
                    { label: "Total Revenue", value: fmt(totalRevenue), color: C.green },
                    { label: "Total Orders", value: totalOrders, color: C.blue },
                    { label: "Avg Daily Revenue", value: fmt(Math.round(avgDaily)), color: C.accent },
                    { label: "Avg Order Value", value: fmt(Math.round(totalRevenue / Math.max(totalOrders, 1))), color: C.purple },
                ].map(({ label, value, color }) => (
                    <div key={label} style={{ background: C.card, border: `1px solid ${C.border}`, padding: "1rem 1.25rem", borderRadius: 10 }}>
                        <p style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted, fontFamily: FM, marginBottom: "0.375rem" }}>{label}</p>
                        <p style={{ fontSize: "1.3rem", fontWeight: 900, color, fontFamily: FM }}>{value}</p>
                    </div>
                ))}
            </div>

            {/* Revenue Bar Chart */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "1.5rem" }}>
                <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.muted, fontFamily: FM, marginBottom: "1.25rem" }}>Daily Revenue</p>
                {daily.length === 0 ? (
                    <p style={{ color: C.muted, fontFamily: FO, textAlign: "center", padding: "3rem" }}>No data for this period.</p>
                ) : (
                    <div style={{ display: "flex", alignItems: "flex-end", gap: period > 30 ? 1 : 3, height: 200, position: "relative" }}>
                        {daily.map((d, i) => {
                            const height = (d.revenue / maxRevenue) * 100;
                            const isHovered = hoveredBar === i;
                            return (
                                <div
                                    key={d.date}
                                    style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}
                                    onMouseEnter={() => setHoveredBar(i)}
                                    onMouseLeave={() => setHoveredBar(null)}
                                >
                                    {/* Tooltip */}
                                    {isHovered && (
                                        <div style={{
                                            position: "absolute", bottom: `calc(${Math.max(height, 5)}% + 12px)`, left: "50%", transform: "translateX(-50%)",
                                            background: C.panel, border: `1px solid ${C.border}`, borderRadius: 6, padding: "0.5rem 0.75rem",
                                            whiteSpace: "nowrap", zIndex: 10, pointerEvents: "none",
                                        }}>
                                            <p style={{ fontSize: "0.65rem", color: C.muted, fontFamily: FM, marginBottom: "0.2rem" }}>{formatShortDate(d.date)}</p>
                                            <p style={{ fontSize: "0.82rem", fontWeight: 900, color: C.accent, fontFamily: FM }}>{fmt(d.revenue)}</p>
                                            <p style={{ fontSize: "0.62rem", color: C.muted, fontFamily: FO }}>{d.order_count} orders</p>
                                        </div>
                                    )}
                                    <div
                                        style={{
                                            width: "100%", minWidth: 3, maxWidth: 40,
                                            height: `${Math.max(height, 2)}%`,
                                            background: isHovered ? C.accent : d.revenue > 0 ? `${C.accent}88` : `${C.border}`,
                                            borderRadius: "3px 3px 0 0",
                                            transition: "all 0.2s",
                                            cursor: "pointer",
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}
                {daily.length > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
                        <span style={{ fontSize: "0.6rem", color: C.muted, fontFamily: FO }}>{formatShortDate(daily[0].date)}</span>
                        <span style={{ fontSize: "0.6rem", color: C.muted, fontFamily: FO }}>{formatShortDate(daily[daily.length - 1].date)}</span>
                    </div>
                )}
            </div>

            {/* Top Products */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "1.5rem" }}>
                <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.muted, fontFamily: FM, marginBottom: "1rem" }}>Top Selling Products</p>
                {topProducts.length === 0 ? (
                    <p style={{ color: C.muted, fontFamily: FO, textAlign: "center", padding: "2rem" }}>No sales data yet.</p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {topProducts.map((product, i) => {
                            const maxRev = topProducts[0]?.total_revenue ?? 1;
                            const pct = (product.total_revenue / maxRev) * 100;
                            return (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.625rem 0.875rem", background: "#111", borderRadius: 6 }}>
                                    <span style={{ fontSize: "0.82rem", fontWeight: 900, color: i < 3 ? C.accent : C.muted, fontFamily: FM, minWidth: 20 }}>#{i + 1}</span>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: "0.82rem", fontWeight: 600, color: C.text, fontFamily: FO, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.product_name}</p>
                                        <div style={{ height: 4, background: "#1a1a1a", borderRadius: 2, marginTop: "0.375rem", overflow: "hidden" }}>
                                            <div style={{ width: `${pct}%`, height: "100%", background: i < 3 ? C.accent : C.muted, borderRadius: 2, transition: "width 0.5s" }} />
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                                        <p style={{ fontSize: "0.82rem", fontWeight: 700, color: C.green, fontFamily: FM }}>{fmt(product.total_revenue)}</p>
                                        <p style={{ fontSize: "0.65rem", color: C.muted, fontFamily: FO }}>{product.total_qty} sold</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
