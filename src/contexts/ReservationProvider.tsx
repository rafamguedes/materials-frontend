import React, { useState, useCallback } from 'react';
import { ReservationContext } from './ReservationContext';
import type { ReservationType } from '../types/ReservationType';
import type { ReservationFilterType } from '../types/ReservationFilterType';
import { fetchReservationsApi } from '../apis/reservation';

export const ReservationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reservations, setReservations] = useState<ReservationType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextToken, setNextToken] = useState<string | undefined>();

  const defaultFilter: ReservationFilterType = {
    rows: 5,
    order: 'DESC',
    orderByColumn: 'ID',
  };

  const statusMap: Record<string, string> = {
    PENDING: 'PENDENTE',
    IN_PROGRESS: 'EM_PROGRESSO',
    CONFIRMED: 'FINALIZADO',
    CANCELLED: 'CANCELADO',
  };

  const itemTypeMap: Record<string, string> = {
    LAPTOP: 'NOTEBOOK',
    PROJECTOR: 'PROJETOR',
    CAMERA: 'CÂMERA',
    MONITOR: 'MONITOR',
    PRINTER: 'IMPRESSORA',
    SCANNER: 'SCANNER',
    TABLET: 'TABLET',
    SMARTPHONE: 'SMARTPHONE',
    DESKTOP: 'DESTKTOP',
    MOUSE: 'MOUSE',
    KEYBOARD: 'TECLADO',
    HEADSET: 'HEADSET',
    HEADPHONES: 'FONES DE OUVIDO',
    SPEAKER: 'CAIXA DE SOM',
    WEBCAM: 'WEBCAM',
    CHARGER: 'CARREGADOR',
  };

  const fetchReservations = useCallback(
    async (filter: ReservationFilterType = defaultFilter, isNewSearch: boolean = false) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchReservationsApi(filter, isNewSearch);

        const translatedReservations = response.data.map(reservation => ({
          ...reservation,
          status: statusMap[reservation.status] || reservation.status,
          itemType: itemTypeMap[reservation.itemType] || reservation.itemType,
        }));

        setReservations(prev => isNewSearch ? translatedReservations : [...prev, ...translatedReservations]);
        setNextToken(response.nextToken);
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
