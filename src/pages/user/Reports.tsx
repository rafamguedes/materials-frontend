import { useState } from 'react';
import { Tabs, Button, DatePicker, Form, message, Radio, ConfigProvider } from 'antd';
import { fetchInactiveUsersReport } from '../../apis/report';
import ptBR from 'antd/es/locale/pt_BR';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import './User.css';

dayjs.locale('pt-br');

function UserReports() {
  const [activeKey, setActiveKey] = useState('1');
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [active, setActive] = useState<string>('active');
  const [orderBy, setOrderBy] = useState<'ASC' | 'DESC'>('DESC');
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!startDate || !endDate) {
      message.warning('Selecione o período!');
      return;
    }
    setLoading(true);
    try {
      const params = {
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        active: active === 'all' ? undefined : active === 'active',
        orderBy,
      };
      const blob = await fetchInactiveUsersReport(params.startDate, params.endDate, params.active, params.orderBy);
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      window.open(url, '_blank');
      message.success('Relatório gerado com sucesso!');
    } catch (err) {
      message.error('Erro ao gerar relatório');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reports-container">
      <h2 className="reports-title">Relatórios de Usuários</h2>
      <div className="reports-tabs">
        <Tabs
          type="card"
          activeKey={activeKey}
          onChange={setActiveKey}
          items={[
            {
              key: '1',
              label: 'Usuários Inativos',
              children: (
                <Form className="reports-form" layout="vertical">
                  <ConfigProvider locale={ptBR}>
                    <Form.Item label="Data Inicial" required>
                        <DatePicker
                        value={startDate}
                        onChange={setStartDate}
                        placeholder="Selecione a data inicial"
                        format="DD/MM/YYYY"
                        style={{ width: '100%' }}
                        />
                    </Form.Item>
                    <Form.Item label="Data Final" required>
                        <DatePicker
                        value={endDate}
                        onChange={setEndDate}
                        placeholder="Selecione a data final"
                        format="DD/MM/YYYY"
                        style={{ width: '100%' }}
                        />
                    </Form.Item>
                  </ConfigProvider>
                  <Form.Item label="Status">
                    <Radio.Group
                      value={active}
                      onChange={e => setActive(e.target.value)}
                      className="radio-status-group"
                    >
                      <Radio.Button
                        value="active"
                        className={active === 'active' ? 'radio-status-active' : ''}
                      >
                        Ativos
                      </Radio.Button>
                      <Radio.Button
                        value="inactive"
                        className={active === 'inactive' ? 'radio-status-active' : ''}
                      >
                        Inativos
                      </Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item label="Ordenação">
                    <Radio.Group
                      value={orderBy}
                      onChange={e => setOrderBy(e.target.value)}
                      className="radio-order-group"
                    >
                      <Radio.Button
                        value="ASC"
                        className={orderBy === 'ASC' ? 'radio-order-active' : ''}
                      >
                        Ascendente
                      </Radio.Button>
                      <Radio.Button
                        value="DESC"
                        className={orderBy === 'DESC' ? 'radio-order-active' : ''}
                      >
                        Descendente
                      </Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      onClick={handleDownload}
                      loading={loading}
                      disabled={!startDate || !endDate}
                    >
                      Gerar Relatório
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default UserReports;