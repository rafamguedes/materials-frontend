import { useState } from 'react';
import { Drawer, Input, Descriptions, Button, Spin, notification, Space } from 'antd';
import { reservationActionApi, fetchReservationByCodeApi } from '../../api/ReservationApi';

type ReservationActionModalProps = {
  open: boolean;
  onClose: () => void;
  action: 'start' | 'finish' | 'cancel';
  onSuccess?: () => void;
};

function ReservationActionModal({ open, onClose, action, onSuccess }: ReservationActionModalProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [reservation, setReservation] = useState<any>(null);
  const [fetching, setFetching] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const actionLabels: Record<'start' | 'finish' | 'cancel', string> = {
    start: 'Iniciar',
    finish: 'Finalizar',
    cancel: 'Cancelar',
  };
  
  const notify = (type: 'success' | 'error', message: string, description?: string) => {
    api[type]({
      message,
      description,
      showProgress: true,
      pauseOnHover: true,
    });
  };

  const handleFetchReservation = async () => {
    if (!code) {
      notify('error', 'Código obrigatório', 'Informe o código da reserva.');
      return;
    }
    setFetching(true);
    try {
      const data = await fetchReservationByCodeApi(code);
      setReservation(data);
    } catch (err: any) {
      setReservation(null);
      notify('error', 'Reserva não encontrada', 'Por favor, verifique o código informado.');
    } finally {
      setFetching(false);
    }
  };

  const handleAction = async () => {
    if (!reservation) {
      notify('error', 'Reserva inválida', 'Busque e selecione uma reserva válida.');
      return;
    }
    setLoading(true);
    try {
      await reservationActionApi(action, code);
      setCode('');
      setReservation(null);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      const apiMessage = err?.response?.data?.message
        || (typeof err?.response?.data === 'string' ? err.response.data : undefined)
        || err?.message || 'Erro ao realizar a ação';
      notify('error', 'Erro ao realizar a ação', apiMessage);    
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setCode('');
    setReservation(null);
    onClose();
  };

  return (
    <Drawer
      title={`${actionLabels[action]} Reserva`}
      width={420}
      onClose={handleCancel}
      open={open}
      styles={{
        body: {
          paddingBottom: 24,
        },
      }}
      extra={
        <Space>
          <Button onClick={handleCancel}>Cancelar</Button>
          {reservation && (
            <Button
              type="primary"
              onClick={handleAction}
              loading={loading}
              style={{
                background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                border: 'none',
                fontWeight: 600,
                letterSpacing: 0.5,
              }}
            >
              {actionLabels[action]}
            </Button>
          )}
        </Space>
      }
      destroyOnClose
    >
      {contextHolder}
      <p>Informe o código da reserva:</p>
      <Input.Search
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder="Código da reserva"
        maxLength={20}
        enterButton="Buscar"
        loading={fetching}
        onSearch={handleFetchReservation}
        autoFocus
      />

      {fetching && <Spin style={{ marginTop: 16 }} />}

      {reservation && (
        <Descriptions
          bordered
          size="small"
          column={1}
          style={{ marginTop: 24, marginBottom: 16 }}
        >
          <Descriptions.Item label="Código">{reservation.code}</Descriptions.Item>
          <Descriptions.Item label="Data/Hora">
            {new Date(reservation.dateTime).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Status">{reservation.status}</Descriptions.Item>
          <Descriptions.Item label="Usuário">{reservation.userRegistry}</Descriptions.Item>
          <Descriptions.Item label="Equipamento">{reservation.itemType}</Descriptions.Item>
        </Descriptions>
      )}
    </Drawer>
  );
}

export default ReservationActionModal;