import CategoryPage from "../CategoryPage";

export default function BalconyOutdoorPage() {
    return (
        <CategoryPage
            config={{
                slug: "balcony-outdoor",
                name: "Balcony & Outdoor",
                description: "Garden, patio & terrace furniture built to weather every season.",
                dbCategories: ["Balcony & Outdoor", "Outdoor"],
                extraFilters: [
                    { title: "Type", key: "type", options: ["Balcony Table", "Planter Stand", "Drying Stand", "Outdoor Rack"] },
                ],
            }}
        />
    );
}
