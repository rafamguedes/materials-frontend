import { axiosInstance } from './Axios';
import type { ReservationType, ReservationUpdateType } from '../types/ReservationType';
import type { ReservationFilterType } from '../types/ReservationFilterType';
import type { createReservationType } from '../types/CreateReservationType';

export async function createReservationApi(payload: createReservationType) {
  return axiosInstance.post('/reservations', payload);
}

export async function fetchReservationByIdApi(id: number) {
  const response = await axiosInstance.get(`/reservations/${id}`);
  return response.data;
}

export async function fetchReservationByCodeApi(code: string) {
  const response = await axiosInstance.get(`/reservations/code/${code}`);
  return response.data;
}

export async function fetchReservationsApi(
  filter: ReservationFilterType,
  isNewSearch: boolean = false
): Promise<{ data: ReservationType[]; nextToken?: string }> {
  if (isNewSearch) filter.nextToken = undefined;
  const response = await axiosInstance.get('/reservations', { params: filter });
  return response.data;
}

export async function deleteReservationApi(id: number) {
  return axiosInstance.delete(`/reservations/${id}`);
}

export async function updateReservationApi(
  id: number,
  payload: Partial<ReservationUpdateType>
) {
  return axiosInstance.put(`/reservations/${id}`, payload);
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