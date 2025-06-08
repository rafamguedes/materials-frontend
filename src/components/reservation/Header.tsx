import React from 'react';
import { Button } from 'antd';

type ReservationHeaderActionsProps = {
  onCreate: () => void;
  onStart: () => void;
  onFinish: () => void;
  onCancel: () => void;
  onRefresh: () => void;
};

const HeaderPage: React.FC<ReservationHeaderActionsProps> = ({
  onCreate,
  onStart,
  onFinish,
  onCancel,
  onRefresh,
}) => (
  <div className="header-actions">
    <Button
      type="primary"
      className="add-reservation-button"
      onClick={onCreate}
      style={{
        background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
        color: '#fff',
        border: 'none',
        fontWeight: 600,
        letterSpacing: 0.5,
      }}
    >
      Criar Reserva
    </Button>
    <Button
      type="primary"
      className="start-reservation-button"
      onClick={onStart}
      style={{
        background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
        color: '#fff',
        border: 'none',
        fontWeight: 600,
        letterSpacing: 0.5,
      }}
    >
      Iniciar
    </Button>
    <Button
      type="primary"
      className="finish-reservation-button"
      onClick={onFinish}
      style={{
        background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
        color: '#fff',
        border: 'none',
        fontWeight: 600,
        letterSpacing: 0.5,
      }}
    >
      Finalizar
    </Button>
    <Button
      type="primary"
      className="cancel-reservation-button"
      onClick={onCancel}
      style={{
        background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
        color: '#fff',
        border: 'none',
        fontWeight: 600,
        letterSpacing: 0.5,
      }}
    >
      Cancelar
    </Button>
    <Button
      type="primary"
      className="refresh-button"
      onClick={onRefresh}
      style={{
        background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
        color: '#fff',
        border: 'none',
        fontWeight: 600,
        letterSpacing: 0.5,
      }}
    >
      Atualizar
    </Button>
  </div>
);

export default HeaderPage;