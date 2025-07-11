import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { FaLaptopCode } from 'react-icons/fa';
import { Menu, Divider } from 'antd';
import type { MenuProps } from 'antd';
import './Header.css';
import {
  AppstoreOutlined,
  UserOutlined,
  LaptopOutlined,
  FileTextOutlined,
  LogoutOutlined,
  ProfileOutlined,
  MailOutlined,
} from '@ant-design/icons';

const Header: React.FC = () => {
  const { Logout, user } = useAuth();
  const navigate = useNavigate();
  const [current, setCurrent] = useState('reservas');

  const onClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'logout') {
      Logout();
      navigate('/login');
      return;
    }
    setCurrent(e.key);
    if (e.key !== 'profile' && e.key !== 'user-info') {
      navigate(`/${e.key}`);
    }
  };

  const items: MenuProps['items'] = [
    {
      label: 'Reservas',
      key: 'reservas',
      icon: <AppstoreOutlined />,
    },
    {
      label: 'Equipamentos',
      key: 'equipamentos',
      icon: <LaptopOutlined />,
    },
    {
      label: 'Usuários',
      key: 'usuarios',
      icon: <UserOutlined />,
    },
    {
      label: 'Relatórios',
      key: 'relatorios',
      icon: <FileTextOutlined />,
    },
    {
      label: 'Perfil',
      icon: <ProfileOutlined />,
      key: 'profile',
      children: [
        {
          key: 'user-info',
          label: (
            <div style={{ minWidth: 360, padding: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 12, color: '#888' }}>
                  <MailOutlined style={{ marginRight: 4 }} />
                  {user?.email}
                  </div>
              </div>
              <Divider style={{ margin: '8px 0' }} />
            </div>
          ),
          disabled: true,
        },
        {
          key: 'logout',
          label: (
            <span style={{ color: '#d32f2f', fontWeight: 500 }}>
              <LogoutOutlined /> Sair
            </span>
          ),
        },
      ],
    },
  ];

  return (
    <header className="menu-container">
      <div className="menu-content">
        <div className="menu-logo">
          <FaLaptopCode className="logo-icon" />
          <span className="logo-text">KIPFLOW</span>
        </div>
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode="horizontal"
          items={items}
          className="menu-items"
        />
      </div>
    </header>
  );
};

export default Header;