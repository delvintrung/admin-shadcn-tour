import { NavLink } from "react-router-dom";
import { LayoutDashboard, Map,CableCar } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";



const navLinks = [
    {
        to: "/",
        label: "Dashboard",
        icon: LayoutDashboard,
    },
    {
        to: "/tours",
        label: "Quản lý Tour",
        icon: Map,
    },
    {
        to: "/bookings",
        label: "Quản lý Booking",
        icon: CableCar,
    },
];

export function Sidebar() {
    return (
        <aside className="hidden h-screen w-64 flex-col border-r bg-background md:flex">
            <div className="flex h-16 items-center border-b px-6">
                <NavLink to="/" className="flex items-center gap-2 font-semibold">
                    <Map className="h-6 w-6" /> {/* Icon logo tạm thời */}
                    <span>TourAdmin</span>
                </NavLink>
            </div>

            {/* Danh sách link */}
            <nav className="flex-1 space-y-2 p-4">
                {navLinks.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end // 'end' prop đảm bảo link "/" không bị active khi ở "/tours"
                        // Dùng hàm trong className để check active
                        className={({ isActive }) =>
                            cn(
                                buttonVariants({ variant: isActive ? "secondary" : "ghost" }),
                                "w-full justify-start"
                            )
                        }
                    >
                        <link.icon className="mr-2 h-4 w-4" />
                        {link.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}