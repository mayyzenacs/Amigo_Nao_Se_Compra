import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import { Footer } from "./Footer";
import Ongs from "./Ongs";
import Ongform from "./Ongform";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <main className="grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ongs" element={<Ongs />} />
            <Route path="/ongform" element={<Ongform />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
