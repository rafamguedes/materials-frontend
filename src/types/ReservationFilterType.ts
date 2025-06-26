export type ReservationFilterType = {
  order?: 'ASC' | 'DESC';
  orderByColumn?: string;
  status?: string;
  search?: string;
  nextToken?: string;
  rows?: number;
  userId?: string;
};