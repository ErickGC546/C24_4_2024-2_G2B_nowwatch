import React, { useState } from 'react'; 
import { Link, Outlet } from 'react-router-dom';

const Navbar = ({ onSearch }) => {
    const [isNavOpen, setIsNavOpen] = useState(false);

    const handleToggle = () => {
        setIsNavOpen(!isNavOpen);
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-dark border-bottom border-body fixed-top" data-bs-theme="dark">
                <div className="container-fluid">
                    <button
                        className="navbar-toggler me-3"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded={isNavOpen ? "true" : "false"}
                        aria-label="Toggle navigation"
                        onClick={handleToggle}
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <a className="navbar-brand d-flex align-items-center" href="/">
                        <img 
                            src="https://img.freepik.com/vector-premium/pictograma-tv-pantalla-television-icono-negro-redondo_53562-15456.jpg?w=740" 
                            height="30" 
                            width="30" 
                            alt="Logo" 
                            className="me-2"
                        />
                        <span className="text-white">noWatch</span>
                    </a>

                    <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/">Tv en vivo</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/categoria">Categorias</Link>
                            </li>
                            <li className="nav-item">
                                {/* Campo de búsqueda */}
                                <input
                                    type="text"
                                    placeholder="Buscar canales"
                                    className="form-control"
                                    onChange={(e) => onSearch(e.target.value)}
                                />
                            </li>
                        </ul>
                    </div>

                    <div className={`dropdown ms-auto ${isNavOpen ? 'd-none' : ''}`}>
                        <a 
                            href="#" 
                            className="d-flex align-items-center" 
                            id="dropdownMenuLink" 
                            data-bs-toggle="dropdown" 
                            aria-expanded="false"
                        >
                            <img 
                                src="https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small_2x/user-profile-icon-free-vector.jpg" 
                                alt="User Image" 
                                width="30" 
                                height="30" 
                                className="rounded-circle"
                            />
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuLink">
                            <li><Link className="dropdown-item" to="/register">Registrarse</Link></li>
                            <li><Link className="dropdown-item" to="/login">Acceso</Link></li>
                        </ul>
                    </div>
                </div>
            </nav>
            <Outlet />
        </>
    );
}

export default Navbar;
