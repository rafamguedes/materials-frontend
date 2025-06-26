import React, { useState } from 'react';
import { Button, DatePicker, Form, message, Radio, ConfigProvider } from 'antd';
import { fetchReservationsReport } from '../../api/ReportApi';
import ptBR from 'antd/es/locale/pt_BR';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

dayjs.locale('pt-br');

const reservationStatusOptions = [
  { value: 'PENDING', label: 'Pendentes' },
  { value: 'IN_PROGRESS', label: 'Em progresso' },
  { value: 'CONFIRMED', label: 'Finalizadas' },
  { value: 'CANCELLED', label: 'Canceladas' },
];

const ReservationsReport: React.FC = () => {
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [status, setStatus] = useState<string>('');
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
        status: status === 'all' ? undefined : status,
        orderBy,
      };
      const blob = await fetchReservationsReport(
        params.startDate,
        params.endDate,
        params.status,
        params.orderBy
      );
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
      <div className="radio-status-container">
        <Form.Item label="Status">
            <Radio.Group
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="radio-status-group"
            >
            {reservationStatusOptions.map(opt => (
                <Radio.Button
                key={opt.value}
                value={opt.value}
                className={status === opt.value ? 'radio-status-active' : ''}
                >
                {opt.label}
                </Radio.Button>
            ))}
            </Radio.Group>
        </Form.Item>
      </div>
      <div className="radio-order-container">
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
      </div>
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
  );
};

export default ReservationsReport;