import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { store } from "@/redux/store";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { AppShell } from "@/layout/AppShell";
import { ProtectedRoute } from "@/layout/ProtectedRoute";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import Drivers from "./pages/Drivers";
import Bookings from "./pages/Bookings";
import Maintenance from "./pages/Maintenance";
import Insurance from "./pages/Insurance";
import AccidentsFines from "./pages/AccidentsFines";
import Disposal from "./pages/Disposal";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ReduxProvider store={store}>
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route element={<ProtectedRoute />}>
                  <Route element={<AppShell />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/vehicles" element={<Vehicles />} />
                    <Route path="/drivers" element={<Drivers />} />
                    <Route path="/bookings" element={<Bookings />} />
                    <Route path="/maintenance" element={<Maintenance />} />
                    <Route path="/insurance" element={<Insurance />} />
                    <Route path="/accidents" element={<AccidentsFines />} />
                    <Route path="/disposal" element={<Disposal />} />
                    <Route path="/profile" element={<Profile />} />
                  </Route>
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  </ReduxProvider>
);

export default App;
