"use client";

import { useState, useEffect, useCallback } from "react";

/* ── FONTS / TOKENS ─────────────────────────────────────────── */
const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";
const C = { bg: "#0F0F0F", panel: "#1A1A1A", border: "#2A2A2A", accent: "#F0C040", text: "#EDEDEA", muted: "#888" };

const fmt = (n: number) => `₹${Number(n).toLocaleString("en-IN")}`;
const fmtDate = (s: string) =>
    new Date(s).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

const ORDER_STATUSES = ["processing", "packed", "shipped", "out_for_delivery", "delivered", "cancelled"];
const STATUS_LABELS: Record<string, string> = {
    processing: "Processing", packed: "Packed", shipped: "Shipped",
    out_for_delivery: "Out for Delivery", delivered: "Delivered", cancelled: "Cancelled",
};

/* ── TYPES ──────────────────────────────────────────────────── */
interface Order {
    id: string; order_number: string; user_email: string; user_phone: string;
    shipping_address: string; city: string; state: string; pincode: string;
    payment_method: string; payment_status: string; order_status: string;
    total_amount: number; advance_paid: number; remaining_amount: number;
    created_at: string;
    order_items?: { product_name: string; quantity: number; unit_price: number; total_price: number }[];
}
interface Message {
    id: string; full_name: string; email: string; phone: string; subject: string; message: string; created_at: string;
}
interface Enquiry {
    id: string; company_name: string; contact_person: string; phone: string; email: string;
    city: string; product_interest: string; quantity: number; message: string; created_at: string;
}
interface Product {
    id: string; title: string; subtitle: string; price: number; category: string; finish: string;
    stock_status: string; stock_qty: number; image_url: string; hover_image_url: string;
    is_new: boolean; is_active: boolean; created_at: string;
}

type Tab = "orders" | "messages" | "enquiries" | "products";

