import { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, notification, Spin } from 'antd';
import { useItemContext } from '../../contexts/ItemContext';
import { updateItemApi, fetchItemByIdApi } from '../../apis/item';
import type { ItemType } from '../../types/ItemType';

type UpdateItemModalProps = {
  isOpen: boolean;
  onClose: () => void;
  itemId: number | null;
  filter: any;
  onUpdate?: () => void;
};

const itemTypeOptions = [
  { value: 'LAPTOP', label: 'Notebook' },
  { value: 'PROJECTOR', label: 'Projetor' },
  { value: 'CAMERA', label: 'Câmera' },
];

const notify = (type: 'success' | 'error', message: string, description?: string) => {
  notification[type]({
    message,
    description,
    showProgress: true,
    pauseOnHover: true,
  });
};

function Update({ isOpen, onClose, itemId, filter, onUpdate }: UpdateItemModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { fetchItems } = useItemContext();

  useEffect(() => {
    if (isOpen && itemId) {
      setLoading(true);
      fetchItemByIdApi(String(itemId))
        .then((item: ItemType) => {
          form.setFieldsValue(item);
        })
        .catch(() => {
          notification.error({
            message: 'Erro ao carregar equipamento',
            placement: 'topRight',
          });
        })
        .finally(() => setLoading(false));
    } else {
      form.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, itemId]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      await updateItemApi(String(itemId), values);

      form.resetFields();
      onClose();

      notify('success', 'Equipamento atualizado com sucesso!');

      await fetchItems(filter, true);
      if (onUpdate) onUpdate();

    } catch (err: any) {
      const apiMessage =
        err?.response?.data?.message ||
        (typeof err?.response?.data === 'string' ? err.response.data : undefined) ||
        err?.message ||
        'Erro ao atualizar equipamento';
        notify('error', 'Erro ao atualizar equipamento', apiMessage);
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
      title="Editar Equipamento"
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
          Salvar
        </Button>,
      ]}
      destroyOnClose
    >
      {loading ? (
        <div style={{ textAlign: 'center', margin: 32 }}>
          <Spin size="large" />
        </div>
      ) : (
        <Form form={form} layout="vertical">
          <Form.Item
            label="Nome"
            name="name"
            rules={[{ required: true, message: 'Informe o nome do equipamento' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Descrição"
            name="description"
            rules={[{ required: true, message: 'Informe a descrição' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tipo"
            name="type"
            rules={[{ required: true, message: 'Selecione o tipo' }]}
          >
            <Select placeholder="Selecione o tipo">
              {itemTypeOptions.map(opt => (
                <Select.Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}

export default Update;