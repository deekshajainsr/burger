/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ViewOrder from "./pages/ViewOrder";
import SpecialRequest from "./pages/SpecialRequest";
import { CartProvider } from "./CartContext";
import { AuthProvider, useAuth } from "./AuthContext";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: '"Outfit", sans-serif',
  },
  palette: {
    primary: {
      main: '#1F2937',
    },
    secondary: {
      main: '#EF4444',
    },
  },
});

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAuth();
  if (loading) return null;
  return isAdmin ? <>{children}</> : <Navigate to="/" />;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <Router>
          <div className="min-h-screen flex flex-col bg-brand-cream">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/:id"
                  element={
                    <ProtectedRoute>
                      <ViewOrder />
                    </ProtectedRoute>
                  }
                />
                <Route path="/special-request" element={<SpecialRequest />} />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <Admin />
                    </AdminRoute>
                  }
                />
              </Routes>
            </main>
            <footer className="bg-brand-dark text-white py-12 mt-20">
              <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-display font-bold mb-4">Burger Shop</h2>
                <p className="text-white/40 max-w-md mx-auto mb-8">
                  The best burgers in town, delivered straight to your door. Fresh ingredients, 
                  expertly grilled, and served with a smile.
                </p>
                <div className="h-px bg-white/10 w-full mb-8" />
                <p className="text-white/20 text-sm">
                  © 2026 Burger Shop. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
    </ThemeProvider>
  );
}

