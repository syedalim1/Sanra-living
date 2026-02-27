import type { Metadata } from "next";
import CategoryPage from "../CategoryPage";

export const metadata: Metadata = {
    title: "Steel Office & Workspace Furniture in India – Desks, Stands & Systems",
    description: "Premium steel office desks, meeting tables, monitor stands, filing racks & workstation frames. Engineered for focus and productivity. Delivered across India.",
    alternates: { canonical: "/shop/workspace" },
    openGraph: { title: "Steel Workspace Furniture – SANRA LIVING", description: "Office desks, monitor stands & filing systems in industrial steel.", url: "/shop/workspace" },
};

export default function WorkspacePage() {
    return (
        <CategoryPage
            config={{
                slug: "workspace",
                name: "Workspace",
                description: "Desks, stands & office systems engineered for focus and productivity.",
                dbCategories: ["Workspace"],
                extraFilters: [
                    { title: "Type", key: "type", options: ["Office Desk", "Meeting Table", "Monitor Stand", "Filing Rack", "Workstation Frame"] },
                ],
            }}
        />
    );
}
