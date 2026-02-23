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
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const playerRef = useRef(null);
  const videoRef = useRef(null);
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
    if (currentChannel && currentChannel.url) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(currentChannel.url);
        hls.attachMedia(videoRef.current);
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = currentChannel.url;
      }
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
        const imageMatch = line.match(/tvg-logo="(.*?)"/);
        currentChannel = {
          name: info || 'Canal desconocido',
          url: '',
          image: imageMatch ? imageMatch[1] : 'https://img.freepik.com/vector-premium/pictograma-tv-pantalla-television-icono-negro-redondo_53562-15456.jpg?w=740',
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
                  src={channel.image}
                  alt={`Imagen del canal ${channel.name}`}
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
