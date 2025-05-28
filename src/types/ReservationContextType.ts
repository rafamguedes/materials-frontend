import type { ReservationType } from './ReservationType';
import type { ReservationFilterType } from './ReservationFilterType';

export type ReservationContextType = {
  reservations: ReservationType[];
  setReservations: React.Dispatch<React.SetStateAction<ReservationType[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  nextToken?: string;
  setNextToken: React.Dispatch<React.SetStateAction<string | undefined>>;
  fetchReservations: (filter: ReservationFilterType, isNewSearch?: boolean) => Promise<void>;
};