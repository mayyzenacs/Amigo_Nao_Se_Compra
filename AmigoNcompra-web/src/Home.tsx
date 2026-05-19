import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PawPrint, Info, MapPin, Search, Heart } from "lucide-react";
import api from "./services/api";
import type { Pet } from "./types/api";

export function Home() {
  const [validCities, setValidCities] = useState<string[]>([]);
  const [city, setCity] = useState("");
  const [pets, setPets] = useState<Pet[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get<string[]>("cities/list")
      .then((res) => setValidCities(res.data))
      .catch((err) => console.error("Erro ao carregar cidades:", err));
    api
      .get<Pet[]>("pets")
      .then((res) => setPets(res.data.slice(0, 5)))
      .catch((err) => console.error("Erro ao carregar pets:", err));
  }, []);

  const filteredSuggestions = useMemo(() => {
    const searchTerm = city.trim().toLowerCase();
    if (searchTerm.length < 3) return [];

    return validCities
      .filter((c) => c.toLowerCase().includes(searchTerm))
      .slice(0, 10);
  }, [city, validCities]);

  const isCityValid = validCities.some(
    (c) => c.toLowerCase() === city.trim().toLowerCase(),
  );

  const handleSearch = () => {
    const trimmedCity = city.trim();
    if (trimmedCity && isCityValid) {
      navigate(`/ongs?city=${encodeURIComponent(trimmedCity)}`);
    }
  };
  return (
    <div className="min-h-screen bg-orange-50 text-slate-800 font-sans selection:bg-orange-200">
      <section className="w-full bg-black py-12 md:py-16 text-white relative overflow-hidden border-b-8 border-orange-700/30">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 rotate-12 pointer-events-none">
          <PawPrint size={400} />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6 leading-none underline decoration-orange-500 decoration-6 underline-offset-6">
                Amigo <span className="text-orange-500">Não </span>{" "}
                <span> se Compra</span>.
              </h2>

              <div className="space-y-6 text-xl font-medium text-orange-50/90 leading-relaxed">
                <p>
                  Estima-se que mais de{" "}
                  <span className="text-white font-black">
                    30 milhões de animais
                  </span>{" "}
                  vivem em situação de abandono no Brasil. Todos os anos,
                  milhares são descartados como objetos.
                </p>
                <p>
                  Ao adotar, você quebra o ciclo de um{" "}
                  <span className="text-white">sistema escravizatório</span> de
                  reprodução forçada.
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-3xl p-8 md:max-w-sm w-full shadow-2xl">
              <h3 className="font-black uppercase text-sm tracking-widest mb-6 flex items-center gap-2">
                <span className="shrink-0">
                  <Info size={18} />
                </span>{" "}
                Por que Adotar?
              </h3>
              <ul className="space-y-4 text-base font-bold">
                <li className="flex gap-3 items-start">
                  <span className="bg-orange-200 text-orange-700 rounded-full p-1 leading-none text-xs">
                    ✓
                  </span>
                  <span className="flex-1">
                    Salva uma vida do abandono e da solidão
                  </span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="bg-orange-200 text-orange-700 rounded-full p-1 leading-none text-xs">
                    ✓
                  </span>
                  <span className="flex-1">
                    Garante que o amor não tenha preço
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-2xl shadow-orange-900/5 mb-12 border border-orange-100 relative -mt-24 z-20">
          <div className="flex items-center gap-2 text-orange-600 font-black uppercase tracking-widest text-sm mb-6">
            <PawPrint size={18} />
            <span>Encontre sua nova amizade</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight mb-6 tracking-tight">
            Encontre amor na sua <span className="text-orange-500">cidade</span>
            . 🧡
          </h1>

          <p className="text-lg md:text-xl font-medium text-slate-600 max-w-2xl mb-10 leading-relaxed">
            Busque ONGs locais e descubra instituições comprometidas perto de
            você.
          </p>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <MapPin
                className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${
                  !isCityValid && city
                    ? "text-red-400"
                    : "text-slate-400 group-focus-within:text-orange-500"
                }`}
                size={24}
              />
              <input
                type="text"
                list="cities-list"
                placeholder="Qual sua cidade? (Ex: São Paulo)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className={`w-full bg-slate-50 border-2 rounded-2xl p-6 pl-16 text-lg font-semibold focus:outline-none transition-all shadow-inner ${
                  !isCityValid && city
                    ? "border-red-200 focus:border-red-400"
                    : "border-slate-100 focus:border-orange-400 focus:bg-white"
                }`}
              />
              <datalist id="cities-list">
                {filteredSuggestions.map((c, index) => (
                  <option key={index} value={c} />
                ))}
              </datalist>
            </div>

            <button
              onClick={handleSearch}
              disabled={!isCityValid}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none text-white rounded-2xl px-12 py-6 text-xl font-black uppercase transition-all flex items-center justify-center gap-3 shadow-lg shadow-orange-500/25 active:scale-95"
            >
              Buscar ONGs <Search size={24} strokeWidth={3} />
            </button>
          </div>

          {!isCityValid && city.length > 2 && (
            <p className="text-red-500 font-bold text-sm mt-3 ml-2 animate-pulse">
              ⚠️ Esta cidade não foi encontrada. Verifique a grafia!
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              className="bg-white rounded-3xl p-10 border border-orange-100 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Heart size={32} fill="currentColor" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase mb-4 tracking-tight">
                {item.tit}
              </h3>
              <p className="font-medium text-slate-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <section className="mt-20 mb-20">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-none uppercase tracking-tighter underline decoration-orange-500 decoration-4 underline-offset-6">
              Alerta de fofura
            </h2>
            <br />
            <span className="text-2xl md:text-xl text-slate-400 font-medium lowercase">
              veja animais adotados felizes e desperte o bem no coração
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {pets.length > 0 ? (
              pets.map((pet) => (
                <div
                  key={pet.id}
                  className="group relative overflow-hidden rounded-xl aspect-3/4"
                >
                  <div className="absolute top-4 left-4 z-20 pointer-events-none">
                    <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">
                      <span className="text-orange-500">
                        {pet.name.substring(0, 1)}
                      </span>
                      <span className="text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
                        {pet.name.substring(1)}
                      </span>
                    </h3>
                  </div>
                  <img
                    src={pet.photo}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400";
                    }}
                  />
                  <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-transparent opacity-60" />
                </div>
              ))
            ) : (
              <div className="col-span-full py-10 text-center border-2 border-dashed border-orange-200 rounded-2xl">
                <p className="text-slate-400 font-black uppercase tracking-widest text-sm">
                  Nenhum pet encontrado na API... 🐾
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
