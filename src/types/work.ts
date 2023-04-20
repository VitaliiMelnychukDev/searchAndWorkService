import { Work } from '../entities/Work';

export type SearchWork = {
  works: Work[];
  total: number;
};
