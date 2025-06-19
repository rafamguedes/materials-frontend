import { Routes, Route, Navigate } from 'react-router-dom';
import ReservationList from '../components/reservation/Reservation';
import EditReservationPage from '../components/reservation/Update';
import { Loading } from '../components/loading/Loading';
import { useAuth } from '../context/AuthProvider';
import ItemList from '../components/item/Item';
import { Layout } from 'antd';
import React from 'react';
import Menu from '../components/header/Header';
import { LoginPage } from '../components/login/Login';

const { Content } = Layout;

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const { signed } = useAuth();
  return signed ? children : <Navigate to="/login" replace />;
}

export function AppRoutes() {
  const { loading, signed } = useAuth();

  if (loading) {
    return <Loading />;
  }

  // Login deve ficar fora do layout
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <Layout>
              <Menu />
              <Content style={{ margin: '0 24px 0 24px', background: '#fff', padding: 14 }}>
                <Routes>
                  <Route path="/reservas" element={<ReservationList />} />
                  <Route path="/reserva/editar/:id" element={<EditReservationPage />} />
                  <Route path="/equipamentos" element={<ItemList />} />
                  <Route path="*" element={<Navigate to="/reservas" replace />} />
                </Routes>
              </Content>
            </Layout>
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}