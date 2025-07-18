import React from 'react';
import { Modal, Form, Input, DatePicker, Button, Select, notification } from 'antd';
import { useReservationContext } from '../../contexts/ReservationContext';
import { createReservationApi } from '../../apis/reservation';
import { useFetchItems } from '../../hooks/useFetchItems';
import locale from 'antd/es/date-picker/locale/pt_BR';
import 'dayjs/locale/pt-br';

type CreateReservationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  filter: any;
  onCreate?: () => void;
};

function CreateReservationModal({ isOpen, onClose, onCreate, filter } : CreateReservationModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const { fetchReservations } = useReservationContext();
  const { items, loading: itemsLoading } = useFetchItems(isOpen);
  const [api, contextHolder] = notification.useNotification();

  const notify = (type: 'success' | 'error', message: string, description?: string) => {
    api[type]({
      message,
      description,
      showProgress: true,
      pauseOnHover: true,
    });
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const payload = {
        dateTime: values.dateTime.toISOString(),
        userRegistry: values.userRegistry,
        itemId: values.itemId,
      };

      await createReservationApi(payload);

      form.resetFields();
      onClose();

      await fetchReservations(filter, true);
      if (onCreate) onCreate();
    } catch (err: any) {
      const apiMessage =
        err?.response?.data?.message ||
        (typeof err?.response?.data === 'string' ? err.response.data : undefined) ||
        err?.message ||
        'Erro ao criar reserva';
      notify('error', 'Erro ao criar reserva', apiMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Nova Reserva"
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      footer={[
        <Button key="cancel" onClick={handleCancel} disabled={loading}>
          Cancelar
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleOk}
          loading={loading}
          style={{
            background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
            border: 'none',
          }}
        >
          Salvar
        </Button>,
      ]}
      destroyOnClose
    >
      {contextHolder}
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          label="Selecione data e hora da reserva"
          name="dateTime"
          rules={[{ required: true, message: 'Informe a data/hora' }]}
        >
          <DatePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            locale={locale}
            style={{ width: '100%' }}
            placeholder="Selecione a data e hora"
          />
        </Form.Item>
        <Form.Item
          label="Informe o registro do Usuário"
          name="userRegistry"
          rules={[{ required: true, message: 'Informe o registro do usuário' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Selecione o equipamento a ser reservado"
          name="itemId"
          rules={[{ required: true, message: 'Informe o tipo de item' }]}
        >
          <Select
            showSearch
            placeholder={itemsLoading ? 'Carregando...' : 'Selecione o equipamento'}
            loading={itemsLoading}
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.value as string)?.toLowerCase().includes(input.toLowerCase())
            }
          >
            {items.map(item => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}{" - "}{item.description}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CreateReservationModal;