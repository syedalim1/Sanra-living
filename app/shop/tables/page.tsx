import CategoryPage from "../CategoryPage";

export default function TablesPage() {
    return (
        <CategoryPage
            config={{
                slug: "tables",
                name: "Tables",
                description: "Dining, coffee, side & work tables crafted from precision steel.",
                dbCategories: ["Tables", "Study Desks"],
                extraFilters: [
                    { title: "Type", key: "type", options: ["Study Table", "Computer Table", "Work Desk", "Laptop Table", "Dining Table", "Coffee Table", "TV Unit Frame"] },
                    { title: "Size", key: "size", options: ["Compact", "Full Size"] },
                ],
            }}
        />
    );
}
