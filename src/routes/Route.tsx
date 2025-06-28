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
import Reports from '../components/reports/Reports';
import { UserList } from '../components/user/User';
import UserDashboard from '../components/dashboard/Dashboard';

function AdminManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      <Menu />
      <Layout.Content style={{ margin: '60px 24px 0 24px', background: '#fff', padding: 14 }}>
        {children}
      </Layout.Content>
    </Layout>
  );
}

function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      <Layout.Content style={{ minHeight: '100vh', background: '#f5f7fa', padding: 0 }}>
        {children}
      </Layout.Content>
    </Layout>
  );
}

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const { signed } = useAuth();
  return signed ? children : <Navigate to="/login" replace />;
}

function RoleRoute({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: React.ReactElement;
}) {
  const { user } = useAuth();
  if (user && allowedRoles.includes(user.role)) {
    return children;
  }
  if (user && user.role === 'USER') {
    return <Navigate to="/dashboard" replace />;
  }
  return <Navigate to="/login" replace />;
}

export function AppRoutes() {
  const { loading, user } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            {user?.role === 'USER' ? (
              <UserLayout>
                <Routes>
                  <Route
                    path="/dashboard"
                    element={
                      <RoleRoute allowedRoles={['USER']}>
                        <UserDashboard />
                      </RoleRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </UserLayout>
            ) : (
              <AdminManagerLayout>
                <Routes>
                  <Route
                    path="/reservas"
                    element={
                      <RoleRoute allowedRoles={['ADMIN', 'MANAGER']}>
                        <ReservationList />
                      </RoleRoute>
                    }
                  />
                  <Route
                    path="/reserva/editar/:id"
                    element={
                      <RoleRoute allowedRoles={['ADMIN', 'MANAGER']}>
                        <EditReservationPage />
                      </RoleRoute>
                    }
                  />
                  <Route
                    path="/equipamentos"
                    element={
                      <RoleRoute allowedRoles={['ADMIN', 'MANAGER']}>
                        <ItemList />
                      </RoleRoute>
                    }
                  />
                  <Route
                    path="/usuarios"
                    element={
                      <RoleRoute allowedRoles={['ADMIN', 'MANAGER']}>
                        <UserList />
                      </RoleRoute>
                    }
                  />
                  <Route
                    path="/relatorios"
                    element={
                      <RoleRoute allowedRoles={['ADMIN', 'MANAGER']}>
                        <Reports />
                      </RoleRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/reservas" replace />} />
                </Routes>
              </AdminManagerLayout>
            )}
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}