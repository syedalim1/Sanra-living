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

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
    <h2 style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", fontWeight: 900, color: "#111", letterSpacing: "-0.02em", fontFamily: FM, marginBottom: "1.5rem" }}>
        {children}
    </h2>
);

const BodyText = ({ children }: { children: React.ReactNode }) => (
    <p style={{ fontSize: "0.9375rem", color: "#444", lineHeight: 1.85, fontFamily: FO, marginBottom: "0.875rem" }}>{children}</p>
);

const BulletItem = ({ children }: { children: React.ReactNode }) => (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.625rem" }}>
        <div style={{ width: 5, height: 5, background: "#1C1C1C", flexShrink: 0, marginTop: "0.55rem" }} />
        <p style={{ fontSize: "0.9375rem", color: "#444", lineHeight: 1.8, fontFamily: FO, margin: 0 }}>{children}</p>
    </div>
);

const StepItem = ({ number, children }: { number: string; children: React.ReactNode }) => (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "0.875rem" }}>
        <div style={{ width: 28, height: 28, background: "#1C1C1C", color: "#fff", fontSize: "0.7rem", fontWeight: 700, fontFamily: FM, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {number}
        </div>
        <p style={{ fontSize: "0.9375rem", color: "#444", lineHeight: 1.8, fontFamily: FO, margin: 0, paddingTop: "0.25rem" }}>{children}</p>
    </div>
);

export default function WarrantyPage() {
    return (
        <main style={{ background: "#F5F5F5", minHeight: "100vh", fontFamily: FO }}>
            <SiteHeader />

            {/* ── HERO ──────────────────────────────────────────────── */}
            <section style={{ background: "#fff", padding: "clamp(3.5rem, 8vw, 6rem) 1.5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 700, margin: "0 auto" }}>
                    <Label>Product Assurance</Label>
                    <h1 style={{ fontSize: "clamp(1.75rem, 4.5vw, 3rem)", fontWeight: 900, color: "#111", lineHeight: 1.1, letterSpacing: "-0.025em", fontFamily: FM, marginBottom: "0.75rem" }}>
                        10 Year Structural Warranty
                    </h1>
                    <p style={{ fontSize: "1rem", color: "#888", fontFamily: FO, fontStyle: "italic", marginBottom: "1rem" }}>
                        Built on Engineering Confidence.
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "#bbb", fontFamily: FM, letterSpacing: "0.1em" }}>Last Updated: February 2025</p>
                </div>
            </section>

            <Divider />

            {/* ── SECTION 1 – INTRODUCTION ──────────────────────────── */}
            <section style={{ background: "#fff", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 01</Label>
                    <SectionHeading>Introduction</SectionHeading>
                    <BodyText>
                        SANRA LIVING products are engineered using structural-grade steel and precision fabrication processes.
                    </BodyText>
                    <BodyText>
                        We offer a <strong style={{ color: "#111" }}>10-Year Structural Warranty</strong> on the primary steel frame of our products, reflecting our commitment to durability and material strength.
                    </BodyText>
                </div>
            </section>

            <Divider />

            {/* ── SECTION 2 – WHAT IS COVERED ──────────────────────── */}
            <section style={{ background: "#F5F5F5", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 02</Label>
                    <SectionHeading>This Warranty Covers</SectionHeading>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 1, background: "#E6E6E6", marginBottom: "1.5rem" }}>
                        {[
                            { icon: "⚙", title: "Frame Failure", desc: "Structural failure of the main steel frame under normal use." },
                            { icon: "◼", title: "Manufacturing Defects", desc: "Defects in steel components originating from the fabrication process." },
                            { icon: "▲", title: "Weld Breakage", desc: "Breakage at welded joints under standard residential usage." },
                        ].map((item) => (
                            <div key={item.title} style={{ background: "#fff", padding: "1.75rem 1.25rem" }}>
                                <span style={{ fontSize: "1rem", display: "block", marginBottom: "0.625rem" }}>{item.icon}</span>
                                <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111", fontFamily: FM, marginBottom: "0.375rem" }}>{item.title}</p>
                                <p style={{ fontSize: "0.78rem", color: "#777", fontFamily: FO, lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div style={{ padding: "1rem 1.25rem", background: "#fff", borderLeft: "3px solid #1C1C1C" }}>
                        <p style={{ fontSize: "0.875rem", color: "#444", fontFamily: FO, lineHeight: 1.7, margin: 0 }}>
                            This warranty applies <strong style={{ color: "#111" }}>only to the structural integrity of the steel frame</strong>. It does not extend to surface finishes or accessory components.
                        </p>
                    </div>
                </div>
            </section>

            <Divider />

            {/* ── SECTION 3 – WHAT IS NOT COVERED ─────────────────── */}
            <section style={{ background: "#fff", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 03</Label>
                    <SectionHeading>This Warranty Does Not Cover</SectionHeading>
                    <BulletItem>Surface scratches</BulletItem>
                    <BulletItem>Powder coating wear over time</BulletItem>
                    <BulletItem>Damage caused during improper assembly</BulletItem>
                    <BulletItem>Overloading beyond recommended weight capacity</BulletItem>
                    <BulletItem>Corrosion due to water exposure or misuse</BulletItem>
                    <BulletItem>Damage caused by accidents, relocation, or modification of the product</BulletItem>
                </div>
            </section>

            <Divider />

            {/* ── SECTION 4 – WARRANTY CONDITIONS ─────────────────── */}
            <section style={{ background: "#F5F5F5", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 04</Label>
                    <SectionHeading>Warranty Conditions</SectionHeading>
                    <BodyText>To claim warranty, the following conditions must be met:</BodyText>
                    <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "#E6E6E6" }}>
                        {[
                            "Original order invoice must be provided.",
                            "Product must be used under normal residential conditions.",
                            "Proof images or videos of the defect must be submitted.",
                            "Unboxing video may be required in certain cases.",
                        ].map((item) => (
                            <div key={item} style={{ background: "#fff", padding: "1rem 1.25rem", display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                                <div style={{ width: 5, height: 5, background: "#1C1C1C", flexShrink: 0, marginTop: "0.5rem" }} />
                                <p style={{ fontSize: "0.9rem", color: "#444", fontFamily: FO, lineHeight: 1.7, margin: 0 }}>{item}</p>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: "1.25rem", padding: "1rem 1.25rem", background: "#fff", borderLeft: "3px solid #999" }}>
                        <p style={{ fontSize: "0.875rem", color: "#555", fontFamily: FO, lineHeight: 1.7, margin: 0 }}>
                            Warranty is valid <strong style={{ color: "#111" }}>only for the original purchaser</strong> and is <strong style={{ color: "#111" }}>non-transferable</strong>.
                        </p>
                    </div>
                </div>
            </section>

            <Divider />

            {/* ── SECTION 5 – RESOLUTION PROCESS ──────────────────── */}
            <section style={{ background: "#fff", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 05</Label>
                    <SectionHeading>Resolution Process</SectionHeading>
                    <BodyText>If a structural defect is confirmed, SANRA LIVING will offer one of the following resolutions:</BodyText>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 1, background: "#E6E6E6", marginBottom: "1.5rem" }}>
                        <div style={{ background: "#fff", padding: "1.75rem 1.25rem", borderTop: "2px solid #1C1C1C" }}>
                            <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111", fontFamily: FM, marginBottom: "0.375rem" }}>Part Replacement</p>
                            <p style={{ fontSize: "0.78rem", color: "#777", fontFamily: FO, lineHeight: 1.7, margin: 0 }}>The defective component will be replaced at no cost.</p>
                        </div>
                        <div style={{ background: "#fff", padding: "1.75rem 1.25rem", borderTop: "2px solid #999" }}>
                            <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111", fontFamily: FM, marginBottom: "0.375rem" }}>Repair Solution</p>
                            <p style={{ fontSize: "0.78rem", color: "#777", fontFamily: FO, lineHeight: 1.7, margin: 0 }}>A suitable repair solution will be offered where applicable.</p>
                        </div>
                    </div>
                    <BodyText>Full product replacement is subject to evaluation. SANRA LIVING reserves the right to inspect the product before approving a warranty claim.</BodyText>
                </div>
            </section>

            <Divider />

            {/* ── SECTION 6 – CLAIM PROCESS ────────────────────────── */}
            <section style={{ background: "#F5F5F5", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 06</Label>
                    <SectionHeading>How to Initiate a Warranty Claim</SectionHeading>
                    <StepItem number="1">
                        Email us at <strong style={{ color: "#111" }}>support@sanraliving.com</strong> with the subject line: <em>"Warranty Claim – [Order Number]"</em>.
                    </StepItem>
                    <StepItem number="2">
                        Include your <strong style={{ color: "#111" }}>Order Number</strong> and <strong style={{ color: "#111" }}>Product Name</strong> in the email.
                    </StepItem>
                    <StepItem number="3">
                        Attach <strong style={{ color: "#111" }}>clear photos or videos</strong> showing the defect, along with a description of the issue.
                    </StepItem>
                    <StepItem number="4">
                        Our team will review and respond within <strong style={{ color: "#111" }}>2–4 working days</strong>.
                    </StepItem>
                    <div style={{ marginTop: "1.5rem", display: "inline-flex", flexDirection: "column", gap: "0.875rem", background: "#fff", padding: "1.5rem 2rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#888", fontFamily: FM, letterSpacing: "0.15em", textTransform: "uppercase", minWidth: 90 }}>Email</span>
                            <a href="mailto:support@sanraliving.com" style={{ fontSize: "0.9375rem", color: "#111", fontFamily: FM, fontWeight: 700, textDecoration: "none" }}>support@sanraliving.com</a>
                        </div>
                        <div style={{ height: 1, background: "#E6E6E6" }} />
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#888", fontFamily: FM, letterSpacing: "0.15em", textTransform: "uppercase", minWidth: 90 }}>Response</span>
                            <span style={{ fontSize: "0.9375rem", color: "#444", fontFamily: FO }}>2–4 Working Days</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION 7 – CONFIDENCE STATEMENT (Dark Block) ────── */}
            <section style={{ background: "#1C1C1C", padding: "clamp(4rem, 10vw, 7rem) 1.5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 640, margin: "0 auto" }}>
                    <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.22em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", fontFamily: FM, marginBottom: "2rem" }}>
                        SANRA LIVING™ — Engineering Promise
                    </p>
                    <div style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", fontWeight: 900, color: "#fff", fontFamily: FM, lineHeight: 1, letterSpacing: "-0.04em", marginBottom: "0.25rem" }}>10</div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "rgba(255,255,255,0.4)", fontFamily: FM, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "2.5rem" }}>Year Structural Warranty</div>
                    <h2 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)", fontWeight: 900, color: "#fff", lineHeight: 1.2, letterSpacing: "-0.025em", fontFamily: FM, marginBottom: "1.5rem" }}>
                        Built to Last. Designed to Endure.
                    </h2>
                    <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.5)", fontFamily: FO, lineHeight: 1.9, maxWidth: 480, margin: "0 auto 2.5rem" }}>
                        Our 10-Year Structural Warranty reflects our confidence in steel engineering and long-term durability.
                    </p>
                    <div style={{ height: 1, background: "rgba(255,255,255,0.1)", maxWidth: 200, margin: "0 auto" }} />
                </div>
            </section>

            <SiteFooter />
        </main>
    );
}
