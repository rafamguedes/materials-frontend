import './Header.css';
import { useAuth } from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Header = () => {
  const { Logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    Logout();
    navigate('/login');
  };

  return (
    <header className="menu-container">
      <div className="menu-content">
        <div className="menu-logo">
          <img src="./src/assets/logo.png" alt="Logo" id="logo-img" />
          <img src={logo} alt="Logo" id="logo-img" />
          <span className="logo-text">KIPFLOW</span>
        </div>

        <nav className="menu-items">
          <a href="/" className="menu-item">Reservas</a>
          <a href="/items" className="menu-item">Equipamentos</a>
          <a href="/users" className="menu-item">Usuários</a>
          <a href="/reports" className="menu-item">Relatórios</a>
          <a href="/logout" className="menu-item" onClick={handleLogout}>Logout</a>
          <a href="/reports/reservations" className="menu-item">Relatórios</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;