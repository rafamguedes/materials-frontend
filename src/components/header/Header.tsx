import './Header.css';
import { useAuth } from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { FaLaptopCode } from 'react-icons/fa';

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
          <FaLaptopCode className="logo-icon" />
          <span className="logo-text">KIPFLOW</span>
        </div>

        <nav className="menu-items">
          <a href="/" className="menu-item">Reservas</a>
          <a href="/equipamentos" className="menu-item">Equipamentos</a>
          <a href="/usuarios" className="menu-item">Usuários</a>
          <a href="/relatorios" className="menu-item">Relatórios</a>
          <a href="/logout" className="menu-item" onClick={handleLogout}>Logout</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;