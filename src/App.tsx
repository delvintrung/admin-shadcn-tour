import { ToursPage } from "./pages/tours/ToursPage";
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {MainLayout} from "@/components/layout/Mainlayout.tsx";
import {DashboardPage} from "@/pages/DashboardPage.tsx";
import {BookingsPage} from "@/pages/bookings/BookingPage.tsx";
import {UsersPage} from "@/pages/users/UserPage.tsx";
import {ToursDetailPage} from "@/pages/tours-detail/ToursDetailPage.tsx";
import {ToursDetailByIdPage} from "@/pages/tours-detail/components/TourDetailByIdPage.tsx";
import {NotFoundPage} from "@/pages/404Page.tsx";
import ItineraryPage from "@/pages/itineraries/ItineraryPage.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                     <Route index element={<DashboardPage />} />
                    <Route path="tours" element={<ToursPage />} />
                    <Route path="bookings" element={<BookingsPage />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="tours-detail" element={<ToursDetailPage />} />
                    <Route path="tours-detail/:id/edit" element={<ToursDetailByIdPage/>} />
                    <Route path="itinerary" element={<ItineraryPage/>} />
                    <Route path="*" element={<NotFoundPage/>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App
