import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { listenToAuthChanges } from '../firebase';
import { fetchChannels } from '../services/channelService';
import { fetchFavorites, removeFavorite } from '../services/favoritesService';

const FALLBACK_IMAGE = 'https://i.ibb.co/fGD9PvcR/Logo.png';

const ListaFavoritos = () => {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

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
              : FALLBACK_IMAGE,
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
            : FALLBACK_IMAGE,
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
      enqueueSnackbar('Canal eliminado de favoritos', { variant: 'default' });
    } catch (error) {
      console.error('Error al eliminar favorito:', error);
      enqueueSnackbar('No se pudo eliminar el favorito', { variant: 'error' });
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
          <div
            key={favorite.id}
            className="channel-card"
            onClick={() => navigate('/', { state: { channelUrl: favorite.url } })}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate('/', { state: { channelUrl: favorite.url } });
              }
            }}
          >
            <img
              src={favorite.image || FALLBACK_IMAGE}
              alt={favorite.name || 'Canal Favorito'}
              onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = FALLBACK_IMAGE; }}
              className="channel-image"
            />
            <p>{favorite.name.replace(/\s*[\(\[].*?[\)\]]/g, '')}</p>
            <button
              onClick={(e) => { e.stopPropagation(); handleRemoveFavorite(favorite.id); }}
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
