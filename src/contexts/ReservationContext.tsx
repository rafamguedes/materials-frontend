import { createContext, useContext } from 'react';
import type { ReservationContextType } from '../types/ReservationContextType';

export const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export const useReservationContext = () => {
  const ctx = useContext(ReservationContext);
  if (!ctx) throw new Error('useReservationContext deve ser usado dentro do ReservationProvider');
  return ctx;
};