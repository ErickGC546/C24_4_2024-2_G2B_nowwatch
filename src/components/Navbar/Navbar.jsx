import React, { useState } from 'react';

export const Navbar = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);

    const handleToggle = () => {
        setIsNavOpen(!isNavOpen);
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-dark border-bottom border-body" data-bs-theme="dark">
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

                    <a className="navbar-brand d-flex align-items-center" href="#">
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
                                <a className="nav-link text-white" href="#">Tv en vivo</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-white" href="#">Categorias</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-white" href="#">Buscar</a>
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
                            <li><a className="dropdown-item" href="#">Registrarse</a></li>
                            <li><a className="dropdown-item" href="#">Acceso</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}
