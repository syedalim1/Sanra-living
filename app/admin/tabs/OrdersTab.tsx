"use client";

import React, { useState } from "react";
import { C, FM, FO, fmt, fmtDate, ORDER_STATUSES, STATUS_LABELS } from "../constants";
import { Badge, Th, Td } from "../components/AdminUI";
import InvoiceView from "../components/InvoiceView";
import type { Order } from "../types";

interface Props {
    orders: Order[];
    searchQuery: string;
    setSearchQuery: (v: string) => void;
    orderStatusFilter: string;
    setOrderStatusFilter: (v: string) => void;
    expandedOrder: string | null;
    setExpandedOrder: (id: string | null) => void;
    updatingOrder: string | null;
    updateOrderStatus: (orderId: string, status: string) => void;
    exportOrdersCsv: () => void;
    onSaveNotes: (orderId: string, notes: string) => void;
}

export default function OrdersTab({
    orders, searchQuery, setSearchQuery,
    orderStatusFilter, setOrderStatusFilter,
    expandedOrder, setExpandedOrder,
    updatingOrder, updateOrderStatus, exportOrdersCsv,
    onSaveNotes,
}: Props) {
    const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
    const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
    const [savingNotes, setSavingNotes] = useState<string | null>(null);

    const filtered = orders.filter(o => {
        const q = searchQuery.toLowerCase();
        const matchSearch = !q || o.order_number.toLowerCase().includes(q) || o.user_email.toLowerCase().includes(q) || o.user_phone.includes(q);
        const matchStatus = orderStatusFilter === "all" || o.order_status === orderStatusFilter;
        return matchSearch && matchStatus;
    });

    const handleSaveNotes = async (order: Order) => {
        const notes = notesDraft[order.id] ?? order.admin_notes ?? "";
        setSavingNotes(order.id);
        await onSaveNotes(order.id, notes);
        setSavingNotes(null);
    };

    return (
        <div className="overflow-x-auto">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5 flex-wrap items-stretch sm:items-center">
                <input
                    placeholder="Search orders (email, phone, order #)…"
                    value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    className="w-full sm:max-w-[320px] px-3.5 py-2.5 bg-white border border-[var(--ap-border)] text-[var(--ap-text)] text-sm font-[family-name:var(--ap-font-body)] rounded-lg outline-none focus:border-[var(--ap-accent)] focus:ring-2 focus:ring-[var(--ap-accent)]/5 transition-colors"
                />
                <select
                    value={orderStatusFilter} onChange={e => setOrderStatusFilter(e.target.value)}
                    className="w-full sm:max-w-[180px] px-3.5 py-2.5 bg-white border border-[var(--ap-border)] text-[var(--ap-text)] text-sm font-[family-name:var(--ap-font-body)] rounded-lg outline-none cursor-pointer focus:border-[var(--ap-accent)] transition-colors"
                >
                    <option value="all">All Statuses</option>
                    {ORDER_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
                <button
                    onClick={exportOrdersCsv}
                    className="px-4 py-2.5 bg-transparent border border-[var(--ap-border)] text-[#10B981] text-[0.68rem] font-bold font-[family-name:var(--ap-font-heading)] cursor-pointer rounded-lg tracking-wider uppercase hover:border-[#10B981] transition-colors"
                >
                    ↓ Export CSV
                </button>
                <span className="text-xs text-[var(--ap-muted)] font-[family-name:var(--ap-font-body)] sm:ml-auto">
                    {filtered.length} orders
                </span>
            </div>

            {/* Mobile: Card layout / Desktop: Table */}
            {/* Desktop Table */}
            <div className="hidden md:block">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <Th>Order #</Th><Th>Customer</Th><Th>Phone</Th><Th>Total</Th>
                            <Th>Payment</Th><Th>Method</Th><Th>Order Status</Th><Th>Update Status</Th><Th>Date</Th><Th>Actions</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((order) => (
                            <React.Fragment key={order.id}>
                                <tr
                                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                    className="border-b border-[var(--ap-border)] cursor-pointer hover:bg-[#fafafa] transition-colors"
                                >
                                    <Td>
                                        <span className="font-bold text-[var(--ap-accent)] font-[family-name:var(--ap-font-heading)] text-sm">{order.order_number}</span>
                                        {order.admin_notes && <span className="text-[#3B82F6] ml-1 text-xs" title="Has notes">📝</span>}
                                    </Td>
                                    <Td><span className="text-sm text-[var(--ap-text)]">{order.user_email}</span></Td>
                                    <Td><span className="text-sm text-[var(--ap-muted)]">{order.user_phone}</span></Td>
                                    <Td><span className="font-bold text-sm font-[family-name:var(--ap-font-heading)]">{fmt(order.total_amount)}</span></Td>
                                    <Td><Badge status={order.payment_status} /></Td>
                                    <Td><Badge status={order.payment_method} /></Td>
                                    <Td><Badge status={order.order_status} /></Td>
                                    <Td style={{ minWidth: 160 }} onClick={e => e.stopPropagation()}>
                                        <select
                                            value={order.order_status}
                                            disabled={updatingOrder === order.id}
                                            onChange={e => updateOrderStatus(order.id, e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-[var(--ap-border)] text-sm rounded-lg outline-none cursor-pointer"
                                        >
                                            {ORDER_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                                        </select>
                                    </Td>
                                    <Td><span className="text-xs text-[var(--ap-muted)] whitespace-nowrap">{fmtDate(order.created_at)}</span></Td>
                                    <Td onClick={e => e.stopPropagation()}>
                                        <button
                                            onClick={() => setInvoiceOrder(order)}
                                            className="px-3 py-1.5 bg-transparent border border-[var(--ap-border)] text-[var(--ap-text)] text-[0.62rem] font-bold font-[family-name:var(--ap-font-heading)] cursor-pointer rounded tracking-wider uppercase hover:border-[var(--ap-accent)] transition-colors"
                                        >
                                            🖨 Invoice
                                        </button>
                                    </Td>
                                </tr>

                                {expandedOrder === order.id && (
                                    <tr>
                                        <td colSpan={10} className="bg-[#fafaf8] p-5 border-b border-[var(--ap-border)]">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-5">
                                                {/* Shipping */}
                                                <div>
                                                    <p className="text-[0.58rem] text-[var(--ap-muted)] font-[family-name:var(--ap-font-heading)] tracking-[0.18em] uppercase mb-1.5">Shipping Address</p>
                                                    <p className="text-sm text-[var(--ap-text)] font-[family-name:var(--ap-font-body)] leading-relaxed">
                                                        {order.shipping_address}<br />
                                                        {order.city}, {order.state} – {order.pincode}
                                                    </p>
                                                </div>
                                                {/* Payment */}
                                                <div>
                                                    <p className="text-[0.58rem] text-[var(--ap-muted)] font-[family-name:var(--ap-font-heading)] tracking-[0.18em] uppercase mb-1.5">Payment Details</p>
                                                    <p className="text-sm text-[var(--ap-text)] font-[family-name:var(--ap-font-body)] leading-loose">
                                                        Method: <strong>{order.payment_method.toUpperCase()}</strong><br />
                                                        Advance Paid: <strong className="text-[#10B981]">{fmt(order.advance_paid)}</strong><br />
                                                        Remaining COD: <strong className={order.remaining_amount > 0 ? "text-[#F97316]" : "text-[var(--ap-muted)]"}>{fmt(order.remaining_amount)}</strong>
                                                    </p>
                                                </div>
                                                {/* Razorpay ID */}
                                                {order.razorpay_payment_id && (
                                                    <div>
                                                        <p className="text-[0.58rem] text-[var(--ap-muted)] font-[family-name:var(--ap-font-heading)] tracking-[0.18em] uppercase mb-1.5">Payment ID</p>
                                                        <p className="text-xs text-[#3B82F6] font-mono break-all">{order.razorpay_payment_id}</p>
                                                    </div>
                                                )}
                                                {/* Quick Actions */}
                                                <div>
                                                    <p className="text-[0.58rem] text-[var(--ap-muted)] font-[family-name:var(--ap-font-heading)] tracking-[0.18em] uppercase mb-2">Quick Actions</p>
                                                    <div className="flex flex-col gap-1.5">
                                                        {["packed", "shipped", "out_for_delivery", "delivered"].map(s => (
                                                            <button key={s}
                                                                onClick={() => updateOrderStatus(order.id, s)}
                                                                disabled={order.order_status === s}
                                                                className={`px-3 py-1.5 text-[0.68rem] font-bold font-[family-name:var(--ap-font-heading)] rounded tracking-wider uppercase text-left transition-colors cursor-pointer border
                                                                    ${order.order_status === s
                                                                        ? "bg-[var(--ap-accent-dim)] border-[var(--ap-accent)] text-[var(--ap-accent)] cursor-default"
                                                                        : "bg-transparent border-[var(--ap-border)] text-[var(--ap-muted)] hover:border-[var(--ap-accent)]"
                                                                    }`}
                                                            >
                                                                {order.order_status === s ? "✓ " : ""}{STATUS_LABELS[s]}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Admin Notes */}
                                            <div className="border-t border-[var(--ap-border)] pt-4 mb-5">
                                                <p className="text-[0.58rem] text-[var(--ap-muted)] font-[family-name:var(--ap-font-heading)] tracking-[0.18em] uppercase mb-2">📝 Admin Notes (internal)</p>
                                                <textarea
                                                    value={notesDraft[order.id] ?? order.admin_notes ?? ""}
                                                    onChange={e => setNotesDraft(d => ({ ...d, [order.id]: e.target.value }))}
                                                    rows={3}
                                                    placeholder="Add internal notes about this order…"
                                                    className="w-full bg-white border border-[var(--ap-border)] text-[var(--ap-text)] text-sm font-[family-name:var(--ap-font-body)] rounded-lg p-3 resize-y leading-relaxed outline-none focus:border-[var(--ap-accent)] transition-colors"
                                                />
                                                <button
                                                    onClick={() => handleSaveNotes(order)}
                                                    disabled={savingNotes === order.id}
                                                    className="mt-2 px-5 py-2 bg-[var(--ap-accent)] text-white font-black text-[0.68rem] tracking-wider uppercase border-none cursor-pointer rounded font-[family-name:var(--ap-font-heading)] disabled:opacity-70"
                                                >
                                                    {savingNotes === order.id ? "Saving…" : "Save Notes"}
                                                </button>
                                            </div>

                                            {/* Items List */}
                                            {order.order_items && order.order_items.length > 0 && (
                                                <div className="border-t border-[var(--ap-border)] pt-4">
                                                    <p className="text-[0.58rem] text-[var(--ap-muted)] font-[family-name:var(--ap-font-heading)] tracking-[0.18em] uppercase mb-2.5">Items Ordered</p>
                                                    <div className="flex flex-col gap-1.5">
                                                        {order.order_items.map((item, i) => (
                                                            <div key={i} className="flex justify-between items-center text-sm text-[var(--ap-text)] font-[family-name:var(--ap-font-body)] p-2.5 bg-white rounded-md">
                                                                <span>{item.product_name} <span className="text-[var(--ap-muted)]">× {item.quantity}</span></span>
                                                                <span className="font-bold font-[family-name:var(--ap-font-heading)]">{fmt(item.total_price)}</span>
                                                            </div>
                                                        ))}
                                                        <div className="flex justify-end p-2.5 text-base font-black font-[family-name:var(--ap-font-heading)] text-[var(--ap-accent)]">
                                                            Total: {fmt(order.total_amount)}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                        {orders.length === 0 && (
                            <tr><td colSpan={10} className="p-20 text-center text-[var(--ap-muted)] font-[family-name:var(--ap-font-body)]">No orders yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile: Card layout */}
            <div className="flex flex-col gap-3 md:hidden">
                {filtered.map((order) => (
                    <div key={order.id} className="bg-white border border-[var(--ap-border)] rounded-2xl p-4 ap-animate-fadeIn">
                        {/* Order header */}
                        <div className="flex justify-between items-start mb-3" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                            <div>
                                <span className="font-bold text-[var(--ap-accent)] font-[family-name:var(--ap-font-heading)] text-sm">{order.order_number}</span>
                                {order.admin_notes && <span className="text-[#3B82F6] ml-1 text-xs">📝</span>}
                                <p className="text-xs text-[var(--ap-muted)] mt-1 truncate max-w-[200px]">{order.user_email}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-base font-[family-name:var(--ap-font-heading)]">{fmt(order.total_amount)}</p>
                                <p className="text-[0.65rem] text-[var(--ap-muted)] mt-0.5">{fmtDate(order.created_at)}</p>
                            </div>
                        </div>

                        {/* Status badges */}
                        <div className="flex gap-2 flex-wrap mb-3">
                            <Badge status={order.payment_status} />
                            <Badge status={order.order_status} />
                        </div>

                        {/* Quick status update */}
                        <div className="flex gap-2 items-center">
                            <select
                                value={order.order_status}
                                disabled={updatingOrder === order.id}
                                onChange={e => updateOrderStatus(order.id, e.target.value)}
                                className="flex-1 px-3 py-2.5 bg-[#fafaf8] border border-[var(--ap-border)] text-sm rounded-lg outline-none cursor-pointer"
                            >
                                {ORDER_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                            </select>
                            <button
                                onClick={() => setInvoiceOrder(order)}
                                className="px-3 py-2.5 bg-transparent border border-[var(--ap-border)] text-[var(--ap-text)] text-[0.65rem] font-bold font-[family-name:var(--ap-font-heading)] cursor-pointer rounded-lg tracking-wider uppercase"
                            >
                                🖨
                            </button>
                        </div>

                        {/* Expanded details */}
                        {expandedOrder === order.id && (
                            <div className="mt-4 pt-4 border-t border-[var(--ap-border-light)]">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-[0.55rem] text-[var(--ap-muted)] font-[family-name:var(--ap-font-heading)] tracking-[0.14em] uppercase mb-1">Phone</p>
                                        <p className="text-sm">{order.user_phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-[0.55rem] text-[var(--ap-muted)] font-[family-name:var(--ap-font-heading)] tracking-[0.14em] uppercase mb-1">Method</p>
                                        <p className="text-sm font-bold">{order.payment_method.toUpperCase()}</p>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <p className="text-[0.55rem] text-[var(--ap-muted)] font-[family-name:var(--ap-font-heading)] tracking-[0.14em] uppercase mb-1">Address</p>
                                    <p className="text-sm leading-relaxed">{order.shipping_address}, {order.city}, {order.state} – {order.pincode}</p>
                                </div>
                                {order.order_items && order.order_items.length > 0 && (
                                    <div className="border-t border-[var(--ap-border-light)] pt-3">
                                        <p className="text-[0.55rem] text-[var(--ap-muted)] font-[family-name:var(--ap-font-heading)] tracking-[0.14em] uppercase mb-2">Items</p>
                                        {order.order_items.map((item, i) => (
                                            <div key={i} className="flex justify-between text-sm py-1.5">
                                                <span>{item.product_name} <span className="text-[var(--ap-muted)]">×{item.quantity}</span></span>
                                                <span className="font-bold">{fmt(item.total_price)}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
                {orders.length === 0 && (
                    <p className="text-center text-[var(--ap-muted)] py-16">No orders yet.</p>
                )}
            </div>

            {/* Invoice Modal */}
            {invoiceOrder && (
                <InvoiceView order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />
            )}
        </div>
    );
}
