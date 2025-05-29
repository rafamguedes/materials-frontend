import React from 'react';
import { Modal, Form, Input, DatePicker, Button, message, Select } from 'antd';
import { useReservationContext } from '../../context/ReservationContext';
import { createReservationApi } from '../../api/ReservationApi';
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

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      await createReservationApi({
        ...values,
        dateTime: values.dateTime.format('YYYY-MM-DDTHH:mm'),
      });

      form.resetFields();
      onClose();
      
      await fetchReservations(filter, true);
      if (onCreate) onCreate();
    } catch (err: any) {
      message.error(err?.message || 'Erro ao criar reserva');
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
};

export default CreateReservationModal;