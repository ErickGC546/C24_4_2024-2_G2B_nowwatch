import React, { useEffect, useState } from 'react';
import { listenToAuthChanges } from '../firebase';
import { fetchChannels } from '../services/channelService';
import { fetchFavorites, removeFavorite } from '../services/favoritesService';

const ListaFavoritos = () => {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = listenToAuthChanges((user) => setCurrentUser(user));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!currentUser) {
          setFavoritos([]);
          setLoading(false);
          return;
        }

        // Obtener la lista completa de canales desde fetchChannels
        const canalesData = await fetchChannels();
        const canales = parseM3U(canalesData);

        const favoritosResponse = await fetchFavorites(currentUser.uid);

        // Combinar los datos de favoritos con los datos de canales
        const favoritosConDetalles = favoritosResponse.map((favorito) => {
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

    fetchData();
  }, [currentUser]);

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
    if (!currentUser) return;

    try {
      await removeFavorite(currentUser.uid, favoriteId);
      setFavoritos(favoritos.filter((fav) => fav.id !== favoriteId));
    } catch (error) {
      console.error('Error al eliminar favorito:', error);
    }
  };

  if (loading) return <p className="perfil-loading">Cargando favoritos...</p>;
  if (error) return <p className="perfil-error">{error}</p>;

  return (
    <div className="channel-list">
      {favoritos.length === 0 ? (
        <p className="favoritos-empty">No tienes canales favoritos aún</p>
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
              className="btn-remove"
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
