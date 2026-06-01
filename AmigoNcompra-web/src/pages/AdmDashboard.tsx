import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Trash2,
  Edit,
  Plus,
  Activity,
  ShieldAlert,
  Send,
  X,
  Link as LinkIcon,
  Check,
  Dog,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../services/api";
import {
  ACTIVITY_FLAGS,
  type DashboardView,
  type NewOng,
  type Pet,
} from "../types/api";

export function AdminDashboard() {
  const [activeView, setActiveView] = useState<DashboardView>("list-ongs");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [ongs, setOngs] = useState<NewOng[]>([]);
  const [editingOngId, setEditingOngId] = useState<string | null>(null);
  const [ongPage, setOngPage] = useState(1);
  const [ongTotalPages, setOngTotalPages] = useState(1);
  const [ongFormData, setOngFormData] = useState({
    name: "",
    city: "",
    website: "",
    contact: "",
    activities: 0,
    about: "",
    photo: "",
  });

  const [pets, setPets] = useState<Pet[]>([]);
  const [editingPetId, setEditingPetId] = useState<string | null>(null);
  const [petFormData, setPetFormData] = useState({
    name: "",
    photo: "",
  });

  useEffect(() => {
    if (activeView === "list-ongs") fetchOngs(ongPage);
    if (activeView === "list-pets") fetchPets();
  }, [activeView, ongPage]);

  const fetchOngs = async (pageToFetch: number) => {
    try {
      setIsLoading(true);
      const response = await api.get(`/ongs?page=${pageToFetch}&pageSize=10`);
      setOngs(response.data.data);
      setOngPage(response.data.pagination.currentPage);
      setOngTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Erro ao buscar ONGs:", error);
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOng = async (id: string) => {
    if (!window.confirm("Remover esta ONG permanentemente?")) return;
    try {
      await api.delete(`/ongs/delete/${id}`);
      setOngs(ongs.filter((ong) => ong.id !== id));
      alert("ONG removida.");
    } catch (error) {
      console.error("Erro ao deletar ONG:", error);
    }
  };

  const handleEditOngClick = (ong: NewOng) => {
    setOngFormData({
      name: ong.name,
      city: ong.city,
      website: ong.website || "",
      contact: ong.contact,
      activities: ong.activities || 0,
      about: ong.about || "",
      photo: ong.photo || "",
    });
    setEditingOngId(ong.id);
    setActiveView("form-ongs");
  };

  const handleAddNewOngClick = () => {
    setOngFormData({
      name: "",
      city: "",
      website: "",
      contact: "",
      activities: 0,
      about: "",
      photo: "",
    });
    setEditingOngId(null);
    setActiveView("form-ongs");
  };

  const toggleActivity = (flagValue: number) => {
    setOngFormData((prev) => ({
      ...prev,
      activities: prev.activities ^ flagValue,
    }));
  };

  const isActivityActive = (flagValue: number) => {
    return (ongFormData.activities & flagValue) === flagValue;
  };

  const handleSubmitOng = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name: ongFormData.name,
        city: ongFormData.city,
        website: ongFormData.website || null,
        contact: ongFormData.contact,
        activities: ongFormData.activities > 0 ? ongFormData.activities : null,
        about: ongFormData.about || null,
        photo: ongFormData.photo || null,
      };

      if (editingOngId) await api.put(`/ongs/update/${editingOngId}`, payload);
      else await api.post("/ongs/add", payload);

      alert("ONG salva!");
      setActiveView("list-ongs");
    } catch (error) {
      console.error("Erro:", error);
      alert("Falha ao salvar a ONG.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchPets = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<Pet[]>("/pets");
      setPets(response.data);
    } catch (error) {
      console.error("Erro ao buscar Pets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePet = async (id: string) => {
    if (!window.confirm("Remover este pet permanentemente?")) return;
    try {
      await api.delete(`/pets/delete/${id}`);
      setPets(pets.filter((pet) => pet.id !== id));
      alert("Pet removido.");
    } catch (error) {
      console.error("Erro ao deletar Pet:", error);
    }
  };

  const handleEditPetClick = (pet: Pet) => {
    setPetFormData({ name: pet.name, photo: pet.photo || "" });
    setEditingPetId(pet.id);
    setActiveView("form-pets");
  };

  const handleAddNewPetClick = () => {
    setPetFormData({ name: "", photo: "" });
    setEditingPetId(null);
    setActiveView("form-pets");
  };

  const handleSubmitPet = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name: petFormData.name,
        photo: petFormData.photo || null,
      };
      if (editingPetId) await api.put(`/pets/update/${editingPetId}`, payload);
      else await api.post("/pets/add", payload);

      alert("Pet salvo!");
      setActiveView("list-pets");
    } catch (error) {
      console.error("Erro:", error);
      alert("Falha ao salvar o Pet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("@AmigoNCompra:token");
    navigate("/");
  };

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
            <button
              onClick={() => setActiveView("list-ongs")}
              className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold transition-all ${
                activeView === "list-ongs"
                  ? "bg-white/10 text-orange-400"
                  : "text-slate-400 hover:bg-white/5"
              }`}
            >
              <Activity size={18} /> Gerenciar ONGs
            </button>
            <button
              onClick={handleAddNewOngClick}
              className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold transition-all ${
                activeView === "form-ongs" && !editingOngId
                  ? "bg-white/10 text-orange-400"
                  : "text-slate-400 hover:bg-white/5"
              }`}
            >
              <Plus size={18} /> Adicionar ONG
            </button>
          </div>

          <div className="space-y-2">
            <h3 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-2 mb-3">
              Animais
            </h3>
            <button
              onClick={() => setActiveView("list-pets")}
              className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold transition-all ${
                activeView === "list-pets"
                  ? "bg-white/10 text-orange-400"
                  : "text-slate-400 hover:bg-white/5"
              }`}
            >
              <Dog size={18} /> Gerenciar Pets
            </button>
            <button
              onClick={handleAddNewPetClick}
              className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold transition-all ${
                activeView === "form-pets" && !editingPetId
                  ? "bg-white/10 text-orange-400"
                  : "text-slate-400 hover:bg-white/5"
              }`}
            >
              <Plus size={18} /> Adicionar Pet
            </button>
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
        {activeView === "list-ongs" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex justify-between items-center mb-10">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                  Controle de ONGs
                </h1>
                <p className="text-slate-500 font-medium">
                  Gerencie as instituições cadastradas na plataforma.
                </p>
              </div>
            </header>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              {isLoading ? (
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
                      {ongs.map((ong) => (
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
                              onClick={() => handleEditOngClick(ong)}
                              className="p-2 text-slate-400 hover:text-blue-500 rounded-lg"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteOng(ong.id)}
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
                      Página {ongPage} de {ongTotalPages}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setOngPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={ongPage === 1}
                        className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-all"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={() =>
                          setOngPage((prev) =>
                            Math.min(ongTotalPages, prev + 1),
                          )
                        }
                        disabled={ongPage >= ongTotalPages}
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

        {activeView === "form-ongs" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
            <header className="flex justify-between items-center mb-10">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                  {editingOngId ? "Editar Instituição" : "Nova ONG"}
                </h1>
              </div>
              <button
                onClick={() => setActiveView("list-ongs")}
                className="bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2"
              >
                <X size={20} /> Cancelar
              </button>
            </header>
            <form
              onSubmit={handleSubmitOng}
              className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400">
                    Nome *
                  </label>
                  <input
                    type="text"
                    required
                    value={ongFormData.name}
                    onChange={(e) =>
                      setOngFormData({ ...ongFormData, name: e.target.value })
                    }
                    className="w-full bg-slate-50 border-2 rounded-2xl p-4"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    required
                    value={ongFormData.city}
                    onChange={(e) =>
                      setOngFormData({ ...ongFormData, city: e.target.value })
                    }
                    className="w-full bg-slate-50 border-2 rounded-2xl p-4"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400">
                    Contato *
                  </label>
                  <input
                    type="text"
                    required
                    value={ongFormData.contact}
                    onChange={(e) =>
                      setOngFormData({
                        ...ongFormData,
                        contact: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border-2 rounded-2xl p-4"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400">
                    Website
                  </label>
                  <input
                    type="url"
                    value={ongFormData.website}
                    onChange={(e) =>
                      setOngFormData({
                        ...ongFormData,
                        website: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border-2 rounded-2xl p-4"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400">
                  Atividades (Bitmask)
                </label>
                <div className="flex gap-3">
                  {ACTIVITY_FLAGS.map((f) => (
                    <button
                      key={f.value}
                      type="button"
                      onClick={() => toggleActivity(f.value)}
                      className={`flex gap-2 px-4 py-2 rounded-xl border-2 font-bold ${isActivityActive(f.value) ? "bg-orange-50 border-orange-500 text-orange-600" : "border-slate-200 text-slate-400"}`}
                    >
                      {isActivityActive(f.value) && <Check size={16} />}
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
                  value={ongFormData.about}
                  onChange={(e) =>
                    setOngFormData({ ...ongFormData, about: e.target.value })
                  }
                  className="w-full bg-slate-50 border-2 rounded-2xl p-4"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400">
                  URL Foto (Imgur)
                </label>
                <input
                  type="url"
                  value={ongFormData.photo}
                  onChange={(e) =>
                    setOngFormData({ ...ongFormData, photo: e.target.value })
                  }
                  className="w-full bg-slate-50 border-2 rounded-2xl p-4"
                />
              </div>
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-black text-white px-8 py-4 rounded-xl font-black flex gap-3"
                >
                  {isSubmitting ? "Salvando..." : "Salvar"}
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>
        )}

        {activeView === "list-pets" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex justify-between items-center mb-10">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                  Controle de Pets
                </h1>
              </div>
            </header>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              {isLoading ? (
                <div className="p-10 text-center font-bold">
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
                    {pets.map((pet) => (
                      <tr key={pet.id} className="border-b">
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
                            onClick={() => handleEditPetClick(pet)}
                            className="p-2 hover:text-blue-500"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeletePet(pet.id)}
                            className="p-2 hover:text-red-500"
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

        {activeView === "form-pets" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
            <header className="flex justify-between items-center mb-10">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                {editingPetId ? "Editar Pet" : "Novo Pet"}
              </h1>
              <button
                onClick={() => setActiveView("list-pets")}
                className="bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2"
              >
                <X size={20} /> Cancelar
              </button>
            </header>
            <form
              onSubmit={handleSubmitPet}
              className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 space-y-6"
            >
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400">
                  Nome do Pet *
                </label>
                <input
                  type="text"
                  required
                  value={petFormData.name}
                  onChange={(e) =>
                    setPetFormData({ ...petFormData, name: e.target.value })
                  }
                  className="w-full bg-slate-50 border-2 rounded-2xl p-4"
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
                    value={petFormData.photo}
                    onChange={(e) =>
                      setPetFormData({ ...petFormData, photo: e.target.value })
                    }
                    className="w-full bg-slate-50 border-2 rounded-2xl p-4 pl-14"
                  />
                </div>
                {petFormData.photo && (
                  <img
                    src={petFormData.photo}
                    alt="Preview"
                    className="mt-4 h-32 rounded-xl object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
              </div>
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-black text-white px-8 py-4 rounded-xl font-black flex gap-3"
                >
                  {isSubmitting ? "Salvando..." : "Salvar"}
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
