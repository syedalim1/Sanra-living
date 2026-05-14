"use client";

import React, { useState } from "react";
import { fmt } from "../constants";
import type { DailyRevenue, TopProduct } from "../types";

interface Props { daily: DailyRevenue[]; topProducts: TopProduct[]; period: number; onPeriodChange: (days: number) => void; }

export default function AnalyticsTab({ daily, topProducts, period, onPeriodChange }: Props) {
    const [hoveredBar, setHoveredBar] = useState<number | null>(null);
    const totalRevenue = daily.reduce((s, d) => s + d.revenue, 0);
    const totalOrders = daily.reduce((s, d) => s + d.order_count, 0);
    const maxRevenue = Math.max(...daily.map(d => d.revenue), 1);
    const avgDaily = totalRevenue / Math.max(daily.length, 1);
    const fmtSD = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div>
                    <p className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-[var(--ap-muted)] font-[family-name:var(--ap-font-heading)] mb-2">Revenue Overview</p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 sm:items-baseline">
                        <span className="text-3xl md:text-4xl font-black text-[var(--ap-accent)] font-[family-name:var(--ap-font-heading)]">{fmt(totalRevenue)}</span>
                        <span className="text-sm text-[var(--ap-muted)]">{totalOrders} orders · {daily.length} days</span>
                    </div>
                </div>
                <select value={period} onChange={e => onPeriodChange(Number(e.target.value))} className="px-3.5 py-2.5 bg-white border border-[var(--ap-border)] text-sm rounded-lg outline-none cursor-pointer w-full sm:w-auto sm:max-w-[160px]">
                    <option value={7}>Last 7 Days</option><option value={30}>Last 30 Days</option><option value={90}>Last 90 Days</option>
                </select>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[{ l: "Total Revenue", v: fmt(totalRevenue), c: "#10B981" }, { l: "Total Orders", v: totalOrders, c: "#3B82F6" }, { l: "Avg Daily Revenue", v: fmt(Math.round(avgDaily)), c: "var(--ap-accent)" }, { l: "Avg Order Value", v: fmt(Math.round(totalRevenue / Math.max(totalOrders, 1))), c: "#8B5CF6" }].map(({ l, v, c }) => (
                    <div key={l} className="bg-white border border-[var(--ap-border)] p-4 rounded-xl">
                        <p className="text-[0.55rem] font-bold tracking-[0.18em] uppercase text-[var(--ap-muted)] font-[family-name:var(--ap-font-heading)] mb-1.5">{l}</p>
                        <p className="text-xl md:text-2xl font-black font-[family-name:var(--ap-font-heading)]" style={{ color: c }}>{v}</p>
                    </div>
                ))}
            </div>

            {/* Bar Chart */}
            <div className="bg-white border border-[var(--ap-border)] rounded-xl p-4 md:p-6">
                <p className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-[var(--ap-muted)] font-[family-name:var(--ap-font-heading)] mb-5">Daily Revenue</p>
                {daily.length === 0 ? (
                    <p className="text-[var(--ap-muted)] text-center py-12">No data for this period.</p>
                ) : (
                    <div className="flex items-end h-[200px] relative" style={{ gap: period > 30 ? 1 : 3 }}>
                        {daily.map((d, i) => {
                            const h = (d.revenue / maxRevenue) * 100;
                            const hov = hoveredBar === i;
                            return (
                                <div key={d.date} className="flex-1 flex flex-col items-center relative" onMouseEnter={() => setHoveredBar(i)} onMouseLeave={() => setHoveredBar(null)}>
                                    {hov && (
                                        <div className="absolute left-1/2 -translate-x-1/2 bg-white border border-[var(--ap-border)] rounded-md px-3 py-2 whitespace-nowrap z-10 pointer-events-none shadow-sm" style={{ bottom: `calc(${Math.max(h, 5)}% + 12px)` }}>
                                            <p className="text-[0.65rem] text-[var(--ap-muted)] font-[family-name:var(--ap-font-heading)] mb-0.5">{fmtSD(d.date)}</p>
                                            <p className="text-sm font-black text-[var(--ap-accent)] font-[family-name:var(--ap-font-heading)]">{fmt(d.revenue)}</p>
                                            <p className="text-[0.62rem] text-[var(--ap-muted)]">{d.order_count} orders</p>
                                        </div>
                                    )}
                                    <div className="w-full min-w-[3px] max-w-[40px] rounded-t transition-all duration-200 cursor-pointer" style={{ height: `${Math.max(h, 2)}%`, background: hov ? "var(--ap-accent)" : d.revenue > 0 ? "rgba(17,17,17,0.53)" : "var(--ap-border)" }} />
                                </div>
                            );
                        })}
                    </div>
                )}
                {daily.length > 0 && (
                    <div className="flex justify-between mt-2">
                        <span className="text-[0.6rem] text-[var(--ap-muted)]">{fmtSD(daily[0].date)}</span>
                        <span className="text-[0.6rem] text-[var(--ap-muted)]">{fmtSD(daily[daily.length - 1].date)}</span>
                    </div>
                )}
            </div>

            {/* Top Products */}
            <div className="bg-white border border-[var(--ap-border)] rounded-xl p-4 md:p-6">
                <p className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-[var(--ap-muted)] font-[family-name:var(--ap-font-heading)] mb-4">Top Selling Products</p>
                {topProducts.length === 0 ? (
                    <p className="text-[var(--ap-muted)] text-center py-8">No sales data yet.</p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {topProducts.map((p, i) => {
                            const pct = (p.total_revenue / (topProducts[0]?.total_revenue ?? 1)) * 100;
                            return (
                                <div key={i} className="flex items-center gap-3 md:gap-4 p-3 bg-[#fafaf8] rounded-lg">
                                    <span className={`text-sm font-black font-[family-name:var(--ap-font-heading)] min-w-[20px] ${i < 3 ? "text-[var(--ap-accent)]" : "text-[var(--ap-muted)]"}`}>#{i + 1}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-[var(--ap-text)] truncate">{p.product_name}</p>
                                        <div className="h-1 bg-[var(--ap-border-light)] rounded mt-1.5 overflow-hidden">
                                            <div className={`h-full rounded transition-all duration-500 ${i < 3 ? "bg-[var(--ap-accent)]" : "bg-[var(--ap-muted)]"}`} style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-bold text-[#10B981] font-[family-name:var(--ap-font-heading)]">{fmt(p.total_revenue)}</p>
                                        <p className="text-[0.65rem] text-[var(--ap-muted)]">{p.total_qty} sold</p>
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
