import { axiosInstance } from '.';
import type { UserType } from '../types/UserType';
import type { UserFilterType } from '../types/UserType';

export async function createUserApi(user: UserType): Promise<UserType> {
  const response = await axiosInstance.post('/users', user);
  return response.data;
}

export async function fetchUsersApi(
  filter: UserFilterType = {},
  isNewSearch: boolean = false
): Promise<{ data: UserType[]; nextToken?: string }> {
  const params: any = {
    order: filter.order,
    orderByColumn: filter.orderByColumn,
    search: filter.search,
    rows: filter.rows,
  };
  if (!isNewSearch && filter.nextToken) params.nextToken = filter.nextToken;

  const response = await axiosInstance.get('/users', { params });
  return response.data;
}

export async function fetchUserByIdApi(id: string): Promise<UserType> {
  const response = await axiosInstance.get(`/users/${id}`);
  return response.data;
}

export async function updateUserApi(id: string, user: UserType): Promise<UserType> {
  const response = await axiosInstance.put(`/users/${id}`, user);
  return response.data;
}

export async function deleteUserApi(id: string): Promise<void> {
  await axiosInstance.delete(`/users/${id}`);
}