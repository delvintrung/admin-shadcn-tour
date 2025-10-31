// src/components/layout/MainLayout.tsx
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header"; // 1. Import Header
import { Toaster } from "@/components/ui/sonner"

export function MainLayout() {
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[256px_1fr]">

            <Sidebar />
            <div className="flex flex-col">
                <Header />
                <main className="flex-1 overflow-auto bg-muted/40 p-6 md:p-8">
                    <Toaster position="top-right" />
                    <Outlet />
                </main>
            </div>
        </div>
    );
}