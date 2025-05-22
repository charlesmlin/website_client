import React, { useState, useEffect } from 'react';
import ImageViewer from './components/ImageViewer';
import './App.css';

function App({ apiUrl }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const response = await fetch(`${apiUrl}/imageurl/Charles_Profile_Pic.jpeg`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch image URL');
        }
        
        const imageUrl = await response.text();
        setImageUrl(imageUrl);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImageUrl();
  }, [apiUrl]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>AWS S3 Image Viewer</h1>
        {loading && <p>Loading image...</p>}
        {error && <p className="error">Error: {error}</p>}
        {imageUrl && <ImageViewer url={imageUrl} />}
      </header>
    </div>
  );
}

export default App;
