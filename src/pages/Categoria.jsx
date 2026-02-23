import React, { useEffect, useState, useRef } from 'react';
import Hls from 'hls.js';
import { fetchChannels } from '../services/channelService';
import '../styles/Categoria.css';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeDown, FaExpand } from 'react-icons/fa';

export const Categorias = () => {
  const [channels, setChannels] = useState([]);
  const [categories, setCategories] = useState({});
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [visibleChannels, setVisibleChannels] = useState({});
  const [currentChannel, setCurrentChannel] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef(null);
  const videoRef = useRef(null);
  const hideControlsTimer = useRef(null);

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
        const groupMatch = line.match(/group-title="(.*?)"/); // Extraer categoría
        const imageMatch = line.match(/tvg-logo="(.*?)"/);
        currentChannel = {
          name: info || 'Canal desconocido',
          category: groupMatch ? groupMatch[1] : 'Sin categoría',
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
                  onError={() => alert('No se pudo reproducir este canal.')}
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
                          src={channel.image}
                          alt={channel.name}
                          className="categorias-channel-image"
                        />
                        <p className="categorias-channel-name">{channel.name.replace(/\s*[\(\[].*?[\)\]]/g, '')}</p>
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


