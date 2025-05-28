import React, { useState, useCallback } from 'react';
import { ReservationContext } from './ReservationContext';
import type { ReservationType } from '../types/ReservationType';
import type { ReservationFilterType } from '../types/ReservationFilterType';
import { fetchReservationsApi } from '../api/ReservationApi';

export const ReservationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reservations, setReservations] = useState<ReservationType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextToken, setNextToken] = useState<string | undefined>();

  const fetchReservations = useCallback(
    async (filter: ReservationFilterType, isNewSearch: boolean = false) => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchReservationsApi(filter, isNewSearch);
        setReservations(prev => isNewSearch ? data.data : [...prev, ...data.data]);
        setNextToken(data.nextToken);
      } catch (error: any) {
        setError(error?.message || 'Erro ao buscar reservas');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return (
    <ReservationContext.Provider
      value={{
        reservations,
        setReservations,
        loading,
        setLoading,
        error,
        setError,
        nextToken,
        setNextToken,
        fetchReservations,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};