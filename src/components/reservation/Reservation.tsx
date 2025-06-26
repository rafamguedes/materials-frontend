import { useState, useEffect } from 'react';
import type { ReservationFilterType } from '../../types/ReservationFilterType';
import { useReservationContext } from '../../context/ReservationContext';
import { Table, Button, Input, Select, Space, Popconfirm } from 'antd';
import { deleteReservationApi } from '../../api/reservation';
import ReservationActionModal from './ActionModal';
import CreateReservationModal from './Create';
import { SearchOutlined } from '@ant-design/icons';

import { FaEdit, FaTrash } from 'react-icons/fa';
import './Reservation.css';
import { useNavigate } from 'react-router-dom';
import HeaderPage from './Header';
const { Option } = Select;
const { Search } = Input;

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
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'start' | 'finish' | 'cancel'>('start');
  const navigate = useNavigate();
  
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
          PENDENTE: { label: 'PENDENTE', className: 'pending' },
          EM_PROGRESSO: { label: 'EM PROGRESSO', className: 'in_progress' },
          FINALIZADO: { label: 'FINALIZADO', className: 'completed' },
          CANCELADO: { label: 'CANCELADO', className: 'canceled' },
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
            onClick={() => navigate(`/reserva/editar/${record.id}`)}
            style={{ fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
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
              style={{ fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
          <HeaderPage
            onCreate={() => setModalOpen(true)}
            onStart={() => { setActionType('start'); setActionModalOpen(true); }}
            onFinish={() => { setActionType('finish'); setActionModalOpen(true); }}
            onCancel={() => { setActionType('cancel'); setActionModalOpen(true); }}
            onRefresh={() => fetchReservations({ ...filter }, true)}
          />
        </header>
        <div className="filter-container" style={{ marginBottom: 24 }}>
          <div className="filter-group">
            <label htmlFor="search">Pesquisar:</label>
            <Search
              id="search"
              value={filter.search || ''}
              onChange={handleSearchChange}
              placeholder="Digite para pesquisar..."
              allowClear
              enterButton={
                <SearchOutlined/>
              }
              style={{ maxWidth: 320 }}
              size="middle"
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
              <Option value="CONFIRMED">Finalizado</Option>
              <Option value="CANCELLED">Cancelado</Option>
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