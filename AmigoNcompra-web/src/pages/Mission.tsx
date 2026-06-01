import { ArrowLeft, Target, Heart, ShieldCheck, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Mission() {
  const navigate = useNavigate();

  const values = [
    {
      icon: <Heart className="text-orange-500" size={32} />,
      title: "Causa Animal",
      desc: "Nossa prioridade absoluta é o bem-estar dos animais que hoje não possuem visibilidade no sistema.",
    },
    {
      icon: <ShieldCheck className="text-orange-500" size={32} />,
      title: "Curadoria Técnica",
      desc: "Não somos apenas um mural. Cada ONG passa por uma triagem antes de aparecer aqui.",
    },
    {
      icon: <Target className="text-orange-500" size={32} />,
      title: "Foco no Resultado",
      desc: "Trabalhamos para reduzir o abandono sistêmico através de conexões reais e conscientes.",
    },
    {
      icon: <Users className="text-orange-500" size={32} />,
      title: "Comunidade",
      desc: "Unimos protetores, adotantes e tecnologia em uma rede de apoio mútua.",
    },
  ];

  return (
    <div className="min-h-screen bg-orange-50 font-sans pb-20 selection:bg-orange-200">
      <main className="max-w-5xl mx-auto px-6 pt-12">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-orange-600 font-black mb-8 hover:bg-orange-100 w-fit px-4 py-2 rounded-xl transition-all uppercase text-xs tracking-widest"
        >
          <ArrowLeft size={18} strokeWidth={3} /> Voltar para o início
        </button>
        <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl border-2 border-orange-100 mb-10">
          <header className="mb-8">
            <span className="text-orange-500 font-black uppercase tracking-[0.3em] text-sm">
              Manifesto
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter mt-4 mb-8 leading-none">
              Nossa Missão é <br />
              <span className="text-orange-500">Mudar o Destino.</span>
            </h2>
            <p className="text-xl text-slate-500 font-medium max-w-3xl leading-relaxed">
              O{" "}
              <span className="text-slate-900 font-bold">
                Amigo não se compra
              </span>{" "}
              nasceu da indignação com os números de abandono e a
              comercialização de vidas como objetos. Nós usamos tecnologia para
              dar visibilidade a quem realmente faz a diferença na ponta:
              <span className="text-orange-600 font-black italic">
                {" "}
                as ONGs e protetoras sérias.
              </span>
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t-2 border-slate-50 pt-12">
            <div>
              <h3 className="text-2xl font-black text-slate-900 uppercase mb-4 tracking-tight">
                O Objetivo
              </h3>
              <p className="text-slate-500 font-bold leading-relaxed">
                Conscientizar sobre a comercialização de animais e incentivar a
                adoção responsável. Queremos que cada pessoa que decida adotar
                saiba exatamente onde encontrar uma instituição idônea,
                eliminando o comércio de vidas e incentivando a guarda
                responsável.
              </p>
            </div>
            <div className="bg-orange-500 rounded-4xl p-8 text-white shadow-xl rotate-1 md:rotate-2">
              <h3 className="text-2xl font-black uppercase mb-2">
                Impacto Real
              </h3>
              <p className="font-bold text-orange-100">
                Mais de 30 milhões de animais vivem em situação de abandono.
                Nossa meta é reduzir esse número mapeando as ONGs brasileiras e
                incentivando a adoção desses animais.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-[2.5rem] border-2 border-orange-100 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="mb-6 bg-orange-50 w-fit p-4 rounded-2xl">
                {v.icon}
              </div>
              <h4 className="font-black text-slate-900 uppercase text-sm tracking-widest mb-3">
                {v.title}
              </h4>
              <p className="text-slate-500 text-sm font-bold leading-relaxed">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
