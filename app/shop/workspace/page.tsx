import CategoryPage from "../CategoryPage";

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
