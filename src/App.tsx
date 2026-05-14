import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import PublicProfile from "./pages/PublicProfile.tsx";
import StrategicRoadmap from "./pages/StrategicRoadmap.tsx";
import NotFound from "./pages/NotFound.tsx";
import { I18nProvider } from "@/i18n/I18nContext";
import { AuthProvider } from "@/hooks/useAuth";
import Auth from "./pages/Auth.tsx";
import MentorView from "./pages/MentorView.tsx";
import CompanyView from "./pages/CompanyView.tsx";
import { RequireAuth } from "@/components/medad/RoleRouter";
import { DemoBanner } from "@/components/medad/DemoBanner";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <I18nProvider>
      <AccessibilityProvider>
      <AuthProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <DemoBanner />
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<RequireAuth allow={["student","admin"]}><Index /></RequireAuth>} />
          <Route path="/mentor" element={<RequireAuth><MentorView /></RequireAuth>} />
          <Route path="/company" element={<RequireAuth><CompanyView /></RequireAuth>} />
          <Route path="/roadmap" element={<RequireAuth><StrategicRoadmap /></RequireAuth>} />
          <Route path="/profile/:slug" element={<PublicProfile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
      </AccessibilityProvider>
      </I18nProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
