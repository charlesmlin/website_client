import { useState, useEffect } from "react";
import ImageViewer from "./components/ImageViewer";

function App({ apiUrl }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchImageUrl = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/imageurl/Charles_Profile_Pic.jpeg`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch image URL");
      }

      const imageUrl = await response.text();
      setImageUrl(imageUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImageUrl();
  }, [apiUrl]);

  return (
    <div className="min-h-screen bg-react-dark text-white">
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <header className="text-4xl md:text-6xl font-bold mb-8 text-center">
          <h1>AWS S3 Image Viewer</h1>
          {loading && (
            <div className="flex flex-col items-center space-y-4">
              <div className="loading-spinner">
                <p className="text-lg">Loading image...</p>
              </div>
            </div>
          )}
          {error && (
            <div className="text-center">
              <p className="error-message">Error: {error}</p>
            </div>
          )}
          {imageUrl && !loading && <ImageViewer url={imageUrl} />}
        </header>
      </div>
    </div>
  );
}

export default App;
