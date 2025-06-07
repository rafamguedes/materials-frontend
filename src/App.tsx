import ReservationList from './components/reservation/Reservation';
import { ReservationProvider } from './context/ReservationProvider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Menu from './components/header/Header';
import { Layout } from 'antd';
import 'antd/dist/reset.css';
import ItemList from './components/item/Item';
import { ItemProvider } from './context/ItemProvider';
import EditReservationPage from './components/reservation/Update';

const { Content } = Layout;

function App() {
  return (
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
              </Routes>
            </Content>
          </Layout>
        </BrowserRouter>
      </ItemProvider>
    </ReservationProvider>
  );
}

export default App;