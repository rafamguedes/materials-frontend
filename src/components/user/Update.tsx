import { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, notification, Spin, Switch } from 'antd';
import { useUserContext } from '../../context/UserContext';
import { updateUserApi, fetchUserByIdApi } from '../../api/user';
import type { UserType } from '../../types/UserType';

type UpdateUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userId: number | null;
  filter: any;
  onUpdate?: () => void;
};

const notify = (type: 'success' | 'error', message: string, description?: string) => {
  notification[type]({
    message,
    description,
    showProgress: true,
    pauseOnHover: true,
  });
};

function Update({ isOpen, onClose, userId, filter, onUpdate }: UpdateUserModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { fetchUsers } = useUserContext();

  useEffect(() => {
    if (isOpen && userId) {
      setLoading(true);
      fetchUserByIdApi(String(userId))
        .then((user: UserType) => {
          form.setFieldsValue(user);
        })
        .catch(() => {
          notification.error({
            message: 'Erro ao carregar usuário',
            placement: 'topRight',
          });
        })
        .finally(() => setLoading(false));
    } else {
      form.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, userId]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      await updateUserApi(String(userId), values);

      form.resetFields();
      onClose();

      notify('success', 'Usuário atualizado com sucesso!');

      await fetchUsers(filter, true);
      if (onUpdate) onUpdate();

    } catch (err: any) {
      const apiMessage =
        err?.response?.data?.message ||
        (typeof err?.response?.data === 'string' ? err.response.data : undefined) ||
        err?.message ||
        'Erro ao atualizar usuário';
      notify('error', 'Erro ao atualizar usuário', apiMessage);
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
      title="Editar Usuário"
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
          <Form.Item
            label="Ativo"
            name="active"
            valuePropName="checked"
          >
            <Switch checkedChildren="Sim" unCheckedChildren="Não" />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}

export default Update;