import { useState, useEffect } from "react";
import ImageViewer from "./components/ImageViewer";
import GoogleLoginButton from "./components/GoogleLoginButton";
import QuizComponent from "./components/QuizComponent";
import DraggableComponent from "./wrapper/DraggableWrapper";
import LayoutEditButton from "./components/LayoutEditButton";

function App({ apiUrl, googleClientId }) {
  const [username, setUsername] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userIp, setUserIp] = useState(null);
  const [isDragMode, setIsDragMode] = useState(false);
  const [viewerPosition, setViewerPosition] = useState({ x: 0, y: 100 });
  const [quizPosition, setQuizPosition] = useState({ x: 500, y: 100 });

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
    if (!userResponse.success) {
      console.log(`Authentication failed: ${userResponse.message}`);
      return;
    }
    setUserEmail(userResponse.email);
    setUsername(userResponse.name.split(" ")[0]);
  };

  const fetchUserIp = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      setUserIp(data.ip);
    } catch (err) {}
  };

  const handlePositionChange = (id, newPosition) => {
    if (id === "imageViewer") {
      setViewerPosition(newPosition);
    } else if (id === "awsQuiz") {
      setQuizPosition(newPosition);
    }
  };

  const toggleDragMode = () => {
    console.log("Toggled");
    setIsDragMode(!isDragMode);
  };

  useEffect(() => {
    fetchUserIp();
  }, [apiUrl]);

  return (
    <div className="min-h-screen bg-react-dark text-white">
      <div className="flex flex-col min-h-screen p-4 mb-8">
        <header className="flex flex-row justify-end items-center gap-4 min-h-[40px]">
          <div className="flex flex-row items-center gap-4">
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
          </div>
        </header>
        <main className="flex-grow flex flex-col justify-center gap-4">
          <DraggableComponent
            key="imageViewer"
            id="imageViewer"
            position={viewerPosition}
            onPositionChange={handlePositionChange}
            isDragMode={isDragMode}
          >
            <ImageViewer
              apiUrl={apiUrl}
              imageName="Charles_Profile_Pic.jpeg"
              headerText={null}
            />
          </DraggableComponent>
          {(userEmail || userIp) && (
            <DraggableComponent
              key="awsQuiz"
              id="awsQuiz"
              position={quizPosition}
              onPositionChange={handlePositionChange}
              isDragMode={isDragMode}
            >
              <QuizComponent
                apiUrl={apiUrl}
                userId={userEmail || userIp}
                certification="cloud-practitioner"
              />
            </DraggableComponent>
          )}
        </main>
        <footer className="flex flex-row justify-end items-center">
          <LayoutEditButton isDragMode={isDragMode} onToggle={toggleDragMode} />
        </footer>
      </div>
    </div>
  );
}

export default App;
