"use client";

import { useState, useEffect, useCallback } from "react";
import ProductEditModal from "./ProductEditModal";

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
    hover_image_url: string; images?: string[]; description?: string;
    is_new: boolean; is_active: boolean; created_at: string;
}

type Tab = "dashboard" | "orders" | "messages" | "enquiries" | "products";

const CATEGORIES = ["Seating", "Tables", "Storage", "Bedroom", "Workspace", "Balcony & Outdoor", "Modular", "CNC & Custom", "Commercial"];

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
    const [tab, setTab] = useState<Tab>("dashboard");

    const [orders, setOrders] = useState<Order[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    const [loading, setLoading] = useState(false);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
    const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

    // Search & filter state
    const [searchQuery, setSearchQuery] = useState("");
    const [orderStatusFilter, setOrderStatusFilter] = useState("all");
    const [productCategoryFilter, setProductCategoryFilter] = useState("all");

    // Product edit state
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Add product form
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [newProduct, setNewProduct] = useState({
        title: "", subtitle: "", price: "", category: "Seating",
        finish: "Matte Black", stock_status: "In Stock", stock_qty: "99",
        image_url: "", hover_image_url: "", is_new: false,
    });
    const [addingProduct, setAddingProduct] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

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
        setSearchQuery("");
        try {
            const headers = { "x-admin-key": adminKey };
            if (t === "dashboard") {
                const [o, m, e, p] = await Promise.all([
                    fetch("/api/admin/orders", { headers }).then(r => r.json()),
                    fetch("/api/admin/messages", { headers }).then(r => r.json()),
                    fetch("/api/admin/enquiries", { headers }).then(r => r.json()),
                    fetch("/api/admin/products", { headers }).then(r => r.json()),
                ]);
                setOrders(o.orders ?? []); setMessages(m.messages ?? []);
                setEnquiries(e.enquiries ?? []); setProducts(p.products ?? []);
            } else if (t === "orders") {
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
            setLastRefreshed(new Date());
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

    const deleteProduct = async (id: string) => {
        await fetch(`/api/admin/products?id=${id}`, {
            method: "DELETE",
            headers: { "x-admin-key": adminKey },
        });
        setProducts(prev => prev.filter(p => p.id !== id));
        setDeleteConfirm(null);
    };

    const duplicateProduct = async (product: Product) => {
        const dup = { title: `${product.title} (Copy)`, subtitle: product.subtitle, price: product.price, category: product.category, finish: product.finish, stock_status: product.stock_status, stock_qty: product.stock_qty, image_url: product.image_url, hover_image_url: product.hover_image_url, is_new: false };
        await fetch("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
            body: JSON.stringify(dup),
        });
        fetchData("products");
    };

    /* ── CSV EXPORT ──────────────────────────────────────────── */
    const exportOrdersCsv = () => {
        const headers = ["Order #", "Email", "Phone", "Total", "Payment", "Method", "Status", "City", "State", "Date"];
        const rows = orders.map(o => [o.order_number, o.user_email, o.user_phone, o.total_amount, o.payment_status, o.payment_method, o.order_status, o.city, o.state, o.created_at]);
        const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
        a.download = `sanra-orders-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
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
            setNewProduct({ title: "", subtitle: "", price: "", category: "Seating", finish: "Matte Black", stock_status: "In Stock", stock_qty: "99", image_url: "", hover_image_url: "", is_new: false });
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
                        {lastRefreshed && <span style={{ fontSize: "0.62rem", color: "#444", fontFamily: FO }}>Updated {lastRefreshed.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>}
                        <a href="/" target="_blank" rel="noopener" style={{ fontSize: "0.7rem", color: C.muted, fontFamily: FM, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", border: `1px solid ${C.border}`, padding: "0.4rem 0.875rem", borderRadius: 4 }}>
                            ↗ Live Site
                        </a>
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
                <div style={{ display: "flex", gap: 0, marginBottom: "1.5rem", borderBottom: `1px solid ${C.border}`, overflowX: "auto" }}>
                    {(["dashboard", "orders", "messages", "enquiries", "products"] as Tab[]).map((t) => (
                        <button key={t} onClick={() => setTab(t)} style={{
                            padding: "0.8rem 1.25rem", background: "none", border: "none", cursor: "pointer",
                            fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: FM,
                            color: tab === t ? C.accent : C.muted,
                            borderBottom: tab === t ? `2px solid ${C.accent}` : "2px solid transparent",
                            transition: "all 0.15s", marginBottom: -1, whiteSpace: "nowrap",
                        }}>
                            {t === "dashboard" ? "⊞ Dashboard" : t}
                        </button>
                    ))}
                </div>

                {loading && (
                    <div style={{ textAlign: "center", padding: "5rem", color: C.muted, fontFamily: FO }}>
                        <div style={{ fontSize: "2rem", marginBottom: "1rem", opacity: 0.4 }}>⟳</div>
                        Loading…
                    </div>
                )}

                {/* ══════════════════════ DASHBOARD TAB ═══════════════════════ */}
                {!loading && tab === "dashboard" && (() => {
                    const now = new Date();
                    const today = orders.filter(o => new Date(o.created_at).toDateString() === now.toDateString());
                    const week = orders.filter(o => (now.getTime() - new Date(o.created_at).getTime()) < 7 * 86400000);
                    const month = orders.filter(o => new Date(o.created_at).getMonth() === now.getMonth() && new Date(o.created_at).getFullYear() === now.getFullYear());
                    const todayRev = today.filter(o => o.payment_status === "paid").reduce((s, o) => s + o.total_amount, 0);
                    const weekRev = week.filter(o => o.payment_status === "paid").reduce((s, o) => s + o.total_amount, 0);
                    const monthRev = month.filter(o => o.payment_status === "paid").reduce((s, o) => s + o.total_amount, 0);
                    const statusCounts = ORDER_STATUSES.map(s => ({ status: s, count: orders.filter(o => o.order_status === s).length })).filter(s => s.count > 0);
                    const lowStock = products.filter(p => p.is_active && p.stock_qty <= 5);
                    const recent = [...orders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

                    return (
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                            {/* Revenue Row */}
                            <div>
                                <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.muted, fontFamily: FM, marginBottom: "0.75rem" }}>Revenue (Paid)</p>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.75rem" }}>
                                    <StatCard label="Today" value={fmt(todayRev)} sub={`${today.length} orders`} color={C.green} />
                                    <StatCard label="This Week" value={fmt(weekRev)} sub={`${week.length} orders`} color={C.green} />
                                    <StatCard label="This Month" value={fmt(monthRev)} sub={`${month.length} orders`} color={C.green} />
                                    <StatCard label="All Time" value={fmt(totalRevenue)} sub={`${paidOrders.length} paid`} color={C.accent} />
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
                                {/* Order Status Distribution */}
                                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "1.25rem 1.5rem" }}>
                                    <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.muted, fontFamily: FM, marginBottom: "1rem" }}>Order Status Distribution</p>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                        {statusCounts.map(({ status, count }) => (
                                            <div key={status} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                <span style={{ width: 90, fontSize: "0.72rem", fontWeight: 600, color: C.muted, fontFamily: FM, textTransform: "capitalize" }}>{STATUS_LABELS[status]}</span>
                                                <div style={{ flex: 1, height: 8, background: "#1a1a1a", borderRadius: 4, overflow: "hidden" }}>
                                                    <div style={{ width: `${(count / orders.length) * 100}%`, height: "100%", background: STATUS_COLORS[status] ?? "#555", borderRadius: 4, transition: "width 0.5s" }} />
                                                </div>
                                                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: C.text, fontFamily: FM, minWidth: 24, textAlign: "right" }}>{count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Low Stock Alerts */}
                                <div style={{ background: C.card, border: `1px solid ${lowStock.length > 0 ? "#F97316" + "44" : C.border}`, borderRadius: 10, padding: "1.25rem 1.5rem" }}>
                                    <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: lowStock.length > 0 ? C.orange : C.muted, fontFamily: FM, marginBottom: "1rem" }}>
                                        ⚠ Low Stock Alerts ({lowStock.length})
                                    </p>
                                    {lowStock.length === 0 ? (
                                        <p style={{ fontSize: "0.82rem", color: C.green, fontFamily: FO }}>✓ All products are well stocked.</p>
                                    ) : (
                                        <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                                            {lowStock.map(p => (
                                                <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0.75rem", background: "#111", borderRadius: 6 }}>
                                                    <span style={{ fontSize: "0.82rem", color: C.text, fontFamily: FO }}>{p.title}</span>
                                                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: p.stock_qty <= 2 ? C.red : C.orange, fontFamily: FM }}>{p.stock_qty} left</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Recent Orders */}
                            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "1.25rem 1.5rem" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                    <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.muted, fontFamily: FM }}>Recent Orders</p>
                                    <button onClick={() => setTab("orders")} style={{ fontSize: "0.65rem", color: C.accent, background: "none", border: "none", cursor: "pointer", fontFamily: FM, letterSpacing: "0.08em", textTransform: "uppercase" }}>View All →</button>
                                </div>
                                {recent.length === 0 ? (
                                    <p style={{ fontSize: "0.82rem", color: C.muted, fontFamily: FO }}>No orders yet.</p>
                                ) : (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                                        {recent.map(o => (
                                            <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.625rem 0.875rem", background: "#111", borderRadius: 6, gap: "1rem" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
                                                    <span style={{ fontWeight: 700, color: C.accent, fontFamily: FM, fontSize: "0.78rem", flexShrink: 0 }}>{o.order_number}</span>
                                                    <span style={{ fontSize: "0.78rem", color: C.muted, fontFamily: FO, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.user_email}</span>
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
                                                    <span style={{ fontWeight: 700, fontSize: "0.82rem", fontFamily: FM }}>{fmt(o.total_amount)}</span>
                                                    <Badge status={o.order_status} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })()}

                {/* ══════════════════════ ORDERS TAB ════════════════════════ */}
                {!loading && tab === "orders" && (
                    <div style={{ overflowX: "auto" }}>
                        {/* Search / Filter / Export */}
                        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
                            <input
                                placeholder="Search orders (email, phone, order #)…"
                                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                style={{ ...inputStyle, maxWidth: 320, padding: "0.5rem 0.875rem" }}
                            />
                            <select value={orderStatusFilter} onChange={e => setOrderStatusFilter(e.target.value)} style={{ ...selectStyle, maxWidth: 180, padding: "0.5rem 0.875rem" }}>
                                <option value="all">All Statuses</option>
                                {ORDER_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                            </select>
                            <button onClick={exportOrdersCsv} style={{ padding: "0.5rem 1rem", background: "transparent", border: `1px solid ${C.border}`, color: C.green, fontSize: "0.68rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                                ↓ Export CSV
                            </button>
                            <span style={{ fontSize: "0.72rem", color: C.muted, fontFamily: FO, marginLeft: "auto" }}>
                                {orders.filter(o => {
                                    const q = searchQuery.toLowerCase();
                                    const matchSearch = !q || o.order_number.toLowerCase().includes(q) || o.user_email.toLowerCase().includes(q) || o.user_phone.includes(q);
                                    const matchStatus = orderStatusFilter === "all" || o.order_status === orderStatusFilter;
                                    return matchSearch && matchStatus;
                                }).length} orders
                            </span>
                        </div>
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
                                {orders.filter(o => {
                                    const q = searchQuery.toLowerCase();
                                    const matchSearch = !q || o.order_number.toLowerCase().includes(q) || o.user_email.toLowerCase().includes(q) || o.user_phone.includes(q);
                                    const matchStatus = orderStatusFilter === "all" || o.order_status === orderStatusFilter;
                                    return matchSearch && matchStatus;
                                }).map((order) => (
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
                        <input placeholder="Search messages (name, email, subject)…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ ...inputStyle, maxWidth: 360, padding: "0.5rem 0.875rem", marginBottom: "0.25rem" }} />
                        {messages.length === 0 && <p style={{ color: C.muted, fontFamily: FO, padding: "5rem", textAlign: "center" }}>No messages yet.</p>}
                        {messages.filter(m => { const q = searchQuery.toLowerCase(); return !q || m.full_name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || (m.subject ?? "").toLowerCase().includes(q); }).map((msg) => (
                            <div key={msg.id} style={{ background: C.card, border: `1px solid ${C.border}`, padding: "1.25rem 1.5rem", borderRadius: 10 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.875rem" }}>
                                    <div>
                                        <p style={{ fontSize: "0.92rem", fontWeight: 700, color: C.text, fontFamily: FM }}>{msg.full_name}</p>
                                        <p style={{ fontSize: "0.75rem", color: C.muted, fontFamily: FO, marginTop: "0.2rem" }}>{msg.email}{msg.phone && ` · ${msg.phone}`}</p>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexWrap: "wrap" }}>
                                        {msg.subject && <span style={{ fontSize: "0.62rem", fontWeight: 700, padding: "0.2rem 0.6rem", background: `${C.blue}22`, color: C.blue, borderRadius: 4, fontFamily: FM, letterSpacing: "0.08em", textTransform: "uppercase" }}>{msg.subject}</span>}
                                        <span style={{ fontSize: "0.72rem", color: C.muted, fontFamily: FO }}>{fmtDate(msg.created_at)}</span>
                                        <a href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject ?? "Your Enquiry — SANRA LIVING™")}&body=${encodeURIComponent(`Hi ${msg.full_name},\n\nThank you for reaching out to SANRA LIVING™.\n\n`)}`}
                                            style={{ display: "inline-block", padding: "0.35rem 0.875rem", background: C.accentDim, border: `1px solid ${C.accent}`, color: C.accent, fontSize: "0.65rem", fontWeight: 700, fontFamily: FM, borderRadius: 4, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}>
                                            ✉ Reply
                                        </a>
                                        {msg.phone && (
                                            <a href={`https://wa.me/${msg.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${msg.full_name}, regarding your message to SANRA LIVING™...`)}`} target="_blank" rel="noopener"
                                                style={{ display: "inline-block", padding: "0.35rem 0.875rem", background: "#25D36622", border: "1px solid #25D366", color: "#25D366", fontSize: "0.65rem", fontWeight: 700, fontFamily: FM, borderRadius: 4, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}>
                                                WhatsApp
                                            </a>
                                        )}
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
                        <input placeholder="Search enquiries (company, person, product)…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ ...inputStyle, maxWidth: 360, padding: "0.5rem 0.875rem", marginBottom: "0.25rem" }} />
                        {enquiries.length === 0 && <p style={{ color: C.muted, fontFamily: FO, padding: "5rem", textAlign: "center" }}>No bulk enquiries yet.</p>}
                        {enquiries.filter(e => { const q = searchQuery.toLowerCase(); return !q || (e.company_name ?? "").toLowerCase().includes(q) || e.contact_person.toLowerCase().includes(q) || (e.product_interest ?? "").toLowerCase().includes(q); }).map((enq) => (
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
                        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                            <input placeholder="Search products…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ ...inputStyle, maxWidth: 280, padding: "0.5rem 0.875rem" }} />
                            <select value={productCategoryFilter} onChange={e => setProductCategoryFilter(e.target.value)} style={{ ...selectStyle, maxWidth: 180, padding: "0.5rem 0.875rem" }}>
                                <option value="all">All Categories</option>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <button
                                onClick={() => setShowAddProduct(v => !v)}
                                style={{ padding: "0.7rem 1.5rem", background: showAddProduct ? "transparent" : C.accent, color: showAddProduct ? C.muted : "#111", fontWeight: 900, fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", border: `1px solid ${showAddProduct ? C.border : C.accent}`, cursor: "pointer", borderRadius: 6, fontFamily: FM, marginLeft: "auto" }}
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
                                            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
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
                                    {products.filter(p => {
                                        const q = searchQuery.toLowerCase();
                                        const matchSearch = !q || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
                                        const matchCat = productCategoryFilter === "all" || p.category === productCategoryFilter;
                                        return matchSearch && matchCat;
                                    }).map((product) => {
                                        return (
                                            <tr key={product.id} style={{ borderBottom: `1px solid ${C.border}`, opacity: product.is_active ? 1 : 0.5, transition: "opacity 0.2s" }}>
                                                <Td>
                                                    <p style={{ fontSize: "0.85rem", fontWeight: 700, color: C.text, fontFamily: FM }}>{product.title}</p>
                                                    <p style={{ fontSize: "0.7rem", color: C.muted, fontFamily: FO }}>{product.subtitle}</p>
                                                </Td>
                                                <Td><span style={{ fontSize: "0.78rem", color: C.muted }}>{product.category}</span></Td>
                                                <Td>
                                                    <span style={{ fontWeight: 700, color: C.accent, fontFamily: FM, fontSize: "0.88rem" }}>{fmt(product.price)}</span>
                                                </Td>
                                                <Td>
                                                    <span style={{ fontSize: "0.82rem", color: C.text }}>{product.stock_qty}</span>
                                                </Td>
                                                <Td>
                                                    <span style={{ fontSize: "0.78rem", color: C.muted }}>{product.stock_status}</span>
                                                </Td>
                                                <Td><span style={{ fontSize: "0.78rem", color: C.muted }}>{product.finish}</span></Td>
                                                <Td>
                                                    <span style={{ display: "inline-block", padding: "0.2rem 0.6rem", borderRadius: 4, fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: FM, background: product.is_active ? `${C.green}22` : `${C.red}22`, color: product.is_active ? C.green : C.red }}>
                                                        {product.is_active ? "Live" : "Hidden"}
                                                    </span>
                                                </Td>
                                                <Td>
                                                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                                                        <button onClick={() => setEditingProduct(product)} style={{ padding: "0.35rem 0.75rem", background: "transparent", border: `1px solid ${C.border}`, color: C.blue, fontSize: "0.65rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                                                            Edit
                                                        </button>
                                                        <button onClick={() => toggleProductActive(product)} style={{ padding: "0.35rem 0.75rem", background: "transparent", border: `1px solid ${C.border}`, color: product.is_active ? C.red : C.green, fontSize: "0.65rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                                                            {product.is_active ? "Hide" : "Publish"}
                                                        </button>
                                                        <button onClick={() => duplicateProduct(product)} style={{ padding: "0.35rem 0.75rem", background: "transparent", border: `1px solid ${C.border}`, color: C.purple, fontSize: "0.65rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                                                            Copy
                                                        </button>
                                                        {deleteConfirm === product.id ? (
                                                            <>
                                                                <button onClick={() => deleteProduct(product.id)} style={{ padding: "0.35rem 0.75rem", background: C.red, border: "none", color: "#fff", fontSize: "0.65rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>Confirm</button>
                                                                <button onClick={() => setDeleteConfirm(null)} style={{ padding: "0.35rem 0.75rem", background: "transparent", border: `1px solid ${C.border}`, color: C.muted, fontSize: "0.65rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4 }}>✕</button>
                                                            </>
                                                        ) : (
                                                            <button onClick={() => setDeleteConfirm(product.id)} style={{ padding: "0.35rem 0.75rem", background: "transparent", border: `1px solid ${C.border}`, color: C.red, fontSize: "0.65rem", fontWeight: 700, fontFamily: FM, cursor: "pointer", borderRadius: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                                                                Del
                                                            </button>
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

                        {editingProduct && (
                            <ProductEditModal
                                product={editingProduct}
                                adminKey={adminKey}
                                onClose={() => setEditingProduct(null)}
                                onSaved={(updated) => {
                                    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
                                    setEditingProduct(null);
                                }}
                            />
                        )}
                    </div>
                )}

            </div>
        </main>
    );
}
