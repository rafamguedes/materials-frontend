import React from 'react';
import { Modal, Form, Input, Select, Button, notification } from 'antd';
import { useItemContext } from '../../contexts/ItemContext';
import { createItemApi } from '../../apis/item';

type CreateItemModalProps = {
  isOpen: boolean;
  onClose: () => void;
  filter: any;
  onCreate?: () => void;
};

const itemTypeOptions = [
  { value: 'LAPTOP', label: 'Notebook' },
  { value: 'PROJECTOR', label: 'Projetor' },
  { value: 'CAMERA', label: 'Câmera' },
];

function Create({ isOpen, onClose, onCreate, filter }: CreateItemModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const { fetchItems } = useItemContext();
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

      await createItemApi(values);

      form.resetFields();
      onClose();

      await fetchItems(filter, true);
      if (onCreate) onCreate();
      setTimeout(() => {
        notify('success', 'Equipamento criado com sucesso!');
      }, 300);
    } catch (err: any) {
      const apiMessage =
        err?.response?.data?.message ||
        (typeof err?.response?.data === 'string' ? err.response.data : undefined) ||
        err?.message ||
        'Erro ao criar equipamento';
      notify('error', 'Erro ao criar equipamento', apiMessage);
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
      title="Novo Equipamento"
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
    </Modal>
  );
}

export default Create;