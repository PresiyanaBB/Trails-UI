import { NavLink } from "react-router-dom";
import '../styles/header.css';

const HeaderComponent = () => {
    return (
        <header className="header-container">
            <nav className="navbar navbar-expand-lg navbar-light">
                <div className="container-fluid header-content">
                    <NavLink className="navbar-brand" to="/">
                        <img src="/trails.png" alt="Trails Logo" className="header-logo" />
                    </NavLink>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/">Начало</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/artists">Артисти</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/archive">Архив</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/contacts">Контакти</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default HeaderComponent;
