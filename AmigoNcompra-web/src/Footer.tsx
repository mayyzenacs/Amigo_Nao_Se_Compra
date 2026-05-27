export const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-orange-100 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 text-orange-600 font-black uppercase tracking-tighter text-2xl mb-6">
              <span>
                Amigo <span className="text-black"> Não</span> se Compra
              </span>
            </div>
            <p className="text-slate-500 font-medium leading-relaxed max-w-sm">
              Iniciativa de extensão universitária focada em conscientizar sobre
              o abandono e comercialização de animais.
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
                  href="/manifesto"
                  className="hover:text-orange-500 transition-colors"
                >
                  Nosso Objetivo
                </a>
              </li>
              <li>
                <a
                  href="/cadastro"
                  className="hover:text-orange-500 transition-colors"
                >
                  Como Cadastrar
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-black uppercase text-sm tracking-widest mb-6">
              Informações
            </h4>
            <div className="flex flex-col">
              <ul className="font-bold text-slate-600 mb-9">
                <li>
                  <a
                    href="/privacidade"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Privacidade
                  </a>
                </li>
              </ul>
              <p> por Mayra Pereira</p>
              <div className="flex items-center gap-2">
                <a
                  href="https://github.com/mayyzenacs"
                  target="_blank"
                  className="font-black text-slate-500 hover:text-orange-500 transition-all text-sm "
                >
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/mayradev/"
                  target="_blank"
                  className="font-black text-slate-500 hover:text-orange-500 transition-all text-sm"
                >
                  Linkedin
                </a>{" "}
                <a
                  href="https://mayradev.me"
                  target="_blank"
                  className="font-black text-slate-500 hover:text-orange-500 transition-all text-sm"
                >
                  Portfólio
                </a>{" "}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-50 flex justify-center text-[10px] font-black uppercase text-slate-400 tracking-widest">
          <p>© 2026 Amigo não se compra - mayra pereira</p>
        </div>
      </div>
    </footer>
  );
};
