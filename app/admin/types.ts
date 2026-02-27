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
    category: string;
    finish: string;
    stock_status: string;
    stock_qty: number;
    image_url: string;
    hover_image_url: string;
    images?: string[];
    description?: string;
    is_new: boolean;
    is_active: boolean;
    created_at: string;
}

export type Tab = "dashboard" | "orders" | "messages" | "enquiries" | "products";
