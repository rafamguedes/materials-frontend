import './Menu.css';

const Menu = () => {
  return (
    <header className="menu-container">
      <div className="menu-content">
        <div className="menu-logo">
            <img src="./src/assets/logo.png" alt="Logo" id="logo-img" />
            <span className="logo-text">KIPFLOW</span>
        </div>

        <nav className="menu-items">
          <a href="/" className="menu-item">Reservas</a>
          <a href="/equipamentos" className="menu-item">Equipamentos</a>
          <a href="/usuarios" className="menu-item">Usuários</a>
          <a href="/relatorios" className="menu-item">Relatórios</a>
          <a href="/perfil" className="menu-item">Perfil</a>
        </nav>
      </div>
    </header>
  );
};

export default Menu;