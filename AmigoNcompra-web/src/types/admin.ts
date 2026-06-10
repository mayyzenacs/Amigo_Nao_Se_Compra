export const ACTIVITY_FLAGS = [
  { label: "Adoção", value: 1 },
  { label: "Recebe Doação", value: 2 },
  { label: "Resgate", value: 4 },
  { label: "Castração", value: 8 },
];

export type DashboardView =
  | "list-ongs"
  | "form-ongs"
  | "list-pets"
  | "form-pets";

export interface OngFormData {
  name: string;
  city: string;
  website: string;
  contact: string;
  activities: number;
  about: string;
  photo: string;
}

export const INITIAL_ONG = {
  name: "",
  city: "",
  website: "",
  contact: "",
  activities: 0,
  about: "",
  photo: "",
};

export interface NewOng {
  id: string;
  name: string;
  city: string;
  website?: string;
  contact: string;
  activities?: number;
  about?: string;
  photo?: string;
}

export interface PetFormData {
  name: string;
  photo: string;
}

export const INITIAL_PET = { name: "", photo: "" };
