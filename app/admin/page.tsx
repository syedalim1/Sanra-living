"use client";

import { useState, useEffect, useCallback } from "react";

/* ── DESIGN TOKENS ──────────────────────────────────────────── */
const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";
const C = {
    bg: "#0A0A0A",
    panel: "#141414",
    card: "#1A1A1A",
    border: "#252525",
    accent: "#F0C040",
    accentDim: "#F0C04018",
    text: "#EDEDEA",
    muted: "#777",
    green: "#10B981",
    red: "#EF4444",
    blue: "#3B82F6",
    orange: "#F97316",
    purple: "#8B5CF6",
};

const fmt = (n: number) => `₹${Number(n).toLocaleString("en-IN")}`;
const fmtDate = (s: string) =>
    new Date(s).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });

const ORDER_STATUSES = ["processing", "packed", "shipped", "out_for_delivery", "delivered", "cancelled"];
const STATUS_LABELS: Record<string, string> = {
    processing: "Processing", packed: "Packed", shipped: "Shipped",
    out_for_delivery: "Out for Delivery", delivered: "Delivered", cancelled: "Cancelled",
    paid: "Paid", pending: "Pending", failed: "Failed", cod: "COD", prepaid: "Prepaid",
};
const STATUS_COLORS: Record<string, string> = {
    processing: C.blue, packed: C.purple, shipped: C.orange,
    out_for_delivery: "#F59E0B", delivered: C.green, cancelled: C.red,
    paid: C.green, pending: "#F59E0B", failed: C.red,
};

/* ── TYPES ──────────────────────────────────────────────────── */
interface Order {
    id: string; order_number: string; user_email: string; user_phone: string;
    shipping_address: string; city: string; state: string; pincode: string;
    payment_method: string; payment_status: string; order_status: string;
    total_amount: number; advance_paid: number; remaining_amount: number;
    razorpay_payment_id?: string; created_at: string;
    order_items?: { product_name: string; quantity: number; unit_price: number; total_price: number }[];
}
interface Message {
    id: string; full_name: string; email: string; phone: string;
    subject: string; message: string; created_at: string;
}
interface Enquiry {
    id: string; company_name: string; contact_person: string; phone: string;
    email: string; city: string; product_interest: string; quantity: number;
    message: string; created_at: string;
}
interface Product {
    id: string; title: string; subtitle: string; price: number; category: string;
    finish: string; stock_status: string; stock_qty: number; image_url: string;
    hover_image_url: string; is_new: boolean; is_active: boolean; created_at: string;
}

type Tab = "orders" | "messages" | "enquiries" | "products";

/* ── REUSABLE COMPONENTS ─────────────────────────────────────── */
function Badge({ status }: { status: string }) {
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

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
    return (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: "1.25rem 1.5rem", borderRadius: 10 }}>
            <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.muted, fontFamily: FM, marginBottom: "0.5rem" }}>{label}</p>
            <p style={{ fontSize: "1.65rem", fontWeight: 900, color: color ?? C.accent, fontFamily: FM, lineHeight: 1 }}>{value}</p>
            {sub && <p style={{ fontSize: "0.7rem", color: C.muted, fontFamily: FO, marginTop: "0.375rem" }}>{sub}</p>}
        </div>
    );
}

function Th({ children }: { children: React.ReactNode }) {
    return (
        <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, fontFamily: FM, borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap", background: C.panel }}>
            {children}
        </th>
    );
}
function Td({ children, style, onClick }: { children: React.ReactNode; style?: React.CSSProperties; onClick?: (e: React.MouseEvent<HTMLTableCellElement>) => void }) {
    return (
        <td onClick={onClick} style={{ padding: "0.875rem 1rem", verticalAlign: "middle", ...style }}>
            {children}
        </td>
    );
}

