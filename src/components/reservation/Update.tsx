import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Form,
  DatePicker,
  Button,
  Select,
  Input,
  Spin,
  notification,
  Typography,
  Row,
  Col,
  Space,
} from 'antd';
import locale from 'antd/es/date-picker/locale/pt_BR';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { fetchReservationByIdApi } from '../../api/ReservationApi';
import type { ItemType } from '../../types/ItemType';
import { fetchItemsApi } from '../../api/ItemApi';
import { axiosInstance } from '../../api/Axios';

const { Title } = Typography;

const statusOptions = [
  { value: 'PENDING', label: 'Pendente' },
  { value: 'IN_PROGRESS', label: 'Em progresso' },
  { value: 'CONFIRMED', label: 'Finalizado' },
  { value: 'CANCELLED', label: 'Cancelado' },
];

type ReservationDTO = {
  id: number;
  dateTime: string;
  startTime?: string;
  endTime?: string;
  code: string;
  status: string;
  createdAt?: string;
  userRegistry: string;
  itemId: number;
  itemType: string;
};

const EditReservationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reservation, setReservation] = useState<ReservationDTO | null>(null);
  const [items, setItems] = useState<ItemType[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const notify = (type: 'success' | 'error', message: string, description?: string) => {
    api[type]({
      message,
      description,
      showProgress: false,
      pauseOnHover: true,
    });
  };

  useEffect(() => {
    setLoading(true);
    fetchReservationByIdApi(Number(id))
      .then((res) => {
        setReservation(res);
        form.setFieldsValue({
          dateTime: res.dateTime ? dayjs(res.dateTime) : undefined,
          status: res.status,
          itemId: res.itemId,
        });
        console.log('Reserva carregada:', res);
      })
      .catch(() =>
        notification.error({
          message: 'Erro ao carregar reserva',
          placement: 'topRight',
        })
      )
      .finally(() => setLoading(false));
  }, [id, form]);

  useEffect(() => {
    setItemsLoading(true);
    fetchItemsApi()
      .then((res) => {
        setItems(res.data);
      })
      .catch(() =>
        notification.error({
          message: 'Erro ao carregar equipamentos',
          placement: 'topRight',
        })
      )
      .finally(() => setItemsLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      const payload = {
        dateTime: values.dateTime.format('YYYY-MM-DDTHH:mm:ss'),
        status: values.status,
        itemId: values.itemId,
      };

      await axiosInstance.put(`/reservations/${id}`, payload);

      setReservation((prev) => ({
        ...prev!,
        dateTime: values.dateTime.format('YYYY-MM-DDTHH:mm:ss'),
        status: values.status,
        itemId: values.itemId,
      }));

      notify('success', 'Reserva atualizada com sucesso!');
    } catch (err: any) {
      const apiMessage = err?.response?.data?.message
        || (typeof err?.response?.data === 'string' ? err.response.data : undefined)
        || err?.message || 'Erro ao realizar a ação';
      notify('error', 'Erro ao realizar a ação', apiMessage);   
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  const isEditable = reservation?.status === 'PENDING';

  return (
    <>
      <Row justify="center" style={{ margin: '16px 0' }}>
        <Col span={22}>
          <Card
            title={
              <Row justify="space-between" align="middle">
                <Col>
                  <Title level={3} style={{ margin: 0, color: '#1976d2', fontWeight: 'bold' }}>Dados da Reserva</Title>
                </Col>
                <Col>
                  <Space>
                    <Button onClick={() => navigate('/')} disabled={saving}>
                      Voltar
                    </Button>
                    <Button
                      type="primary"
                      onClick={handleSave}
                      loading={saving}
                      disabled={!isEditable}
                      style={{
                        background: isEditable
                          ? 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)'
                          : '#e0e0e0',
                        border: 'none',
                        color: isEditable ? '#fff' : '#888',
                        cursor: isEditable ? 'pointer' : 'not-allowed',
                        fontWeight: 600,
                      }}
                    >
                      Salvar Alterações
                    </Button>
                  </Space>
                </Col>
              </Row>
            }
            bordered={false}
            style={{ boxShadow: '0 2px 16px #1976d233', borderRadius: 12 }}
          >
            <Form form={form} layout="vertical">
              <Row gutter={24}>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Data e Hora da Reserva"
                    name="dateTime"
                  >
                    <DatePicker
                      showTime={{ format: 'HH:mm' }}
                      format="YYYY-MM-DD HH:mm"
                      locale={locale}
                      style={{ width: '100%' }}
                      placeholder="Selecione a data e hora"
                      disabled={!isEditable}
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Equipamento"
                    name="itemId"
                  >
                    <Select
                      showSearch
                      placeholder="Selecione o equipamento"
                      loading={itemsLoading}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        !!option?.children &&
                        option.children.toString().toLowerCase().includes(input.toLowerCase())
                      }
                      disabled={!isEditable}
                    >
                      {items.map(item => (
                        <Select.Option key={item.id} value={item.id}>
                          {[item.name, item.description, item.itemType].filter(Boolean).join(' - ')}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Status"
                    name="status"
                  >
                    <Select placeholder="Selecione o status" disabled >
                      {statusOptions.map(opt => (
                        <Select.Option key={opt.value} value={opt.value}>
                          {opt.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col xs={24} md={6}>
                  <Form.Item label="Código da Reserva">
                    <Input value={reservation?.code} disabled />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={6}>
                  <Form.Item label="Usuário">
                    <Input value={reservation?.userRegistry} disabled />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={6}>
                  <Form.Item label="Tipo de Equipamento">
                    <Input value={reservation?.itemType} disabled />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={6}>
                  <Form.Item label="Criado em">
                    <Input
                      value={reservation?.createdAt ? dayjs(reservation.createdAt).format('DD/MM/YYYY HH:mm') : ''}
                      disabled
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col xs={24} md={8}>
                  <Form.Item label="Início">
                    <Input
                      value={reservation?.startTime ? dayjs(reservation.startTime).format('DD/MM/YYYY HH:mm') : ''}
                      disabled
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={8}>
                  <Form.Item label="Fim">
                    <Input
                      value={reservation?.endTime ? dayjs(reservation.endTime).format('DD/MM/YYYY HH:mm') : ''}
                      disabled
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>

      {contextHolder}
    </>
  );
};

export default EditReservationPage;