import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ListaFavoritos from '../components/ListaFavoritos'; // Importamos el componente

function Perfil() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jwtToken, setJwtToken] = useState(localStorage.getItem('jwtToken')); // Obtener token de localStorage

  useEffect(() => {
    const fetchProfile = async () => {
      if (!jwtToken) {
        setError('No se encontró el token de autenticación');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('http://localhost:8080/profile/user', {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });

        setUserProfile(res.data);
        setLoading(false);
      } catch (error) {
        setError('No se pudo obtener el perfil');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [jwtToken]);

  // Eliminar un favorito de la lista en el perfil
  const handleRemoveFavorite = (favoriteId) => {
    // Aquí podrías realizar una actualización de UI si es necesario
    console.log(`Eliminado favorito con ID: ${favoriteId}`);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Perfil de Usuario</h1>
      {loading && <p className="text-center">Cargando...</p>}
      {error && <p className="text-center text-danger">{error}</p>}
      {userProfile && (
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="row">
              <div className="col-md-4 text-center">
                <img
                  src={userProfile.photo || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="img-fluid rounded-circle"
                />
              </div>
              <div className="col-md-8">
                <h3>{userProfile.first_name} {userProfile.last_name}</h3>
                <p>{userProfile.email}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <h2 className="mt-4">Favoritos</h2>
      <ListaFavoritos jwtToken={jwtToken} onRemoveFavorite={handleRemoveFavorite} />
    </div>
  );
}

export default Perfil;
