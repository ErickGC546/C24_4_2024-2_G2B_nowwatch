import React, { useEffect, useState, useRef } from 'react';
import Hls from 'hls.js';
import { useSnackbar } from 'notistack';
import { fetchChannels } from '../services/channelService';
import { listenToAuthChanges } from '../firebase';
import { addFavorite, fetchFavorites, removeFavorite } from '../services/favoritesService';
import '../styles/Categoria.css';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeDown, FaExpand, FaStar } from 'react-icons/fa';

const FALLBACK_IMAGE = 'https://i.ibb.co/fGD9PvcR/Logo.png';

export const Categorias = () => {
  const [channels, setChannels] = useState([]);
  const [categories, setCategories] = useState({});
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [visibleChannels, setVisibleChannels] = useState({});
  const [currentChannel, setCurrentChannel] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingStream, setIsLoadingStream] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const playerRef = useRef(null);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const loadTimeoutRef = useRef(null);
  const hideControlsTimer = useRef(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const unsubscribe = listenToAuthChanges((user) => setCurrentUser(user));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!currentUser) {
        setFavorites([]);
        return;
      }
      try {
        const favs = await fetchFavorites(currentUser.uid);
        setFavorites(favs.map((fav) => ({ id: fav.id, url: fav.url })));
      } catch (error) {
        console.error('Error loading favorites:', error);
        enqueueSnackbar('No se pudieron cargar tus favoritos', { variant: 'warning' });
      }
    };

    loadFavorites();
  }, [currentUser, enqueueSnackbar]);

  useEffect(() => {
    const loadChannels = async () => {
      try {
        const data = await fetchChannels();
        const parsedChannels = parseM3U(data);

        // Agrupar canales por categoría
        const groupedCategories = parsedChannels.reduce((acc, channel) => {
          if (!acc[channel.category]) {
            acc[channel.category] = [];
          }
          acc[channel.category].push(channel);
          return acc;
        }, {});

        setChannels(parsedChannels);
        setCategories(groupedCategories);
        setFilteredCategories(Object.keys(groupedCategories));

        // Inicializar visibleChannels con 5 canales por categoría
        const initialVisibleChannels = Object.keys(groupedCategories).reduce((acc, category) => {
          acc[category] = 5; // Mostrar 5 canales inicialmente por categoría
          return acc;
        }, {});

        setVisibleChannels(initialVisibleChannels);

        // Establecer el primer canal por defecto
        const firstCategory = Object.keys(groupedCategories)[0];
        if (firstCategory) {
          setCurrentChannel(groupedCategories[firstCategory][0]);
        }
      } catch (error) {
        console.error('Error loading channels:', error);
      }
    };

    loadChannels();
  }, []);

  useEffect(() => {
    if (currentChannel && currentChannel.url) {
      const video = videoRef.current;
      setErrorMessage('');

      if (!video) {
        return () => {};
      }

      setIsLoadingStream(true);
      setIsPlaying(false);

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }

      video.removeAttribute('src');
      video.load();

      const handleTimeout = () => {
        setIsLoadingStream(false);
        setErrorMessage('Problema con la conexion del canal.');
      };

      loadTimeoutRef.current = setTimeout(handleTimeout, 30000);

      const tryAutoplay = () => {
        video.play().catch(() => {
          video.muted = true;
          setIsMuted(true);
          video.play().catch(() => {});
        });
      };

      const markReady = () => {
        clearTimeout(loadTimeoutRef.current);
        setIsLoadingStream(false);
        setErrorMessage('');
        tryAutoplay();
      };

      const markError = () => {
        clearTimeout(loadTimeoutRef.current);
        setIsLoadingStream(false);
        setErrorMessage('No se puede reproducir este canal en este momento.');
      };

      let nativeCanPlayHandler = null;
      let nativeErrorHandler = null;

      if (Hls.isSupported()) {
        const hls = new Hls();
        hlsRef.current = hls;

        hls.on(Hls.Events.MANIFEST_PARSED, markReady);
        hls.on(Hls.Events.ERROR, () => {
          markError();
        });

        hls.loadSource(currentChannel.url);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        nativeCanPlayHandler = () => {
          markReady();
          video.removeEventListener('canplay', nativeCanPlayHandler);
        };

        nativeErrorHandler = () => {
          markError();
          video.removeEventListener('error', nativeErrorHandler);
        };

        video.addEventListener('canplay', nativeCanPlayHandler);
        video.addEventListener('error', nativeErrorHandler);
        video.src = currentChannel.url;
      } else {
        markError();
      }

      return () => {
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current);
        }
        if (nativeCanPlayHandler) {
          video.removeEventListener('canplay', nativeCanPlayHandler);
        }
        if (nativeErrorHandler) {
          video.removeEventListener('error', nativeErrorHandler);
        }
        video.removeAttribute('src');
        video.load();
      };
    }
  }, [currentChannel]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const active = !!document.fullscreenElement;
      setIsFullscreen(active);
      setControlsVisible(true);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleTogglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const handleFullscreen = () => {
    const container = playerRef.current;
    if (!container) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (container.requestFullscreen) {
      container.requestFullscreen();
    }
  };

  const showControlsTemporarily = () => {
    if (!isFullscreen) return;
    setControlsVisible(true);
    if (hideControlsTimer.current) {
      clearTimeout(hideControlsTimer.current);
    }
    hideControlsTimer.current = setTimeout(() => {
      setControlsVisible(false);
    }, 2000);
  };

  const handleVolumeChange = (nextVolume) => {
    const video = videoRef.current;
    if (!video) return;
    const clamped = Math.max(0, Math.min(1, nextVolume));
    video.volume = clamped;
    video.muted = clamped === 0;
    setVolume(clamped);
    setIsMuted(video.muted);
  };

  const parseM3U = (data) => {
    const lines = data.split('\n');
    const channels = [];
    let currentChannel = {};

    lines.forEach((line) => {
      if (line.startsWith('#EXTINF')) {
        const [, info] = line.split(',');
        const groupMatch = line.match(/group-title="(.*?)"/); // Extraer categoría
        const imageMatch = line.match(/tvg-logo="(.*?)"/);
        currentChannel = {
          name: info || 'Canal desconocido',
          category: groupMatch ? groupMatch[1] : 'Sin categoría',
          url: '',
          image: imageMatch ? imageMatch[1] : FALLBACK_IMAGE,
        };
      } else if (line.startsWith('http') || line.startsWith('rtsp')) {
        currentChannel.url = line;
        channels.push(currentChannel);
      }
    });

    return channels;
  };

  const handleChannelChange = (channel) => {
    setCurrentChannel(channel);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const loadMoreChannels = (category) => {
    setVisibleChannels((prev) => ({
      ...prev,
      [category]: (prev[category] || 0) + 5, // Incrementar 5 canales para esa categoría
    }));
  };

  const handleSearch = (term) => {
    if (term === '') {
      setFilteredCategories(Object.keys(categories));
    } else {
      const filtered = Object.keys(categories).filter((category) =>
        category.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  };

  const toggleFavorite = async (channel) => {
    if (!currentUser) {
      enqueueSnackbar('Inicia sesión para gestionar favoritos', { variant: 'info' });
      return;
    }

    const existing = favorites.find((fav) => fav.url === channel.url);

    try {
      if (existing) {
        await removeFavorite(currentUser.uid, existing.id);
        setFavorites((prev) => prev.filter((fav) => fav.id !== existing.id));
        enqueueSnackbar('Canal eliminado de favoritos', { variant: 'default' });
      } else {
        const result = await addFavorite(currentUser.uid, channel.url);
        const newId = result.id || `${Date.now()}-${channel.url}`;
        setFavorites((prev) => [...prev, { id: newId, url: channel.url }]);
        enqueueSnackbar('Canal agregado a favoritos', { variant: 'success' });
      }
    } catch (error) {
      console.error('Error al gestionar favorito:', error);
      enqueueSnackbar('Hubo un error al actualizar favoritos', { variant: 'error' });
    }
  };

  return (
    <>
      <div className="categorias-container">
        <div className="categorias-search">
          <input
            type="text"
            placeholder="Buscar categoría..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); handleSearch(e.target.value); }}
          />
        </div>
        <div className="categorias-video-container">
          {currentChannel ? (
            <>
              <div className="categorias-player-head">
                <div>
                  <p className="eyebrow">Transmitiendo ahora</p>
                  <h2 className="categorias-channel-title">{currentChannel.name.replace(/\s*[\(\[].*?[\)\]]/g, '')}</h2>
                </div>
                <div className="tag-strip">
                  <span className="tag">HD</span>
                  <span className="tag">Live</span>
                </div>
              </div>
              <div
                className="video-frame"
                ref={playerRef}
                onMouseMove={showControlsTemporarily}
                onMouseLeave={() => isFullscreen && setControlsVisible(false)}
                onClick={showControlsTemporarily}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  className="categorias-video"
                  controls={false}
                  playsInline
                  onError={() => {
                    setIsLoadingStream(false);
                    setErrorMessage('No se puede reproducir este canal en este momento.');
                    if (loadTimeoutRef.current) {
                      clearTimeout(loadTimeoutRef.current);
                    }
                  }}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onLoadedMetadata={() => {
                    const video = videoRef.current;
                    if (!video) return;
                    setIsMuted(!!video.muted);
                    setVolume(video.volume ?? 0.8);
                  }}
                  onVolumeChange={() => {
                    const video = videoRef.current;
                    if (!video) return;
                    setIsMuted(!!video.muted);
                    setVolume(video.volume ?? 0.8);
                  }}
                />
                {isLoadingStream && (
                  <div
                    className="video-overlay"
                    aria-live="polite"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(0,0,0,0.55)',
                      color: '#fff',
                      fontWeight: 600,
                      zIndex: 2,
                    }}
                  >
                    <span>Cargando canal...</span>
                  </div>
                )}
                {errorMessage && !isLoadingStream && (
                  <div
                    className="video-overlay"
                    role="alert"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(0,0,0,0.65)',
                      color: '#fff',
                      fontWeight: 600,
                      zIndex: 2,
                      textAlign: 'center',
                      padding: '0 1rem',
                    }}
                  >
                    <span>{errorMessage}</span>
                  </div>
                )}
                <div
                  className={`video-controls ${isFullscreen && !controlsVisible ? 'hidden' : ''}`}
                  role="group"
                  aria-label="Controles de reproduccion"
                >
                  <div className="video-control-group">
                    <button
                      type="button"
                      className="video-btn"
                      onClick={handleTogglePlay}
                      aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                    >
                      {isPlaying ? <FaPause /> : <FaPlay />}
                    </button>
                    <button
                      type="button"
                      className="video-btn"
                      onClick={() => handleVolumeChange(volume - 0.1)}
                      aria-label="Bajar volumen"
                    >
                      <FaVolumeDown />
                    </button>
                    <input
                      className="video-slider"
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={(event) => handleVolumeChange(parseFloat(event.target.value))}
                      aria-label="Volumen"
                    />
                    <button
                      type="button"
                      className="video-btn"
                      onClick={() => handleVolumeChange(volume + 0.1)}
                      aria-label="Subir volumen"
                    >
                      <FaVolumeUp />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="video-btn ghost"
                    onClick={handleFullscreen}
                    aria-label="Pantalla completa"
                  >
                    <FaExpand />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="perfil-loading">No hay un canal seleccionado.</p>
          )}
        </div>
        <div className="categorias-list-container">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <div key={category} className="categorias-category-section">
                <h2 className="categorias-category-title">{category}</h2>
                <div className="categorias-channel-list">
                  {categories[category].length > 0 ? (
                    categories[category].slice(0, visibleChannels[category]).map((channel, index) => (
                      <div
                        key={index}
                        className={`categorias-channel-card ${
                          currentChannel && currentChannel.url === channel.url ? 'categorias-active-channel' : ''
                        }`}
                        onClick={() => handleChannelChange(channel)}
                      >
                        <img
                          src={channel.image || FALLBACK_IMAGE}
                          alt={channel.name}
                          onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = FALLBACK_IMAGE; }}
                          className="categorias-channel-image"
                        />
                        <p className="categorias-channel-name">{channel.name.replace(/\s*[\(\[].*?[\)\]]/g, '')}</p>
                        <div className="btn-container">
                          <button
                            className="btn-favoritos"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(channel);
                            }}
                          >
                            <FaStar className="icono-favorito" />
                            {favorites.some((fav) => fav.url === channel.url) ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No hay canales disponibles en esta categoría</p>
                  )}
                </div>
                {visibleChannels[category] < categories[category].length && (
                  <button onClick={() => loadMoreChannels(category)} className="boton-elegante">
                    Ver más canales
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No se encuentra ninguna categoría que coincida con la búsqueda</p>
          )}
        </div>
      </div>
    </>
  );  
};

export default Categorias;


