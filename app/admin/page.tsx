"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser, UserButton, SignOutButton } from "@clerk/nextjs";
import { C, FM, FO, fmt, ADMIN_EMAIL, ORDER_STATUSES } from "./constants";
import { StatCard } from "./components/AdminUI";
import DashboardTab from "./tabs/DashboardTab";
import OrdersTab from "./tabs/OrdersTab";
import MessagesTab from "./tabs/MessagesTab";
import EnquiriesTab from "./tabs/EnquiriesTab";
import ProductsTab from "./tabs/ProductsTab";
import type { Order, Message, Enquiry, Product, Tab } from "./types";

// Admin API key (used in API request headers)
const adminKey = process.env.NEXT_PUBLIC_ADMIN_KEY ?? "";

/* ── MAIN COMPONENT ─────────────────────────────────────────── */
export default function AdminPage() {
    const { isLoaded, isSignedIn, user } = useUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress ?? "";
    const isAdmin = isSignedIn && userEmail === ADMIN_EMAIL;

    /* ── STATE ───────────────────────────────────────────────── */
    const [tab, setTab] = useState<Tab>("dashboard");
    const [orders, setOrders] = useState<Order[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
    const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [orderStatusFilter, setOrderStatusFilter] = useState("all");
    const [productCategoryFilter, setProductCategoryFilter] = useState("all");
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [newProduct, setNewProduct] = useState({
        title: "", subtitle: "", price: "", category: "Seating",
        finish: "Matte Black", stock_status: "In Stock", stock_qty: "99",
        image_url: "", hover_image_url: "", is_new: false,
    });
    const [addingProduct, setAddingProduct] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    /* ── DATA FETCHING ── must be above any early returns ─────── */
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
    }, []);

    useEffect(() => { if (isAdmin) fetchData(tab); }, [isAdmin, tab, fetchData]);

    /* ── LOADING SCREEN ───────────────────────────────────────── */
    if (!isLoaded) {
        return (
            <main style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FO }}>
                <div style={{ color: C.muted, fontSize: "0.9rem" }}>Loading…</div>
            </main>
        );
    }

    /* ── ACCESS DENIED SCREEN ────────────────────────────────── */
    if (!isAdmin) {
        return (
            <main style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", fontFamily: FO }}>
                <div style={{ background: C.panel, border: `1px solid ${C.border}`, padding: "2.5rem", width: "100%", maxWidth: 400, borderRadius: 14, textAlign: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", marginBottom: "2rem" }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.red }} />
                        <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: C.muted, fontFamily: FM }}>SANRA LIVING™ · Admin</span>
                    </div>
                    <h1 style={{ fontSize: "1.4rem", fontWeight: 900, color: C.text, fontFamily: FM, marginBottom: "0.75rem" }}>Access Denied</h1>
                    <p style={{ fontSize: "0.85rem", color: C.muted, fontFamily: FO, marginBottom: "1.5rem", lineHeight: 1.6 }}>
                        {isSignedIn
                            ? `Signed in as ${userEmail}. This account is not authorized.`
                            : "You need to sign in with an authorized account."}
                    </p>
                    {isSignedIn && (
                        <SignOutButton>
                            <button style={{ padding: "0.75rem 1.5rem", background: C.accent, color: "#111", fontWeight: 900, fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", border: "none", cursor: "pointer", borderRadius: 6, fontFamily: FM }}>
                                Sign Out
                            </button>
                        </SignOutButton>
                    )}
                </div>
            </main>
        );
    }

    /* ── ACTIONS ─────────────────────────────────────────────── */
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

    const toggleProductActive = async (product: Product) => {
        await fetch(`/api/admin/products?id=${product.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
            body: JSON.stringify({ is_active: !product.is_active }),
        });
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_active: !p.is_active } : p));
    };

    const deleteProduct = async (id: string) => {
        await fetch(`/api/admin/products?id=${id}`, { method: "DELETE", headers: { "x-admin-key": adminKey } });
        setProducts(prev => prev.filter(p => p.id !== id));
        setDeleteConfirm(null);
    };

    const duplicateProduct = async (product: Product) => {
        const dup = { title: `${product.title} (Copy)`, subtitle: product.subtitle, price: product.price, category: product.category, finish: product.finish, stock_status: product.stock_status, stock_qty: product.stock_qty, image_url: product.image_url, hover_image_url: product.hover_image_url, is_new: false };
        await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-key": adminKey }, body: JSON.stringify(dup) });
        fetchData("products");
    };

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

    /* ── COMPUTED STATS ──────────────────────────────────────── */
    const paidOrders = orders.filter(o => o.payment_status === "paid");
    const totalRevenue = paidOrders.reduce((s, o) => s + o.total_amount, 0);
    const pendingOrders = orders.filter(o => o.order_status === "processing").length;
    const liveProducts = products.filter(p => p.is_active).length;

    /* ── RENDER ──────────────────────────────────────────────── */
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
                        <a href="/" target="_blank" rel="noopener" style={{ fontSize: "0.7rem", color: C.muted, fontFamily: FM, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", border: `1px solid ${C.border}`, padding: "0.4rem 0.875rem", borderRadius: 4 }}>↗ Live Site</a>
                        <button onClick={() => fetchData(tab)} style={{ fontSize: "0.7rem", color: C.muted, background: "none", border: `1px solid ${C.border}`, cursor: "pointer", fontFamily: FM, letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.4rem 0.875rem", borderRadius: 4 }}>↻ Refresh</button>
                        <UserButton afterSignOutUrl="/" />
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

                {/* ── TAB PANELS ── */}
                {!loading && tab === "dashboard" && (
                    <DashboardTab
                        orders={orders} products={products}
                        totalRevenue={totalRevenue} paidOrders={paidOrders}
                        onViewOrders={() => setTab("orders")}
                    />
                )}
                {!loading && tab === "orders" && (
                    <OrdersTab
                        orders={orders}
                        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                        orderStatusFilter={orderStatusFilter} setOrderStatusFilter={setOrderStatusFilter}
                        expandedOrder={expandedOrder} setExpandedOrder={setExpandedOrder}
                        updatingOrder={updatingOrder} updateOrderStatus={updateOrderStatus}
                        exportOrdersCsv={exportOrdersCsv}
                    />
                )}
                {!loading && tab === "messages" && (
                    <MessagesTab messages={messages} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                )}
                {!loading && tab === "enquiries" && (
                    <EnquiriesTab enquiries={enquiries} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                )}
                {!loading && tab === "products" && (
                    <ProductsTab
                        products={products} adminKey={adminKey}
                        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                        productCategoryFilter={productCategoryFilter} setProductCategoryFilter={setProductCategoryFilter}
                        showAddProduct={showAddProduct} setShowAddProduct={setShowAddProduct}
                        newProduct={newProduct} setNewProduct={setNewProduct}
                        addingProduct={addingProduct} handleAddProduct={handleAddProduct}
                        editingProduct={editingProduct} setEditingProduct={setEditingProduct}
                        deleteConfirm={deleteConfirm} setDeleteConfirm={setDeleteConfirm}
                        toggleProductActive={toggleProductActive}
                        duplicateProduct={duplicateProduct}
                        deleteProduct={deleteProduct}
                        onProductSaved={(updated) => setProducts(prev => prev.map(p => p.id === updated.id ? updated : p))}
                    />
                )}

            </div>
        </main>
    );
}
