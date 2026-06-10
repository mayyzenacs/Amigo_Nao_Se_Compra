import { useState } from "react";
import api from "../services/api";
import type { Pet } from "../types/api";
import { INITIAL_PET, type PetFormData } from "../types/admin";

export function usePetManagement() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PetFormData>(INITIAL_PET);

  const fetch = async () => {
    try {
      setIsLoading(true);
      const res = await api.get<Pet[]>("/pets");
      setPets(res.data);
    } catch (err) {
      console.error("Erro ao buscar Pets:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const delete_ = async (id: string) => {
    if (!window.confirm("Remover este pet permanentemente?")) return;
    try {
      await api.delete(`/pets/delete/${id}`);
      setPets(pets.filter((p) => p.id !== id));
      alert("Pet removido.");
    } catch (err) {
      console.error("Erro ao deletar Pet:", err);
    }
  };

  const startEdit = (pet: Pet) => {
    setFormData({ name: pet.name, photo: pet.photo || "" });
    setEditingId(pet.id);
  };

  const startNew = () => {
    setFormData(INITIAL_PET);
    setEditingId(null);
  };

  const submit = async () => {
    setIsSubmitting(true);
    try {
      const payload = { name: formData.name, photo: formData.photo || null };
      if (editingId) await api.put(`/pets/update/${editingId}`, payload);
      else await api.post("/pets/add", payload);

      alert("Pet salvo!");
      setFormData(INITIAL_PET);
      setEditingId(null);
      await fetch();
    } catch (err) {
      console.error("Erro:", err);
      alert("Falha ao salvar o Pet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    pets,
    isLoading,
    isSubmitting,
    editingId,
    formData,
    setFormData,
    fetch,
    delete: delete_,
    startEdit,
    startNew,
    submit,
  };
}
