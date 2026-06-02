import { BrowserRouter, Route, Routes } from "react-router-dom";
import Ongs from "./pages/Ongs";
import Ongform from "./pages/Ongform";
import Mission from "./pages/Mission";
import Privacy from "./pages/Privacy";
import { AdmLogin } from "./pages/AdmLogin";
import { ProtectedRoute } from "./pages/Protected";
import { AdminDashboard } from "./pages/AdmDashboard";
import { Footer } from "./pages/Footer";
import { Home } from "./pages/Home";

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
