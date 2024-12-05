import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const Navbar = ({ onSearch }) => {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleToggle = () => {
        setIsNavOpen(!isNavOpen);
    };

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                setUserProfile(null);
                return;
            }

            try {
                const res = await axios.get('http://localhost:8080/profile/user', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserProfile(res.data);
            } catch (error) {
                setError('No se pudo obtener el perfil');
            }
        };

        fetchProfile();
    }, []);

    const handleLoginSuccess = async (credentialResponse) => {
        const { credential } = credentialResponse;
        try {
            const response = await axios.post('http://localhost:8080/auth/callback/google', {
                idToken: credential,
            });

            if (response.data.message === 'Authentication successful') {
                const jwtToken = response.data.token;
                
                console.log('JWT recibido:', jwtToken);
                localStorage.setItem('jwtToken', jwtToken);

                navigate('/perfil');
            }
        } catch (error) {
            console.error('Error durante la autenticación de Google:', error);
            setError('Error en la autenticación');
        }
    };

    const handleLoginFailure = (error) => {
        console.error('Login failed:', error);
        setError('Error en la autenticación');
    };

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        setUserProfile(null);
        navigate('/');
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-dark border-bottom border-body fixed-top" data-bs-theme="dark">
                <div className="container-fluid">
                    {/* Botón de menú responsivo */}
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

                    {/* Logo y nombre */}
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

                    {/* Menú colapsable */}
                    <div className={`collapse navbar-collapse justify-content-center ${isNavOpen ? 'show' : ''}`} id="navbarNav">
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

                    {/* Ícono de usuario, oculto cuando el menú está abierto */}
                    <div className={`dropdown ms-auto ${isNavOpen ? 'd-none' : 'd-lg-flex'}`}>
                        <a 
                            href="#" 
                            className="d-flex align-items-center" 
                            id="dropdownMenuLink" 
                            data-bs-toggle="dropdown" 
                            aria-expanded="false"
                        >
                            {userProfile ? (
                                <img 
                                    src={userProfile.photo || "https://via.placeholder.com/150"}
                                    alt="User Image" 
                                    width="30" 
                                    height="30" 
                                    className="rounded-circle"
                                />
                            ) : (
                                <img 
                                    src="https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small_2x/user-profile-icon-free-vector.jpg" 
                                    alt="User Image" 
                                    width="30" 
                                    height="30" 
                                    className="rounded-circle"
                                />
                            )}
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuLink">
                            {userProfile ? (
                                <li><Link className="dropdown-item" to="/perfil">Mi Perfil</Link></li>
                            ) : (
                                <li>
                                    <GoogleLogin
                                        onSuccess={handleLoginSuccess}
                                        onError={handleLoginFailure}
                                        useOneTap
                                    />
                                </li>
                            )}
                            {userProfile && (
                                <li>
                                    <button className="dropdown-item" onClick={handleLogout}>
                                        Cerrar sesión
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
            <Outlet />
        </>
    );
}

export default Navbar;
