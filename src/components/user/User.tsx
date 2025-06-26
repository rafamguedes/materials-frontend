import { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Popconfirm, Select, message, notification } from 'antd';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useUserContext } from '../../context/UserContext';
import { deleteUserApi } from '../../api/user';
import type { UserFilterType, UserType } from '../../types/UserType';
import Create from './Create';
import Update from './Update';
import './User.css';

const { Option } = Select;
const { Search } = Input;

export function UserList() {
  const {
    users,
    setUsers,
    loading,
    error,
    nextToken,
    setNextToken,
    fetchUsers,
  } = useUserContext();

  const [filter, setFilter] = useState<UserFilterType>({
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
    setUsers([]);
    setNextToken(undefined);
    fetchUsers({ ...filter }, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.order, filter.orderByColumn, filter.rows, filter.search]);

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
  
  const handleRowsChange = (value: number) => {
    setFilter(prev => ({
      ...prev,
      rows: value,
      nextToken: undefined,
    }));
  };

  const handleLoadMore = () => {
    fetchUsers({ ...filter, nextToken }, false);
  };

  const handleEdit = (id: number) => {
    setEditId(id);
    setEditModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUserApi(String(id));
      message.success('Usuário excluído com sucesso!');
      fetchUsers({ ...filter }, true);
    } catch (err: any) {
      const apiMessage =
        err?.response?.data?.message ||
        (typeof err?.response?.data === 'string' ? err.response.data : undefined) ||
        err?.message ||
        'Erro ao excluir usuário';

      notify('error', 'Erro ao excluir usuário', apiMessage);
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
      title: 'E-mail',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Registro',
      dataIndex: 'registry',
      key: 'registry',
    },
    {
      title: 'Ativo',
      dataIndex: 'active',
      key: 'active',
      render: (v: boolean) => (v ? 'Sim' : 'Não'),
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 100,
      render: (_: any, record: UserType) => (
        <Space>
          <Button
            type="text"
            icon={<FaEdit />}
            title="Editar"
            onClick={() => handleEdit(record.id)}
          />
          <Popconfirm
            title="Confirmar exclusão"
            description="Tem certeza que deseja excluir este usuário?"
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
      <div className="user-container">
        <header className="user-header">
          <h1>Usuários</h1>
          <div className="header-actions">
            <Button
              type="primary"
              className="add-user-button"
              onClick={() => setModalOpen(true)}
              style={{
                background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                color: '#fff',
                border: 'none',
                fontWeight: 600,
                letterSpacing: 0.5,
              }}
            >
              Novo Usuário
            </Button>
            <Button
              type="primary"
              className="refresh-button"
              onClick={() => fetchUsers({ ...filter }, true)}
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
              <Option value="EMAIL">E-mail</Option>
              <Option value="REGISTRY">Registro</Option>
              <Option value="ACTIVE">Ativo</Option>
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
          dataSource={users}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={false}
          locale={{
            emptyText: 'Nenhum usuário encontrado',
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
        onCreate={() => fetchUsers({ ...filter }, true)}
      />

      <Update
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        userId={editId}
        filter={filter}
        onUpdate={() => fetchUsers({ ...filter }, true)}
      />

      {contextHolder}
    </>
  );
}