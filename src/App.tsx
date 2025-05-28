import ReservationList from './components/reservation/ReservationList';
import { ReservationProvider } from './context/ReservationProvider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Menu from './components/menu/Menu';
import { Layout } from 'antd';
import 'antd/dist/reset.css';

const { Content } = Layout;

function App() {
  return (
    <ReservationProvider>
      <BrowserRouter>
        <Layout>
          <Menu />
          <Content style={{ margin: '0 24px 0 24px', background: '#fff', padding: 14 }}>
            <Routes>
              <Route path="/" element={<ReservationList />} />
            </Routes>
          </Content>
        </Layout>
      </BrowserRouter>
    </ReservationProvider>
  );
}

export default App;