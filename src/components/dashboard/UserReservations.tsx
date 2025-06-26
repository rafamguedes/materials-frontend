import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Tag, message, Empty, Select, Row, Space, Popconfirm } from 'antd';
import { fetchReservationsApi, deleteReservationApi } from '../../api/ReservationApi';
import type { ReservationType } from '../../types/ReservationType';
import { useAuth } from '../../context/AuthProvider';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import EditReservationModal from './EditUserReservation';

const { Option } = Select;

const statusOptions = [
  { value: '', label: 'Status' },
  { value: 'PENDING', label: 'Pendente' },
  { value: 'IN_PROGRESS', label: 'Em andamento' },
  { value: 'CONFIRMED', label: 'Finalizada' },
  { value: 'CANCELLED', label: 'Cancelada' },
];

const getStatusLabel = (status: string) => {
  const found = statusOptions.find(opt => opt.value === status);
  return found ? found.label : status || 'Pendente';
};

const UserReservations: React.FC = () => {
  const [reservations, setReservations] = useState<ReservationType[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextToken, setNextToken] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string>('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editReservation, setEditReservation] = useState<ReservationType | null>(null);
  const { user } = useAuth();

  const fetchData = (isNewSearch = false, statusFilter = status) => {
    if (!user?.id) return;
    setLoading(true);
    fetchReservationsApi(
      {
        userId: String(user.id),
        status: statusFilter || undefined,
        nextToken: isNewSearch ? undefined : nextToken,
        rows: 10,
        orderByColumn: 'ID',
        order: 'DESC',
      },
      isNewSearch
    )
      .then((data) => {
        setReservations(isNewSearch ? data.data : [...reservations, ...data.data]);
        setNextToken(data.nextToken);
      })
      .catch((err: { message?: string }) => {
        message.error(err?.message || 'Erro ao carregar reservas');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setReservations([]);
    setNextToken(undefined);
    fetchData(true, status);
  }, [user?.id, status]);

  const handleEdit = (reservation: ReservationType) => {
    setEditReservation(reservation);
    setEditModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteReservationApi(id);
      message.success('Reserva excluída com sucesso!');
      fetchData(true, status);
    } catch (err: any) {
      message.error(
        err?.response?.data?.message ||
          err?.message ||
          'Erro ao excluir reserva'
      );
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Equipamento',
      dataIndex: 'itemType',
      key: 'itemType',
      render: (value: string) => value || 'Equipamento',
    },
    {
      title: 'Data/Hora',
      dataIndex: 'dateTime',
      key: 'dateTime',
      render: (value: string) =>
        value ? new Date(value).toLocaleString('pt-BR') : '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value: string) => (
        <Tag color="blue">{getStatusLabel(value)}</Tag>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 120,
      render: (_: any, record: ReservationType) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
            disabled={record.status !== 'PENDING'}
            title="Editar"
          />
          <Popconfirm
            title="Confirmar exclusão"
            description="Tem certeza que deseja excluir esta reserva?"
            okText="Sim"
            cancelText="Cancelar"
            onConfirm={() => handleDelete(record.id)}
            placement="topRight"
            disabled={record.status !== 'PENDING'}
          >
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              disabled={record.status !== 'PENDING'}
              title={
                record.status !== 'PENDING'
                  ? 'Só é possível excluir reservas pendentes'
                  : 'Excluir'
              }
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        title={
          <Row justify="space-between" align="middle">
            <span className="row-title">Minhas Reservas</span>
            <Select
              value={status}
              onChange={value => setStatus(value)}
              style={{ minWidth: 160 }}
              placeholder="Filtrar por status"
              size="small"
            >
              {statusOptions.map(opt => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          </Row>
        }
        style={{ width: '100%', maxWidth: '100%', margin: '0 auto', boxShadow: '0 2px 12px #0001' }}
      >
        <Table
          dataSource={reservations}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={false}
          locale={{
            emptyText: <Empty description="Nenhuma reserva encontrada." />,
          }}
        />
        {nextToken && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Button onClick={() => fetchData(false)} loading={loading}>
              Carregar mais
            </Button>
          </div>
        )}
      </Card>
      <EditReservationModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        reservation={editReservation}
        onUpdate={() => fetchData(true, status)}
      />
    </>
  );
};

export default UserReservations;