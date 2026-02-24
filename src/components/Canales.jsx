import React, { useEffect, useState, useRef } from 'react'; 
import Hls from 'hls.js';
import { fetchChannels } from '../services/channelService';
import { listenToAuthChanges } from '../firebase';
import { addFavorite } from '../services/favoritesService';
import '../styles/Canales.css';
import { FaStar, FaSearch, FaPlay, FaPause, FaVolumeUp, FaVolumeDown, FaExpand } from "react-icons/fa";

export const Canales = () => {
  const [channels, setChannels] = useState([]);
  const [filteredChannels, setFilteredChannels] = useState([]);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [visibleChannels, setVisibleChannels] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingStream, setIsLoadingStream] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const playerRef = useRef(null);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const loadTimeoutRef = useRef(null);
  const hideControlsTimer = useRef(null);

  useEffect(() => {
    const unsubscribe = listenToAuthChanges((user) => setCurrentUser(user));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadChannels = async () => {
      try {
        const data = await fetchChannels();
        const parsedChannels = parseM3U(data);
        setChannels(parsedChannels);
        setFilteredChannels(parsedChannels); // Inicialmente, los canales filtrados son todos
        if (parsedChannels.length > 0) {
          setCurrentChannel(parsedChannels[0]);
        }
      } catch (error) {
        console.error('Error loading channels:', error);
      }
    };

    loadChannels();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    setErrorMessage('');

    if (!currentChannel || !currentChannel.url || !video) {
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
      setErrorMessage('Problema con la conexión del canal.');
    };
    loadTimeoutRef.current = setTimeout(handleTimeout, 30000);

    const tryAutoplay = () => {
      if (!video) return;
      video.play().catch(() => {
        // If the browser blocks autoplay with sound, mute and retry once.
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
      const handleCanPlay = () => {
        markReady();
        video.removeEventListener('canplay', handleCanPlay);
      };

      const handleError = () => {
        markError();
        video.removeEventListener('error', handleError);
      };

      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);
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
      video.removeAttribute('src');
      video.load();
    };
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
        const imageMatch = line.match(/tvg-logo="(.*?)"/);
        currentChannel = {
          name: info || 'Canal desconocido',
          url: '',
          image: imageMatch ? imageMatch[1] : 'https://i.ibb.co/fGD9PvcR/Logo.png',
        };
      } else if (line.startsWith('http') || line.startsWith('rtsp')) {
        currentChannel.url = line;
        channels.push(currentChannel);
      }
    });

    return channels;
  };

  const handleSearch = (searchTerm) => {
    if (searchTerm === '') {
      setFilteredChannels(channels);
    } else {
      const filtered = channels.filter(channel => 
        channel.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredChannels(filtered);
    }
  };

  const handleChannelChange = (channel) => {
    setErrorMessage('');
    setIsLoadingStream(true);
    setCurrentChannel(channel);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const loadMoreChannels = () => {
    setVisibleChannels((prevVisibleChannels) => prevVisibleChannels + 5);
  };

  const agregarAFavoritos = async (url) => {
    if (!currentUser) {
      alert('Por favor, inicia sesión para agregar a favoritos');
      return;
    }

    try {
      const result = await addFavorite(currentUser.uid, url);
      if (result.alreadyExists) {
        alert('Este canal ya está en tus favoritos');
      } else {
        alert('Canal agregado a favoritos');
      }
    } catch (error) {
      console.error('Error al agregar a favoritos:', error);
      alert('Hubo un error al agregar el canal a favoritos');
    }
  };

  return (
    <div className="canales-shell">
      <div className="canales-player">
        {currentChannel && currentChannel.url ? (
          <>
            <div className="canales-player-head">
              <div>
                <p className="eyebrow">Transmitiendo ahora</p>
                <h2><span>{currentChannel.name.replace(/\s*[\(\[].*?[\)\]]/g, '')}</span></h2>
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
              style={{ position: 'relative' }}
            >
              <video
                ref={videoRef}
                autoPlay
                className="video"
                controls={false}
                playsInline
                onError={() => alert("Este canal no se puede reproducir.")}
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
          <p>No hay un canal seleccionado</p>
        )}
      </div>

      <div className="canales-search">
        <FaSearch className="search-icon" style={{ color: 'var(--accent)' }} />
        <input
          type="text"
          placeholder="Buscar canal en vivo..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); handleSearch(e.target.value); }}
        />
      </div>

      <div className="canales-grid" id="grid-canales">
        <div className="canales-grid-head">
          <h3 className="section-title"><span>Canales</span> en vivo</h3>
          <span className="canales-count">{filteredChannels.length} disponibles</span>
        </div>
        <div className="channel-list">
          {filteredChannels.length > 0 ? (
            filteredChannels.slice(0, visibleChannels).map((channel, index) => (
              <div
                key={index}
                onClick={() => handleChannelChange(channel)}
                className={`channel-card ${currentChannel === channel ? 'active' : ''}`}
              >
                <img
                  src={channel.image || 'https://i.ibb.co/fGD9PvcR/Logo.png'}
                  alt={`Imagen del canal ${channel.name}`}
                  onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = 'https://i.ibb.co/fGD9PvcR/Logo.png'; }}
                  className="channel-image"
                />
                <p>{channel.name.replace(/\s*[\(\[].*?[\)\]]/g, '')}</p>
                <div className="btn-container">
                  <button className="btn-favoritos" onClick={(e) => { e.stopPropagation(); agregarAFavoritos(channel.url)}}>
                    <FaStar className="icono-favorito" />
                    Añadir a favoritos
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No se encuentra ninguna canal de TV que coincida con la búsqueda</p>
          )}
        </div>
      </div>

      {visibleChannels < filteredChannels.length && (
        <div className="canales-load">
          <button onClick={loadMoreChannels} className="boton-elegante">
            Ver más canales
          </button>
        </div>
      )}
    </div>
  );
};

export default Canales;
