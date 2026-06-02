import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Trash2,
  Edit,
  Plus,
  Activity,
  ShieldAlert,
  X,
  Link as LinkIcon,
  Dog,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useOngManagement } from "../hooks/useOngManagement";
import { usePetManagement } from "../hooks/usePetManagement";
import { ACTIVITY_FLAGS, type DashboardView } from "../types/admin";

export function AdminDashboard() {
  const [view, setView] = useState<DashboardView>("list-ongs");
  const navigate = useNavigate();
  const ongMgmt = useOngManagement();
  const petMgmt = usePetManagement();

  useEffect(() => {
    if (view === "list-ongs") {
      ongMgmt.fetch(ongMgmt.page).catch(() => handleLogout());
    } else if (view === "list-pets") {
      petMgmt.fetch();
    }
  }, [view]);

  const handleLogout = () => {
    localStorage.removeItem("@AmigoNCompra:token");
    navigate("/");
  };

  const navButton = (
    viewName: DashboardView,
    icon: React.ReactNode,
    label: string,
    isNew?: boolean,
  ) => (
    <button
      onClick={() => {
        if (isNew) {
          if (viewName === "form-ongs") ongMgmt.startNew();
          else petMgmt.startNew();
        }
        setView(viewName);
      }}
      className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold transition-all ${
        view === viewName
          ? "bg-white/10 text-orange-400"
          : "text-slate-400 hover:bg-white/5"
      }`}
    >
      {icon} {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex">
      <aside className="w-64 bg-black text-white p-6 flex flex-col shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <ShieldAlert className="text-orange-500" size={32} />
          <h2 className="text-xl font-black uppercase tracking-tighter">
            Painel <span className="text-orange-500">Admin</span>
          </h2>
        </div>

        <nav className="flex-1 space-y-6">
          <div className="space-y-2">
            <h3 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-2 mb-3">
              Instituições
            </h3>
            {navButton("list-ongs", <Activity size={18} />, "Gerenciar ONGs")}
            {navButton("form-ongs", <Plus size={18} />, "Adicionar ONG", true)}
          </div>

          <div className="space-y-2">
            <h3 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-2 mb-3">
              Animais
            </h3>
            {navButton("list-pets", <Dog size={18} />, "Gerenciar Pets")}
            {navButton("form-pets", <Plus size={18} />, "Adicionar Pet", true)}
          </div>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full p-4 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded-xl font-bold transition-colors mt-auto"
        >
          <LogOut size={20} /> Encerrar Sessão
        </button>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        {view === "list-ongs" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
              Controle de ONGs
            </h1>
            <p className="text-slate-500 font-medium mb-10">
              Gerencie as instituições cadastradas na plataforma.
            </p>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              {ongMgmt.isLoading ? (
                <div className="p-10 text-center text-slate-400 font-bold animate-pulse">
                  Carregando dados...
                </div>
              ) : (
                <>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100/50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-widest">
                        <th className="p-5 font-black">Instituição</th>
                        <th className="p-5 font-black">Cidade</th>
                        <th className="p-5 font-black">Contato</th>
                        <th className="p-5 font-black text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ongMgmt.ongs.map((ong) => (
                        <tr
                          key={ong.id}
                          className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                          <td className="p-5 font-bold text-slate-900">
                            {ong.name}
                          </td>
                          <td className="p-5 text-slate-600 font-medium">
                            {ong.city}
                          </td>
                          <td className="p-5 text-slate-600">{ong.contact}</td>
                          <td className="p-5 flex justify-end gap-3">
                            <button
                              onClick={() => {
                                ongMgmt.startEdit(ong);
                                setView("form-ongs");
                              }}
                              className="p-2 text-slate-400 hover:text-blue-500 rounded-lg"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => ongMgmt.delete(ong.id)}
                              className="p-2 text-slate-400 hover:text-red-500 rounded-lg"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="flex items-center justify-between p-5 bg-slate-50/50 border-t border-slate-100">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                      Página {ongMgmt.page} de {ongMgmt.totalPages}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          ongMgmt.setPage(Math.max(1, ongMgmt.page - 1))
                        }
                        disabled={ongMgmt.page === 1}
                        className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-all"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={() =>
                          ongMgmt.setPage(
                            Math.min(ongMgmt.totalPages, ongMgmt.page + 1),
                          )
                        }
                        disabled={ongMgmt.page >= ongMgmt.totalPages}
                        className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-all"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {view === "form-ongs" && (
          <div className="max-w-4xl mx-auto">
            <header className="flex justify-between items-center mb-10">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                {ongMgmt.editingId ? "Editar Instituição" : "Nova ONG"}
              </h1>
            </header>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ongMgmt.submit().then(() => setView("list-ongs"));
              }}
              className="bg-white rounded-3xl shadow-sm p-8 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    key: "name",
                    label: "Nome *",
                    type: "text",
                    required: true,
                  },
                  {
                    key: "city",
                    label: "Cidade *",
                    type: "text",
                    required: true,
                  },
                  {
                    key: "contact",
                    label: "Contato *",
                    type: "text",
                    required: true,
                  },
                  {
                    key: "website",
                    label: "Website",
                    type: "url",
                    required: false,
                  },
                ].map(({ key, label, type, required }) => (
                  <div key={key} className="space-y-2">
                    <label className="text-xs font-black text-slate-400">
                      {label}
                    </label>
                    <input
                      type={type}
                      required={required}
                      value={
                        ongMgmt.formData[key as keyof typeof ongMgmt.formData]
                      }
                      onChange={(e) =>
                        ongMgmt.setFormData({
                          ...ongMgmt.formData,
                          [key]: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border-2 border-slate-300 rounded-2xl p-4 focus:border-orange-400 focus:outline-none transition-colors"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400">
                  Atividades
                </label>
                <div className="flex gap-3 flex-wrap">
                  {ACTIVITY_FLAGS.map((f) => (
                    <button
                      key={f.value}
                      type="button"
                      onClick={() => ongMgmt.toggleActivity(f.value)}
                      className={`flex gap-2 px-4 py-2 rounded-xl border-2 border-slate-300 font-bold transition-all ${
                        (ongMgmt.formData.activities & f.value) === f.value
                          ? "bg-orange-200 border-orange-500 text-orange-600"
                          : "border-slate-200 text-slate-400"
                      }`}
                    >
                      {(ongMgmt.formData.activities & f.value) === f.value}
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400">
                  Sobre
                </label>
                <textarea
                  rows={3}
                  value={ongMgmt.formData.about}
                  onChange={(e) =>
                    ongMgmt.setFormData({
                      ...ongMgmt.formData,
                      about: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50 border-2 border-slate-300 rounded-2xl p-4 focus:border-orange-400 focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400">
                  URL Foto (Imgur)
                </label>
                <input
                  type="url"
                  value={ongMgmt.formData.photo}
                  onChange={(e) =>
                    ongMgmt.setFormData({
                      ...ongMgmt.formData,
                      photo: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50 border-2 border-slate-300 rounded-2xl p-4 focus:border-orange-400 focus:outline-none transition-colors"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={ongMgmt.isSubmitting}
                  className="bg-black text-white px-4 py-4 rounded-xl font-black flex gap-3 hover:bg-slate-800 disabled:opacity-50 transition-all"
                >
                  {ongMgmt.isSubmitting ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        )}

        {view === "list-pets" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-10">
              Controle de Pets
            </h1>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              {petMgmt.isLoading ? (
                <div className="p-10 text-center font-bold text-slate-400">
                  Carregando dados...
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-100/50 border-b text-slate-500 text-xs uppercase">
                      <th className="p-5 font-black">Foto</th>
                      <th className="p-5 font-black">Nome do Pet</th>
                      <th className="p-5 font-black text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {petMgmt.pets.map((pet) => (
                      <tr
                        key={pet.id}
                        className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        <td className="p-3 pl-5">
                          {pet.photo ? (
                            <img
                              src={pet.photo}
                              alt={pet.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center">
                              <Dog size={20} className="text-slate-400" />
                            </div>
                          )}
                        </td>
                        <td className="p-5 font-bold">{pet.name}</td>
                        <td className="p-5 flex justify-end gap-3">
                          <button
                            onClick={() => {
                              petMgmt.startEdit(pet);
                              setView("form-pets");
                            }}
                            className="p-2 text-slate-400 hover:text-blue-500 rounded-lg transition-colors"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => petMgmt.delete(pet.id)}
                            className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {view === "form-pets" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
            <header className="flex justify-between items-center mb-10">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                {petMgmt.editingId ? "Editar Pet" : "Novo Pet"}
              </h1>
              <button
                onClick={() => setView("list-pets")}
                className="bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2"
              >
                <X size={20} /> Cancelar
              </button>
            </header>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                petMgmt.submit().then(() => setView("list-pets"));
              }}
              className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 space-y-6"
            >
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400">
                  Nome do Pet *
                </label>
                <input
                  type="text"
                  required
                  value={petMgmt.formData.name}
                  onChange={(e) =>
                    petMgmt.setFormData({
                      ...petMgmt.formData,
                      name: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50 border-2 border-slate-300 rounded-2xl p-4 focus:border-orange-400 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400">
                  URL da Foto (Imgur)
                </label>
                <div className="relative">
                  <LinkIcon
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    type="url"
                    value={petMgmt.formData.photo}
                    onChange={(e) =>
                      petMgmt.setFormData({
                        ...petMgmt.formData,
                        photo: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border-2 border-slate-300 rounded-2xl p-4 pl-14 focus:border-orange-400 focus:outline-none transition-colors"
                  />
                </div>
                {petMgmt.formData.photo && (
                  <img
                    src={petMgmt.formData.photo}
                    alt="Preview"
                    className="mt-4 h-32 rounded-xl object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={petMgmt.isSubmitting}
                  className="bg-black text-white px-4 py-4 rounded-xl font-black flex gap-3 hover:bg-slate-800 disabled:opacity-50 transition-all"
                >
                  {petMgmt.isSubmitting ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
