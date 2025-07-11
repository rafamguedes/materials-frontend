import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, notification, Card, DatePicker, Row, Col, Tag, message } from 'antd';
import type { Dayjs } from 'dayjs';
import locale from 'antd/es/date-picker/locale/pt_BR';
import 'dayjs/locale/pt-br';
import dayjs from 'dayjs';
import { createReservationApi } from '../../apis/reservation';
import { fetchItemsApi } from '../../apis/item';
import type { ItemType } from '../../types/ItemType';

type Props = {
  onSuccess?: () => void;
};

const CreateReservationForm: React.FC<Props> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ItemType[]>([]);
  const [api, contextHolder] = notification.useNotification();
  const [selectedDateTime, setSelectedDateTime] = useState<Dayjs | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchItemsApi({}, true)
      .then((data) => setItems(data.data))
      .catch((err: { message?: string }) => {
        message.error(err?.message || 'Erro ao carregar equipamentos');
      })
    .finally(() => setLoading(false));
  }, []);

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      await createReservationApi({
        dateTime: selectedDateTime ? selectedDateTime.toISOString() : '',
        userRegistry: values.userRegistry,
        itemId: values.itemId,
      });
      form.resetFields();
      setSelectedDateTime(null);
      api.success({ message: 'Reserva criada com sucesso!' });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      const apiMessage =
      err?.response?.data?.message ||
      (typeof err?.response?.data === 'string' ? err.response.data : undefined) ||
      err?.message ||
      'Erro ao criar reserva';
      api.error({ message: 'Erro ao criar reserva', description: apiMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '100%', margin: '0 auto', width: '100%' }}>
      {contextHolder}
      <Row gutter={32} align="top">
        <Col xs={24} md={14}>
          <Card 
            title="Criar Reserva"
            style={{ width: '100%', boxShadow: '0 2px 12px #0001' }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              initialValues={{
                userRegistry: '',
                itemId: undefined,
              }}
            >
              <Form.Item
                label="Data e hora da reserva"
                required
                validateStatus={!selectedDateTime ? 'error' : ''}
                help={!selectedDateTime ? 'Selecione a data e hora da reserva' : ''}
              >
                <DatePicker
                  showTime={{ format: 'HH:mm', minuteStep: 15 }}
                  format="YYYY-MM-DD HH:mm"
                  locale={locale}
                  style={{ width: '100%' }}
                  value={selectedDateTime}
                  onChange={setSelectedDateTime}
                  placeholder="Selecione a data e hora"
                  disabledDate={current => current && current < dayjs().startOf('day')}
                />
              </Form.Item>
              <Form.Item
                label="Matrícula"
                name="userRegistry"
                rules={[{ required: true, message: 'Informe sua matrícula' }]}
              >
                <Input placeholder="Digite sua matrícula" />
              </Form.Item>
              <Form.Item
                label="Equipamento"
                name="itemId"
                rules={[{ required: true, message: 'Selecione o item' }]}
              >
                <Select
                  placeholder={'Selecione o equipamento'}
                >
                  {items.map(item => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  disabled={!selectedDateTime}
                >
                  Reservar
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col xs={24} md={10}>
          <Card
            title="Tipos de Equipamentos Disponíveis"
            style={{ width: '100%', minHeight: 250, boxShadow: '0 2px 12px #0001' }}
          >
            <div className="equipment-tag-cloud">
              {items.length === 0 ? (
                <span style={{ color: '#888' }}>Nenhum equipamento cadastrado.</span>
              ) : (
                items.map(item => (
                  <Tag color="blue" key={item.id} style={{ fontSize: 14, padding: '4px 10px', marginBottom: 8, borderRadius: 8 }}>
                    {item.name}
                  </Tag>
                ))
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CreateReservationForm;