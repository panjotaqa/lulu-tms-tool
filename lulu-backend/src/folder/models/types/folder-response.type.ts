export type FolderResponse = {
  id: string;
  title: string;
  order: number; // Mapeado de position
  projectId: string;
  parentFolderId: string | null;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  children?: FolderResponse[];
  createdAt: Date;
  updatedAt: Date;
};

export type FolderTreeResponse = FolderResponse[];

