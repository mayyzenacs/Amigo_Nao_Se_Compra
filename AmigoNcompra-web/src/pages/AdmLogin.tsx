import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, PawPrint, ArrowLeft } from "lucide-react";
import api from "../services/api";

export function AdmLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await api.post("/login", { username, password });

      const { token } = response.data;
      localStorage.setItem("@AmigoNCompra:token", token);

      navigate("/admin/painel");
    } catch (err: any) {
      setError("Acesso negado. Credenciais inválidas.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-6 font-sans">
      <button
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 text-slate-400 hover:text-orange-600 flex items-center gap-2 font-bold uppercase text-xs transition-colors"
      >
        <ArrowLeft size={16} /> Voltar para o site
      </button>

      <div className="max-w-md w-full">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-orange-900/10 border border-orange-100">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-2 border-red-100 text-red-600 p-4 rounded-2xl text-sm font-bold">
                ⚠️ {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">
                Usuário
              </label>
              <div className="relative group">
                <User
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors"
                  size={20}
                />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 pl-14 text-lg font-semibold focus:outline-none focus:border-orange-400 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">
                Acesso
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors"
                  size={20}
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 pl-14 text-lg font-semibold focus:outline-none focus:border-orange-400 focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black hover:bg-orange-600 text-white rounded-2xl py-5 text-xl font-black uppercase transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:bg-slate-300"
            >
              {isLoading ? "Validando..." : "Entrar no Sistema"}
              {!isLoading}
            </button>
          </form>
        </div>

        <div className="text-center mt-8 flex items-center justify-center gap-2 text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">
          <PawPrint size={12} />
          <span>Amigo Não se Compra - Painel</span>
        </div>
      </div>
    </div>
  );
}
