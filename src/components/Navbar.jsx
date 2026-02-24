import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { listenToAuthChanges, signInWithGoogle, logout } from '../firebase';
import '../styles/Navbar.css';

const Navbar = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [error, setError] = useState(null);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleToggle = () => {
        setIsNavOpen(!isNavOpen);
    };

    const FALLBACK_AVATAR = 'https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small_2x/user-profile-icon-free-vector.jpg';

    useEffect(() => {
        const unsubscribe = listenToAuthChanges((user) => {
            if (user) {
                setUserProfile({
                    displayName: user.displayName,
                    email: user.email,
                    photo: user.photoURL,
                });
            } else {
                setUserProfile(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogin = async () => {
        try {
            await signInWithGoogle();
            navigate('/perfil');
        } catch (err) {
            console.error('Error durante la autenticación de Google:', err);
            setError('Error en la autenticación');
        }
    };

    const confirmLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (err) {
            console.error('Error al cerrar sesión:', err);
            setError('No se pudo cerrar sesión');
        } finally {
            setShowLogoutConfirm(false);
        }
    };

    return (
        <>
            <nav className="nw-navbar fixed-top">
                <div className="nw-nav-shell">
                    <div className="nw-brand" onClick={() => navigate('/')}> 
                        <img 
                            src="https://i.ibb.co/fGD9PvcR/Logo.png" 
                            height="40" 
                            width="40" 
                            alt="Logo" 
                            className="me-2"
                        />
                        <div className="nw-brand-text">
                            <span>NoWatch</span>
                        </div>
                    </div>

                    <button className="nw-burger" onClick={handleToggle} aria-label="Toggle navigation">
                        <span />
                        <span />
                        <span />
                    </button>

                    <div className={`nw-links ${isNavOpen ? 'open' : ''}`}>
                        <Link className={location.pathname === '/' ? 'active' : ''} to="/" onClick={() => setIsNavOpen(false)}>
                            En vivo
                        </Link>
                        <Link className={location.pathname.startsWith('/categoria') ? 'active' : ''} to="/categoria" onClick={() => setIsNavOpen(false)}>
                            Categorías
                        </Link>
                        {userProfile && (
                          <Link className={location.pathname.startsWith('/perfil') ? 'active' : ''} to="/perfil" onClick={() => setIsNavOpen(false)}>
                              Perfil
                          </Link>
                        )}
                    </div>

                    <div className="nw-user">
                        <button
                            type="button"
                            className="nw-user-chip"
                            aria-label={userProfile ? 'Cerrar sesión' : 'Iniciar sesión con Google'}
                            onClick={userProfile ? () => setShowLogoutConfirm(true) : handleLogin}
                        >
                            <img 
                                src={userProfile?.photo || FALLBACK_AVATAR}
                                alt="Foto de perfil"
                                referrerPolicy="no-referrer"
                                onError={(e) => { e.currentTarget.src = FALLBACK_AVATAR; }}
                            />
                            <span>{userProfile ? 'Cerrar sesión' : 'Iniciar sesión'}</span>
                        </button>
                    </div>
                </div>
            </nav>
            <Outlet />
            {showLogoutConfirm && (
                <div className="nw-dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby="logout-title">
                    <div className="nw-dialog">
                        <h4 id="logout-title">¿Deseas cerrar sesión?</h4>
                        <p className="nw-dialog-body">Tu sesión se cerrará y volverás a la página principal.</p>
                        <div className="nw-dialog-actions">
                            <button type="button" className="nw-btn ghost" onClick={() => setShowLogoutConfirm(false)}>
                                No, continuar aquí
                            </button>
                            <button type="button" className="nw-btn danger" onClick={confirmLogout}>
                                Sí, cerrar sesión
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Navbar;
