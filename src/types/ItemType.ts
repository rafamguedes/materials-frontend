export type ItemType = {
  id: number;
  name: string;
  description: string;
  itemType: string;
  status: string;
  serialNumber: string;
};

export type ItemFilterType = {
  order?: 'ASC' | 'DESC';
  orderByColumn?: string;
  search?: string;
  rows?: number;
  nextToken?: string;
  status?: string;
};