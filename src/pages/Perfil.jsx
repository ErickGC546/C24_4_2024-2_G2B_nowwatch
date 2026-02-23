import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listenToAuthChanges } from '../firebase';
import ListaFavoritos from '../components/ListaFavoritos';
import '../styles/Perfil.css';

function Perfil() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = listenToAuthChanges((user) => {
      if (user) {
        setUserProfile({
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
        setError(null);
      } else {
        setUserProfile(null);
        setError('Inicia sesión con Google para ver tu perfil');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && !userProfile) {
      navigate('/');
    }
  }, [loading, userProfile, navigate]);

  return (
    <div className="perfil-container">
      <h1 className="perfil-title">Perfil de <span>Usuario</span></h1>
      {loading && <p className="perfil-loading">Cargando...</p>}
      {error && <p className="perfil-error">{error}</p>}
      {userProfile && (
        <div className="perfil-card">
          <div className="perfil-content">
            <div className="perfil-avatar-wrapper">
              <img
                src={userProfile.photoURL || 'https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small_2x/user-profile-icon-free-vector.jpg'}
                alt="Profile"
                referrerPolicy="no-referrer"
                onError={(e) => { e.currentTarget.src = 'https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small_2x/user-profile-icon-free-vector.jpg'; }}
                className="perfil-avatar"
              />
            </div>
            <div className="perfil-info">
              <h3>{userProfile.displayName}</h3>
              <p>{userProfile.email}</p>
            </div>
          </div>
        </div>
      )}

      <h2 className="perfil-section-title"><span>Canales Favoritos</span></h2>
      <ListaFavoritos />
    </div>
  );
}

export default Perfil;
