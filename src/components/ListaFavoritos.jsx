import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchChannels } from '../services/channelService';

const ListaFavoritos = ({ jwtToken, onRemoveFavorite }) => {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener la lista de favoritos del backend
        const favoritosResponse = await axios.get('http://localhost:8080/favoritos', {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        // Obtener la lista completa de canales desde fetchChannels
        const canalesData = await fetchChannels();
        const canales = parseM3U(canalesData);

        // Combinar los datos de favoritos con los datos de canales
        const favoritosConDetalles = favoritosResponse.data.map((favorito) => {
          const canalDetalles = canales.find(
            (canal) => canal.url === favorito.url // Coincidencia por URL
          );
          return {
            ...favorito,
            name: canalDetalles ? canalDetalles.name : 'Canal desconocido',
            image: canalDetalles
              ? canalDetalles.image
              : 'https://via.placeholder.com/150',
          };
        });

        setFavoritos(favoritosConDetalles);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError('No se pudo cargar los favoritos.');
        setLoading(false);
      }
    };

    if (jwtToken) {
      fetchData();
    }
  }, [jwtToken]);

  const parseM3U = (data) => {
    const lines = data.split('\n');
    const channels = [];
    let currentChannel = {};

    lines.forEach((line) => {
      if (line.startsWith('#EXTINF')) {
        const [, info] = line.split(',');
        const imageMatch = line.match(/tvg-logo="(.*?)"/);
        currentChannel = {
          name: info || 'Canal desconocido',
          url: '',
          image: imageMatch
            ? imageMatch[1]
            : 'https://via.placeholder.com/150',
        };
      } else if (line.startsWith('http') || line.startsWith('rtsp')) {
        currentChannel.url = line;
        channels.push(currentChannel);
      }
    });

    return channels;
  };

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      await axios.delete(`http://localhost:8080/favoritos/${favoriteId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setFavoritos(favoritos.filter((fav) => fav.id !== favoriteId));
    } catch (error) {
      console.error('Error al eliminar favorito:', error);
    }
  };

  if (loading) return <p>Cargando favoritos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="channel-list">
      {favoritos.length === 0 ? (
        <p>No tienes canales favoritos aún</p>
      ) : (
        favoritos.map((favorite) => (
          <div key={favorite.id} className="channel-card">
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
        ))
      )}
    </div>
  );
};

export default ListaFavoritos;
