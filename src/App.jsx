import { useState, useEffect } from "react";
import ImageViewer from "./components/ImageViewer";
import GoogleLoginButton from "./components/GoogleLoginButton";

function App({ apiUrl, googleClientId }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(null);

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

  const authenticateUser = async (token) => {
    // Send the token directly to server for authentication
    const response = await fetch(`${apiUrl}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "google", token: token }),
    });
    if (!response.ok) {
      console.log("Authentication failed");
      return;
    }
    const userResponse = await response.json();
    console.log("User response fetched: ", userResponse);
    if (!userResponse.success) {
      console.log(`Authentication failed: ${userResponse.message}`);
      return;
    }
    setUsername(userResponse.name.split(" ")[0]);
  };

  useEffect(() => {
    fetchImageUrl();
  }, [apiUrl]);

  return (
    <div className="min-h-screen bg-react-dark text-white">
      <div className="flex flex-col min-h-screen p-4 mb-8">
        <header className="flex flex-row justify-end items-center gap-4 min-h-[40px]">
          {username && <p>Welcome back, {username}</p>}
          {!username && (
            <>
              <p>Sign in as Admin:</p>
              <GoogleLoginButton
                clientId={googleClientId}
                onSuccess={authenticateUser}
              />
            </>
          )}
        </header>
        <main className="flex flex-col justify-center text-4xl md:text-6xl font-bold text-center gap-4">
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
        </main>
      </div>
    </div>
  );
}

export default App;
