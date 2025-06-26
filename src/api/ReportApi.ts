import { axiosInstance } from './Axios';

export async function fetchInactiveUsersReport(
  startDate: string,
  endDate: string,
  active?: boolean,
  orderBy?: 'ASC' | 'DESC'
): Promise<Blob> {
  const params: any = { startDate, endDate };
  if (typeof active === 'boolean') params.active = active;
  if (orderBy) params.orderBy = orderBy;
  const response = await axiosInstance.get('/reports/users', {
    params,
    responseType: 'blob',
  });
  return response.data;
}

export async function fetchReservationsReport(
  startDate: string,
  endDate: string,
  status?: string,
  orderBy?: 'ASC' | 'DESC'
): Promise<Blob> {
  const params: any = { startDate, endDate };
  if (status) params.status = status;
  if (orderBy) params.orderBy = orderBy;
  const response = await axiosInstance.get('/reports/reservations', {
    params,
    responseType: 'blob',
  });
  return response.data;
}

export async function fetchItemsReport(
  startDate: string,
  endDate: string,
  status?: string,
  orderBy?: 'ASC' | 'DESC'
): Promise<Blob> {
  const params: any = { startDate, endDate };
  if (status && status.length > 0) params.status = status;
  if (orderBy) params.orderBy = orderBy;
  const response = await axiosInstance.get('/reports/items', {
    params,
    responseType: 'blob',
  });
  return response.data;
}