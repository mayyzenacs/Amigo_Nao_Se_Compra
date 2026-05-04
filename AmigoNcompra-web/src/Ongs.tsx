import { useLocation, useNavigate } from "react-router-dom";
import {
  MapPin,
  Globe,
  DollarSign,
  Heart,
  ArrowLeft,
  PawPrint,
} from "lucide-react";

export default function Ongs() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const city = queryParams.get("cidade") || "";

  const ongsExemplo = [
    {
      id: 1,
      nome: "ACÃOCHEGO",
      atividades: ["Adoção", "Recebe Doações", "Resgate"],
      logo: "/images.jpg",
      site: "https://www.instagram.com/acaochego",
    },
    {
      id: 2,
      nome: "Abrigo Animal",
      atividades: ["Adoção", "Resgate"],
      logo: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=200",
      site: "#",
    },
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {ongsExemplo.map((ong) => (
            <div
              key={ong.id}
              className="bg-white p-8 rounded-[2.5rem] border-2 border-orange-100 shadow-sm hover:shadow-xl transition-all flex flex-col gap-6 group"
            >
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-slate-50 rounded-3xl overflow-hidden shrink-0 border-2 border-orange-50 flex items-center justify-center">
                  {ong.logo ? (
                    <img
                      src={ong.logo}
                      alt={ong.nome}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                  ) : (
                    <PawPrint size={40} className="text-slate-200" />
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight leading-none">
                    {ong.nome}
                  </h3>

                  {/* Tags de Atividades */}
                  <div className="flex flex-wrap gap-2 mt-1">
                    {ong.atividades?.map((atv, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-black uppercase tracking-widest bg-orange-100 text-orange-600 px-2 py-1 rounded-md border border-orange-200/50"
                      >
                        {atv}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ações Estratégicas */}
              <div className="grid grid-cols-2 gap-4">
                <a
                  href={ong.site}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-black py-4 rounded-2xl transition-all uppercase text-xs tracking-widest border border-slate-200"
                >
                  <Globe size={18} /> Site Oficial
                </a>
                <button className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-orange-500/20 uppercase text-xs tracking-widest">
                  <DollarSign size={18} /> Como Doar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            {
              tit: "Apoie Local",
              desc: "Fortaleça a rede de proteção da sua cidade.",
            },
            { tit: "Adoção", desc: "Encontre um amigo para a vida toda." },
            {
              tit: "Divulgação",
              desc: "Compartilhe para que mais vidas sejam salvas.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-10 border border-orange-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <Heart size={32} fill="currentColor" />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase mb-3">
                {item.tit}
              </h3>
              <p className="font-medium text-slate-500 leading-relaxed text-sm">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="p-12 rounded-[3rem] text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <PawPrint
              size={200}
              className="absolute -right-10 -bottom-10 rotate-12 text-white"
            />
          </div>
          <div className="relative z-10">
            <p className="text-orange-400 font-black text-2xl md:text-3xl uppercase tracking-tighter mb-4">
              Quer sua ong aqui?
            </p>
            <a
              href="#"
              className="font-bold hover:text-orange-500 underline underline-offset-8 transition-colors text-lg"
            >
              Veja como cadastrar sua instituição
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
