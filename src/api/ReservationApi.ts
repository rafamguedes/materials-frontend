import axiosInstance from './axios';
import type { ReservationType } from '../types/ReservationType';
import type { ReservationFilterType } from '../types/ReservationFilterType';

export async function createReservationApi(payload: any) {
  return axiosInstance.post('/reservations', payload);
}

export async function fetchReservationByCodeApi(code: string) {
  const response = await axiosInstance.get(`/reservations/code/${code}`);
  return response.data;
}

export async function fetchReservationsApi(
  filter: ReservationFilterType,
  isNewSearch: boolean = false
): Promise<{ data: ReservationType[]; nextToken?: string }> {
  const params: any = {
    order: filter.order,
    orderByColumn: filter.orderByColumn,
    status: filter.status,
    search: filter.search,
    rows: filter.rows ?? 5,
  };
  if (!isNewSearch && filter.nextToken) params.nextToken = filter.nextToken;

  const response = await axiosInstance.get('/reservations', { params });
  return response.data;
}

export async function deleteReservationApi(id: number) {
  return axiosInstance.delete(`/reservations/${id}`);
}

export async function reservationActionApi(
  action: 'start' | 'finish' | 'cancel',
  code: string
) {
  const endpoints: Record<'start' | 'finish' | 'cancel', string> = {
    start: 'start',
    finish: 'complete',
    cancel: 'cancel',
  };
  return axiosInstance.patch(`/reservations/${endpoints[action]}/${code}`);
}