export type ApplicationResponse = {
  id: string;
  name: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PaginatedApplicationResponse = {
  data: ApplicationResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

