import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Globe, DollarSign, ArrowLeft, Loader2, Heart } from "lucide-react";
import api from "./services/api";
import type { Ong, SearchResponse } from "./types/api"; // Importe o novo tipo aqui

export default function Ongs() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const city = queryParams.get("city") || "";

  const [result, setResult] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOngs() {
      try {
        setLoading(true);
        const response = await api.get<SearchResponse>("ongs/search", {
          params: { city: city },
        });

        setResult(response.data);
      } catch (error) {
        console.error("Erro na integração:", error);
        setResult({ data: [], message: "Erro ao conectar com o servidor." });
      } finally {
        setLoading(false);
      }
    }

    if (city) fetchOngs();
    else setLoading(false);
  }, [city]);

  const renderBadges = (activities: string) => {
    if (!activities) return null;
    const getStyle = (name: string) => {
      const n = name.trim().toLowerCase();
      if (n.includes("resgate")) return "bg-red-50 text-red-600 border-red-100";
      if (n.includes("castracao"))
        return "bg-blue-50 text-blue-600 border-blue-100";
      if (n.includes("adocao"))
        return "bg-green-50 text-green-600 border-green-100";
      return "bg-slate-50 text-slate-500 border-slate-100";
    };

    return activities.split(",").map((atv) => (
      <span
        key={atv}
        className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${getStyle(atv)}`}
      >
        {atv.trim()}
      </span>
    ));
  };

  const renderOngCard = (ong: Ong) => (
    <div
      key={ong.id}
      className="bg-white p-8 rounded-[2.5rem] border-2 border-orange-100 shadow-sm hover:shadow-xl transition-all flex flex-col gap-6 group"
    >
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 bg-slate-50 rounded-3xl overflow-hidden shrink-0 border-2 border-orange-50 flex items-center justify-center">
          <img
            src={ong.photo}
            alt={ong.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
          />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight leading-none">
            {ong.name}
          </h3>
          <div className="flex flex-wrap gap-2 mt-1">
            {renderBadges(ong.activities)}
          </div>
        </div>
      </div>
      <p className="text-slate-500 font-medium leading-relaxed line-clamp-3">
        {ong.about}
      </p>
      <div className="grid grid-cols-2 gap-4 mt-auto">
        <a
          href={ong.website || "#"}
          target="_blank"
          className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-black py-4 rounded-2xl transition-all uppercase text-xs tracking-widest border border-slate-200"
        >
          <Globe size={18} /> Site Oficial
        </a>
        <button className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-orange-500/20 uppercase text-xs tracking-widest">
          <DollarSign size={18} /> Como Doar
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-orange-50 font-sans pb-20 selection:bg-orange-200">
      <main className="max-w-6xl mx-auto px-6 pt-12">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-orange-600 font-black mb-8 hover:bg-orange-100 w-fit px-4 py-2 rounded-xl transition-all uppercase text-xs tracking-widest"
        >
          <ArrowLeft size={18} strokeWidth={3} /> Voltar para o início
        </button>

        <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter mb-12 leading-none">
          ONGs em{" "}
          <span className="text-orange-500">{city || "Sua Região"}</span>
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-orange-500" size={48} />
            <p className="font-black uppercase text-slate-400 tracking-widest">
              Rastreando instituições...
            </p>
          </div>
        ) : (
          <div className="space-y-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {result?.data.map(renderOngCard)}
            </div>

            {result?.data.length === 0 && (
              <div className="space-y-12">
                <div className="bg-white p-16 rounded-[3rem] border-4 border-dashed border-orange-100 text-center">
                  <p className="text-2xl font-black text-slate-400 uppercase italic mb-2">
                    {result.message || "Nenhuma ONG encontrada nesta cidade."}
                  </p>
                  <p className="text-orange-500 font-bold uppercase tracking-widest text-sm">
                    Mas não vá embora! Confira estas outras instituições:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {result.suggestions?.map(renderOngCard)}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {[
            { tit: "Apoie Local", desc: "Fortaleça a rede." },
            { tit: "Adoção", desc: "Amigo pra vida." },
            { tit: "Divulgação", desc: "Compartilhe." },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-10 border border-orange-100 shadow-sm"
            >
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <Heart size={32} fill="currentColor" />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase mb-3">
                {item.tit}
              </h3>
              <p className="font-medium text-slate-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
