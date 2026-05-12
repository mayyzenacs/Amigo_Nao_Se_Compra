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

export interface Pet {
  id: string;
  name: string;
  photo: string;
}

export interface SearchResponse {
  data: Ong[];
  suggestions?: Ong[];
  message?: string;
}
