import React from 'react';
import { Modal, Form, Input, Button, notification } from 'antd';
import { useUserContext } from '../../context/UserContext';
import { createUserApi } from '../../api/user';

type CreateUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  filter: any;
  onCreate?: () => void;
};

function Create({ isOpen, onClose, onCreate, filter }: CreateUserModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const { fetchUsers } = useUserContext();
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

      await createUserApi(values);

      form.resetFields();
      onClose();

      await fetchUsers(filter, true);
      if (onCreate) onCreate();
      setTimeout(() => {
        notify('success', 'Usuário criado com sucesso!');
      }, 300);
    } catch (err: any) {
      const apiMessage =
        err?.response?.data?.message ||
        (typeof err?.response?.data === 'string' ? err.response.data : undefined) ||
        err?.message ||
        'Erro ao criar usuário';
      notify('error', 'Erro ao criar usuário', apiMessage);
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
      title="Novo Usuário"
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
          rules={[{ required: true, message: 'Informe o nome do usuário' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="E-mail"
          name="email"
          rules={[{ required: true, message: 'Informe o e-mail' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Registro"
          name="registry"
          rules={[{ required: true, message: 'Informe o registro' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default Create;