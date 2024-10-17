import React, { useEffect, useState } from 'react';

export const Canales = () => {
  const [channels, setChannels] = useState([]);
  const [currentChannel, setCurrentChannel] = useState(null);

  useEffect(() => {

    fetch('https://iptv-org.github.io/iptv/index.m3u')
      .then(response => response.text()) 
      .then(data => {
        const parsedChannels = parseM3U(data);
        setChannels(parsedChannels);
        setCurrentChannel(parsedChannels[0]);
      })
      .catch(error => console.error('Error fetching the m3u file:', error));
  }, []);


  const parseM3U = (data) => {
    const lines = data.split('\n');
    const channels = [];
    let currentChannel = {};

    lines.forEach((line) => {
      if (line.startsWith('#EXTINF')) {
        
        const info = line.split(',');
        currentChannel = {
          name: info[1] || 'No name',
          url: '', 
          image: 'https://img.freepik.com/vector-premium/pictograma-tv-pantalla-television-icono-negro-redondo_53562-15456.jpg?w=740',
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
  };

  return (
    <div>
      <center><h1>Reproductor de Canales IPTV</h1>

        {currentChannel && (
          <div >
            <h2>Canal: {currentChannel.name}</h2>
            <video
              src={currentChannel.url}
              controls
              autoPlay
              width="600"
            >
            </video>
          </div>
        )}
      </center>

      <h2>Lista de Canales</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {channels.map((channel, index) => (
          <div
            key={index}
            onClick={() => handleChannelChange(channel)}
            style={{
              cursor: 'pointer',
              margin: '10px',
              textAlign: 'center'
            }}
          >
            <img
              src={channel.image}
              alt={channel.name}
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
            />
            <p>{channel.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};


