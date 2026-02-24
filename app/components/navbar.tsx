import Link from "next/link";
import { useEffect, useState } from "react";

function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const tc = scrolled ? "#111111" : "#ffffff";
    const tc2 = scrolled ? "#555555" : "rgba(255,255,255,0.65)";

    return (
        <nav style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
            background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(0, 0, 0, 0.97)",
            borderBottom: scrolled ? "1px solid #E6E6E6" : "none",
            backdropFilter: scrolled ? "blur(8px)" : "none",
            transition: "all 0.3s ease",
        }}>
            <div className="sl-container">
                <div className="flex items-center justify-between" style={{ height: 72 }}>

                    {/* Logo */}
                    <Link href="/" style={{ textDecoration: "none" }}>
                        <div style={{ lineHeight: 1 }}>
                            <div style={{ fontSize: "1.25rem", fontWeight: 800, letterSpacing: "0.06em", color: tc, textTransform: "uppercase", transition: "color 0.3s" }}>SANRA LIVING</div>
                            <div style={{ fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.2em", color: tc2, textTransform: "uppercase", transition: "color 0.3s" }}>ENGINEERED STEEL LIVING</div>
                        </div>
                    </Link>

                    {/* Desktop nav — HIDDEN on mobile via Tailwind */}
                    <div className="hidden md:flex items-center" style={{ gap: "2.25rem" }}>
                        {["Shop", "About", "Warranty", "Contact"].map((item) => (
                            <Link key={item} href={`/${item.toLowerCase()}`}
                                style={{ fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: tc, textDecoration: "none", transition: "color 0.3s" }}>
                                {item}
                            </Link>
                        ))}
                        <Link href="/shop" className="sl-btn sl-btn-primary" style={{ padding: "0.6rem 1.5rem", fontSize: "0.75rem" }}>Shop Now</Link>
                    </div>

                    {/* Mobile hamburger — HIDDEN on desktop via Tailwind */}
                    <button onClick={() => setMenuOpen(!menuOpen)}
                        className="flex md:hidden flex-col justify-center items-center gap-[5px] p-2"
                        style={{ background: "transparent", border: "none", cursor: "pointer" }}
                        aria-label="Toggle menu">
                        {[0, 1, 2].map((i) => (
                            <span key={i} style={{ display: "block", width: 22, height: 2, background: tc, borderRadius: 1, transition: "background 0.3s" }} />
                        ))}
                    </button>
                </div>
            </div>

            {/* Mobile menu dropdown */}
            {menuOpen && (
                <div style={{ background: "#fff", borderTop: "1px solid #E6E6E6", padding: "0.5rem 0 1.5rem" }}>
                    <div className="sl-container">
                        {["Shop", "About", "Warranty", "Contact"].map((item) => (
                            <Link key={item} href={`/${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                                style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#111", textDecoration: "none", padding: "0.875rem 0", borderBottom: "1px solid #F0F0F0" }}>
                                {item}
                            </Link>
                        ))}
                        <Link href="/shop" onClick={() => setMenuOpen(false)} className="sl-btn sl-btn-primary"
                            style={{ display: "block", marginTop: "1rem", textAlign: "center" }}>
                            Shop Now
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;