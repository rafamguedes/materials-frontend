import React, { useState } from 'react';
import {
  CalendarOutlined,
  UserOutlined,
  PlusOutlined,
  ProfileOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import { useAuth } from '../../contexts/AuthProvider';
import './Dashboard.css';
import { FaLaptopCode } from 'react-icons/fa';
import CreateReservationForm from './CreateReservation';
import UserReservations from './UserReservations';

const { Header, Content, Footer, Sider } = Layout;

const siderStyle: React.CSSProperties = {
  overflow: 'auto',
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
};

const items: MenuProps['items'] = [
  {
    key: '1',
    icon: <PlusOutlined />,
    label: 'Nova Reserva',
  },
  {
    key: '2',
    icon: <CalendarOutlined />,
    label: 'Minhas Reservas',
  },
  {
    key: '3',
    icon: <UserOutlined />,
    label: 'Meus Dados',
  },
  {
    key: '4',
    icon: <ProfileOutlined />,
    label: 'Sair',
  },
];

function UserDashboard() {
  const { user, Logout } = useAuth();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [selectedKey, setSelectedKey] = useState('1');

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === '4') {
      Logout();
    } else {
      setSelectedKey(key);
    }
  };

  // Conteúdo dinâmico conforme menu
  const renderContent = () => {
    switch (selectedKey) {
      case '1':
        return <CreateReservationForm />;
      case '2':
        return <UserReservations key={selectedKey} />;
      case '3':
        return (
          <>
            <h2>Meus Dados</h2>
            <p>Em breve: edição dos seus dados.</p>
          </>
        );
      case '4':
        // Aqui você pode chamar a função de logout do seu contexto
        window.location.href = '/login';
        return null;
      default:
        return (
          <>
            <h2>Bem-vindo ao seu painel!</h2>
            <p>Use o menu ao lado para navegar entre as funcionalidades.</p>
          </>
        );
    }
  };

  return (
    <Layout hasSider>
      <Sider style={siderStyle}>
        <div className="demo-logo-vertical">
          <FaLaptopCode />
          KIPFLOW
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          selectedKeys={[selectedKey]}
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div style={{ paddingLeft: 24, fontWeight: 600, fontSize: 18 }}>
            Olá, {user?.name || 'Usuário'}
          </div>
        </Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
            className="user-dashboard-container"
          >
            {renderContent()}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          KIPFLOW ©{new Date().getFullYear()} - Todos os direitos reservados
        </Footer>
      </Layout>
    </Layout>
  );
}

export default UserDashboard;