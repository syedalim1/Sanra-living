import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "10 Year Structural Warranty – SANRA LIVING Steel Furniture",
    description:
        "SANRA LIVING offers a 10-year structural warranty on all steel furniture frames. Learn about coverage, conditions, claim process & resolution. Built on engineering confidence.",
    keywords: [
        "steel furniture warranty", "10 year warranty furniture India",
        "SANRA LIVING warranty", "structural warranty steel furniture",
        "furniture warranty claim", "steel frame warranty",
    ],
    alternates: { canonical: "/warranty" },
    openGraph: {
        title: "10 Year Structural Warranty – SANRA LIVING",
        description: "Industry-leading 10-year warranty on steel furniture frames. Learn about coverage & claims.",
        url: "/warranty",
        type: "website",
    },
};

export default function WarrantyLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
