import ReservationList from './components/reservation/Reservation';
import { ReservationProvider } from './context/ReservationProvider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ItemList from './components/item/Item';
import { ItemProvider } from './context/ItemProvider';
import EditReservationPage from './components/reservation/Update';
import { UserProvider } from './context/UserProvider';
import { UserList } from './components/user/User';
import ReservationReports from './components/reports/Reports';
import Menu from './components/header/Header';
import { Layout } from 'antd';
import 'antd/dist/reset.css';

const { Content } = Layout;

function App() {
  return (
    <UserProvider>
      <ReservationProvider>
        <ItemProvider>
          <BrowserRouter>
            <Layout>
              <Menu />
              <Content style={{ margin: '0 24px 0 24px', background: '#fff', padding: 14 }}>
                <Routes>
                  <Route path="/" element={<ReservationList />} />
                  <Route path="/reservations/edit/:id" element={<EditReservationPage />} />
                  <Route path="/items" element={<ItemList />} />
                  <Route path="/users" element={<UserList />} />
                  <Route path="/reports/reservations" element={<ReservationReports />} />
                </Routes>
              </Content>
            </Layout>
          </BrowserRouter>
        </ItemProvider>
      </ReservationProvider>
    </UserProvider>
  );
}

export default App;