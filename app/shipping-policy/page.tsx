"use client";

import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";

/* ── FONTS ───────────────────────────────────────────────────── */
const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

/* ── HELPERS ─────────────────────────────────────────────────── */
const Label = ({ children }: { children: React.ReactNode }) => (
    <p style={{
        fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.22em",
        textTransform: "uppercase", color: "#888", fontFamily: FM,
        marginBottom: "1.25rem",
    }}>
        {children}
    </p>
);

const Divider = () => (
    <div style={{ height: 1, background: "#E6E6E6", margin: "0 auto", maxWidth: 900 }} />
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
    <h2 style={{
        fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
        fontWeight: 900,
        color: "#111",
        letterSpacing: "-0.02em",
        fontFamily: FM,
        marginBottom: "1.5rem",
    }}>
        {children}
    </h2>
);

const BodyText = ({ children }: { children: React.ReactNode }) => (
    <p style={{ fontSize: "0.9375rem", color: "#444", lineHeight: 1.85, fontFamily: FO, marginBottom: "0.875rem" }}>
        {children}
    </p>
);

const BulletItem = ({ children }: { children: React.ReactNode }) => (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.625rem" }}>
        <div style={{ width: 5, height: 5, background: "#1C1C1C", flexShrink: 0, marginTop: "0.55rem" }} />
        <p style={{ fontSize: "0.9375rem", color: "#444", lineHeight: 1.8, fontFamily: FO, margin: 0 }}>{children}</p>
    </div>
);

const StepItem = ({ number, children }: { number: string; children: React.ReactNode }) => (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "0.875rem" }}>
        <div style={{
            width: 28, height: 28, background: "#1C1C1C", color: "#fff",
            fontSize: "0.7rem", fontWeight: 700, fontFamily: FM,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
        }}>{number}</div>
        <p style={{ fontSize: "0.9375rem", color: "#444", lineHeight: 1.8, fontFamily: FO, margin: 0, paddingTop: "0.25rem" }}>{children}</p>
    </div>
);

