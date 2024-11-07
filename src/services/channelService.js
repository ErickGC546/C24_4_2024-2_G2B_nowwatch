export const fetchChannels = async () => {
    try {
      const response = await fetch('https://iptv-org.github.io/iptv/languages/spa.m3u');
      const data = await response.text();
      return data;
    } catch (error) {
      console.error('Error fetching the m3u file:', error);
      throw error;
    }
};
  