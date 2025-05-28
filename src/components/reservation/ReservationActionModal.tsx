import React, { useState } from 'react';
import { Modal, Input, message } from 'antd';

type ReservationActionModalProps = {
  open: boolean;
  onClose: () => void;
  action: 'start' | 'finish' | 'cancel';
  onSuccess?: () => void;
};

const ReservationActionModal: React.FC<ReservationActionModalProps> = ({
  open,
  onClose,
  action,
  onSuccess,
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const actionLabels: Record<'start' | 'finish' | 'cancel', string> = {
    start: 'Iniciar',
    finish: 'Finalizar',
    cancel: 'Cancelar Reserva',
  };

  const actionEndpoints: Record<'start' | 'finish' | 'cancel', string> = {
    start: 'start',
    finish: 'complete',
    cancel: 'cancel',
  };

  const handleAction = async () => {
    if (!code) {
      message.error('Informe o código da reserva.');
      return;
    }
    setLoading(true);
    try {
      const endpoint = actionEndpoints[action];
      const res = await fetch(`http://localhost:8080/api/v1/reservations/${endpoint}/${code}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Erro ao realizar a ação');
      message.success(`Reserva ${actionLabels[action].toLowerCase()} da com sucesso!`);
      setCode('');
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      message.error(err?.message || 'Erro ao realizar a ação');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setCode('');
    onClose();
  };

  return (
    <Modal
      open={open}
      title={`${actionLabels[action]} Reserva`}
      onOk={handleAction}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText={actionLabels[action]}
      cancelText="Cancelar"
      destroyOnClose
    >
      <p>Informe o código da reserva para {actionLabels[action].toLowerCase()}:</p>
      <Input
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder="Código da reserva"
        maxLength={20}
        autoFocus
      />
    </Modal>
  );
};

export default ReservationActionModal;