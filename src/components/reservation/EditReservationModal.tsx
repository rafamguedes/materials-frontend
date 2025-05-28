import React, { useEffect, useState } from 'react';
import { Modal, Form, DatePicker, Button, Select, Input, message, Spin, notification } from 'antd';
import locale from 'antd/es/date-picker/locale/pt_BR';
import type { ItemType } from '../../types/ItemType';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

type EditReservationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  reservationId: number;
  onUpdate?: () => void;
};

const EditReservationModal: React.FC<EditReservationModalProps> = ({
  isOpen,
  onClose,
  reservationId,
  onUpdate,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<ItemType[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [itemType, setItemType] = useState<string>('');
  const [itemName, setItemName] = useState<string>('');
  const [itemDescription, setItemDescription] = useState<string>('');

  // Carrega dados da reserva
  useEffect(() => {
    if (!isOpen) return;
    const fetchReservation = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8080/api/v1/reservations/${reservationId}`);
        if (!res.ok) throw new Error('Erro ao carregar reserva');
        const data = await res.json();
        form.setFieldsValue({
          dateTime: data.dateTime ? dayjs(data.dateTime) : undefined,
          itemId: data.itemId,
          status: data.status,
        });
        setItemType(data.itemType || '');
        setItemName(data.itemName || '');
        setItemDescription(data.itemDescription || '');
      } catch (err) {
        message.error('Erro ao carregar reserva');
      } finally {
        setLoading(false);
      }
    };
    fetchReservation();
  }, [reservationId, isOpen, form]);

  // Carrega itens para o select
  useEffect(() => {
    if (!isOpen) return;
    setItemsLoading(true);
    fetch('http://localhost:8080/api/v1/items')
      .then(res => {
        if (!res.ok) throw new Error('Erro ao carregar itens');
        return res.json();
      })
      .then((data: ItemType[]) => setItems(data))
      .catch(() => message.error('Erro ao carregar itens'))
      .finally(() => setItemsLoading(false));
  }, [isOpen]);

  // Atualiza o itemType ao selecionar um novo equipamento
  const handleItemChange = (itemId: number) => {
    const selected = items.find(item => item.id === itemId);
    setItemType(selected?.type || '');
    setItemName(selected?.name || '');
    setItemDescription(selected?.description || '');
    form.setFieldsValue({ itemId });
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      if (values.dateTime <= Date.now()) {
        notification.error({
          message: 'Erro de Validação',
          description: 'Data e hora devem ser futuras',
          placement: 'topRight',
        });
        setSaving(false);
        return;
      }

      const payload = {
        ...values,
        dateTime: values.dateTime.format('YYYY-MM-DDTHH:mm'),
      };

      const res = await fetch(`http://localhost:8080/api/v1/reservations/${reservationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        notification.error({
          message: 'Erro ao atualizar reserva',
          description: 'Não foi possível atualizar a reserva.',
          placement: 'topRight',
        });
        setSaving(false);
        return;
      }

      notification.success({
        message: 'Reserva atualizada com sucesso!',
        placement: 'topRight',
      });
      onClose();
      if (onUpdate) onUpdate();
    } catch (err: any) {
      notification.error({
        message: 'Erro ao atualizar reserva',
        description: err?.message || 'Erro desconhecido',
        placement: 'topRight',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Editar Reserva"
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={saving}
      footer={[
        <Button key="cancel" onClick={handleCancel} disabled={saving}>
          Cancelar
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleOk}
          loading={saving}
          style={{
            background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
            border: 'none',
          }}
        >
          Atualizar
        </Button>,
      ]}
      destroyOnClose
    >
      {loading ? (
        <Spin style={{ marginTop: 40 }} />
      ) : (
        <Form form={form} layout="vertical">
          <Form.Item
            label="Data e Hora"
            name="dateTime"
          >
            <DatePicker
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              locale={locale}
              style={{ width: '100%' }}
              placeholder="Selecione a data e hora"
            />
          </Form.Item>
          <Form.Item label="Equipamento Atual do Cliente">
            <Input
              value={itemName + ' - ' + itemDescription + ' - ' + itemType }
              placeholder="Nome do Equipamento"
              style={{ width: '100%' }}
              disabled
            />
          </Form.Item>
          <Form.Item
            label="Equipamento"
            name="itemId"
          >
            <Select
              showSearch
              placeholder="Selecione o equipamento"
              onChange={handleItemChange}
              loading={itemsLoading}
            >
              {items.map(item => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name + ' - ' + item.description + ' - ' + item.type}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default EditReservationModal;