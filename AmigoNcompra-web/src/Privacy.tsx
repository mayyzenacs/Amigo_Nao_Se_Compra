import { ArrowLeft, ShieldCheck, Mail, EyeOff, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Privacy() {
  const navigate = useNavigate();

  const sections = [
    {
      icon: <EyeOff className="text-orange-500" size={24} />,
      title: "Por que minha ONG está aqui?",
      desc: "Nossa base de dados é construída através de mapeamento público e indicações da comunidade. O objetivo é puramente dar visibilidade gratuita para o trabalho de proteção animal.",
    },
    {
      icon: <FileText className="text-orange-500" size={24} />,
      title: "Uso dos Dados",
      desc: "Exibimos apenas informações públicas (nome, localização, redes sociais e site). Não comercializamos dados e não cobramos taxas de ONGs ou adotantes.",
    },
  ];

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
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck size={32} strokeWidth={2.5} />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-6 leading-none">
              Privacidade e <br />
              <span className="text-orange-500">Transparência</span>
            </h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              Respeitamos o trabalho dos protetores. Entenda como lidamos com as
              informações exibidas em nossa plataforma de mapeamento.
            </p>
          </header>

          <div className="space-y-10">
            {sections.map((s, i) => (
              <div
                key={i}
                className="flex gap-6 items-start border-l-4 border-orange-100 pl-6"
              >
                <div className="mt-1">{s.icon}</div>
                <div>
                  <h3 className="font-black text-slate-900 uppercase text-sm tracking-widest mb-2">
                    {s.title}
                  </h3>
                  <p className="text-slate-500 font-bold leading-relaxed italic">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}

            <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-xl mt-12">
              <div className="flex items-center gap-4 mb-6">
                <Mail className="text-orange-500" size={32} />
                <h3 className="text-2xl font-black uppercase tracking-tight">
                  Deseja remover sua ONG?
                </h3>
              </div>
              <p className="text-slate-400 font-bold mb-8 leading-relaxed">
                Se você é o responsável legal por uma instituição listada e
                prefere que os dados não sejam exibidos em nosso mapeamento,
                basta entrar em contato. Realizamos a remoção imediata.
              </p>

              <div className="flex flex-col bg-slate-800 border-2 border-slate-700 p-4 rounded-2xl w-full md:w-fit">
                <span className="text-orange-500 font-black uppercase text-sm md:text-sm tracking-[0.2em] block mb-2">
                  E-mail para solicitações
                </span>
                <a
                  href="mailto:mayyzenacontato@gmail.com"
                  className="text-sm md:text-lg font-mono font-bold hover:text-orange-400 transition-colors break-all md:break-normal"
                >
                  mayyzenacontato@gmail.com
                </a>
              </div>
            </div>
          </div>

          <footer className="mt-12 pt-12 border-t-2 border-slate-50 text-center">
            <p className="text-slate-400 text-sm font-black uppercase tracking-widest">
              Última atualização: Maio de 2026
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
