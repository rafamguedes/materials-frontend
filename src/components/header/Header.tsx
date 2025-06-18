import './Header.css';
import logo from '../../assets/logo.png';

const Header = () => {
  return (
    <header className="menu-container">
      <div className="menu-content">
        <div className="menu-logo">
          <img src={logo} alt="Logo" id="logo-img" />
          <span className="logo-text">KIPFLOW</span>
        </div>

        <nav className="menu-items">
          <a href="/" className="menu-item">Reservas</a>
          <a href="/items" className="menu-item">Equipamentos</a>
          <a href="/users" className="menu-item">Usuários</a>
          <a href="/reports/reservations" className="menu-item">Relatórios</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;