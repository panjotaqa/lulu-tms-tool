import { User } from '../../../user/models/user.entity';

export type ProjectResponse = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  isArchived: boolean;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  users: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
};

export type PaginatedProjectResponse = {
  data: ProjectResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

