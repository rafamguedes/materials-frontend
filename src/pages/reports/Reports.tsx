import { useState } from 'react';
import { Tabs } from 'antd';
import UserReport from './UserReport';
import ReservationsReport from './ReservationsReport';
import ItemReport from './ItemReport';
import './Report.css';

function Reports() {
  const [activeKey, setActiveKey] = useState('1');
  return (
    <div className="reports-container">
      <h2 className="reports-title">Relatórios</h2>
      <div className="reports-tabs">
        <Tabs
          type="card"
          activeKey={activeKey}
          onChange={setActiveKey}
          items={[
            { key: '1', label: 'Reservas', children: <ReservationsReport /> },
            { key: '2', label: 'Equipamentos', children: <ItemReport /> },
            { key: '3', label: 'Usuários', children: <UserReport /> },
          ]}
        />
      </div>
    </div>
  );
};

export default Reports;