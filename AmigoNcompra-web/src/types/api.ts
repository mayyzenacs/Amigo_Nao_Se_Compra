export interface Ong {
  id: string;
  name: string;
  city: string;
  contact: string;
  website: string;
  about: string;
  activities: string;
  photo: string;
}

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

export interface Pet {
  id: string;
  name: string;
  photo: string;
}

export interface SearchResponse {
  data: Ong[];
  suggestions?: Ong[];
  code: string;
}

export interface OngRegister {
  name: string;
  cityuf: string;
  contacturl: string;
  websitelink: string;
  activities: string;
}

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
