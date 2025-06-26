import { ReservationProvider } from './context/ReservationProvider';
import 'antd/dist/reset.css';
import { ItemProvider } from './context/ItemProvider';
import { AppRoutes } from './routes/Route';
import { AuthProvider } from './context/AuthProvider';
import { UserProvider } from './context/UserProvider';

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