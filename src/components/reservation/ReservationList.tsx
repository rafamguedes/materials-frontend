import { useState, useEffect } from 'react';
import type { ReservationFilterType } from '../../types/ReservationFilterType';
import { useReservationContext } from '../../context/ReservationContext';
import { Table, Button, Input, Select, Space, Popconfirm } from 'antd';
import { deleteReservationApi } from '../../api/ReservationApi';
import ReservationActionModal from './ReservationActionModal';
import CreateReservationModal from './CreateReservationModal';
import EditReservationModal from './EditReservationModal';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './ReservationList.css';
const { Option } = Select;

function ReservationList() {
  const {
    reservations,
    setReservations,
    loading,
    error,
    nextToken,
    setNextToken,
    fetchReservations,
  } = useReservationContext();

  const [filter, setFilter] = useState<ReservationFilterType>({
    rows: 5,
    order: 'DESC',
    orderByColumn: 'ID',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'start' | 'finish' | 'cancel'>('start');

  useEffect(() => {
    setReservations([]);
    setNextToken(undefined);
    fetchReservations({ ...filter }, true);
  }, [filter.order, filter.orderByColumn, filter.status, filter.rows, filter.search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({
      ...prev,
      search: e.target.value,
      nextToken: undefined
    }));
  };

  const handleOrderChange = (value: string) => {
    setFilter(prev => ({
      ...prev,
      order: value as 'ASC' | 'DESC',
      nextToken: undefined
    }));
  };

  const handleOrderByColumnChange = (value: string) => {
    setFilter(prev => ({
      ...prev,
      orderByColumn: value,
      nextToken: undefined
    }));
  };

  const handleStatusChange = (value: string) => {
    setFilter(prev => ({
      ...prev,
      status: value,
      nextToken: undefined
    }));
  };

  const handleRowsChange = (value: number) => {
    setFilter(prev => ({
      ...prev,
      rows: value,
      nextToken: undefined
    }));
  };

  const handleLoadMore = () => {
    fetchReservations({ ...filter, nextToken }, false);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteReservationApi(id);
      fetchReservations({ ...filter }, true);
    } catch (err: any) {
      console.log('Erro ao excluir reserva:', err);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
    },
    {
      title: 'Código',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Data/Hora',
      dataIndex: 'dateTime',
      key: 'dateTime',
      render: (value: string) => new Date(value).toLocaleString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value: string) => {
        const statusMap: Record<string, { label: string; className: string }> = {
          PENDING: { label: 'Pendente', className: 'pending' },
          IN_PROGRESS: { label: 'Em progresso', className: 'in_progress' },
          COMPLETED: { label: 'Finalizado', className: 'completed' },
          CANCELED: { label: 'Cancelado', className: 'canceled' },
        };
        const status = statusMap[value] || { label: value, className: '' };
        return (
          <span className={`status-badge ${status.className}`}>
            {status.label}
          </span>
        );
      },
    },
    {
      title: 'Registro do Usuário',
      dataIndex: 'userRegistry',
      key: 'userRegistry',
    },
    {
      title: 'Tipo de Equipamento',
      dataIndex: 'itemType',
      key: 'itemType',
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="text"
            icon={<FaEdit />}
            title="Editar"
            onClick={() => { setEditId(record.id); setEditModalOpen(true); }}
          />
          <Popconfirm
            title="Confirmar exclusão"
            description="Tem certeza que deseja excluir esta reserva?"
            okText="Sim"
            cancelText="Cancelar"
            onConfirm={() => handleDelete(record.id)}
            placement="topRight"
          >
            <Button
              type="text"
              icon={<FaTrash />}
              title="Deletar"
              danger
            />
          </Popconfirm>
        </Space>
      ),
      width: 100,
    },
  ];

  return (
    <>
      <div className="reservation-container">
        <header className="reservation-header">
          <h1>Painel de Reservas</h1>
          <div className="header-actions">
            <Button
              type="primary"
              className="add-reservation-button"
              onClick={() => setModalOpen(true)}
              style={{
                background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                color: '#fff',
                border: 'none',
                fontWeight: 600,
                letterSpacing: 0.5,
              }}
            >
              Criar Reserva
            </Button>
            <Button
              type="primary"
              className="start-reservation-button"
              onClick={() => { setActionType('start'); setActionModalOpen(true); }}
              style={{
                background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                color: '#fff',
                border: 'none',
                fontWeight: 600,
                letterSpacing: 0.5,
              }}
            >
              Iniciar
            </Button>
            <Button
              type="primary"
              className="finish-reservation-button"
              onClick={() => { setActionType('finish'); setActionModalOpen(true); }}
              style={{
                background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                color: '#fff',
                border: 'none',
                fontWeight: 600,
                letterSpacing: 0.5,
              }}
            >
              Finalizar
            </Button>
            <Button
              type="primary"
              className="cancel-reservation-button"
              onClick={() => { setActionType('cancel'); setActionModalOpen(true); }}
              style={{
                background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                color: '#fff',
                border: 'none',
                fontWeight: 600,
                letterSpacing: 0.5,
              }}
            >
              Cancelar
            </Button>
            <Button
              type="primary"
              className="refresh-button"
              onClick={() => fetchReservations({ ...filter }, true)}
              style={{
                background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                color: '#fff',
                border: 'none',
                fontWeight: 600,
                letterSpacing: 0.5,
              }}
            >
              Atualizar
            </Button>
          </div>
        </header>
        <div className="filter-container" style={{ marginBottom: 24 }}>
          <div className="filter-group">
            <label htmlFor="search">Pesquisar:</label>
            <Input
              id="search"
              value={filter.search || ''}
              onChange={handleSearchChange}
              placeholder="Digite para pesquisar..."
              allowClear
            />
          </div>
          <div className="filter-group">
            <label htmlFor="orderByColumn">Ordenar por coluna:</label>
            <Select
              id="orderByColumn"
              value={filter.orderByColumn}
              onChange={handleOrderByColumnChange}
              style={{ minWidth: 160 }}
            >
              <Option value="ID">ID</Option>
              <Option value="CODE">Código</Option>
              <Option value="DATE_TIME">Data/Hora</Option>
              <Option value="STATUS">Status</Option>
              <Option value="REGISTRY">Registro do Usuário</Option>
              <Option value="ITEM_TYPE">Tipo de Equipamento</Option>
            </Select>
          </div>
          <div className="filter-group">
            <label htmlFor="order">Ordenar por tipo:</label>
            <Select
              id="order"
              value={filter.order}
              onChange={handleOrderChange}
              style={{ minWidth: 120 }}
            >
              <Option value="ASC">Ascendente</Option>
              <Option value="DESC">Descendente</Option>
            </Select>
          </div>
          <div className="filter-group">
            <label htmlFor="status">Filtrar por status:</label>
            <Select
              id="status"
              value={filter.status || ''}
              onChange={handleStatusChange}
              style={{ minWidth: 140 }}
              allowClear
            >
              <Option value="">Todos</Option>
              <Option value="PENDING">Pendente</Option>
              <Option value="IN_PROGRESS">Em progresso</Option>
              <Option value="COMPLETED">Finalizado</Option>
              <Option value="CANCELED">Cancelado</Option>
            </Select>
          </div>
          <div className="filter-group">
            <label htmlFor="rows">Número de linhas:</label>
            <Select
              id="rows"
              value={filter.rows}
              onChange={handleRowsChange}
              style={{ minWidth: 100 }}
            >
              <Option value={5}>5</Option>
              <Option value={10}>10</Option>
              <Option value={20}>20</Option>
            </Select>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <Table
          dataSource={reservations}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={false}
          locale={{
            emptyText: 'Nenhuma reserva encontrada',
          }}
        />

        {nextToken && (
          <div className="load-more-container">
            <Button
              onClick={handleLoadMore}
              loading={loading}
              style={{
                background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                color: '#fff',
                border: 'none',
                fontWeight: 600,
                letterSpacing: 0.5,
              }}
            >
              Carregar mais
            </Button>
          </div>
        )}
      </div>
      <CreateReservationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        filter={filter}
        onCreate={() => fetchReservations({ ...filter }, true)}
      />
      <EditReservationModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        reservationId={editId!}
        onUpdate={() => fetchReservations({ ...filter }, true)}
      />
      <ReservationActionModal
        open={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
        action={actionType}
        onSuccess={() => fetchReservations({ ...filter }, true)}
      />
    </>
  );
};

export default ReservationList;