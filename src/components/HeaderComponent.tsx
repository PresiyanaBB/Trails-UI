import '../styles/header.css';

const HeaderComponent = () => {
    return (
        <header className="header-container">
            <nav className="navbar navbar-expand-md navbar-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="index.html">
                        <img src="/step.png" alt="home" id="logo-to-home-page" className="animated-logo" />
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarText">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="/">Начало</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/artists">Артисти</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/gallery">Галерия</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/contacts">Контакти</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header >
    );
}

export default HeaderComponent;
