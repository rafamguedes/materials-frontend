export type ReservationType = {
  id: number;
  code: string;
  dateTime: string;
  status: string;
  userRegistry: string;
  itemType: string;
};

export type ReservationUpdateType = {
  dateTime?: string;
  itemId?: number;
};