import { ReservationProvider } from './contexts/ReservationProvider';
import { ItemProvider } from './contexts/ItemProvider';
import { AuthProvider } from './contexts/AuthProvider';
import { UserProvider } from './contexts/UserProvider';
import { AppRoutes } from './routes/Route';
import 'antd/dist/reset.css';

function App() {
  return (
    <AuthProvider>
      <ReservationProvider>
        <ItemProvider>
          <UserProvider>
            <AppRoutes />
          </UserProvider>
        </ItemProvider>
      </ReservationProvider>
    </AuthProvider>
  );
}

export default App;