/* ── PAGE ────────────────────────────────────────────────────── */
export default function ShippingPolicyPage() {
    return (
        <main style={{ background: "#F5F5F5", minHeight: "100vh", fontFamily: FO }}>
            <SiteHeader />

            {/* ── PAGE HERO ────────────────────────────────────────── */}
            <section style={{ background: "#fff", padding: "clamp(3.5rem, 8vw, 6rem) 1.5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 700, margin: "0 auto" }}>
                    <Label>Legal & Support</Label>
                    <h1 style={{
                        fontSize: "clamp(1.75rem, 4.5vw, 3rem)",
                        fontWeight: 900,
                        color: "#111",
                        lineHeight: 1.1,
                        letterSpacing: "-0.025em",
                        fontFamily: FM,
                        marginBottom: "1rem",
                    }}>
                        Shipping &amp; Replacement Policy
                    </h1>
                    <p style={{ fontSize: "0.78rem", color: "#999", fontFamily: FM, letterSpacing: "0.1em" }}>
                        Last Updated: February 2025
                    </p>
                </div>
            </section>

            <Divider />

            {/* ── SECTION 1: ORDER PROCESSING ──────────────────────── */}
            <section style={{ background: "#fff", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 01</Label>
                    <SectionHeading>Order Processing</SectionHeading>
                    <BodyText>All orders are processed within <strong style={{ color: "#111" }}>2–4 working days</strong> after payment confirmation.</BodyText>
                    <BodyText>Orders placed on weekends or public holidays will be processed on the next working day.</BodyText>
                    <BodyText>Once dispatched, tracking details will be shared via email and SMS.</BodyText>
                </div>
            </section>

            <Divider />

            {/* ── SECTION 2: DELIVERY TIMELINE ─────────────────────── */}
            <section style={{ background: "#F5F5F5", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 02</Label>
                    <SectionHeading>Estimated Delivery Time</SectionHeading>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: 1,
                        background: "#E6E6E6",
                        marginBottom: "1.75rem",
                    }}>
                        {[
                            { region: "Tamil Nadu", time: "3–5 Working Days" },
                            { region: "South India", time: "4–6 Working Days" },
                            { region: "Rest of India", time: "5–8 Working Days" },
                        ].map((item) => (
                            <div key={item.region} style={{ background: "#fff", padding: "1.5rem 1.25rem" }}>
                                <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "#888", fontFamily: FM, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem" }}>{item.region}</p>
                                <p style={{ fontSize: "1rem", fontWeight: 900, color: "#111", fontFamily: FM, margin: 0 }}>{item.time}</p>
                            </div>
                        ))}
                    </div>
                    <BodyText>Delivery timelines may vary depending on courier service and location accessibility.</BodyText>
                </div>
            </section>

            <Divider />

            {/* ── SECTION 3: SHIPPING CHARGES ──────────────────────── */}
            <section style={{ background: "#fff", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 03</Label>
                    <SectionHeading>Shipping Charges</SectionHeading>
                    <BodyText>Shipping charges are calculated at checkout based on delivery location.</BodyText>
                    <BodyText>In certain promotional periods, free shipping may be offered on selected products.</BodyText>
                </div>
            </section>

            <Divider />

            {/* ── SECTION 4: COD ───────────────────────────────────── */}
            <section style={{ background: "#F5F5F5", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 04</Label>
                    <SectionHeading>Cash on Delivery Policy</SectionHeading>
                    <BodyText>SANRA LIVING offers Cash on Delivery with a <strong style={{ color: "#111" }}>partial advance payment</strong>.</BodyText>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                        <BulletItem>Advance amount varies based on product value and is <strong style={{ color: "#111" }}>non-refundable</strong> once the order is dispatched.</BulletItem>
                        <BulletItem>The remaining balance is payable at the time of delivery.</BulletItem>
                        <BulletItem>Orders may be cancelled if the advance payment is not completed within the specified time.</BulletItem>
                    </div>
                </div>
            </section>

            <Divider />

            {/* ── SECTION 5: UNBOXING (IMPORTANT) ──────────────────── */}
            <section style={{ background: "#1C1C1C", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", fontFamily: FM, marginBottom: "1.25rem" }}>
                        Section 05 · Important
                    </p>
                    <h2 style={{
                        fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
                        fontWeight: 900,
                        color: "#fff",
                        letterSpacing: "-0.02em",
                        fontFamily: FM,
                        marginBottom: "1.5rem",
                    }}>
                        Unboxing &amp; Inspection
                    </h2>
                    <div style={{ background: "rgba(255,255,255,0.06)", borderLeft: "3px solid #fff", padding: "1.25rem 1.5rem", marginBottom: "1.75rem" }}>
                        <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff", fontFamily: FM, margin: 0, letterSpacing: "0.02em" }}>
                            📹 Unboxing Video is Mandatory
                        </p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {[
                            "Customers are required to record a complete unboxing video from the moment the package is opened.",
                            "This video is mandatory to process any damage or defect claims.",
                            "Claims without unboxing video proof may not be accepted.",
                        ].map((text, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                                <div style={{ width: 5, height: 5, background: "rgba(255,255,255,0.4)", flexShrink: 0, marginTop: "0.55rem" }} />
                                <p style={{ fontSize: "0.9375rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.8, fontFamily: FO, margin: 0 }}>{text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Divider />

            {/* ── SECTION 6: REPLACEMENT ───────────────────────────── */}
            <section style={{ background: "#fff", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 06</Label>
                    <SectionHeading>10-Day Replacement Window</SectionHeading>
                    <BodyText>We offer a <strong style={{ color: "#111" }}>10-day replacement policy</strong> from the date of delivery in case of:</BodyText>
                    <div style={{ marginBottom: "1.75rem" }}>
                        <BulletItem>Manufacturing defects</BulletItem>
                        <BulletItem>Transit damage</BulletItem>
                    </div>
                    <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111", fontFamily: FM, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
                        To Initiate a Replacement Request:
                    </p>
                    <StepItem number="1">Contact support within <strong style={{ color: "#111" }}>48 hours</strong> of noticing the issue.</StepItem>
                    <StepItem number="2">Share your order number along with clear photos or videos of the issue.</StepItem>
                    <StepItem number="3">Provide your unboxing video as proof of the condition at the time of delivery.</StepItem>
                </div>
            </section>

            <Divider />

            {/* ── SECTION 7: NOT COVERED ───────────────────────────── */}
            <section style={{ background: "#F5F5F5", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 07</Label>
                    <SectionHeading>What Is Not Covered</SectionHeading>
                    <BodyText>Replacement will not be applicable for the following:</BodyText>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                        {[
                            "Damage caused during self-assembly",
                            "Improper installation",
                            "Surface scratches after installation",
                            "Normal wear and tear",
                            "Misuse or modification of the product",
                        ].map((item) => (
                            <BulletItem key={item}>{item}</BulletItem>
                        ))}
                    </div>
                </div>
            </section>

            <Divider />

            {/* ── SECTION 8: RETURN SHIPPING ───────────────────────── */}
            <section style={{ background: "#fff", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 08</Label>
                    <SectionHeading>Return Shipping Responsibility</SectionHeading>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
                        <div style={{ padding: "1.5rem", background: "#F5F5F5", borderTop: "2px solid #1C1C1C" }}>
                            <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#1C1C1C", fontFamily: FM, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Covered by SANRA LIVING</p>
                            <p style={{ fontSize: "0.9rem", color: "#444", fontFamily: FO, lineHeight: 1.8, margin: 0 }}>
                                If the issue is confirmed as a <strong style={{ color: "#111" }}>manufacturing defect or transit damage</strong>, we will bear the return shipping cost.
                            </p>
                        </div>
                        <div style={{ padding: "1.5rem", background: "#F5F5F5", borderTop: "2px solid #999" }}>
                            <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#999", fontFamily: FM, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Customer Responsibility</p>
                            <p style={{ fontSize: "0.9rem", color: "#444", fontFamily: FO, lineHeight: 1.8, margin: 0 }}>
                                If the issue is not covered under policy, the customer will be responsible for return shipping charges.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Divider />

            {/* ── SECTION 9: NO REFUND ─────────────────────────────── */}
            <section style={{ background: "#F5F5F5", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 09</Label>
                    <SectionHeading>No Refund Policy</SectionHeading>
                    <BodyText>SANRA LIVING currently follows a <strong style={{ color: "#111" }}>Replacement Only Policy</strong>.</BodyText>
                    <BodyText>Refunds are not applicable once the product is dispatched.</BodyText>
                </div>
            </section>

            <Divider />

            {/* ── SECTION 10: CONTACT ──────────────────────────────── */}
            <section style={{ background: "#fff", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 10</Label>
                    <SectionHeading>Contact for Support</SectionHeading>
                    <BodyText>For any shipping or replacement assistance, reach out to us:</BodyText>
                    <div style={{ display: "inline-flex", flexDirection: "column", gap: "0.875rem", background: "#F5F5F5", padding: "1.5rem 2rem", marginTop: "0.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#888", fontFamily: FM, letterSpacing: "0.15em", textTransform: "uppercase", minWidth: 90 }}>Email</span>
                            <a href="mailto:support@sanraliving.com" style={{ fontSize: "0.9375rem", color: "#111", fontFamily: FM, fontWeight: 700, textDecoration: "none" }}>
                                support@sanraliving.com
                            </a>
                        </div>
                        <div style={{ height: 1, background: "#E6E6E6" }} />
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#888", fontFamily: FM, letterSpacing: "0.15em", textTransform: "uppercase", minWidth: 90 }}>Response</span>
                            <span style={{ fontSize: "0.9375rem", color: "#444", fontFamily: FO }}>Within 24–48 working hours</span>
                        </div>
                    </div>
                </div>
            </section>

            <SiteFooter />

        </main>
    );
}
