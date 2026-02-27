// ── ADMIN SHARED TYPES ───────────────────────────────────────────────

export interface Order {
    id: string;
    order_number: string;
    user_email: string;
    user_phone: string;
    shipping_address: string;
    city: string;
    state: string;
    pincode: string;
    payment_method: string;
    payment_status: string;
    order_status: string;
    total_amount: number;
    advance_paid: number;
    remaining_amount: number;
    razorpay_payment_id?: string;
    admin_notes?: string;
    created_at: string;
    order_items?: {
        product_name: string;
        quantity: number;
        unit_price: number;
        total_price: number;
    }[];
}

export interface Message {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    created_at: string;
}

export interface Enquiry {
    id: string;
    company_name: string;
    contact_person: string;
    phone: string;
    email: string;
    city: string;
    product_interest: string;
    quantity: number;
    message: string;
    created_at: string;
}

export interface Product {
    id: string;
    title: string;
    subtitle: string;
    price: number;
    compare_at_price?: number | null;
    category: string;
    finish: string;
    stock_status: string;
    stock_qty: number;
    image_url: string;
    hover_image_url: string;
    images?: string[];
    video_url?: string;
    video_thumbnail?: string;
    description?: string;
    weight_kg?: number | null;
    dimensions?: string;
    tags?: string[];
    display_order?: number;
    is_new: boolean;
    is_active: boolean;
    created_at: string;
}

export interface Coupon {
    id: string;
    code: string;
    description: string;
    discount_type: "percentage" | "flat";
    discount_value: number;
    min_order_amount: number;
    max_discount: number | null;
    max_uses: number;
    used_count: number;
    is_active: boolean;
    starts_at: string;
    expires_at: string | null;
    created_at: string;
}

export interface Customer {
    user_email: string;
    user_phone: string;
    city: string;
    state: string;
    total_orders: number;
    total_spent: number;
    last_order_date: string;
}

export interface DailyRevenue {
    date: string;
    revenue: number;
    order_count: number;
}

export interface TopProduct {
    product_name: string;
    total_qty: number;
    total_revenue: number;
}

export interface ActivityLogEntry {
    id: string;
    action_type: string;
    description: string;
    admin_email: string | null;
    metadata: Record<string, unknown>;
    created_at: string;
}

export interface StoreSetting {
    key: string;
    value: string;
    updated_at: string;
}

export type Tab =
    | "dashboard"
    | "orders"
    | "messages"
    | "enquiries"
    | "products"
    | "coupons"
    | "customers"
    | "analytics"
    | "activity"
    | "settings";
