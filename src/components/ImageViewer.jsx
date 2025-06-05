import { useState, useEffect } from "react";

const ImageViewer = ({ apiUrl, imageName, headerText }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchImageUrl = async (apiUrl, imageName) => {
    try {
      const response = await fetch(`${apiUrl}/imageurl/${imageName}`);

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
    fetchImageUrl(apiUrl, imageName);
  }, [apiUrl, imageName]);

  return (
    <div className="flex flex-col justify-center gap-4">
      {headerText && (
        <div className="text-4xl md:text-6xl text-center font-semibold text-gray-800">
          <h2>{headerText}</h2>
        </div>
      )}
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
      {imageUrl && !loading && (
        <div className="max-w-sm mx-auto">
          <img
            src={imageUrl}
            alt="Personal Pic from AWS S3"
            className="w-full h-auto rounded-lg shadow-md transition-opacity duration-300"
          />
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
