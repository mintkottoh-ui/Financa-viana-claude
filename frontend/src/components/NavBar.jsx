import { NavLink } from "react-router-dom";

export function NavBar() {
  return (
    <header className="navbar">
      <nav>
        <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
          Dashboard
        </NavLink>
        <NavLink to="/transacoes" className={({ isActive }) => (isActive ? "active" : "")}>
          Transações
        </NavLink>
        <NavLink to="/metas" className={({ isActive }) => (isActive ? "active" : "")}>
          Metas
        </NavLink>
        <NavLink to="/backup" className={({ isActive }) => (isActive ? "active" : "")}>
          Backup
        </NavLink>
      </nav>
    </header>
  );
}
