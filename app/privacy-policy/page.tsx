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

const TOC = [
    { id: "s1", label: "01 — Information We Collect" },
    { id: "s2", label: "02 — How We Use Your Information" },
    { id: "s3", label: "03 — Payment Security" },
    { id: "s4", label: "04 — Cookies" },
    { id: "s5", label: "05 — Data Protection" },
    { id: "s6", label: "06 — Third-Party Services" },
    { id: "s7", label: "07 — User Rights" },
    { id: "s8", label: "08 — Policy Updates" },
    { id: "s9", label: "09 — Contact" },
];

export default function PrivacyPolicyPage() {
    return (
        <main style={{ background: "#F5F5F5", minHeight: "100vh", fontFamily: FO }}>
            <SiteHeader />

            {/* HERO */}
            <section style={{ background: "#fff", borderBottom: "1px solid #E6E6E6", padding: "clamp(3.5rem, 8vw, 6rem) 1.5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 700, margin: "0 auto" }}>
                    <Label>Legal Document</Label>
                    <h1 style={{ fontSize: "clamp(1.75rem, 4.5vw, 3rem)", fontWeight: 900, color: "#111", lineHeight: 1.1, letterSpacing: "-0.025em", fontFamily: FM, marginBottom: "1rem" }}>
                        Privacy Policy
                    </h1>
                    <p style={{ fontSize: "0.9375rem", color: "#666", lineHeight: 1.9, maxWidth: 520, margin: "0 auto 1rem", fontFamily: FO }}>
                        Your privacy is important to us. This policy explains how SANRA LIVING collects, uses, and protects your information.
                    </p>
                    <p style={{ fontSize: "0.72rem", color: "#bbb", fontFamily: FM, letterSpacing: "0.1em" }}>Effective Date: 24 February 2025</p>
                </div>
            </section>

            {/* TABLE OF CONTENTS */}
            <section style={{ background: "#1C1C1C", padding: "clamp(2rem, 5vw, 3rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", fontFamily: FM, marginBottom: "1.25rem" }}>
                        Contents
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.375rem" }}>
                        {TOC.map((s) => (
                            <a key={s.id} href={`#${s.id}`} style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", fontFamily: FM, textDecoration: "none", padding: "0.375rem 0", borderBottom: "1px solid rgba(255,255,255,0.07)", letterSpacing: "0.04em" }}>
                                {s.label}
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 1 – INFORMATION WE COLLECT */}
            <section style={{ background: "#fff", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 01</Label>
                    <SectionHeading id="s1">Information We Collect</SectionHeading>
                    <BodyText>We may collect the following information when you use our website or place an order:</BodyText>
                    <BulletItem>Full Name</BulletItem>
                    <BulletItem>Email Address</BulletItem>
                    <BulletItem>Phone Number</BulletItem>
                    <BulletItem>Shipping &amp; Billing Address</BulletItem>
                    <BulletItem>Payment details — processed securely via Razorpay</BulletItem>
                    <BulletItem>Order history and transaction records</BulletItem>
                    <div style={{ marginTop: "1rem", padding: "1rem 1.25rem", background: "#F5F5F5", borderLeft: "3px solid #1C1C1C" }}>
                        <p style={{ fontSize: "0.875rem", color: "#444", fontFamily: FO, lineHeight: 1.8, margin: 0 }}>
                            We do <strong style={{ color: "#111" }}>not</strong> store sensitive payment information such as card numbers or CVV details on our servers.
                        </p>
                    </div>
                </div>
            </section>

            <Divider />

            {/* SECTION 2 – HOW WE USE YOUR INFORMATION */}
            <section style={{ background: "#F5F5F5", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 02</Label>
                    <SectionHeading id="s2">How We Use Your Information</SectionHeading>
                    <BodyText>We use the information collected for the following purposes:</BodyText>
                    <BulletItem>Process and fulfil orders placed on our website</BulletItem>
                    <BulletItem>Provide order updates and delivery tracking details</BulletItem>
                    <BulletItem>Respond to customer support queries</BulletItem>
                    <BulletItem>Improve website functionality and user experience</BulletItem>
                    <BulletItem>Send service-related communications relevant to your order</BulletItem>
                    <div style={{ marginTop: "1rem", padding: "1rem 1.25rem", background: "#fff", borderLeft: "3px solid #ccc" }}>
                        <p style={{ fontSize: "0.875rem", color: "#555", fontFamily: FO, lineHeight: 1.8, margin: 0 }}>
                            We do <strong style={{ color: "#111" }}>not</strong> sell, rent, or share your personal information with third parties for marketing purposes.
                        </p>
                    </div>
                </div>
            </section>

            <Divider />

            {/* SECTION 3 – PAYMENT SECURITY */}
            <section style={{ background: "#fff", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 03</Label>
                    <SectionHeading id="s3">Payment Security</SectionHeading>
                    <BodyText>
                        All online payments are processed securely through <strong style={{ color: "#111" }}>Razorpay</strong>, a PCI DSS compliant payment gateway.
                    </BodyText>
                    <BodyText>
                        SANRA LIVING does not store your debit card, credit card, or UPI credentials on our servers. All payment data is handled exclusively by Razorpay under their security protocols.
                    </BodyText>
                </div>
            </section>

            <Divider />

            {/* SECTION 4 – COOKIES */}
            <section style={{ background: "#F5F5F5", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 04</Label>
                    <SectionHeading id="s4">Cookies</SectionHeading>
                    <BodyText>Our website may use cookies to:</BodyText>
                    <BulletItem>Improve user experience and navigation</BulletItem>
                    <BulletItem>Analyse website traffic and usage patterns</BulletItem>
                    <BulletItem>Store user preferences for future visits</BulletItem>
                    <BodyText>
                        You may disable cookies through your browser settings at any time. Disabling cookies may affect certain features of the website.
                    </BodyText>
                </div>
            </section>

            <Divider />

            {/* SECTION 5 – DATA PROTECTION */}
            <section style={{ background: "#fff", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 05</Label>
                    <SectionHeading id="s5">Data Protection</SectionHeading>
                    <BodyText>
                        We implement reasonable technical and administrative security measures to protect your personal data from unauthorised access, disclosure, or misuse.
                    </BodyText>
                    <div style={{ padding: "1rem 1.25rem", background: "#F5F5F5", borderLeft: "3px solid #ccc" }}>
                        <p style={{ fontSize: "0.875rem", color: "#555", fontFamily: FO, lineHeight: 1.8, margin: 0 }}>
                            No method of online data transmission can be guaranteed 100% secure. While we take reasonable precautions, we cannot warrant absolute security of data transmitted over the internet.
                        </p>
                    </div>
                </div>
            </section>

            <Divider />

            {/* SECTION 6 – THIRD-PARTY SERVICES */}
            <section style={{ background: "#F5F5F5", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 06</Label>
                    <SectionHeading id="s6">Third-Party Services</SectionHeading>
                    <BodyText>To operate our business, we may use the following third-party services:</BodyText>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 1, background: "#E6E6E6" }}>
                        {[
                            { label: "Razorpay", role: "Payment Processing" },
                            { label: "Courier Partners", role: "Order Shipping" },
                            { label: "Analytics Tools", role: "Traffic Analysis" },
                        ].map((item) => (
                            <div key={item.label} style={{ background: "#fff", padding: "1.25rem" }}>
                                <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111", fontFamily: FM, marginBottom: "0.25rem" }}>{item.label}</p>
                                <p style={{ fontSize: "0.78rem", color: "#777", fontFamily: FO, margin: 0 }}>{item.role}</p>
                            </div>
                        ))}
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "#888", fontFamily: FO, marginTop: "1rem" }}>
                        These services operate under their own respective privacy policies and terms of service. We are not responsible for their practices.
                    </p>
                </div>
            </section>

            <Divider />

            {/* SECTION 7 – USER RIGHTS */}
            <section style={{ background: "#fff", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 07</Label>
                    <SectionHeading id="s7">User Rights</SectionHeading>
                    <BodyText>You may request the following at any time:</BodyText>
                    <BulletItem>Access to the personal data we hold about you</BulletItem>
                    <BulletItem>Correction of inaccurate or outdated information</BulletItem>
                    <BulletItem>Deletion of your account and associated data, where applicable</BulletItem>
                    <BodyText>
                        To submit a request, email us at{" "}
                        <a href="mailto:support@sanraliving.com" style={{ color: "#111", fontWeight: 700, textDecoration: "underline", textUnderlineOffset: "2px" }}>
                            support@sanraliving.com
                        </a>
                        . We will respond within a reasonable timeframe.
                    </BodyText>
                </div>
            </section>

            <Divider />

            {/* SECTION 8 – POLICY UPDATES */}
            <section style={{ background: "#F5F5F5", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 08</Label>
                    <SectionHeading id="s8">Policy Updates</SectionHeading>
                    <BodyText>
                        SANRA LIVING reserves the right to update this Privacy Policy at any time without prior notice.
                    </BodyText>
                    <BodyText>
                        Any changes will be posted on this page with an updated effective date. Continued use of our website following any changes constitutes your acceptance of the revised policy.
                    </BodyText>
                </div>
            </section>

            {/* SECTION 9 – CONTACT (dark) */}
            <section style={{ background: "#1C1C1C", padding: "clamp(3rem, 7vw, 5rem) 1.5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 480, margin: "0 auto" }}>
                    <p id="s9" style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.22em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", fontFamily: FM, marginBottom: "1.25rem" }}>
                        Section 09
                    </p>
                    <h2 style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", fontFamily: FM, marginBottom: "0.875rem" }}>
                        Privacy Concerns
                    </h2>
                    <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", fontFamily: FO, lineHeight: 1.8, marginBottom: "1.25rem" }}>
                        For any queries or concerns related to this Privacy Policy or your personal data:
                    </p>
                    <a href="mailto:support@sanraliving.com" style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", fontFamily: FM, display: "block", marginBottom: "2rem", textDecoration: "none" }}>
                        support@sanraliving.com
                    </a>
                    <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "0 auto 1.5rem", maxWidth: 200 }} />
                    <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.2)", fontFamily: FM, letterSpacing: "0.12em" }}>
                        Effective Date: 24 February 2025
                    </p>
                </div>
            </section>

            <SiteFooter />
        </main>
    );
}
