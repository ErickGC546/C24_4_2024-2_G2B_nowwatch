import React, { useEffect, useState, useRef } from 'react';
import Hls from 'hls.js';
import { fetchChannels } from '../services/channelService';
import Navbar  from '../components/Navbar';
import '../styles/Categoria.css';

export const Categorias = () => {
  const [channels, setChannels] = useState([]);
  const [categories, setCategories] = useState({});
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [visibleChannels, setVisibleChannels] = useState({});
  const [currentChannel, setCurrentChannel] = useState(null);
  const videoRef = useRef(null);

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
      setFilteredCategories(Object.keys(categories)); // Mostrar todas las categorías
    } else {
      const filtered = Object.keys(categories).filter((category) =>
        category.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredCategories(filtered); // Actualizar categorías filtradas
    }
  };

  return (
    <>
      {/* Pasar handleSearch al Navbar */}
      <Navbar onSearch={handleSearch} />
  
      <div className="categorias-container">
        <div className="categorias-video-container">
          {currentChannel ? (
            <>
              <h2 className="categorias-current-title">Canal: {currentChannel.name}</h2>
              <video
                ref={videoRef}
                controls
                autoPlay
                className="categorias-video"
                onError={() => alert('No se pudo reproducir este canal.')}
              />
            </>
          ) : (
            <p>No hay un canal seleccionado.</p>
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


