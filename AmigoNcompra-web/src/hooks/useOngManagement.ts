import { useState } from "react";
import api from "../services/api";
import { INITIAL_ONG, type NewOng, type OngFormData } from "../types/admin";

export function useOngManagement() {
  const [ongs, setOngs] = useState<NewOng[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<OngFormData>(INITIAL_ONG);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetch = async (pageNum: number) => {
    try {
      setIsLoading(true);
      const res = await api.get(`/ongs?page=${pageNum}&pageSize=10`);
      setOngs(res.data.data);
      setPage(res.data.pagination.currentPage);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error("Erro ao buscar ONGs:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const delete_ = async (id: string) => {
    if (!window.confirm("Remover esta ONG permanentemente?")) return;
    try {
      await api.delete(`/ongs/delete/${id}`);
      setOngs(ongs.filter((o) => o.id !== id));
      alert("ONG removida.");
    } catch (err) {
      console.error("Erro ao deletar ONG:", err);
    }
  };

  const startEdit = (ong: NewOng) => {
    setFormData({
      name: ong.name,
      city: ong.city,
      website: ong.website || "",
      contact: ong.contact,
      activities: ong.activities || 0,
      about: ong.about || "",
      photo: ong.photo || "",
    });
    setEditingId(ong.id);
  };

  const startNew = () => {
    setFormData(INITIAL_ONG);
    setEditingId(null);
  };

  const toggleActivity = (flag: number) => {
    setFormData((p) => ({
      ...p,
      activities: p.activities ^ flag,
    }));
  };

  const submit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        city: formData.city,
        website: formData.website || null,
        contact: formData.contact,
        activities: formData.activities > 0 ? formData.activities : null,
        about: formData.about || null,
        photo: formData.photo || null,
      };

      if (editingId) await api.put(`/ongs/update/${editingId}`, payload);
      else await api.post("/ongs/add", payload);

      alert("ONG salva!");
      setFormData(INITIAL_ONG);
      setEditingId(null);
      await fetch(page);
    } catch (err) {
      console.error("Erro:", err);
      alert("Falha ao salvar a ONG.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    ongs,
    isLoading,
    isSubmitting,
    editingId,
    formData,
    setFormData,
    page,
    totalPages,
    setPage,
    fetch,
    delete: delete_,
    startEdit,
    startNew,
    toggleActivity,
    submit,
  };
}
