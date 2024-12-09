import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ListaFavoritos = ({ jwtToken, onRemoveFavorite }) => {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavoritos = async () => {
      try {
        const response = await axios.get('http://localhost:8080/favoritos', {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        setFavoritos(response.data);
        setLoading(false);
      } catch (error) {
        setError('No se pudo cargar los favoritos.');
        setLoading(false);
      }
    };

    if (jwtToken) {
      fetchFavoritos();
    }
  }, [jwtToken]);

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      await axios.delete(`http://localhost:8080/favoritos/${favoriteId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setFavoritos(favoritos.filter((fav) => fav.id !== favoriteId)); // Actualizamos la lista de favoritos
    } catch (error) {
      console.error('Error al eliminar favorito:', error);
    }
  };

  if (loading) return <p>Cargando favoritos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="channel-list">
      {favoritos.map((favorite) => (
        <div key={favorite.id} className="channel-card">
          {/* Aquí podrías obtener el canal de una lista o por algún otro criterio si tienes la URL */}
          <img
            src={favorite.image || 'https://via.placeholder.com/150'}
            alt={favorite.name || 'Canal Favorito'}
            className="channel-image"
          />
          <p>{favorite.name || 'Canal desconocido'}</p>
          <button
            onClick={() => handleRemoveFavorite(favorite.id)}
            className="btn btn-danger"
          >
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
};

export default ListaFavoritos;
