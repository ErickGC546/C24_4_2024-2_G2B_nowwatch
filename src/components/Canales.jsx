import React, { useEffect, useState, useRef } from 'react'; 
import Hls from 'hls.js';
import { fetchChannels } from '../services/channelService';
import Navbar from './Navbar';
import '../styles/Canales.css';
import axios from 'axios';

export const Canales = () => {
  const [channels, setChannels] = useState([]);
  const [filteredChannels, setFilteredChannels] = useState([]);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [favoriteChannels, setFavoriteChannels] = useState([]);
  const [visibleChannels, setVisibleChannels] = useState(5);
  const videoRef = useRef(null);

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
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert('Por favor, inicia sesión para agregar a favoritos');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/favoritos', 
        { url },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data); // Mensaje de éxito o error
    } catch (error) {
      console.error('Error al agregar a favoritos:', error);
      alert('Hubo un error al agregar el canal a favoritos');
    }
  };

  return (
    <div className="container">
      {/* Pasar la función handleSearch al Navbar */}
      <Navbar onSearch={handleSearch} />

      {currentChannel && currentChannel.url ? (
        <div className="video-container">
          <h2>Canal: {currentChannel.name}</h2>
          <video
            ref={videoRef}
            controls
            autoPlay
            className="video"
            onError={() => alert("Este canal no se puede reproducir.")}
          />
        </div>
      ) : (
        <p>No hay un canal seleccionado o el canal actual no tiene una URL válida.</p>
      )}
      <br />
      <h2>Lista de Canales</h2>
      <div className="channel-list">
        {filteredChannels.slice(0, visibleChannels).map((channel, index) => (
          <div
            key={index}
            onClick={() => handleChannelChange(channel)}
            className={`channel-card ${currentChannel === channel ? 'active' : ''}`}
          >
            <img
              src={channel.image}
              
              className="channel-image"
            />
            <p>{channel.name}</p>
            <button onClick={() => agregarAFavoritos(channel.url)}>
              Agregar a favoritos
            </button>
          </div>
        ))}
      </div>

      {visibleChannels < filteredChannels.length && (
        <center>
          <button onClick={loadMoreChannels} className="boton-elegante">
            Ver más canales
          </button>
        </center>
      )}
    </div>
  );
};

export default Canales;
