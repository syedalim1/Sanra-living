"use client";

import React from "react";
import { fmt } from "../constants";
import { StatCard } from "../components/AdminUI";
import type { Order, Product } from "../types";

interface Props {
    orders: Order[];
    products: Product[];
    totalRevenue: number;
    paidOrders: Order[];
    onViewOrders: () => void;
}

export default function DashboardTab({ orders, products, totalRevenue, paidOrders, onViewOrders }: Props) {
    return (
        <div className="flex flex-col gap-6 md:gap-8">
            
            {/* Main Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <StatCard label="Total Products" value={products.length} sub={`${products.filter(p => p.is_active).length} active`} color="#3B82F6" />
                <StatCard label="Total Orders" value={orders.length} sub={`${paidOrders.length} paid`} color="#10B981" />
                <StatCard label="Total Revenue" value={fmt(totalRevenue)} sub="From paid orders" color="#111" />
            </div>

            {/* Recent Orders */}
            <div className="bg-white border border-[var(--ap-border)] rounded-xl p-4 md:p-6">
                <div className="flex justify-between items-center mb-4 md:mb-5">
                    <h3 className="text-base md:text-lg font-extrabold font-[family-name:var(--ap-font-heading)] text-[var(--ap-text)] m-0">
                        Recent Orders
                    </h3>
                    <button
                        onClick={onViewOrders}
                        className="text-sm text-[#3B82F6] bg-transparent border-none cursor-pointer font-[family-name:var(--ap-font-heading)] font-semibold"
                    >
                        View All →
                    </button>
                </div>
                {orders.length === 0 ? (
                    <p className="text-sm text-[var(--ap-muted)] font-[family-name:var(--ap-font-body)]">No orders yet.</p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {[...orders]
                            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                            .slice(0, 5)
                            .map(o => (
                                <div key={o.id} className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 p-3 md:p-4 bg-[#fafafa] rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-[#3B82F6] font-[family-name:var(--ap-font-heading)] text-sm">
                                            {o.order_number}
                                        </span>
                                        <span className="text-sm text-[var(--ap-muted)] font-[family-name:var(--ap-font-body)] truncate max-w-[180px]">
                                            {o.user_phone || o.user_email}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-base font-[family-name:var(--ap-font-heading)] text-[var(--ap-text)]">
                                            {fmt(o.total_amount)}
                                        </span>
                                        <span
                                            className="px-2.5 py-1 rounded text-[0.65rem] font-bold uppercase font-[family-name:var(--ap-font-heading)]"
                                            style={{
                                                background: o.payment_status === "paid" ? "#10B98118" : "#F5920018",
                                                color: o.payment_status === "paid" ? "#10B981" : "#F97316",
                                            }}
                                        >
                                            {o.payment_status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}
