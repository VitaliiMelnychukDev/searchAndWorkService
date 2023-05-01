import { Work } from '../entities/Work';

export type SearchWork = {
  works: Work[];
  total: number;
};

export type Worker = {
  id: number;
  email: string;
  phone: string | null;
  name: string;
  categoryDescription: string;
};
