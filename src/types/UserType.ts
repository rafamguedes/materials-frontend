export type UserType = {
  id: number;
  name: string;
  email: string;
  registry: string;
  active: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  address?: {
    street?: string;
    number?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    complement?: string;
  };
};

export type UserFilterType = {
  order?: 'ASC' | 'DESC';
  search?: string;
  orderByColumn?: string;
  rows?: number;
  nextToken?: string;
};