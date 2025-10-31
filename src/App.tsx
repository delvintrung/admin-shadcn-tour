import { ToursPage } from "./pages/tours/ToursPage";
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {MainLayout} from "@/components/layout/Mainlayout.tsx";
import {DashboardPage} from "@/pages/DashboardPage.tsx";
import {BookingsPage} from "@/pages/BookingPage.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                     <Route index element={<DashboardPage />} />
                    <Route path="tours" element={<ToursPage />} />
                    <Route path="bookings" element={<BookingsPage />} />

                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App
