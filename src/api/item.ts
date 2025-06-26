import { axiosInstance } from '.';
import type { ItemType } from '../types/ItemType';
import type { ItemFilterType } from '../types/ItemType';

export async function createItemApi(item: ItemType): Promise<ItemType> {
  const response = await axiosInstance.post('/items', item);
  return response.data;
}

export async function fetchItemsApi(
  filter: ItemFilterType = {},
  isNewSearch: boolean = false
): Promise<{ data: ItemType[]; nextToken?: string }> {
  const params: any = {
    order: filter.order,
    orderByColumn: filter.orderByColumn,
    search: filter.search,
    rows: filter.rows,
    status: filter.status,
  };
  if (!isNewSearch && filter.nextToken) params.nextToken = filter.nextToken;

  const response = await axiosInstance.get('/items', { params });
  return response.data;
}

export async function fetchItemByIdApi(id: string): Promise<ItemType> {
  const response = await axiosInstance.get(`/items/${id}`);
  return response.data;
}

export async function updateItemApi(id: string, item: ItemType): Promise<ItemType> {
  const response = await axiosInstance.put(`/items/${id}`, item);
  return response.data;
}

export async function deleteItemApi(id: string): Promise<void> {
  await axiosInstance.delete(`/items/${id}`);
}
