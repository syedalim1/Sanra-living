"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useUser, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import { useCart } from "@/app/context/CartContext";

const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

type DeliveryMode = "prepaid" | "cod";

const STEPS = ["Cart", "Shipping", "Payment", "Confirm"];

interface FormState {
    name: string; phone: string; email: string;
    address1: string; address2: string;
    city: string; state: string; pincode: string;
    billingSame: boolean;
}

interface Errors {
    [key: string]: string;
}

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Puducherry", "Chandigarh",
];

export default function CheckoutPage() {
    const { items, subtotal, dispatch } = useCart();
    const router = useRouter();
    const { isSignedIn, user } = useUser();

    const [delivery, setDelivery] = useState<DeliveryMode>("prepaid");
    const [form, setForm] = useState<FormState>({
        name: "", phone: "", email: "",
        address1: "", address2: "",
        city: "", state: "", pincode: "",
        billingSame: true,
    });
    const [errors, setErrors] = useState<Errors>({});
    const [submitting, setSubmitting] = useState(false);

    // COD advance = 20% of subtotal (paid now via Razorpay to confirm order)
    const codAdvance = delivery === "cod" ? Math.round(subtotal * 0.2) : 0;
    // Total order value (same either way — subtotal)
    const orderTotal = subtotal;
    // Amount charged via Razorpay: for COD → 20% advance; for prepaid → full amount
    const amountPayableNow = delivery === "cod" ? codAdvance : subtotal;

    // Redirect to cart if empty
    useEffect(() => {
        if (items.length === 0) router.replace("/cart");
    }, [items, router]);

    // Auto-fill email from Clerk
    useEffect(() => {
        if (isSignedIn && user?.primaryEmailAddress?.emailAddress && !form.email) {
            setForm(prev => ({ ...prev, email: user.primaryEmailAddress!.emailAddress }));
        }
    }, [isSignedIn, user]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, type } = e.target;
        const value = type === "checkbox"
            ? (e.target as HTMLInputElement).checked
            : e.target.value;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
    };

    const validate = (): boolean => {
        const required: (keyof FormState)[] = ["name", "phone", "email", "address1", "city", "state", "pincode"];
        const newErrors: Errors = {};
        required.forEach((field) => {
            if (!String(form[field]).trim()) {
                newErrors[field] = "This field is required";
            }
        });
        if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) {
            newErrors.phone = "Enter a valid 10-digit Indian mobile number";
        }
        if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = "Enter a valid email address";
        }
        if (form.pincode && !/^\d{6}$/.test(form.pincode)) {
            newErrors.pincode = "Enter a valid 6-digit pincode";
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return Object.keys(newErrors).length === 0;
    };

    // Load Razorpay SDK
    const loadRazorpay = () =>
        new Promise<void>((resolve, reject) => {
            if (typeof window !== "undefined" && (window as any).Razorpay) { resolve(); return; }
            const s = document.createElement("script");
            s.src = "https://checkout.razorpay.com/v1/checkout.js";
            s.onload = () => resolve();
            s.onerror = () => reject(new Error("Razorpay SDK failed to load. Please disable ad blockers and try again."));
            document.body.appendChild(s);
        });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);

        try {
            // 1. Create order on server
            const orderRes = await fetch("/api/razorpay/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: items.map((i) => ({ id: i.id, title: i.title, qty: i.qty, price: i.price })),
                    subtotal,
                    codAdvance,        // 20% for COD, 0 for prepaid
                    totalPayable: orderTotal,  // always just the subtotal (item total)
                    amountPayableNow,  // razorpay charges this: 20% for COD, 100% for prepaid
                    paymentMethod: delivery,
                    shipping: form,
                }),
            });
            const orderData = await orderRes.json();
            if (!orderRes.ok) throw new Error(orderData.error ?? "Order creation failed");

            // 2. Open Razorpay for both prepaid AND COD advance
            await loadRazorpay();
            const RazorpayClass = (window as unknown as { Razorpay: new (opts: Record<string, unknown>) => { open(): void; on(event: string, callback: (res: any) => void): void } }).Razorpay;

            const razorpayOptions = {
                key: orderData.keyId,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Sanra Living",
                description: delivery === "cod"
                    ? `20% Advance — Remaining ₹${(orderTotal - codAdvance).toLocaleString("en-IN")} at delivery`
                    : "Premium Steel Furniture — Full Payment",
                order_id: orderData.rzpOrderId,
                prefill: {
                    name: form.name,
                    email: form.email,
                    contact: form.phone,
                },
                theme: { color: "#1C1C1C" },
                handler: async (response: {
                    razorpay_order_id: string;
                    razorpay_payment_id: string;
                    razorpay_signature: string;
                }) => {
                    // 3. Verify payment and mark order as Processing
                    const verifyRes = await fetch("/api/razorpay/verify-payment", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            dbOrderId: orderData.dbOrderId,
                            items: items.map((i) => ({ id: i.id, qty: i.qty })),
                        }),
                    });
                    if (!verifyRes.ok) {
                        alert("Payment verification failed. Please contact support with payment ID: " + response.razorpay_payment_id);
                        setSubmitting(false);
                        return;
                    }
                    dispatch({ type: "CLEAR" });
                    router.push(
                        `/order-confirmation?orderId=${orderData.orderNumber}&total=${orderTotal}&cod=${delivery === "cod" ? orderTotal - codAdvance : 0}`
                    );
                },
                modal: {
                    ondismiss: () => { setSubmitting(false); },
                },
            };

            const rzp = new RazorpayClass(razorpayOptions);
            rzp.on("payment.failed", function (response: any) {
                alert(`Payment failed: ${response.error.description}`);
                setSubmitting(false);
            });
            rzp.open();
        } catch (err: any) {
            console.error(err);
            alert(err.message || "Something went wrong. Please try again.");
            setSubmitting(false);
        }
    };


    const inputStyle: React.CSSProperties = {
        width: "100%", padding: "0.75rem 1rem",
        border: "1px solid #E0E0E0", borderRadius: 0,
        fontSize: "0.9rem", fontFamily: FO, color: "#1C1C1C",
        background: "#FAFAFA", outline: "none", boxSizing: "border-box",
    };

    const errStyle: React.CSSProperties = {
        fontSize: "0.72rem", color: "#C0392B", fontFamily: FO, marginTop: "0.25rem",
    };

    const labelStyle: React.CSSProperties = {
        fontSize: "0.72rem", fontWeight: 700, color: "#333", fontFamily: FM,
        letterSpacing: "0.06em", marginBottom: "0.35rem", display: "block",
    };

    const Field = ({
        name, label, required, placeholder, type = "text", half,
    }: {
        name: keyof FormState; label: string; required?: boolean;
        placeholder?: string; type?: string; half?: boolean;
    }) => (
        <div style={{ gridColumn: half ? "span 1" : "span 2" }}>
            <label style={labelStyle} htmlFor={name}>
                {label} {required && <span style={{ color: "#C0392B" }}>*</span>}
            </label>
            <input
                type={type} id={name} name={name}
                value={String(form[name])} onChange={handleChange}
                placeholder={placeholder}
                style={{ ...inputStyle, borderColor: errors[name] ? "#C0392B" : "#E0E0E0" }}
            />
            {errors[name] && <p style={errStyle}>{errors[name]}</p>}
        </div>
    );

    if (items.length === 0) return null;

    return (
        <main style={{ background: "#F5F5F5", minHeight: "100vh", fontFamily: FO }}>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
            <SiteHeader />

            {/* ── STEP INDICATOR ─────────────────────────────────── */}
            <div style={{ background: "#fff", borderBottom: "1px solid #E6E6E6", padding: "0 1.5rem" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.25rem 0", gap: 0 }}>
                    {STEPS.map((step, i) => {
                        const active = i === 1; // Shipping step
                        const done = i === 0;
                        return (
                            <div key={step} style={{ display: "flex", alignItems: "center" }}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
                                    <div style={{
                                        width: 28, height: 28, borderRadius: "50%",
                                        background: done ? "#1C1C1C" : active ? "#1C1C1C" : "#E6E6E6",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: "0.72rem", fontWeight: 700, color: (done || active) ? "#fff" : "#aaa",
                                        fontFamily: FM,
                                    }}>
                                        {done ? "✓" : i + 1}
                                    </div>
                                    <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: active ? "#111" : done ? "#111" : "#bbb", fontFamily: FM }}>{step}</span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div style={{ width: "clamp(2rem,8vw,5rem)", height: 1, background: i === 0 ? "#1C1C1C" : "#E6E6E6", margin: "0 0.5rem", marginBottom: "1.1rem" }} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── MAIN ───────────────────────────────────────────── */}
            <form onSubmit={handleSubmit}>
                <section style={{ padding: "clamp(2rem,5vw,3rem) 1.5rem" }}>
                    <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }} className="sl-checkout-grid">

                        {/* ── LEFT: FORM ───────────────────────────── */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

                            {/* Shipping Details */}
                            <div style={{ background: "#fff", padding: "2rem" }}>
                                <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#888", fontFamily: FM, marginBottom: "1.5rem" }}>
                                    Shipping Details
                                </p>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                    <Field name="name" label="Full Name" required placeholder="Your full name" />
                                    <Field name="phone" label="Phone Number" required placeholder="+91 98765 43210" type="tel" half />
                                    <Field name="email" label="Email Address" required placeholder="you@example.com" type="email" half />
                                    <Field name="address1" label="Address Line 1" required placeholder="Door no., Street, Area" />
                                    <Field name="address2" label="Address Line 2" placeholder="Landmark, Locality (optional)" />
                                    <Field name="city" label="City" required placeholder="City" half />
                                    <div>
                                        <label style={labelStyle}>State <span style={{ color: "#C0392B" }}>*</span></label>
                                        <select name="state" value={form.state} onChange={handleChange}
                                            style={{ ...inputStyle, cursor: "pointer", borderColor: errors.state ? "#C0392B" : "#E0E0E0" }}>
                                            <option value="">Select State…</option>
                                            {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        {errors.state && <p style={errStyle}>{errors.state}</p>}
                                    </div>
                                    <Field name="pincode" label="Pincode" required placeholder="600001" half />
                                </div>

                                <label style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginTop: "1.25rem", cursor: "pointer" }}>
                                    <input type="checkbox" name="billingSame" checked={form.billingSame} onChange={handleChange}
                                        style={{ width: 16, height: 16, accentColor: "#1C1C1C" }} />
                                    <span style={{ fontSize: "0.84rem", color: "#555", fontFamily: FO }}>Billing address same as shipping</span>
                                </label>
                            </div>

                            {/* Delivery Options */}
                            <div style={{ background: "#fff", padding: "2rem" }}>
                                <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#888", fontFamily: FM, marginBottom: "1.5rem" }}>
                                    Delivery Options
                                </p>
                                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                    {[
                                        {
                                            value: "prepaid" as DeliveryMode,
                                            title: "Prepaid – Free Shipping",
                                            desc: "Pay online now. No extra charges. Order dispatched within 1 business day.",
                                            badge: "FREE",
                                        },
                                        {
                                            value: "cod" as DeliveryMode,
                                            title: "Cash on Delivery (COD)",
                                            desc: `Pay 20% advance (${fmt(Math.round(subtotal * 0.2))}) online now to confirm your order. Remaining ${fmt(subtotal - Math.round(subtotal * 0.2))} paid at delivery.`,
                                            badge: `20% Advance`,
                                        },
                                    ].map((opt) => (
                                        <div
                                            key={opt.value}
                                            onClick={() => setDelivery(opt.value)}
                                            style={{
                                                border: `2px solid ${delivery === opt.value ? "#1C1C1C" : "#E6E6E6"}`,
                                                padding: "1.25rem",
                                                cursor: "pointer",
                                                display: "flex", gap: "1rem", alignItems: "flex-start",
                                                transition: "border-color 0.2s",
                                            }}>
                                            <div style={{
                                                width: 18, height: 18, borderRadius: "50%",
                                                border: `2px solid ${delivery === opt.value ? "#1C1C1C" : "#ccc"}`,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                flexShrink: 0, marginTop: "0.1rem",
                                            }}>
                                                {delivery === opt.value && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1C1C1C" }} />}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.375rem" }}>
                                                    <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#111", fontFamily: FM }}>{opt.title}</p>
                                                    <span style={{
                                                        fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em",
                                                        background: delivery === opt.value ? "#1C1C1C" : "#F0F0F0",
                                                        color: delivery === opt.value ? "#fff" : "#777",
                                                        padding: "0.2rem 0.6rem", fontFamily: FM,
                                                        textTransform: "uppercase",
                                                    }}>{opt.badge}</span>
                                                </div>
                                                <p style={{ fontSize: "0.82rem", color: "#666", fontFamily: FO, lineHeight: 1.7 }}>{opt.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* ── RIGHT: SUMMARY ───────────────────────── */}
                        <div className="sl-checkout-summary">
                            <div style={{ background: "#fff", border: "1px solid #E6E6E6", padding: "1.75rem", position: "sticky", top: 80 }}>
                                <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#888", fontFamily: FM, marginBottom: "1.25rem" }}>
                                    Order Summary
                                </p>

                                {/* Product lines */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", marginBottom: "1.25rem" }}>
                                    {items.map((item) => (
                                        <div key={`${item.id}-${item.finish}`} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                                            <div style={{ width: 48, height: 48, background: "#F2F2F0", flexShrink: 0, overflow: "hidden" }}>
                                                <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111", fontFamily: FM }}>{item.title} <span style={{ color: "#aaa" }}>×{item.qty}</span></p>
                                                <p style={{ fontSize: "0.75rem", color: "#888", fontFamily: FO }}>{item.finish}</p>
                                            </div>
                                            <p style={{ fontSize: "0.84rem", fontWeight: 700, color: "#111", fontFamily: FM, flexShrink: 0 }}>{fmt(item.price * item.qty)}</p>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ height: 1, background: "#E6E6E6", marginBottom: "1rem" }} />

                                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                    <SummaryRow label="Subtotal" value={fmt(subtotal)} />
                                    <SummaryRow label="Shipping" value="Free" muted />
                                    {delivery === "cod" && <SummaryRow label="COD Advance (20%)" value={fmt(codAdvance)} />}
                                </div>

                                <div style={{ height: 1, background: "#E6E6E6", margin: "1rem 0" }} />

                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem" }}>
                                    <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111", fontFamily: FM }}>
                                        {delivery === "cod" ? "Pay Now (Advance)" : "Total Payable"}
                                    </p>
                                    <p style={{ fontSize: "1.2rem", fontWeight: 900, color: "#111", fontFamily: FM }}>{fmt(amountPayableNow)}</p>
                                </div>

                                {delivery === "cod" && (
                                    <p style={{ fontSize: "0.75rem", color: "#888", fontFamily: FO, marginBottom: "1.25rem", lineHeight: 1.6 }}>
                                        + {fmt(orderTotal - codAdvance)} remaining at delivery
                                    </p>
                                )}
                                {delivery !== "cod" && <div style={{ marginBottom: "1.25rem" }} />}

                                <button type="submit" disabled={submitting} style={{
                                    width: "100%", padding: "1rem",
                                    background: submitting ? "#555" : "#1C1C1C",
                                    color: "#fff", fontWeight: 700,
                                    fontSize: "0.8rem", letterSpacing: "0.12em",
                                    textTransform: "uppercase", border: "none",
                                    cursor: submitting ? "not-allowed" : "pointer",
                                    fontFamily: FM, transition: "background 0.2s",
                                }}>
                                    {submitting ? "Processing…" : delivery === "cod" ? `Pay Advance ${fmt(amountPayableNow)}` : "Pay Securely"}
                                </button>

                                <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1rem", alignItems: "center" }}>
                                    <span style={{ fontSize: "0.7rem", color: "#aaa", fontFamily: FO }}>🔒 Secured by Razorpay</span>
                                </div>

                                <div style={{ textAlign: "center", marginTop: "1rem" }}>
                                    <Link href="/cart" style={{ fontSize: "0.75rem", color: "#888", fontFamily: FO, textDecoration: "underline" }}>
                                        ← Edit Cart
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>
            </form>

            <SiteFooter />

            <style>{`
                @media (min-width: 900px) {
                    .sl-checkout-grid { grid-template-columns: 1fr 360px !important; }
                }
            `}</style>
        </main>
    );
}

function SummaryRow({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p style={{ fontSize: "0.82rem", color: muted ? "#aaa" : "#555", fontFamily: FO }}>{label}</p>
            <p style={{ fontSize: "0.82rem", fontWeight: 600, color: muted ? "#aaa" : "#111", fontFamily: FM }}>{value}</p>
        </div>
    );
}
