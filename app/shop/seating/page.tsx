import CategoryPage from "../CategoryPage";

export default function SeatingPage() {
    return (
        <CategoryPage
            config={{
                slug: "seating",
                name: "Seating",
                description: "Chairs, stools & lounge systems engineered from structural steel.",
                dbCategories: ["Seating"],
                extraFilters: [
                    { title: "Type", key: "type", options: ["Chair", "Arm Chair", "Cushion Chair", "Bench", "Stool"] },
                    { title: "Cushion", key: "cushion", options: ["With Cushion", "Without Cushion"] },
                ],
            }}
        />
    );
}
