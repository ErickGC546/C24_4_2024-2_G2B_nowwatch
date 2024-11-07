import React, { useEffect, useState, useRef } from 'react';
import Hls from 'hls.js';
import { fetchChannels } from '../services/channelService';
import '../styles/Canales.css';

export const Canales = () => {
  const [channels, setChannels] = useState([]);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [visibleChannels, setVisibleChannels] = useState(5);
  const videoRef = useRef(null);

  useEffect(() => {
    const loadChannels = async () => {
      try {
        const data = await fetchChannels();
        const parsedChannels = parseM3U(data);
        setChannels(parsedChannels);
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

  return (
    <div className="container">
      <h1>Reproductor de Canales IPTV</h1>
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

      <h2>Lista de Canales</h2>
      <div className="channel-list">
        {channels.slice(0, visibleChannels).map((channel, index) => (
          <div
            key={index}
            onClick={() => handleChannelChange(channel)}
            className={`channel-card ${currentChannel === channel ? 'active' : ''}`}
          >
            <img
              src={channel.image}
              alt={channel.name}
              className="channel-image"
            />
            <p>{channel.name}</p>
          </div>
        ))}
      </div>

      {visibleChannels < channels.length && (
        <center>
          <button onClick={loadMoreChannels} className="boton-elegante">
            Cargar más
          </button>
        </center>
      )}
    </div>
  );
};

export default Canales;