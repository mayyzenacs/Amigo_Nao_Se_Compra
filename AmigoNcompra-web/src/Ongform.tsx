import { useState } from "react";
import { ArrowLeft, Send, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Ongform() {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    contact: "",
    activities: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submissionPayload = {
      ...formData,
      requestDate: new Date().toISOString(),
      source: "web_form_mvp",
      status: "PENDING_CURATION",
    };

    console.log("JSON captured for manual curation:", submissionPayload);

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center p-6 font-sans">
        <div className="bg-white rounded-[3rem] p-12 text-center shadow-2xl border-2 border-orange-100 max-w-lg">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} strokeWidth={3} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 uppercase mb-4 tracking-tighter">
            Recebido!
          </h2>
          <p className="text-slate-500 font-bold mb-8 leading-relaxed">
            Coletamos as informações da sua ONG. Nossa equipe fará a triagem e
            entraremos em contato para publicar o perfil.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 font-sans pb-20 selection:bg-orange-200">
      <main className="max-w-4xl mx-auto px-6 pt-12">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-orange-600 font-black mb-8 hover:bg-orange-100 w-fit px-4 py-2 rounded-xl transition-all uppercase text-xs tracking-widest"
        >
          <ArrowLeft size={18} strokeWidth={3} /> Voltar para o início
        </button>

        <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl border-2 border-orange-100">
          <header className="mb-12">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter mb-6 leading-none">
              Sua ONG no{" "}
              <span className="text-orange-500">Amigo não se compra</span>
            </h2>
            <p className="text-lg text-slate-500 font-medium max-w-2xl leading-relaxed">
              Ajude-nos a mapear instituições. Preencha os dados abaixo para
              nossa
              <span className="text-orange-600 font-black italic">
                {" "}
                triagem manual
              </span>
              .
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-black uppercase text-sm tracking-widest text-slate-400 ml-2">
                  Nome da Instituição
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 focus:outline-none focus:border-orange-400 transition-all font-bold placeholder:text-slate-300"
                  placeholder="Ex: Abrigo Patas"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-black uppercase text-[10px] tracking-widest text-slate-400 ml-2">
                  Cidade - UF
                </label>
                <input
                  required
                  type="text"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 focus:outline-none focus:border-orange-400 transition-all font-bold placeholder:text-slate-300"
                  placeholder="Ex: Jundiai - SP"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-black uppercase text-[10px] tracking-widest text-slate-400 ml-2">
                Link de Contato(whatsapp) ou Rede Social
              </label>
              <input
                required
                type="text"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 focus:outline-none focus:border-orange-400 transition-all font-bold placeholder:text-slate-300"
                placeholder="Ex: instagram.com/suaong OU wa.me/5511"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-black uppercase text-[10px] tracking-widest text-slate-400 ml-2">
                Link do site
              </label>
              <input
                required
                type="text"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 focus:outline-none focus:border-orange-400 transition-all font-bold placeholder:text-slate-300"
                placeholder="Caso não tenha deixe em branco"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-black uppercase text-[10px] tracking-widest text-slate-400 ml-2">
                O que vocês fazem?
              </label>
              <textarea
                required
                value={formData.activities}
                onChange={(e) =>
                  setFormData({ ...formData, activities: e.target.value })
                }
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 focus:outline-none focus:border-orange-400 transition-all font-bold min-h-35 resize-none placeholder:text-slate-300"
                placeholder="Descreva se realizam adoção, recebem doações, quais atividades e breve resumo..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-6 rounded-2xl transition-all shadow-xl shadow-orange-500/30 uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95"
            >
              Enviar para Triagem <Send size={20} />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
