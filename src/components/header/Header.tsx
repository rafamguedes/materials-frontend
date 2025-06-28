import './Header.css';
import { useAuth } from '../../context/AuthProvider';
import { useNavigate, Link } from 'react-router-dom';
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
          <Link to="/reservas" className="menu-item">Reservas</Link>
          <Link to="/equipamentos" className="menu-item">Equipamentos</Link>
          <Link to="/usuarios" className="menu-item">Usuários</Link>
          <Link to="/relatorios" className="menu-item">Relatórios</Link>
          <a href="/logout" className="menu-item" onClick={handleLogout}>Logout</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;