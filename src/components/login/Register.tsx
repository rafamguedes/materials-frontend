import React from 'react';
import { Drawer, Form, Input, Button, notification } from 'antd';
import { createUserApi } from '../../api/user';

type RegisterDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  onRegister?: () => void;
};

function Register({ isOpen, onClose, onRegister }: RegisterDrawerProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
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

      if (onRegister) onRegister();
      setTimeout(() => {
        notify('success', 'Usuário registrado com sucesso!');
      }, 300);
    } catch (err: any) {
      const apiMessage =
        err?.response?.data?.message ||
        (typeof err?.response?.data === 'string' ? err.response.data : undefined) ||
        err?.message ||
        'Erro ao registrar usuário';
      notify('error', 'Erro ao registrar usuário', apiMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Drawer
      title="Registrar Usuário"
      open={isOpen}
      onClose={handleCancel}
      width={400}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button onClick={handleCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="primary"
            onClick={handleOk}
            loading={loading}
            style={{
              background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
              border: 'none',
            }}
          >
            Registrar
          </Button>
        </div>
      }
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
          rules={[
            { required: true, message: 'Informe o e-mail' },
            { type: 'email', message: 'E-mail inválido' },
          ]}
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
        <Form.Item
          label="Senha"
          name="password"
          rules={[{ required: true, message: 'Informe a senha' }]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Drawer>
  );
}

export default Register;