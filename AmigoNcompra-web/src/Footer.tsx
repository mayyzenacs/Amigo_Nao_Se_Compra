export const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-orange-100 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 text-orange-600 font-black uppercase tracking-tighter text-2xl mb-6">
              <span>Amigo Não se Compra</span>
            </div>
            <p className="text-slate-500 font-medium leading-relaxed max-w-sm">
              Iniciativa de extensão universitária focada em promover a adoção
              responsável e combater o abandono animal.
            </p>
          </div>

          <div>
            <h4 className="text-slate-900 font-black uppercase text-sm tracking-widest mb-6">
              Navegação
            </h4>
            <ul className="space-y-4 font-bold text-slate-600">
              <li>
                <a href="/" className="hover:text-orange-500 transition-colors">
                  Página Inicial
                </a>
              </li>
              <li>
                <a
                  href="/ongform"
                  className="hover:text-orange-500 transition-colors"
                >
                  Como cadastrar
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-black uppercase text-sm tracking-widest mb-6">
              Informações
            </h4>
            <div className="flex flex-col mb-6">
              <p> por Mayra Pereira</p>
              <a
                href="#"
                className="font-black text-slate-400 hover:text-orange-500 transition-all text-sm uppercase tracking-tighter"
              >
                GitHub
              </a>
              <a
                href="#"
                className="font-black text-slate-400 hover:text-orange-500 transition-all text-sm uppercase tracking-tighter"
              >
                Linkedin
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">
          <p>© 2026 Engenharia de Software - Projeto de Extensão II.</p>
          <div className="flex gap-6">
            <span>Lorem ipsum dolor sit amet.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
