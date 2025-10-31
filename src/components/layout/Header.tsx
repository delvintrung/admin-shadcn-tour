// src/components/layout/Header.tsx
import { NavLink } from "react-router-dom";
import { Menu, UserCircle, Map, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

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
];

export function Header() {
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-6">

            {/* 1. Mobile Menu (Sheet) */}
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Mở menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="flex flex-col">
                        <nav className="grid gap-2 text-lg font-medium">
                            <NavLink
                                to="/"
                                className="flex items-center gap-2 text-lg font-semibold mb-4"
                            >
                                <Map className="h-6 w-6" />
                                <span>TourAdmin</span>
                            </NavLink>
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    end
                                    className={({ isActive }) =>
                                        cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                                            isActive
                                                ? "text-primary bg-muted"
                                                : "text-muted-foreground hover:text-primary"
                                        )
                                    }
                                >
                                    <link.icon className="h-4 w-4" />
                                    {link.label}
                                </NavLink>
                            ))}
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>

            {/* 2. Tên Công ty (Desktop) */}
            <div className="hidden md:block">
                <h1 className="text-lg font-semibold">
                    Booking Tour Mininator Page
                </h1>
            </div>

            {/* 3. User Menu (Dropdown) */}
            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="rounded-full">
                            <UserCircle className="h-5 w-5" />
                            <span className="sr-only">Mở menu người dùng</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Cài đặt</DropdownMenuItem>
                        <DropdownMenuItem>Hỗ trợ</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Đăng xuất</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}