import React, { useEffect, useState } from 'react';
import { Modal, Form, DatePicker, Select, message } from 'antd';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/pt_BR';
import { updateReservationApi } from '../../api/reservation';
import type { ItemType } from '../../types/ItemType';
import type { ReservationType } from '../../types/ReservationType';
import { fetchItemsApi } from '../../api/item';

type Props = {
  open: boolean;
  onClose: () => void;
  reservation: ReservationType | null;
  onUpdate: () => void;
};

const EditReservationModal: React.FC<Props> = ({
  open,
  onClose,
  reservation,
  onUpdate,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ItemType[]>([]);

  useEffect(() => {
    if (reservation) {
      form.setFieldsValue({
        dateTime: reservation.dateTime ? dayjs(reservation.dateTime) : null,
        itemId: reservation,
      });
    }
  }, [reservation, form]);

  useEffect(() => {
    setLoading(true);
    fetchItemsApi({}, true)
      .then((data) => setItems(data.data))
      .catch((err: { message?: string }) => {
        message.error(err?.message || 'Erro ao carregar equipamentos');
      })
    .finally(() => setLoading(false));
  }, []);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await updateReservationApi(reservation!.id, {
        dateTime: values.dateTime.toISOString(),
        itemId: values.id,
      });
      message.success('Reserva atualizada com sucesso!');
      onUpdate();
      onClose();
    } catch (err: any) {
      message.error(
        err?.response?.data?.message ||
          err?.message ||
          'Erro ao atualizar reserva'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Editar Reserva"
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={loading}
      okText="Salvar"
      cancelText="Cancelar"
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Data e hora da reserva"
          name="dateTime"
          rules={[{ required: true, message: 'Selecione a data e hora' }]}
        >
          <DatePicker
            showTime={{ format: 'HH:mm', minuteStep: 15 }}
            format="YYYY-MM-DD HH:mm"
            locale={locale}
            style={{ width: '100%' }}
            disabledDate={current => current && current < dayjs().startOf('day')}
          />
        </Form.Item>
        <Form.Item
          label="Equipamento"
          name="id"
          rules={[{ required: true, message: 'Selecione o equipamento' }]}
        >
          <Select placeholder="Selecione o equipamento">
            {items.map(item => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditReservationModal;