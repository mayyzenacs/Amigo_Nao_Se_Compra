import { BrowserRouter, Route, Routes } from "react-router-dom";
import Mission from "./pages/Mission";
import Privacy from "./pages/Privacy";
import { AdmLogin } from "./pages/AdmLogin";
import { ProtectedRoute } from "./Protected";
import { AdminDashboard } from "./pages/AdmDashboard";
import Ongs from "./pages/Ongs";
import Ongform from "./pages/Ongform";
import { Home } from "lucide-react";
import { Footer } from "./Footer";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <main className="grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ongs" element={<Ongs />} />
            <Route path="/cadastro" element={<Ongform />} />
            <Route path="/manifesto" element={<Mission />} />
            <Route path="/privacidade" element={<Privacy />} />

            <Route path="/mcp-login" element={<AdmLogin />} />

            <Route
              path="/admin/painel"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
