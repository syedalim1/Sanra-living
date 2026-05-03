// ── ADMIN SHARED CONSTANTS & HELPERS ────────────────────────────────

export const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
export const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

export const C = {
    bg: "#F5F5F5",
    panel: "#fff",
    card: "#fff",
    border: "#E6E6E6",
    accent: "#111",
    accentDim: "#11111118",
    text: "#111",
    muted: "#888",
    green: "#10B981",
    red: "#EF4444",
    blue: "#3B82F6",
    orange: "#F97316",
    purple: "#8B5CF6",
    black: "#111",
};

export const ADMIN_EMAIL = "syedsyed3777@gmail.com";

export const ORDER_STATUSES = [
    "processing", "packed", "shipped", "out_for_delivery", "delivered", "cancelled",
];

export const STATUS_LABELS: Record<string, string> = {
    processing: "Processing", packed: "Packed", shipped: "Shipped",
    out_for_delivery: "Out for Delivery", delivered: "Delivered", cancelled: "Cancelled",
    paid: "Paid", pending: "Pending", failed: "Failed", cod: "COD", prepaid: "Prepaid",
};

export const STATUS_COLORS: Record<string, string> = {
    processing: C.blue, packed: C.purple, shipped: C.orange,
    out_for_delivery: "#F59E0B", delivered: C.green, cancelled: C.red,
    paid: C.green, pending: "#F59E0B", failed: C.red,
};

export const CATEGORIES = [
    "Seating", "Tables", "Storage", "Bedroom", "Workspace",
    "Balcony & Outdoor", "Modular", "CNC & Custom", "Commercial",
];

export const COUPON_TYPES: Record<string, string> = {
    percentage: "% Off",
    flat: "₹ Off",
};

export const ACTION_TYPE_COLORS: Record<string, string> = {
    order_status: "#3B82F6",
    product_add: "#10B981",
    product_edit: "#F59E0B",
    product_delete: "#EF4444",
    coupon_create: "#8B5CF6",
    coupon_update: "#8B5CF6",
    settings_update: "#6B7280",
    bulk_action: "#F97316",
};

export const fmt = (n: number) => `₹${Number(n).toLocaleString("en-IN")}`;

export const fmtDate = (s: string) =>
    new Date(s).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
