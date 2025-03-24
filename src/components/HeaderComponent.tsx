import { NavLink } from "react-router-dom";
import '../styles/header.css';

const HeaderComponent = () => {
    return (
        <header className="header-container">
            <nav className="navbar navbar-expand-md navbar-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="index.html">
                        <img src="/trails.png" alt="home" id="logo-to-home-page" className="animated-logo" />
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarText">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
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
