import { Company } from '../entities/Company';
import { PaginationData } from './pagination';

export type SearchCompanies = {
  companies: Company[];
} & PaginationData;
