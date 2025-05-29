import axiosInstance from './axios';
import type { ItemType } from '../types/ItemType';

export async function getAllItems(): Promise<ItemType[]> {
  const response = await axiosInstance.get('/items');
  return response.data;
}