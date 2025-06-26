import { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Popconfirm, Select, message, notification } from 'antd';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useItemContext } from '../../context/ItemContext';
import { deleteItemApi } from '../../api/item';
import type { ItemFilterType, ItemType } from '../../types/ItemType';
import './Item.css';
import Create from './Create';
import Update from './Update';

const { Option } = Select;
const { Search } = Input;

function ItemList() {
  const {
    items,
    setItems,
    loading,
    error,
    nextToken,
    setNextToken,
    fetchItems,
  } = useItemContext();

  const [filter, setFilter] = useState<ItemFilterType>({
    rows: 5,
    order: 'DESC',
    orderByColumn: 'ID',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
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
    setItems([]);
    setNextToken(undefined);
    fetchItems({ ...filter }, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.order, filter.orderByColumn, filter.rows, filter.status, filter.search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({
      ...prev,
      search: e.target.value,
      nextToken: undefined,
    }));
  };

  const handleOrderChange = (value: string) => {
    setFilter(prev => ({
      ...prev,
      order: value as 'ASC' | 'DESC',
      nextToken: undefined,
    }));
  };

  const handleOrderByColumnChange = (value: string) => {
    setFilter(prev => ({
      ...prev,
      orderByColumn: value,
      nextToken: undefined,
    }));
  };

  const handleStatusChange = (value: string) => {
    setFilter(prev => ({
      ...prev,
      status: value,
      nextToken: undefined,
    }));
  };

  const handleRowsChange = (value: number) => {
    setFilter(prev => ({
      ...prev,
      rows: value,
      nextToken: undefined,
    }));
  };

  const handleLoadMore = () => {
    fetchItems({ ...filter, nextToken }, false);
  };

  const handleEdit = (id: number) => {
    setEditId(id);
    setEditModalOpen(true);
  };

  const handleDelete = async (id: number) => {
  try {
    await deleteItemApi(String(id));
    message.success('Equipamento excluído com sucesso!');
    fetchItems({ ...filter }, true);
  } catch (err: any) {
    const apiMessage =
        err?.response?.data?.message ||
        (typeof err?.response?.data === 'string' ? err.response.data : undefined) ||
        err?.message ||
        'Erro ao excluir equipamento';

    notify('error', 'Erro ao excluir equipamento', apiMessage);
  }
};

  const translateType = (type: string) => {
    switch (type) {
      case 'LAPTOP':
        return 'Notebook';
      case 'PROJECTOR':
        return 'Projetor';
      case 'CAMERA':
        return 'Câmera';
      default:
        return type;
    }
  };
  
  const translateStatus = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'Disponível';
      case 'RESERVED':
        return 'Reservado';
      case 'IN_MAINTENANCE':
        return 'Em manutenção';
      case 'OUT_OF_SERVICE':
        return 'Fora de serviço';
      case 'LOST':
        return 'Perdido';
      default:
        return status;
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
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Descrição',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Tipo',
      dataIndex: 'itemType',
      key: 'type',
      render: (value: string) => translateType(value),
    },
    {
      title: 'Número de Série',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value: string) => {
        const statusClass = {
          AVAILABLE: 'available',
          RESERVED: 'reserved',
          IN_MAINTENANCE: 'in_maintenance',
          OUT_OF_SERVICE: 'out_of_service',
          LOST: 'lost',
        }[value] || '';
        return (
          <span className={`status-badge ${statusClass}`}>
            {translateStatus(value)}
          </span>
        );
      },
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 100,
      render: (_: any, record: ItemType) => (
        <Space>
          <Button
            type="text"
            icon={<FaEdit />}
            title="Editar"
            onClick={() => handleEdit(record.id)}
          />
          <Popconfirm
            title="Confirmar exclusão"
            description="Tem certeza que deseja excluir este item?"
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
    },
  ];

  return (
    <>
      <div className="item-container">
        <header className="item-header">
          <h1>Equipamentos</h1>
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
              Novo Equipamento
            </Button>
            <Button
              type="primary"
              className="refresh-button"
              onClick={() => fetchItems({ ...filter }, true)}
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
            <Search
              id="search"
              value={filter.search || ''}
              onChange={handleSearchChange}
              placeholder="Pesquisar..."
              allowClear
              enterButton
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
              placeholder="Ordenar por coluna"
            >
              <Option value="ID">ID</Option>
              <Option value="NAME">Nome</Option>
              <Option value="DESCRIPTION">Descrição</Option>
              <Option value="ITEM_TYPE">Tipo</Option>
              <Option value="SERIAL_NUMBER">Número de série</Option>
              <Option value="STATUS">Status</Option>
            </Select>
          </div>
          <div className="filter-group">
            <label htmlFor="order">Ordenar por tipo:</label>
            <Select
              id="order"
              value={filter.order}
              onChange={handleOrderChange}
              style={{ minWidth: 120 }}
              placeholder="Ordenar por tipo"
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
              placeholder="Status"
            >
              <Option value="">Todos</Option>
              <Option value="AVAILABLE">Disponível</Option>
              <Option value="RESERVED">Reservado</Option>
              <Option value="IN_MAINTENANCE">Em manutenção</Option>
              <Option value="OUT_OF_SERVICE">Fora de serviço</Option>
              <Option value="LOST">Perdido</Option>
            </Select>
          </div>
          <div className="filter-group">
            <label htmlFor="rows">Número de linhas:</label>
            <Select
              id="rows"
              value={filter.rows}
              onChange={handleRowsChange}
              style={{ minWidth: 100 }}
              placeholder="Nº de linhas"
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
          dataSource={items}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={false}
          locale={{
            emptyText: 'Nenhum equipamento encontrado',
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
      
      <Create
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        filter={filter}
        onCreate={() => fetchItems({ ...filter }, true)}
      />

      <Update
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        itemId={editId}
        filter={filter}
        onUpdate={() => fetchItems({ ...filter }, true)}
      />

      {contextHolder}
    </>
  );
}

export default ItemList;