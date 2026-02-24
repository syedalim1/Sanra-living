import Link from "next/link";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";

const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

const Label = ({ children }: { children: React.ReactNode }) => (
    <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#888", fontFamily: FM, marginBottom: "1.25rem" }}>
        {children}
    </p>
);

const Divider = () => (
    <div style={{ height: 1, background: "#E6E6E6", margin: "0 auto", maxWidth: 900 }} />
);

const SectionHeading = ({ id, children }: { id: string; children: React.ReactNode }) => (
    <h2 id={id} style={{ fontSize: "clamp(1.05rem, 2.2vw, 1.35rem)", fontWeight: 900, color: "#111", letterSpacing: "-0.02em", fontFamily: FM, marginBottom: "1.25rem", scrollMarginTop: "2rem" }}>
        {children}
    </h2>
);

const BodyText = ({ children }: { children: React.ReactNode }) => (
    <p style={{ fontSize: "0.9rem", color: "#444", lineHeight: 1.9, fontFamily: FO, marginBottom: "0.875rem" }}>{children}</p>
);

const BulletItem = ({ children }: { children: React.ReactNode }) => (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem", marginBottom: "0.625rem" }}>
        <div style={{ width: 4, height: 4, background: "#888", flexShrink: 0, marginTop: "0.6rem" }} />
        <p style={{ fontSize: "0.9rem", color: "#444", lineHeight: 1.8, fontFamily: FO, margin: 0 }}>{children}</p>
    </div>
);

const TOC_SECTIONS = [
    { id: "s1", label: "01 — General" },
    { id: "s2", label: "02 — Product Information" },
    { id: "s3", label: "03 — Pricing & Payments" },
    { id: "s4", label: "04 — Order Cancellation" },
    { id: "s5", label: "05 — Shipping & Delivery" },
    { id: "s6", label: "06 — Replacement Policy" },
    { id: "s7", label: "07 — Warranty" },
    { id: "s8", label: "08 — Intellectual Property" },
    { id: "s9", label: "09 — Limitation of Liability" },
    { id: "s10", label: "10 — Governing Law" },
    { id: "s11", label: "11 — Contact" },
];

