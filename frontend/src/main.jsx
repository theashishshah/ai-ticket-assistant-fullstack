import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CheckAuth from "./components/CheckAuth.jsx";
import Tickets from "./pages/Tickets.jsx";
import TicketDetailsPage from "./pages/Ticket.jsx";
import Login from "./pages/Login.jsx";
import Singup from "./pages/Singup.jsx";
import Admin from "./pages/Admin.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <CheckAuth protected={true}>
                            <Tickets />
                        </CheckAuth>
                    }
                />
                <Route
                    path="/tickets/:id"
                    element={
                        <CheckAuth protected={true}>
                            <TicketDetailsPage />
                        </CheckAuth>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <CheckAuth protected={false}>
                            <Login />
                        </CheckAuth>
                    }
                />
                <Route
                    path="/singup"
                    element={
                        <CheckAuth protected={false}>
                            <Singup />
                        </CheckAuth>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <CheckAuth protected={true}>
                            <Admin />
                        </CheckAuth>
                    }
                />
            </Routes>
        </BrowserRouter>
    </StrictMode>,
);
