import React, { useEffect, useState } from 'react';

export const Categoria = () => {
  const [categories, setCategories] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://iptv-org.github.io/iptv/languages/spa.m3u');
        const data = await response.text();
        const parsedData = parseM3U(data);
        setCategories(parsedData.categories);
      } catch (error) {
        console.error('Error fetching the m3u file:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <h1>Categorías</h1>
      {Object.keys(categories).map((category) => (
        <div key={category}>
          <h2>{category}</h2>
          <ul>
            {categories[category].map((channel, index) => (
              <li key={index}>
                <a href={channel.url} target="_blank" rel="noopener noreferrer">
                  {channel.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
export default Categoria;