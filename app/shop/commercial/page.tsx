import CategoryPage from "../CategoryPage";

export default function CommercialPage() {
    return (
        <CategoryPage
            config={{
                slug: "commercial",
                name: "Commercial",
                description: "Institutional-grade furniture for offices, hostels, libraries & retail spaces.",
                dbCategories: ["Commercial"],
                extraFilters: [
                    { title: "Type", key: "type", options: ["Hostel Bunk Frame", "Library Rack", "Retail Display Rack", "Institutional Desk"] },
                ],
            }}
        />
    );
}
