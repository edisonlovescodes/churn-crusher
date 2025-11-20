import { AdminDashboard } from "@/components/AdminDashboard";

export default function AdminPage() {
    return (
        <main className="min-h-screen bg-background p-8 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[30%] h-[30%] bg-red-900/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 mb-8">
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-muted-foreground">Monitor community health and prevent churn.</p>
            </div>

            <div className="relative z-10">
                <AdminDashboard />
            </div>
        </main>
    );
}
