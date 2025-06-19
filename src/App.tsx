import { ReservationProvider } from './context/ReservationProvider';
import 'antd/dist/reset.css';
import { ItemProvider } from './context/ItemProvider';
import { AppRoutes } from './routes/Route';
import { AuthProvider } from './context/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <ReservationProvider>
        <ItemProvider>
          <AppRoutes />
        </ItemProvider>
      </ReservationProvider>
    </AuthProvider>
  );
}

export default App;