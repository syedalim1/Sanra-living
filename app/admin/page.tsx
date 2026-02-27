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
import AddProductPage from "./tabs/AddProductPage";
import EditProductPage from "./tabs/EditProductPage";
import CouponsTab from "./tabs/CouponsTab";
import CustomersTab from "./tabs/CustomersTab";
import AnalyticsTab from "./tabs/AnalyticsTab";
import ActivityLogTab from "./tabs/ActivityLogTab";
import SettingsTab from "./tabs/SettingsTab";
import type {
    Order, Message, Enquiry, Product, Coupon,
    Customer, DailyRevenue, TopProduct,
    ActivityLogEntry, StoreSetting, Tab,
} from "./types";

const adminKey = process.env.NEXT_PUBLIC_ADMIN_KEY ?? "";

const TAB_ICONS: Record<Tab, string> = {
    dashboard: "⊞", orders: "📦", messages: "✉", enquiries: "📋",
    products: "🏷", coupons: "🎟", customers: "👤", analytics: "📊",
    activity: "📝", settings: "⚙",
};

/* ── MAIN ──────────────────────────────────────────────────── */
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
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [dailyRevenue, setDailyRevenue] = useState<DailyRevenue[]>([]);
    const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
    const [activityLogs, setActivityLogs] = useState<ActivityLogEntry[]>([]);
    const [storeSettings, setStoreSettings] = useState<StoreSetting[]>([]);
    const [analyticsPeriod, setAnalyticsPeriod] = useState(30);
    const [activityFilterType, setActivityFilterType] = useState("all");
    const [loading, setLoading] = useState(false);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
    const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [orderStatusFilter, setOrderStatusFilter] = useState("all");
    const [productCategoryFilter, setProductCategoryFilter] = useState("all");

    // Product sub-views: "list" | "add" | Product (edit)
    const [productView, setProductView] = useState<"list" | "add" | Product>("list");

    /* ── ACTIVITY LOG HELPER ──────────────────────────────────── */
    const logActivity = useCallback(async (action_type: string, description: string, metadata?: Record<string, unknown>) => {
        try {
            await fetch("/api/admin/activity-log", {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
                body: JSON.stringify({ action_type, description, admin_email: userEmail, metadata }),
            });
        } catch { /* silent */ }
    }, [userEmail]);

    /* ── DATA FETCHING ──────────────────────────────────────── */
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
            } else if (t === "coupons") {
                const res = await fetch("/api/admin/coupons", { headers });
                setCoupons((await res.json()).coupons ?? []);
            } else if (t === "customers") {
                const res = await fetch("/api/admin/customers", { headers });
                setCustomers((await res.json()).customers ?? []);
            } else if (t === "analytics") {
                const res = await fetch(`/api/admin/analytics?days=${analyticsPeriod}`, { headers });
                const data = await res.json();
                setDailyRevenue(data.daily ?? []); setTopProducts(data.topProducts ?? []);
            } else if (t === "activity") {
                const res = await fetch(`/api/admin/activity-log?type=${activityFilterType}`, { headers });
                setActivityLogs((await res.json()).logs ?? []);
            } else if (t === "settings") {
                const res = await fetch("/api/admin/settings", { headers });
                setStoreSettings((await res.json()).settings ?? []);
            }
            setLastRefreshed(new Date());
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, [analyticsPeriod, activityFilterType]);

    useEffect(() => {
        if (isAdmin) {
            fetchData(tab);
            if (tab === "products") setProductView("list");
        }
    }, [isAdmin, tab, fetchData]);

    /* ── LOADING ──────────────────────────────────────────────── */
    if (!isLoaded) {
        return (
            <main style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FO }}>
                <div style={{ color: C.muted, fontSize: "0.9rem" }}>Loading…</div>
            </main>
        );
    }

    /* ── ACCESS DENIED ──────────────────────────────────────── */
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
                        {isSignedIn ? `Signed in as ${userEmail}. Not authorized.` : "Sign in with an authorized account."}
                    </p>
                    {isSignedIn && (
                        <SignOutButton>
                            <button style={{ padding: "0.75rem 1.5rem", background: C.accent, color: "#111", fontWeight: 900, fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", border: "none", cursor: "pointer", borderRadius: 6, fontFamily: FM }}>Sign Out</button>
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
            const order = orders.find(o => o.id === orderId);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, order_status: status } : o));
            logActivity("order_status", `Changed order ${order?.order_number ?? orderId} → "${status}"`, { order_id: orderId });
        } catch (err) { console.error(err); }
        finally { setUpdatingOrder(null); }
    };

    const saveOrderNotes = async (orderId: string, notes: string) => {
        try {
            await fetch(`/api/admin/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
                body: JSON.stringify({ admin_notes: notes }),
            });
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, admin_notes: notes } : o));
        } catch (err) { console.error(err); }
    };

    const toggleProductActive = async (product: Product) => {
        await fetch(`/api/admin/products?id=${product.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
            body: JSON.stringify({ is_active: !product.is_active }),
        });
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_active: !p.is_active } : p));
        logActivity("product_edit", `${product.is_active ? "Hidden" : "Published"} "${product.title}"`, { product_id: product.id });
    };

    const deleteProduct = async (id: string) => {
        const product = products.find(p => p.id === id);
        await fetch(`/api/admin/products?id=${id}`, { method: "DELETE", headers: { "x-admin-key": adminKey } });
        setProducts(prev => prev.filter(p => p.id !== id));
        setProductView("list");
        logActivity("product_delete", `Deleted "${product?.title ?? id}"`, { product_id: id });
    };

    const duplicateProduct = async (product: Product) => {
        const dup = { title: `${product.title} (Copy)`, subtitle: product.subtitle, price: product.price, category: product.category, finish: product.finish, stock_status: product.stock_status, stock_qty: product.stock_qty, image_url: product.image_url, hover_image_url: product.hover_image_url, is_new: false };
        await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-key": adminKey }, body: JSON.stringify(dup) });
        fetchData("products");
        logActivity("product_add", `Duplicated "${product.title}"`, { source_product_id: product.id });
    };

    const handleBulkProductAction = async (ids: string[], action: "publish" | "hide" | "delete") => {
        const names = products.filter(p => ids.includes(p.id)).map(p => p.title);
        for (const id of ids) {
            if (action === "delete") {
                await fetch(`/api/admin/products?id=${id}`, { method: "DELETE", headers: { "x-admin-key": adminKey } });
            } else {
                await fetch(`/api/admin/products?id=${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", "x-admin-key": adminKey }, body: JSON.stringify({ is_active: action === "publish" }) });
            }
        }
        fetchData("products");
        logActivity("bulk_action", `Bulk ${action}: ${names.slice(0, 3).join(", ")}${names.length > 3 ? ` +${names.length - 3} more` : ""} (${ids.length})`, { product_ids: ids, action });
    };

    const exportOrdersCsv = () => {
        const headers = ["Order #", "Email", "Phone", "Total", "Payment", "Method", "Status", "City", "State", "Notes", "Date"];
        const rows = orders.map(o => [o.order_number, o.user_email, o.user_phone, o.total_amount, o.payment_status, o.payment_method, o.order_status, o.city, o.state, o.admin_notes ?? "", o.created_at]);
        const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
        a.download = `sanra-orders-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    };

    /* ── COMPUTED ─────────────────────────────────────────────── */
    const paidOrders = orders.filter(o => o.payment_status === "paid");
    const totalRevenue = paidOrders.reduce((s, o) => s + o.total_amount, 0);
    const pendingOrders = orders.filter(o => o.order_status === "processing").length;
    const liveProducts = products.filter(p => p.is_active).length;

    const allTabs: Tab[] = ["dashboard", "orders", "messages", "enquiries", "products", "coupons", "customers", "analytics", "activity", "settings"];

    // Badge counts
    const badgeCounts: Partial<Record<Tab, number>> = {
        orders: pendingOrders || undefined,
        messages: messages.length || undefined,
        enquiries: enquiries.length || undefined,
    };

    /* ── RENDER ──────────────────────────────────────────────── */
    return (
        <main style={{ background: C.bg, minHeight: "100vh", fontFamily: FO, color: C.text }}>
            {/* Header */}
            <header style={{ background: C.panel, borderBottom: `1px solid ${C.border}`, padding: "0 1.5rem", position: "sticky", top: 0, zIndex: 50 }}>
                <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.accent }} />
                        <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: C.accent, fontFamily: FM }}>SANRA LIVING™</span>
                        <span style={{ color: C.border }}>|</span>
                        <span style={{ fontSize: "0.78rem", color: C.muted, fontFamily: FM }}>Admin</span>
                    </div>
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                        {lastRefreshed && <span style={{ fontSize: "0.62rem", color: "#444", fontFamily: FO }}>Updated {lastRefreshed.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>}
                        <a href="/" target="_blank" rel="noopener" style={{ fontSize: "0.7rem", color: C.muted, fontFamily: FM, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", border: `1px solid ${C.border}`, padding: "0.4rem 0.875rem", borderRadius: 4 }}>↗ Site</a>
                        <button onClick={() => fetchData(tab)} style={{ fontSize: "0.7rem", color: C.muted, background: "none", border: `1px solid ${C.border}`, cursor: "pointer", fontFamily: FM, letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.4rem 0.875rem", borderRadius: 4 }}>↻</button>
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </div>
            </header>

            <div style={{ maxWidth: 1400, margin: "0 auto", padding: "2rem 1.5rem" }}>
                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                    <StatCard label="Total Orders" value={orders.length} sub={`${pendingOrders} pending`} />
                    <StatCard label="Revenue (Paid)" value={fmt(totalRevenue)} color={C.green} sub={`${paidOrders.length} paid`} />
                    <StatCard label="Enquiries" value={enquiries.length} />
                    <StatCard label="Messages" value={messages.length} />
                    <StatCard label="Products Live" value={liveProducts} sub={`of ${products.length}`} />
                </div>

                {/* Tabs with Badges */}
                <div style={{ display: "flex", gap: 0, marginBottom: "1.5rem", borderBottom: `1px solid ${C.border}`, overflowX: "auto" }}>
                    {allTabs.map((t) => {
                        const count = badgeCounts[t];
                        return (
                            <button key={t} onClick={() => setTab(t)} style={{
                                padding: "0.8rem 1.25rem", background: "none", border: "none", cursor: "pointer",
                                fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: FM,
                                color: tab === t ? C.accent : C.muted,
                                borderBottom: tab === t ? `2px solid ${C.accent}` : "2px solid transparent",
                                transition: "all 0.15s", marginBottom: -1, whiteSpace: "nowrap",
                                display: "flex", alignItems: "center", gap: "0.4rem",
                            }}>
                                {TAB_ICONS[t]} {t}
                                {count != null && count > 0 && (
                                    <span style={{ background: C.red, color: "#fff", fontSize: "0.5rem", fontWeight: 900, fontFamily: FM, padding: "1px 5px", borderRadius: 10, minWidth: 14, textAlign: "center" }}>{count}</span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {loading && (
                    <div style={{ textAlign: "center", padding: "5rem", color: C.muted, fontFamily: FO }}>
                        <div style={{ fontSize: "2rem", marginBottom: "1rem", opacity: 0.4 }}>⟳</div>Loading…
                    </div>
                )}

                {/* ── TAB PANELS ── */}
                {!loading && tab === "dashboard" && (
                    <DashboardTab orders={orders} products={products} totalRevenue={totalRevenue} paidOrders={paidOrders} onViewOrders={() => setTab("orders")} />
                )}
                {!loading && tab === "orders" && (
                    <OrdersTab
                        orders={orders} searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                        orderStatusFilter={orderStatusFilter} setOrderStatusFilter={setOrderStatusFilter}
                        expandedOrder={expandedOrder} setExpandedOrder={setExpandedOrder}
                        updatingOrder={updatingOrder} updateOrderStatus={updateOrderStatus}
                        exportOrdersCsv={exportOrdersCsv} onSaveNotes={saveOrderNotes}
                    />
                )}
                {!loading && tab === "messages" && (
                    <MessagesTab messages={messages} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                )}
                {!loading && tab === "enquiries" && (
                    <EnquiriesTab enquiries={enquiries} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                )}
                {!loading && tab === "products" && productView === "list" && (
                    <ProductsTab
                        products={products} adminKey={adminKey}
                        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                        productCategoryFilter={productCategoryFilter} setProductCategoryFilter={setProductCategoryFilter}
                        onAddProduct={() => setProductView("add")}
                        onEditProduct={(p) => setProductView(p)}
                        toggleProductActive={toggleProductActive}
                        duplicateProduct={duplicateProduct}
                        deleteProduct={deleteProduct}
                        onBulkAction={handleBulkProductAction}
                    />
                )}
                {!loading && tab === "products" && productView === "add" && (
                    <AddProductPage
                        adminKey={adminKey}
                        onSaved={() => {
                            setProductView("list");
                            fetchData("products");
                            logActivity("product_add", "Added new product");
                        }}
                        onCancel={() => setProductView("list")}
                    />
                )}
                {!loading && tab === "products" && typeof productView === "object" && (
                    <EditProductPage
                        product={productView}
                        adminKey={adminKey}
                        onSaved={(updated) => {
                            setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
                            setProductView("list");
                            logActivity("product_edit", `Edited "${updated.title}"`, { product_id: updated.id });
                        }}
                        onCancel={() => setProductView("list")}
                        onDelete={deleteProduct}
                    />
                )}
                {!loading && tab === "coupons" && (
                    <CouponsTab
                        coupons={coupons} adminKey={adminKey}
                        onCouponCreated={() => { fetchData("coupons"); logActivity("coupon_create", "Created new coupon"); }}
                        onCouponUpdated={(u) => { setCoupons(prev => prev.map(c => c.id === u.id ? u : c)); logActivity("coupon_update", `Updated coupon "${u.code}"`); }}
                        onCouponDeleted={(id) => { const c = coupons.find(x => x.id === id); setCoupons(prev => prev.filter(x => x.id !== id)); logActivity("coupon_update", `Deleted coupon "${c?.code ?? id}"`); }}
                    />
                )}
                {!loading && tab === "customers" && <CustomersTab customers={customers} />}
                {!loading && tab === "analytics" && (
                    <AnalyticsTab daily={dailyRevenue} topProducts={topProducts} period={analyticsPeriod} onPeriodChange={setAnalyticsPeriod} />
                )}
                {!loading && tab === "activity" && (
                    <ActivityLogTab logs={activityLogs} filterType={activityFilterType} onFilterChange={setActivityFilterType} />
                )}
                {!loading && tab === "settings" && (
                    <SettingsTab settings={storeSettings} adminKey={adminKey} onSaved={() => { fetchData("settings"); logActivity("settings_update", "Updated store settings"); }} />
                )}
            </div>
        </main>
    );
}