/* ── MAIN COMPONENT ─────────────────────────────────────────── */
export default function AdminPage() {
    const [authed, setAuthed] = useState(false);
    const [pw, setPw] = useState("");
    const [pwError, setPwError] = useState("");
    const [adminKey, setAdminKey] = useState("");
    const [tab, setTab] = useState<Tab>("orders");

    const [orders, setOrders] = useState<Order[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    const [loading, setLoading] = useState(false);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

    // Product edit state
    const [editingProduct, setEditingProduct] = useState<string | null>(null);
    const [editVals, setEditVals] = useState<Partial<Product>>({});
    const [savingProduct, setSavingProduct] = useState(false);

    // Add product form
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [newProduct, setNewProduct] = useState({
        title: "", subtitle: "", price: "", category: "Entryway Storage",
        finish: "Matte Black", stock_status: "In Stock", stock_qty: "99",
        image_url: "", hover_image_url: "", is_new: false,
    });
    const [addingProduct, setAddingProduct] = useState(false);

    /* ── AUTH ─────────────────────────────────────────────────── */
    useEffect(() => {
        const saved = sessionStorage.getItem("admin_authed");
        const key = sessionStorage.getItem("admin_key");
        if (saved === "1" && key) { setAuthed(true); setAdminKey(key); }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin/orders", { headers: { "x-admin-key": pw } });
            if (res.ok) {
                sessionStorage.setItem("admin_authed", "1");
                sessionStorage.setItem("admin_key", pw);
                setAdminKey(pw);
                setAuthed(true);
            } else {
                setPwError("Incorrect password. Please try again.");
            }
        } catch {
            setPwError("Connection error. Please try again.");
        }
    };

    /* ── DATA FETCHING ───────────────────────────────────────── */
    const fetchData = useCallback(async (t: Tab) => {
        setLoading(true);
        try {
            const headers = { "x-admin-key": adminKey };
            if (t === "orders") {
                const res = await fetch("/api/admin/orders", { headers });
                setOrders((await res.json()).orders ?? []);
            } else if (t === "messages") {
                const res = await fetch("/api/admin/messages", { headers });
                setMessages((await res.json()).messages ?? []);
            } else if (t === "enquiries") {
                const res = await fetch("/api/admin/enquiries", { headers });
                setEnquiries((await res.json()).enquiries ?? []);
            } else if (t === "products") {
                const res = await fetch("/api/admin/products", { headers });
                setProducts((await res.json()).products ?? []);
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, [adminKey]);

    useEffect(() => { if (authed) fetchData(tab); }, [authed, tab, fetchData]);

    /* ── ORDER STATUS UPDATE ─────────────────────────────────── */
    const updateOrderStatus = async (orderId: string, status: string) => {
        setUpdatingOrder(orderId);
        try {
            await fetch(`/api/admin/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
                body: JSON.stringify({ order_status: status }),
            });
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, order_status: status } : o));
        } catch (err) { console.error(err); }
        finally { setUpdatingOrder(null); }
    };

    /* ── PRODUCT ACTIONS ─────────────────────────────────────── */
    const toggleProductActive = async (product: Product) => {
        await fetch(`/api/admin/products?id=${product.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
            body: JSON.stringify({ is_active: !product.is_active }),
        });
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_active: !p.is_active } : p));
    };

    const startEdit = (product: Product) => {
        setEditingProduct(product.id);
        setEditVals({ price: product.price, stock_qty: product.stock_qty, stock_status: product.stock_status, title: product.title });
    };

    const saveEdit = async (productId: string) => {
        setSavingProduct(true);
        try {
            await fetch(`/api/admin/products?id=${productId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
                body: JSON.stringify(editVals),
            });
            setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...editVals } : p));
            setEditingProduct(null);
        } catch (err) { console.error(err); }
        finally { setSavingProduct(false); }
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setAddingProduct(true);
        try {
            const res = await fetch("/api/admin/products", {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
                body: JSON.stringify({ ...newProduct, price: Number(newProduct.price), stock_qty: Number(newProduct.stock_qty) }),
            });
            if (!res.ok) throw new Error("Failed");
            setShowAddProduct(false);
            setNewProduct({ title: "", subtitle: "", price: "", category: "Entryway Storage", finish: "Matte Black", stock_status: "In Stock", stock_qty: "99", image_url: "", hover_image_url: "", is_new: false });
            fetchData("products");
        } catch (err) { console.error(err); }
        finally { setAddingProduct(false); }
    };

    /* ── LOGIN SCREEN ───────────────────────────────────────── */
    if (!authed) {
        return (
            <main style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", fontFamily: FO }}>
                <div style={{ background: C.panel, border: `1px solid ${C.border}`, padding: "2.5rem", width: "100%", maxWidth: 380, borderRadius: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.accent }} />
                        <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: C.muted, fontFamily: FM }}>SANRA LIVING™ · Admin</span>
                    </div>
                    <h1 style={{ fontSize: "1.6rem", fontWeight: 900, color: C.text, fontFamily: FM, marginBottom: "0.5rem" }}>Dashboard Login</h1>
                    <p style={{ fontSize: "0.82rem", color: C.muted, fontFamily: FO, marginBottom: "2rem" }}>Enter your admin password to continue.</p>
                    <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <input
                            type="password" value={pw}
                            onChange={(e) => { setPw(e.target.value); setPwError(""); }}
                            placeholder="Password"
                            autoFocus
                            style={{ padding: "0.875rem 1rem", background: "#0F0F0F", border: `1px solid ${C.border}`, color: C.text, fontSize: "0.95rem", fontFamily: FO, borderRadius: 6, outline: "none" }}
                        />
                        {pwError && <p style={{ fontSize: "0.78rem", color: C.red, fontFamily: FO }}>{pwError}</p>}
                        <button type="submit" style={{ padding: "0.875rem", background: C.accent, color: "#111", fontWeight: 900, fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase", border: "none", cursor: "pointer", borderRadius: 6, fontFamily: FM }}>
                            Access Dashboard →
                        </button>
                    </form>
                </div>
            </main>
        );
    }

    /* ── COMPUTED STATS ──────────────────────────────────────── */
    const paidOrders = orders.filter(o => o.payment_status === "paid");
    const totalRevenue = paidOrders.reduce((s, o) => s + o.total_amount, 0);
    const pendingOrders = orders.filter(o => o.order_status === "processing").length;
    const liveProducts = products.filter(p => p.is_active).length;

    const inputStyle: React.CSSProperties = {
        background: "#0F0F0F", border: `1px solid ${C.border}`, color: C.text,
        fontSize: "0.82rem", fontFamily: FO, borderRadius: 4, padding: "0.35rem 0.6rem", width: "100%",
    };
    const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer" };

    /* ── DASHBOARD ───────────────────────────────────────────── */
    return (
        <main style={{ background: C.bg, minHeight: "100vh", fontFamily: FO, color: C.text }}>

            {/* ── HEADER ── */}
            <header style={{ background: C.panel, borderBottom: `1px solid ${C.border}`, padding: "0 1.5rem", position: "sticky", top: 0, zIndex: 50 }}>
                <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.accent }} />
                        <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: C.accent, fontFamily: FM }}>SANRA LIVING™</span>
                        <span style={{ color: C.border }}>|</span>
                        <span style={{ fontSize: "0.78rem", color: C.muted, fontFamily: FM }}>Admin Dashboard</span>
                    </div>
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                        <button onClick={() => fetchData(tab)} style={{ fontSize: "0.7rem", color: C.muted, background: "none", border: `1px solid ${C.border}`, cursor: "pointer", fontFamily: FM, letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.4rem 0.875rem", borderRadius: 4 }}>
                            ↻ Refresh
                        </button>
                        <button onClick={() => { sessionStorage.clear(); setAuthed(false); }} style={{ fontSize: "0.7rem", color: C.muted, background: "none", border: "none", cursor: "pointer", fontFamily: FM, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            <div style={{ maxWidth: 1400, margin: "0 auto", padding: "2rem 1.5rem" }}>

                {/* ── STATS ── */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                    <StatCard label="Total Orders" value={orders.length} sub={`${pendingOrders} pending`} />
                    <StatCard label="Revenue (Paid)" value={fmt(totalRevenue)} color={C.green} sub={`${paidOrders.length} paid orders`} />
                    <StatCard label="Enquiries" value={enquiries.length} />
                    <StatCard label="Messages" value={messages.length} />
                    <StatCard label="Products Live" value={liveProducts} sub={`of ${products.length} total`} />
                </div>

                {/* ── TABS ── */}
                <div style={{ display: "flex", gap: 0, marginBottom: "1.5rem", borderBottom: `1px solid ${C.border}` }}>
                    {(["orders", "messages", "enquiries", "products"] as Tab[]).map((t) => (
                        <button key={t} onClick={() => setTab(t)} style={{
                            padding: "0.8rem 1.25rem", background: "none", border: "none", cursor: "pointer",
                            fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: FM,
                            color: tab === t ? C.accent : C.muted,
                            borderBottom: tab === t ? `2px solid ${C.accent}` : "2px solid transparent",
                            transition: "all 0.15s", marginBottom: -1,
                        }}>
                            {t}
                        </button>
                    ))}
                </div>

                {loading && (
                    <div style={{ textAlign: "center", padding: "5rem", color: C.muted, fontFamily: FO }}>
                        <div style={{ fontSize: "2rem", marginBottom: "1rem", opacity: 0.4 }}>⟳</div>
                        Loading…
                    </div>
                )}

                {/* ══════════════════════ ORDERS TAB ════════════════════════ */}
                {!loading && tab === "orders" && (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    <Th>Order #</Th>
                                    <Th>Customer</Th>
                                    <Th>Phone</Th>
                                    <Th>Total</Th>
                                    <Th>Payment</Th>
                                    <Th>Method</Th>
                                    <Th>Order Status</Th>
                                    <Th>Update Status</Th>
                                    <Th>Date</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <>
                                        <tr
                                            key={order.id}
                                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                            style={{ borderBottom: `1px solid ${C.border}`, cursor: "pointer", transition: "background 0.12s" }}
                                            onMouseEnter={e => (e.currentTarget.style.background = "#1a1a1a")}
                                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                        >
                                            <Td><span style={{ fontWeight: 700, color: C.accent, fontFamily: FM, fontSize: "0.82rem" }}>{order.order_number}</span></Td>
                                            <Td><span style={{ fontSize: "0.82rem", color: C.text }}>{order.user_email}</span></Td>
                                            <Td><span style={{ fontSize: "0.8rem", color: C.muted }}>{order.user_phone}</span></Td>
                                            <Td><span style={{ fontWeight: 700, fontSize: "0.85rem", fontFamily: FM }}>{fmt(order.total_amount)}</span></Td>
                                            <Td><Badge status={order.payment_status} /></Td>
                                            <Td><Badge status={order.payment_method} /></Td>
                                            <Td><Badge status={order.order_status} /></Td>
                                            <Td style={{ minWidth: 160 }} onClick={e => e.stopPropagation()}>
                                                <select
                                                    value={order.order_status}
                                                    disabled={updatingOrder === order.id}
                                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                    style={selectStyle}
                                                >
                                                    {ORDER_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                                                </select>
                                            </Td>
                                            <Td><span style={{ fontSize: "0.72rem", color: C.muted, whiteSpace: "nowrap" }}>{fmtDate(order.created_at)}</span></Td>
                                        </tr>

                                        {/* ── ORDER DETAIL EXPAND ── */}
                                        {expandedOrder === order.id && (
                                            <tr key={`${order.id}-expanded`}>
                                                <td colSpan={9} style={{ background: "#111", padding: "1.25rem 1.5rem 1.5rem", borderBottom: `1px solid ${C.border}` }}>
                                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1.5rem", marginBottom: "1.25rem" }}>
                                                        {/* Shipping */}
                                                        <div>
                                                            <p style={{ fontSize: "0.58rem", color: C.muted, fontFamily: FM, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Shipping Address</p>
                                                            <p style={{ fontSize: "0.82rem", color: C.text, fontFamily: FO, lineHeight: 1.7 }}>
                                                                {order.shipping_address}<br />
                                                                {order.city}, {order.state} – {order.pincode}
                                                            </p>
                                                        </div>
                                                        {/* Payment Info */}
                                                        <div>
                                                            <p style={{ fontSize: "0.58rem", color: C.muted, fontFamily: FM, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Payment Details</p>
                                                            <p style={{ fontSize: "0.82rem", color: C.text, fontFamily: FO, lineHeight: 1.8 }}>
                                                                Method: <strong>{order.payment_method.toUpperCase()}</strong><br />
                                                                Advance Paid: <strong style={{ color: C.green }}>{fmt(order.advance_paid)}</strong><br />
                                                                Remaining COD: <strong style={{ color: order.remaining_amount > 0 ? C.orange : C.muted }}>{fmt(order.remaining_amount)}</strong>
                                                            </p>
                                                        </div>
                                                        {/* Payment ID */}
                                                        {order.razorpay_payment_id && (
                                                            <div>
                                                                <p style={{ fontSize: "0.58rem", color: C.muted, fontFamily: FM, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Payment ID</p>
                                                                <p style={{ fontSize: "0.75rem", color: C.blue, fontFamily: "monospace", wordBreak: "break-all" }}>{order.razorpay_payment_id}</p>
                                                            </div>
                                                        )}
                                                        {/* Quick Actions */}
                                                        <div>
                                                            <p style={{ fontSize: "0.58rem", color: C.muted, fontFamily: FM, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Quick Actions</p>
                                                            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                                                {["packed", "shipped", "out_for_delivery", "delivered"].map(s => (
                                                                    <button key={s}
                                                                        onClick={() => updateOrderStatus(order.id, s)}
                                                                        disabled={order.order_status === s}
                                                                        style={{ padding: "0.4rem 0.75rem", background: order.order_status === s ? C.accentDim : "transparent", border: `1px solid ${order.order_status === s ? C.accent : C.border}`, color: order.order_status === s ? C.accent : C.muted, fontSize: "0.68rem", fontWeight: 700, fontFamily: FM, cursor: order.order_status === s ? "default" : "pointer", borderRadius: 4, letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "left" }}>
                                                                        {order.order_status === s ? "✓ " : ""}{STATUS_LABELS[s]}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Items List */}
                                                    {order.order_items && order.order_items.length > 0 && (
                                                        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "1rem" }}>
                                                            <p style={{ fontSize: "0.58rem", color: C.muted, fontFamily: FM, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.625rem" }}>Items Ordered</p>
                                                            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                                                                {order.order_items.map((item, i) => (
                                                                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.82rem", color: C.text, fontFamily: FO, padding: "0.5rem 0.875rem", background: C.card, borderRadius: 6 }}>
                                                                        <span>{item.product_name} <span style={{ color: C.muted }}>× {item.quantity}</span></span>
                                                                        <span style={{ fontWeight: 700, fontFamily: FM }}>{fmt(item.total_price)}</span>
                                                                    </div>
                                                                ))}
                                                                <div style={{ display: "flex", justifyContent: "flex-end", padding: "0.5rem 0.875rem", fontSize: "0.88rem", fontWeight: 900, fontFamily: FM, color: C.accent }}>
                                                                    Total: {fmt(order.total_amount)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                                {orders.length === 0 && (
                                    <tr><td colSpan={9} style={{ padding: "5rem", textAlign: "center", color: C.muted, fontFamily: FO }}>No orders yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ══════════════════════ MESSAGES TAB ══════════════════════ */}
                {!loading && tab === "messages" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {messages.length === 0 && <p style={{ color: C.muted, fontFamily: FO, padding: "5rem", textAlign: "center" }}>No messages yet.</p>}
                        {messages.map((msg) => (
                            <div key={msg.id} style={{ background: C.card, border: `1px solid ${C.border}`, padding: "1.25rem 1.5rem", borderRadius: 10 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.875rem" }}>
                                    <div>
                                        <p style={{ fontSize: "0.92rem", fontWeight: 700, color: C.text, fontFamily: FM }}>{msg.full_name}</p>
                                        <p style={{ fontSize: "0.75rem", color: C.muted, fontFamily: FO, marginTop: "0.2rem" }}>{msg.email}{msg.phone && ` · ${msg.phone}`}</p>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexWrap: "wrap" }}>
                                        {msg.subject && <span style={{ fontSize: "0.62rem", fontWeight: 700, padding: "0.2rem 0.6rem", background: `${C.blue}22`, color: C.blue, borderRadius: 4, fontFamily: FM, letterSpacing: "0.08em", textTransform: "uppercase" }}>{msg.subject}</span>}
                                        <span style={{ fontSize: "0.72rem", color: C.muted, fontFamily: FO }}>{fmtDate(msg.created_at)}</span>
                                        <a
                                            href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject ?? "Your Enquiry — SANRA LIVING™")}&body=${encodeURIComponent(`Hi ${msg.full_name},\n\nThank you for reaching out to SANRA LIVING™.\n\n`)}`}
                                            style={{ display: "inline-block", padding: "0.35rem 0.875rem", background: C.accentDim, border: `1px solid ${C.accent}`, color: C.accent, fontSize: "0.65rem", fontWeight: 700, fontFamily: FM, borderRadius: 4, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}
                                        >
                                            ✉ Reply
                                        </a>
                                    </div>
                                </div>
                                <p style={{ fontSize: "0.875rem", color: "#ccc", fontFamily: FO, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{msg.message}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* ══════════════════════ ENQUIRIES TAB ═════════════════════ */}
                {!loading && tab === "enquiries" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {enquiries.length === 0 && <p style={{ color: C.muted, fontFamily: FO, padding: "5rem", textAlign: "center" }}>No bulk enquiries yet.</p>}
                        {enquiries.map((enq) => (
                            <div key={enq.id} style={{ background: C.card, border: `1px solid ${C.border}`, padding: "1.25rem 1.5rem", borderRadius: 10 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1rem" }}>
                                    <div>
                                        <p style={{ fontSize: "0.92rem", fontWeight: 700, color: C.text, fontFamily: FM }}>
                                            {enq.company_name || "—"} <span style={{ fontWeight: 400, color: C.muted }}>· {enq.contact_person}</span>
                                        </p>
                                        <p style={{ fontSize: "0.75rem", color: C.muted, fontFamily: FO, marginTop: "0.2rem" }}>{enq.email} · {enq.phone}{enq.city && ` · ${enq.city}`}</p>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                                        <span style={{ fontSize: "0.72rem", color: C.muted, fontFamily: FO }}>{fmtDate(enq.created_at)}</span>
                                        <a
                                            href={`mailto:${enq.email}?subject=Re: Bulk Enquiry — SANRA LIVING™&body=${encodeURIComponent(`Hi ${enq.contact_person},\n\nThank you for your bulk enquiry at SANRA LIVING™.\n\n`)}`}
                                            style={{ display: "inline-block", padding: "0.35rem 0.875rem", background: C.accentDim, border: `1px solid ${C.accent}`, color: C.accent, fontSize: "0.65rem", fontWeight: 700, fontFamily: FM, borderRadius: 4, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}
                                        >
                                            ✉ Reply
                                        </a>
                                    </div>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.75rem", marginBottom: enq.message ? "1rem" : 0 }}>
                                    {enq.product_interest && (
                                        <div>
                                            <p style={{ fontSize: "0.58rem", color: C.muted, fontFamily: FM, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Product</p>
                                            <p style={{ fontSize: "0.82rem", color: C.text, fontFamily: FO }}>{enq.product_interest}</p>
                                        </div>
                                    )}
                                    {enq.quantity && (
                                        <div>
                                            <p style={{ fontSize: "0.58rem", color: C.muted, fontFamily: FM, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Quantity</p>
                                            <p style={{ fontSize: "0.82rem", color: C.accent, fontFamily: FM, fontWeight: 700 }}>{enq.quantity} units</p>
                                        </div>
                                    )}
                                </div>
                                {enq.message && (
                                    <p style={{ fontSize: "0.875rem", color: "#ccc", fontFamily: FO, lineHeight: 1.75, borderTop: `1px solid ${C.border}`, paddingTop: "0.875rem", whiteSpace: "pre-wrap" }}>{enq.message}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* ══════════════════════ PRODUCTS TAB ═════════════════════ */}
                {!loading && tab === "products" && (
                    <div>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
                            <button
                                onClick={() => setShowAddProduct(v => !v)}
                                style={{ padding: "0.7rem 1.5rem", background: showAddProduct ? "transparent" : C.accent, color: showAddProduct ? C.muted : "#111", fontWeight: 900, fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", border: `1px solid ${showAddProduct ? C.border : C.accent}`, cursor: "pointer", borderRadius: 6, fontFamily: FM }}
                            >
                                {showAddProduct ? "✕ Cancel" : "+ Add Product"}
                            </button>
                        </div>

                        {/* Add Product Form */}
                        {showAddProduct && (
                            <form onSubmit={handleAddProduct} style={{ background: C.card, border: `1px solid ${C.border}`, padding: "1.5rem", borderRadius: 10, marginBottom: "1.5rem" }}>
                                <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.accent, fontFamily: FM, marginBottom: "1.25rem" }}>New Product</p>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                                    {[
                                        { label: "Title *", key: "title" },
                                        { label: "Subtitle", key: "subtitle" },
                                        { label: "Price (₹) *", key: "price", type: "number" },
                                        { label: "Stock Qty", key: "stock_qty", type: "number" },
                                        { label: "Image URL", key: "image_url" },
                                        { label: "Hover Image URL", key: "hover_image_url" },
                                    ].map(({ label, key, type = "text" }) => (
                                        <div key={key}>
                                            <label style={{ display: "block", fontSize: "0.6rem", fontWeight: 700, color: C.muted, fontFamily: FM, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>{label}</label>
                                            <input
                                                type={type} value={newProduct[key as keyof typeof newProduct] as string}
                                                onChange={(e) => setNewProduct(p => ({ ...p, [key]: e.target.value }))}
                                                style={{ ...inputStyle, width: "100%", boxSizing: "border-box", padding: "0.625rem 0.875rem" }}
                                            />
                                        </div>
                                    ))}
                                    <div>
                                        <label style={{ display: "block", fontSize: "0.6rem", fontWeight: 700, color: C.muted, fontFamily: FM, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Category *</label>
                                        <select value={newProduct.category} onChange={(e) => setNewProduct(p => ({ ...p, category: e.target.value }))} style={{ ...selectStyle, width: "100%", boxSizing: "border-box", padding: "0.625rem 0.875rem" }}>
                                            {["Entryway Storage", "Study Desks", "Wall Storage", "Bedroom", "Living Room", "Other"].map(c => <option key={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: "0.6rem", fontWeight: 700, color: C.muted, fontFamily: FM, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Finish</label>
                                        <select value={newProduct.finish} onChange={(e) => setNewProduct(p => ({ ...p, finish: e.target.value }))} style={{ ...selectStyle, width: "100%", boxSizing: "border-box", padding: "0.625rem 0.875rem" }}>
                                            {["Matte Black", "Graphite Grey", "White", "Bronze"].map(f => <option key={f}>{f}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: "0.6rem", fontWeight: 700, color: C.muted, fontFamily: FM, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Stock Status</label>
                                        <select value={newProduct.stock_status} onChange={(e) => setNewProduct(p => ({ ...p, stock_status: e.target.value }))} style={{ ...selectStyle, width: "100%", boxSizing: "border-box", padding: "0.625rem 0.875rem" }}>
                                            {["In Stock", "Only 12 Left", "Only 3 Left", "New", "Limited", "Out of Stock"].map(s => <option key={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", paddingTop: "1.5rem" }}>
                                        <input type="checkbox" id="is_new" checked={newProduct.is_new} onChange={(e) => setNewProduct(p => ({ ...p, is_new: e.target.checked }))} style={{ width: 16, height: 16, accentColor: C.accent }} />
                                        <label htmlFor="is_new" style={{ fontSize: "0.82rem", color: C.text, fontFamily: FO, cursor: "pointer" }}>Mark as New Arrival</label>
                                    </div>
                                </div>
                                <div style={{ marginTop: "1.25rem" }}>
                                    <button type="submit" disabled={addingProduct} style={{ padding: "0.75rem 2rem", background: C.accent, color: "#111", fontWeight: 900, fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", border: "none", cursor: "pointer", borderRadius: 6, fontFamily: FM }}>
                                        {addingProduct ? "Adding…" : "Add Product"}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Products Table */}
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr>
                                        <Th>Title</Th>
                                        <Th>Category</Th>
                                        <Th>Price (₹)</Th>
                                        <Th>Stock Qty</Th>
                                        <Th>Stock Status</Th>
                                        <Th>Finish</Th>
                                        <Th>Status</Th>
                                        <Th>Actions</Th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => {
                                        const isEditing = editingProduct === product.id;
                                        return (
                                            <tr key={product.id} style={{ borderBottom: `1px solid ${C.border}`, opacity: product.is_active ? 1 : 0.5, transition: "opacity 0.2s" }}>
                                                <Td>
                                                    {isEditing ? (
                                                        <input value={editVals.title ?? product.title} onChange={e => setEditVals(v => ({ ...v, title: e.target.value }))} style={{ ...inputStyle, minWidth: 140 }} />
                                                    ) : (
                                                        <>
                                                            <p style={{ fontSize: "0.85rem", fontWeight: 700, color: C.text, fontFamily: FM }}>{product.title}</p>
                                                            <p style={{ fontSize: "0.7rem", color: C.muted, fontFamily: FO }}>{product.subtitle}</p>
                                                        </>
                                                    )}
                                                </Td>
                                                <Td><span style={{ fontSize: "0.78rem", color: C.muted }}>{product.category}</span></Td>
                                                <Td>
                                                    {isEditing ? (
                                                        <input type="number" value={editVals.price ?? product.price} onChange={e => setEditVals(v => ({ ...v, price: Number(e.target.value) }))} style={{ ...inputStyle, width: 90 }} />
                                                    ) : (
                                                        <span style={{ fontWeight: 700, color: C.accent, fontFamily: FM, fontSize: "0.88rem" }}>{fmt(product.price)}</span>
                                                    )}
                                                </Td>
                                                <Td>
                                                    {isEditing ? (
                                                        <input type="number" value={editVals.stock_qty ?? product.stock_qty} onChange={e => setEditVals(v => ({ ...v, stock_qty: Number(e.target.value) }))} style={{ ...inputStyle, width: 80 }} />
                                                    ) : (
                                                        <span style={{ fontSize: "0.82rem", color: C.text }}>{product.stock_qty}</span>
                                                    )}
                                                </Td>
                                                <Td>
                                                    {isEditing ? (
                                                        <select value={editVals.stock_status ?? product.stock_status} onChange={e => setEditVals(v => ({ ...v, stock_status: e.target.value }))} style={selectStyle}>
                                                            {["In Stock", "Only 12 Left", "Only 3 Left", "New", "Limited", "Out of Stock"].map(s => <option key={s}>{s}</option>)}
                                                        </select>
                                                    ) : (
                                                        <span style={{ fontSize: "0.78rem", color: C.muted }}>{product.stock_status}</span>
                                                    )}
                                                </Td>
                                                <Td><span style={{ fontSize: "0.78rem", color: C.muted }}>{product.finish}</span></Td>
                                                <Td>
                                                    <span style={{ display: "inline-block", padding: "0.2rem 0.6rem", borderRadius: 4, fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: FM, background: product.is_active ? `${C.green}22` : `${C.red}22`, color: product.is_active ? C.green : C.red }}>
                                                        {product.is_active ? "Live" : "Hidden"}
                                                    </span>
                                                </Td>
                                                <Td>
                                                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                                                        {isEditing ? (
                                                            <>
                                                                <button onClick={() => saveEdit(product.id)} disabled={savingProduct} style={{ padding: "0.35rem 0.75rem", background: C.green, border: "none", color: "#fff", fontSize: "0.65rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                                                                    {savingProduct ? "…" : "Save"}
                                                                </button>
                                                                <button onClick={() => setEditingProduct(null)} style={{ padding: "0.35rem 0.75rem", background: "transparent", border: `1px solid ${C.border}`, color: C.muted, fontSize: "0.65rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                                                                    Cancel
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button onClick={() => startEdit(product)} style={{ padding: "0.35rem 0.75rem", background: "transparent", border: `1px solid ${C.border}`, color: C.blue, fontSize: "0.65rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                                                                    Edit
                                                                </button>
                                                                <button onClick={() => toggleProductActive(product)} style={{ padding: "0.35rem 0.75rem", background: "transparent", border: `1px solid ${C.border}`, color: product.is_active ? C.red : C.green, fontSize: "0.65rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                                                                    {product.is_active ? "Hide" : "Publish"}
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </Td>
                                            </tr>
                                        );
                                    })}
                                    {products.length === 0 && (
                                        <tr><td colSpan={8} style={{ padding: "5rem", textAlign: "center", color: C.muted, fontFamily: FO }}>No products yet. Add one above.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}