export default function TermsPage() {
    return (
        <main style={{ background: "#F5F5F5", minHeight: "100vh", fontFamily: FO }}>
            <SiteHeader />

            {/* HERO */}
            <section style={{ background: "#fff", borderBottom: "1px solid #E6E6E6", padding: "clamp(3.5rem, 8vw, 6rem) 1.5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 700, margin: "0 auto" }}>
                    <Label>Legal Document</Label>
                    <h1 style={{ fontSize: "clamp(1.75rem, 4.5vw, 3rem)", fontWeight: 900, color: "#111", lineHeight: 1.1, letterSpacing: "-0.025em", fontFamily: FM, marginBottom: "1rem" }}>
                        Terms &amp; Conditions
                    </h1>
                    <p style={{ fontSize: "0.9375rem", color: "#666", lineHeight: 1.9, maxWidth: 520, margin: "0 auto 1rem", fontFamily: FO }}>
                        By accessing and using the SANRA LIVING website, you agree to the following terms and conditions.
                    </p>
                    <p style={{ fontSize: "0.72rem", color: "#bbb", fontFamily: FM, letterSpacing: "0.1em" }}>Last Updated: February 2025</p>
                </div>
            </section>

            {/* TABLE OF CONTENTS */}
            <section style={{ background: "#1C1C1C", padding: "clamp(2rem, 5vw, 3rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", fontFamily: FM, marginBottom: "1.25rem" }}>
                        Contents
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.375rem" }}>
                        {TOC_SECTIONS.map((s) => (
                            <a key={s.id} href={`#${s.id}`} style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", fontFamily: FM, textDecoration: "none", padding: "0.375rem 0", borderBottom: "1px solid rgba(255,255,255,0.07)", letterSpacing: "0.04em" }}>
                                {s.label}
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 1 – GENERAL */}
            <section style={{ background: "#fff", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 01</Label>
                    <SectionHeading id="s1">General</SectionHeading>
                    <BodyText>
                        SANRA LIVING is a premium steel furniture brand operated under <strong style={{ color: "#111" }}>Indian Make Steel Industries</strong>.
                    </BodyText>
                    <BodyText>By placing an order on our website, you confirm that:</BodyText>
                    <BulletItem>You are legally capable of entering into a binding contract</BulletItem>
                    <BulletItem>All information provided at the time of purchase is accurate and complete</BulletItem>
                    <BulletItem>You agree to comply with our policies as published on this website</BulletItem>
                </div>
            </section>

            <Divider />

            {/* SECTION 2 – PRODUCT INFORMATION */}
            <section style={{ background: "#F5F5F5", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 02</Label>
                    <SectionHeading id="s2">Product Information</SectionHeading>
                    <BodyText>
                        We strive to ensure that product descriptions, images, and specifications listed on our website are accurate. However:
                    </BodyText>
                    <BulletItem>Minor variations in colour may occur due to differences in screen settings and lighting conditions</BulletItem>
                    <BulletItem>Dimensions may vary slightly within standard manufacturing tolerance</BulletItem>
                    <div style={{ marginTop: "1rem", padding: "1rem 1.25rem", background: "#fff", borderLeft: "3px solid #ccc" }}>
                        <p style={{ fontSize: "0.875rem", color: "#555", fontFamily: FO, lineHeight: 1.8, margin: 0 }}>
                            SANRA LIVING reserves the right to modify product details, specifications, or pricing without prior notice.
                        </p>
                    </div>
                </div>
            </section>

            <Divider />

            {/* SECTION 3 – PRICING & PAYMENTS */}
            <section style={{ background: "#fff", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 03</Label>
                    <SectionHeading id="s3">Pricing &amp; Payments</SectionHeading>
                    <BodyText>
                        All prices are listed in <strong style={{ color: "#111" }}>Indian Rupees (INR)</strong> and are inclusive of applicable taxes unless otherwise stated.
                    </BodyText>
                    <BodyText>We accept the following payment methods:</BodyText>
                    <BulletItem>Online payments via <strong style={{ color: "#111" }}>Razorpay</strong> (UPI, Net Banking, Cards)</BulletItem>
                    <BulletItem>Partial advance with Cash on Delivery, where applicable</BulletItem>
                    <BodyText>Orders are confirmed only after successful payment processing. SANRA LIVING is not liable for any failed transactions or payment gateway errors.</BodyText>
                </div>
            </section>

            <Divider />

            {/* SECTION 4 – ORDER CANCELLATION */}
            <section style={{ background: "#F5F5F5", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 04</Label>
                    <SectionHeading id="s4">Order Cancellation</SectionHeading>
                    <BodyText>
                        Orders may be cancelled <strong style={{ color: "#111" }}>before dispatch</strong> by contacting our support team. Once an order has been dispatched:
                    </BodyText>
                    <BulletItem>Cancellation is not permitted</BulletItem>
                    <BulletItem>COD advance amounts are non-refundable</BulletItem>
                    <div style={{ marginTop: "1rem", padding: "1rem 1.25rem", background: "#fff", borderLeft: "3px solid #ccc" }}>
                        <p style={{ fontSize: "0.875rem", color: "#555", fontFamily: FO, lineHeight: 1.8, margin: 0 }}>
                            SANRA LIVING reserves the right to cancel orders in cases of suspected fraud, misuse, or pricing errors due to system issues.
                        </p>
                    </div>
                </div>
            </section>

            <Divider />

            {/* SECTION 5 – SHIPPING & DELIVERY */}
            <section style={{ background: "#fff", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 05</Label>
                    <SectionHeading id="s5">Shipping &amp; Delivery</SectionHeading>
                    <BulletItem>Delivery timelines are estimates and may vary due to courier service conditions, regional factors, or force majeure events</BulletItem>
                    <BulletItem>SANRA LIVING is not liable for delays caused by third-party logistics providers</BulletItem>
                    <BulletItem>Customers must inspect products upon delivery and report visible damage before accepting the shipment</BulletItem>
                    <p style={{ fontSize: "0.85rem", color: "#888", fontFamily: FO, marginTop: "1rem" }}>
                        Refer to our{" "}
                        <Link href="/shipping-policy" style={{ color: "#111", fontWeight: 700, textDecoration: "underline", textUnderlineOffset: "2px" }}>
                            Shipping &amp; Replacement Policy
                        </Link>{" "}
                        for complete details.
                    </p>
                </div>
            </section>

            <Divider />

            {/* SECTION 6 – REPLACEMENT POLICY */}
            <section style={{ background: "#F5F5F5", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 06</Label>
                    <SectionHeading id="s6">Replacement Policy</SectionHeading>
                    <BulletItem>Replacement requests must follow the process outlined in our Shipping &amp; Replacement Policy</BulletItem>
                    <BulletItem>An unboxing video is mandatory for all transit damage claims</BulletItem>
                    <BulletItem>Refunds are not applicable. Replacement only, subject to eligibility</BulletItem>
                    <p style={{ fontSize: "0.85rem", color: "#888", fontFamily: FO, marginTop: "1rem" }}>
                        Refer to our{" "}
                        <Link href="/shipping-policy" style={{ color: "#111", fontWeight: 700, textDecoration: "underline", textUnderlineOffset: "2px" }}>
                            Shipping &amp; Replacement Policy
                        </Link>{" "}
                        for the full process.
                    </p>
                </div>
            </section>

            <Divider />

            {/* SECTION 7 – WARRANTY */}
            <section style={{ background: "#fff", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 07</Label>
                    <SectionHeading id="s7">Warranty</SectionHeading>
                    <BulletItem>Warranty coverage is limited to structural steel components as described in our Warranty Policy</BulletItem>
                    <BulletItem>Warranty does not cover misuse, improper installation, or surface damage</BulletItem>
                    <BulletItem>Warranty is valid only for the original purchaser and is non-transferable</BulletItem>
                    <p style={{ fontSize: "0.85rem", color: "#888", fontFamily: FO, marginTop: "1rem" }}>
                        Refer to our{" "}
                        <Link href="/warranty" style={{ color: "#111", fontWeight: 700, textDecoration: "underline", textUnderlineOffset: "2px" }}>
                            10-Year Warranty Policy
                        </Link>{" "}
                        for complete coverage details.
                    </p>
                </div>
            </section>

            <Divider />

            {/* SECTION 8 – INTELLECTUAL PROPERTY */}
            <section style={{ background: "#F5F5F5", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 08</Label>
                    <SectionHeading id="s8">Intellectual Property</SectionHeading>
                    <BodyText>
                        All content on this website, including but not limited to the following, is the intellectual property of SANRA LIVING and may not be reproduced, distributed, or used without written permission:
                    </BodyText>
                    <BulletItem>Logos and brand identity elements</BulletItem>
                    <BulletItem>Product designs and configurations</BulletItem>
                    <BulletItem>Product images and photography</BulletItem>
                    <BulletItem>Written content, descriptions, and marketing copy</BulletItem>
                </div>
            </section>

            <Divider />

            {/* SECTION 9 – LIMITATION OF LIABILITY */}
            <section style={{ background: "#fff", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 09</Label>
                    <SectionHeading id="s9">Limitation of Liability</SectionHeading>
                    <BodyText>SANRA LIVING shall not be liable for:</BodyText>
                    <BulletItem>Indirect, incidental, or consequential damages arising from product use</BulletItem>
                    <BulletItem>Damage resulting from improper assembly by the customer</BulletItem>
                    <BulletItem>Use beyond the recommended load or weight capacity</BulletItem>
                    <div style={{ marginTop: "1rem", padding: "1rem 1.25rem", background: "#F5F5F5", borderLeft: "3px solid #ccc" }}>
                        <p style={{ fontSize: "0.875rem", color: "#555", fontFamily: FO, lineHeight: 1.8, margin: 0 }}>
                            Liability is strictly limited to product replacement under approved conditions as defined in our replacement and warranty policies.
                        </p>
                    </div>
                </div>
            </section>

            <Divider />

            {/* SECTION 10 – GOVERNING LAW */}
            <section style={{ background: "#F5F5F5", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 10</Label>
                    <SectionHeading id="s10">Governing Law</SectionHeading>
                    <BodyText>
                        These terms and conditions shall be governed by and construed in accordance with the <strong style={{ color: "#111" }}>laws of India</strong>.
                    </BodyText>
                    <BodyText>
                        Any disputes arising from or in connection with these terms shall be subject to the exclusive jurisdiction of the appropriate courts of competent jurisdiction in India.
                    </BodyText>
                </div>
            </section>

            {/* SECTION 11 – CONTACT (dark) */}
            <section style={{ background: "#1C1C1C", padding: "clamp(3rem, 7vw, 5rem) 1.5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 480, margin: "0 auto" }}>
                    <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.22em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", fontFamily: FM, marginBottom: "1.25rem" }} id="s11">
                        Section 11
                    </p>
                    <h2 style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", fontFamily: FM, marginBottom: "0.875rem" }}>
                        Contact
                    </h2>
                    <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", fontFamily: FO, lineHeight: 1.8, marginBottom: "1rem" }}>
                        For queries related to these terms and conditions, please contact:
                    </p>
                    <a href="mailto:support@sanraliving.com" style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", fontFamily: FM, display: "block", textDecoration: "none" }}>
                        support@sanraliving.com
                    </a>
                </div>
            </section>

            <SiteFooter />
        </main>
    );
}
