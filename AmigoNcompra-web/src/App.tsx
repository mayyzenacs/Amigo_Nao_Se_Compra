import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./Home";
import { Footer } from "./Footer";
import Ongs from "./Ongs";
import Ongform from "./Ongform";
import Mission from "./Mission";

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
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