/* ── STATUS BADGE ───────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
    const map: Record<string, string> = {
        processing: "#3B82F6", packed: "#8B5CF6", shipped: "#F59E0B",
        out_for_delivery: "#F97316", delivered: "#10B981", cancelled: "#EF4444",
        paid: "#10B981", pending: "#F59E0B",
    };
    return (
        <span style={{
            display: "inline-block", padding: "0.2rem 0.6rem", borderRadius: 4,
            fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
            background: `${map[status] ?? "#555"}22`, color: map[status] ?? "#aaa", fontFamily: FM,
        }}>
            {STATUS_LABELS[status] ?? status}
        </span>
    );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color?: string }) {
    return (
        <div style={{ background: C.panel, border: `1px solid ${C.border}`, padding: "1.25rem 1.5rem", borderRadius: 8 }}>
            <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted, fontFamily: FM, marginBottom: "0.5rem" }}>{label}</p>
            <p style={{ fontSize: "1.6rem", fontWeight: 900, color: color ?? C.accent, fontFamily: FM }}>{value}</p>
        </div>
    );
}

export default function AdminPage() {
    const [authed, setAuthed] = useState(false);
    const [pw, setPw] = useState("");
    const [pwError, setPwError] = useState("");
    const [tab, setTab] = useState<Tab>("orders");
    const [orders, setOrders] = useState<Order[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [newProduct, setNewProduct] = useState({
        title: "", subtitle: "", price: "", category: "Entryway Storage",
        finish: "Matte Black", stock_status: "In Stock", stock_qty: "99",
        image_url: "", hover_image_url: "", is_new: false,
    });
    const [addingProduct, setAddingProduct] = useState(false);
    const [adminKey, setAdminKey] = useState("");

    /* Auth check */
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

    const fetchData = useCallback(async (t: Tab) => {
        setLoading(true);
        try {
            if (t === "orders") {
                const res = await fetch("/api/admin/orders", { headers: { "x-admin-key": adminKey } });
                const json = await res.json();
                setOrders(json.orders ?? []);
            } else if (t === "messages") {
                const res = await fetch("/api/admin/messages", { headers: { "x-admin-key": adminKey } });
                const json = await res.json();
                setMessages(json.messages ?? []);
            } else if (t === "enquiries") {
                const res = await fetch("/api/admin/enquiries", { headers: { "x-admin-key": adminKey } });
                const json = await res.json();
                setEnquiries(json.enquiries ?? []);
            } else if (t === "products") {
                const res = await fetch("/api/admin/products", { headers: { "x-admin-key": adminKey } });
                const json = await res.json();
                setProducts(json.products ?? []);
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, [adminKey]);

    useEffect(() => {
        if (authed) fetchData(tab);
    }, [authed, tab, fetchData]);

    const updateOrderStatus = async (orderId: string, status: string) => {
        setUpdatingOrder(orderId);
        try {
            await fetch(`/api/admin/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
                body: JSON.stringify({ order_status: status }),
            });
            setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, order_status: status } : o));
        } catch (err) { console.error(err); }
        finally { setUpdatingOrder(null); }
    };

    const toggleProductActive = async (product: Product) => {
        try {
            await fetch(`/api/admin/products?id=${product.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
                body: JSON.stringify({ is_active: !product.is_active }),
            });
            setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, is_active: !p.is_active } : p));
        } catch (err) { console.error(err); }
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
                <div style={{ background: C.panel, border: `1px solid ${C.border}`, padding: "2.5rem", width: "100%", maxWidth: 380, borderRadius: 12 }}>
                    <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.muted, fontFamily: FM, marginBottom: "0.5rem" }}>Sanra Living</p>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: C.text, fontFamily: FM, marginBottom: "2rem" }}>Admin Login</h1>
                    <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <input
                            type="password" value={pw} onChange={(e) => { setPw(e.target.value); setPwError(""); }}
                            placeholder="Admin Password"
                            style={{ padding: "0.875rem 1rem", background: "#111", border: `1px solid ${C.border}`, color: C.text, fontSize: "0.95rem", fontFamily: FO, borderRadius: 6, outline: "none" }}
                        />
                        {pwError && <p style={{ fontSize: "0.8rem", color: "#EF4444", fontFamily: FO }}>{pwError}</p>}
                        <button type="submit" style={{ padding: "0.875rem", background: C.accent, color: "#111", fontWeight: 900, fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase", border: "none", cursor: "pointer", borderRadius: 6, fontFamily: FM }}>
                            Access Dashboard
                        </button>
                    </form>
                </div>
            </main>
        );
    }

    const totalRevenue = orders.filter((o) => o.payment_status === "paid").reduce((s, o) => s + o.total_amount, 0);

    /* ── DASHBOARD ──────────────────────────────────────────── */
    return (
        <main style={{ background: C.bg, minHeight: "100vh", fontFamily: FO, color: C.text }}>
            {/* Header */}
            <header style={{ background: C.panel, borderBottom: `1px solid ${C.border}`, padding: "0 1.5rem", position: "sticky", top: 0, zIndex: 50 }}>
                <div style={{ maxWidth: 1300, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: C.accent, fontFamily: FM }}>SANRA LIVING</span>
                        <span style={{ color: C.border }}>|</span>
                        <span style={{ fontSize: "0.85rem", color: C.muted, fontFamily: FM }}>Admin Dashboard</span>
                    </div>
                    <button
                        onClick={() => { sessionStorage.clear(); setAuthed(false); }}
                        style={{ fontSize: "0.72rem", color: C.muted, background: "none", border: "none", cursor: "pointer", fontFamily: FM, letterSpacing: "0.08em", textTransform: "uppercase" }}
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            <div style={{ maxWidth: 1300, margin: "0 auto", padding: "2rem 1.5rem" }}>

                {/* Stats Row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                    <StatCard label="Total Orders" value={orders.length} />
                    <StatCard label="Revenue (Paid)" value={fmt(totalRevenue)} color="#10B981" />
                    <StatCard label="Messages" value={messages.length} />
                    <StatCard label="Bulk Enquiries" value={enquiries.length} />
                    <StatCard label="Products Live" value={products.filter((p) => p.is_active).length} />
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1.5rem", borderBottom: `1px solid ${C.border}`, paddingBottom: "0" }}>
                    {(["orders", "messages", "enquiries", "products"] as Tab[]).map((t) => (
                        <button key={t} onClick={() => setTab(t)} style={{
                            padding: "0.75rem 1.25rem", background: "none", border: "none", cursor: "pointer",
                            fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: FM,
                            color: tab === t ? C.accent : C.muted,
                            borderBottom: tab === t ? `2px solid ${C.accent}` : "2px solid transparent",
                            transition: "all 0.2s", marginBottom: "-1px",
                        }}>
                            {t}
                        </button>
                    ))}
                </div>

                {loading && (
                    <div style={{ textAlign: "center", padding: "4rem", color: C.muted, fontFamily: FO }}>Loading…</div>
                )}

                {/* ── ORDERS TAB ──────────────────────────────── */}
                {!loading && tab === "orders" && (
                    <div>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ background: C.panel }}>
                                        {["Order #", "Customer", "Phone", "Total", "Payment", "Status", "Update Status", "Date"].map((h) => (
                                            <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, fontFamily: FM, borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <>
                                            <tr
                                                key={order.id}
                                                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                                style={{ borderBottom: `1px solid ${C.border}`, cursor: "pointer", transition: "background 0.15s" }}
                                                onMouseEnter={(e) => (e.currentTarget.style.background = "#1f1f1f")}
                                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                            >
                                                <td style={{ padding: "0.875rem 1rem", fontSize: "0.82rem", fontWeight: 700, color: C.accent, fontFamily: FM, whiteSpace: "nowrap" }}>{order.order_number}</td>
                                                <td style={{ padding: "0.875rem 1rem", fontSize: "0.82rem", color: C.text, fontFamily: FO, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis" }}>{order.user_email}</td>
                                                <td style={{ padding: "0.875rem 1rem", fontSize: "0.82rem", color: C.muted, fontFamily: FO, whiteSpace: "nowrap" }}>{order.user_phone}</td>
                                                <td style={{ padding: "0.875rem 1rem", fontSize: "0.82rem", fontWeight: 700, color: C.text, fontFamily: FM, whiteSpace: "nowrap" }}>{fmt(order.total_amount)}</td>
                                                <td style={{ padding: "0.875rem 1rem" }}><StatusBadge status={order.payment_status} /></td>
                                                <td style={{ padding: "0.875rem 1rem" }}><StatusBadge status={order.order_status} /></td>
                                                <td style={{ padding: "0.875rem 1rem" }} onClick={(e) => e.stopPropagation()}>
                                                    <select
                                                        value={order.order_status}
                                                        disabled={updatingOrder === order.id}
                                                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                        style={{ background: C.panel, border: `1px solid ${C.border}`, color: C.text, fontSize: "0.78rem", padding: "0.375rem 0.625rem", fontFamily: FO, cursor: "pointer", borderRadius: 4, minWidth: 140 }}
                                                    >
                                                        {ORDER_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                                                    </select>
                                                </td>
                                                <td style={{ padding: "0.875rem 1rem", fontSize: "0.75rem", color: C.muted, fontFamily: FO, whiteSpace: "nowrap" }}>{fmtDate(order.created_at)}</td>
                                            </tr>
                                            {expandedOrder === order.id && (
                                                <tr key={`${order.id}-expanded`}>
                                                    <td colSpan={8} style={{ background: "#161616", padding: "1rem 1.5rem 1.25rem", borderBottom: `1px solid ${C.border}` }}>
                                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
                                                            <div><p style={{ fontSize: "0.62rem", color: C.muted, fontFamily: FM, marginBottom: "0.25rem" }}>SHIPPING</p><p style={{ fontSize: "0.82rem", color: C.text, fontFamily: FO, lineHeight: 1.6 }}>{order.shipping_address}<br />{order.city}, {order.state} – {order.pincode}</p></div>
                                                            <div><p style={{ fontSize: "0.62rem", color: C.muted, fontFamily: FM, marginBottom: "0.25rem" }}>PAYMENT</p><p style={{ fontSize: "0.82rem", color: C.text, fontFamily: FO }}>{order.payment_method.toUpperCase()}<br />Advance: {fmt(order.advance_paid)}<br />Remaining: {fmt(order.remaining_amount)}</p></div>
                                                        </div>
                                                        {order.order_items && order.order_items.length > 0 && (
                                                            <div>
                                                                <p style={{ fontSize: "0.62rem", color: C.muted, fontFamily: FM, marginBottom: "0.5rem" }}>ORDER ITEMS</p>
                                                                <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                                                                    {order.order_items.map((item, i) => (
                                                                        <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: C.text, fontFamily: FO, padding: "0.375rem 0", borderBottom: `1px solid ${C.border}` }}>
                                                                            <span>{item.product_name} × {item.quantity}</span>
                                                                            <span style={{ fontWeight: 700 }}>{fmt(item.total_price)}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    ))}
                                    {orders.length === 0 && (
                                        <tr><td colSpan={8} style={{ padding: "4rem", textAlign: "center", color: C.muted, fontFamily: FO }}>No orders yet.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── MESSAGES TAB ────────────────────────────── */}
                {!loading && tab === "messages" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {messages.length === 0 && <p style={{ color: C.muted, fontFamily: FO, padding: "4rem", textAlign: "center" }}>No messages yet.</p>}
                        {messages.map((msg) => (
                            <div key={msg.id} style={{ background: C.panel, border: `1px solid ${C.border}`, padding: "1.25rem 1.5rem", borderRadius: 8 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
                                    <div>
                                        <p style={{ fontSize: "0.9rem", fontWeight: 700, color: C.text, fontFamily: FM }}>{msg.full_name}</p>
                                        <p style={{ fontSize: "0.75rem", color: C.muted, fontFamily: FO }}>{msg.email} {msg.phone && `· ${msg.phone}`}</p>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                        {msg.subject && <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "0.2rem 0.6rem", background: "#3B82F622", color: "#3B82F6", borderRadius: 4, fontFamily: FM, letterSpacing: "0.08em", textTransform: "uppercase" }}>{msg.subject}</span>}
                                        <span style={{ fontSize: "0.72rem", color: C.muted, fontFamily: FO }}>{fmtDate(msg.created_at)}</span>
                                    </div>
                                </div>
                                <p style={{ fontSize: "0.875rem", color: "#ccc", fontFamily: FO, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{msg.message}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── ENQUIRIES TAB ───────────────────────────── */}
                {!loading && tab === "enquiries" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {enquiries.length === 0 && <p style={{ color: C.muted, fontFamily: FO, padding: "4rem", textAlign: "center" }}>No enquiries yet.</p>}
                        {enquiries.map((enq) => (
                            <div key={enq.id} style={{ background: C.panel, border: `1px solid ${C.border}`, padding: "1.25rem 1.5rem", borderRadius: 8 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
                                    <div>
                                        <p style={{ fontSize: "0.9rem", fontWeight: 700, color: C.text, fontFamily: FM }}>{enq.company_name || "—"} <span style={{ fontWeight: 400, color: C.muted }}>· {enq.contact_person}</span></p>
                                        <p style={{ fontSize: "0.75rem", color: C.muted, fontFamily: FO }}>{enq.email} · {enq.phone} {enq.city && `· ${enq.city}`}</p>
                                    </div>
                                    <span style={{ fontSize: "0.72rem", color: C.muted, fontFamily: FO }}>{fmtDate(enq.created_at)}</span>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.75rem", marginBottom: enq.message ? "0.875rem" : 0 }}>
                                    {enq.product_interest && <div><p style={{ fontSize: "0.6rem", color: C.muted, fontFamily: FM, marginBottom: "0.2rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Product</p><p style={{ fontSize: "0.82rem", color: C.text, fontFamily: FO }}>{enq.product_interest}</p></div>}
                                    {enq.quantity && <div><p style={{ fontSize: "0.6rem", color: C.muted, fontFamily: FM, marginBottom: "0.2rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Quantity</p><p style={{ fontSize: "0.82rem", color: C.text, fontFamily: FO }}>{enq.quantity} units</p></div>}
                                </div>
                                {enq.message && <p style={{ fontSize: "0.875rem", color: "#ccc", fontFamily: FO, lineHeight: 1.7, borderTop: `1px solid ${C.border}`, paddingTop: "0.875rem", marginTop: "0.5rem", whiteSpace: "pre-wrap" }}>{enq.message}</p>}
                            </div>
                        ))}
                    </div>
                )}

                {/* ── PRODUCTS TAB ────────────────────────────── */}
                {!loading && tab === "products" && (
                    <div>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
                            <button
                                onClick={() => setShowAddProduct((v) => !v)}
                                style={{ padding: "0.75rem 1.5rem", background: C.accent, color: "#111", fontWeight: 900, fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", border: "none", cursor: "pointer", borderRadius: 6, fontFamily: FM }}
                            >
                                {showAddProduct ? "Cancel" : "+ Add Product"}
                            </button>
                        </div>

                        {/* Add Product Form */}
                        {showAddProduct && (
                            <form onSubmit={handleAddProduct} style={{ background: C.panel, border: `1px solid ${C.border}`, padding: "1.5rem", borderRadius: 8, marginBottom: "1.5rem" }}>
                                <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: C.accent, fontFamily: FM, marginBottom: "1.25rem" }}>New Product</p>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                                    {[
                                        { label: "Title *", key: "title", placeholder: "SL Edge" },
                                        { label: "Subtitle", key: "subtitle", placeholder: "Entryway Steel Organizer" },
                                        { label: "Price (₹) *", key: "price", placeholder: "2499", type: "number" },
                                        { label: "Stock Qty", key: "stock_qty", placeholder: "99", type: "number" },
                                        { label: "Image URL", key: "image_url", placeholder: "https://…" },
                                        { label: "Hover Image URL", key: "hover_image_url", placeholder: "https://…" },
                                    ].map(({ label, key, placeholder, type = "text" }) => (
                                        <div key={key}>
                                            <label style={{ display: "block", fontSize: "0.62rem", fontWeight: 700, color: C.muted, fontFamily: FM, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>{label}</label>
                                            <input
                                                type={type} value={newProduct[key as keyof typeof newProduct] as string}
                                                onChange={(e) => setNewProduct((p) => ({ ...p, [key]: e.target.value }))}
                                                placeholder={placeholder}
                                                style={{ width: "100%", padding: "0.625rem 0.875rem", background: "#111", border: `1px solid ${C.border}`, color: C.text, fontSize: "0.85rem", fontFamily: FO, borderRadius: 4, outline: "none", boxSizing: "border-box" }}
                                            />
                                        </div>
                                    ))}
                                    <div>
                                        <label style={{ display: "block", fontSize: "0.62rem", fontWeight: 700, color: C.muted, fontFamily: FM, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Category *</label>
                                        <select value={newProduct.category} onChange={(e) => setNewProduct((p) => ({ ...p, category: e.target.value }))}
                                            style={{ width: "100%", padding: "0.625rem 0.875rem", background: "#111", border: `1px solid ${C.border}`, color: C.text, fontSize: "0.85rem", fontFamily: FO, borderRadius: 4, cursor: "pointer", boxSizing: "border-box" }}>
                                            {["Entryway Storage", "Study Desks", "Wall Storage", "Bedroom", "Living Room", "Other"].map((c) => <option key={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: "0.62rem", fontWeight: 700, color: C.muted, fontFamily: FM, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Finish</label>
                                        <select value={newProduct.finish} onChange={(e) => setNewProduct((p) => ({ ...p, finish: e.target.value }))}
                                            style={{ width: "100%", padding: "0.625rem 0.875rem", background: "#111", border: `1px solid ${C.border}`, color: C.text, fontSize: "0.85rem", fontFamily: FO, borderRadius: 4, cursor: "pointer", boxSizing: "border-box" }}>
                                            {["Matte Black", "Graphite Grey", "White", "Bronze"].map((f) => <option key={f}>{f}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: "0.62rem", fontWeight: 700, color: C.muted, fontFamily: FM, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Stock Status</label>
                                        <select value={newProduct.stock_status} onChange={(e) => setNewProduct((p) => ({ ...p, stock_status: e.target.value }))}
                                            style={{ width: "100%", padding: "0.625rem 0.875rem", background: "#111", border: `1px solid ${C.border}`, color: C.text, fontSize: "0.85rem", fontFamily: FO, borderRadius: 4, cursor: "pointer", boxSizing: "border-box" }}>
                                            {["In Stock", "Only 12 Left", "Only 3 Left", "New", "Limited", "Out of Stock"].map((s) => <option key={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", paddingTop: "1.5rem" }}>
                                        <input type="checkbox" id="is_new" checked={newProduct.is_new} onChange={(e) => setNewProduct((p) => ({ ...p, is_new: e.target.checked }))} style={{ width: 16, height: 16, accentColor: C.accent }} />
                                        <label htmlFor="is_new" style={{ fontSize: "0.82rem", color: C.text, fontFamily: FO, cursor: "pointer" }}>Mark as New Arrival</label>
                                    </div>
                                </div>
                                <div style={{ marginTop: "1.25rem", display: "flex", gap: "0.75rem" }}>
                                    <button type="submit" disabled={addingProduct} style={{ padding: "0.75rem 2rem", background: C.accent, color: "#111", fontWeight: 900, fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", border: "none", cursor: "pointer", borderRadius: 6, fontFamily: FM }}>
                                        {addingProduct ? "Adding…" : "Add Product"}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Products Grid */}
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ background: C.panel }}>
                                        {["Title", "Category", "Price", "Finish", "Stock", "Status", "Actions"].map((h) => (
                                            <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, fontFamily: FM, borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product.id} style={{ borderBottom: `1px solid ${C.border}`, opacity: product.is_active ? 1 : 0.45 }}>
                                            <td style={{ padding: "0.875rem 1rem" }}>
                                                <p style={{ fontSize: "0.85rem", fontWeight: 700, color: C.text, fontFamily: FM }}>{product.title}</p>
                                                <p style={{ fontSize: "0.72rem", color: C.muted, fontFamily: FO }}>{product.subtitle}</p>
                                            </td>
                                            <td style={{ padding: "0.875rem 1rem", fontSize: "0.8rem", color: C.muted, fontFamily: FO, whiteSpace: "nowrap" }}>{product.category}</td>
                                            <td style={{ padding: "0.875rem 1rem", fontSize: "0.85rem", fontWeight: 700, color: C.accent, fontFamily: FM, whiteSpace: "nowrap" }}>{fmt(product.price)}</td>
                                            <td style={{ padding: "0.875rem 1rem", fontSize: "0.8rem", color: C.muted, fontFamily: FO }}>{product.finish}</td>
                                            <td style={{ padding: "0.875rem 1rem", fontSize: "0.8rem", color: C.text, fontFamily: FO }}>{product.stock_status} ({product.stock_qty})</td>
                                            <td style={{ padding: "0.875rem 1rem" }}>
                                                <span style={{ display: "inline-block", padding: "0.2rem 0.6rem", borderRadius: 4, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: FM, background: product.is_active ? "#10B98122" : "#EF444422", color: product.is_active ? "#10B981" : "#EF4444" }}>
                                                    {product.is_active ? "Live" : "Hidden"}
                                                </span>
                                            </td>
                                            <td style={{ padding: "0.875rem 1rem" }}>
                                                <button
                                                    onClick={() => toggleProductActive(product)}
                                                    style={{ padding: "0.4rem 0.875rem", background: "transparent", border: `1px solid ${C.border}`, color: product.is_active ? "#EF4444" : "#10B981", fontSize: "0.7rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}
                                                >
                                                    {product.is_active ? "Hide" : "Publish"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {products.length === 0 && (
                                        <tr><td colSpan={7} style={{ padding: "4rem", textAlign: "center", color: C.muted, fontFamily: FO }}>No products yet. Add one above.</td></tr>
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
