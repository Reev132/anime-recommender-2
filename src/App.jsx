import { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [username, setUsername] = useState("");
  const [testMessage, setTestMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [loading, setLoading] = useState(false);
  const [animeList, setAnimeList] = useState([]); // State for storing the user's anime list

  // Function to fetch the user's anime list
  async function fetchAnimeList(token) {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/user/anime-list?access_token=${token}`);
      const data = await response.json();
      console.log("User's Anime List:", data);
      setAnimeList(data.data || []); // MAL API returns the list in a 'data' array
      setMessageType("success");
    } catch (error) {
      console.error("Error fetching anime list:", error);
      setTestMessage("Failed to load anime list.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  // Function to initiate OAuth2 authentication
  async function getData() {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/authorize");
      const data = await response.json();
      console.log("Auth URL received:", data.auth_url);
      window.location.href = data.auth_url; // Redirect user to MyAnimeList login page
    } catch (error) {
      console.error("Error:", error);
      setTestMessage("Error getting auth URL");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  // Handle token retrieval and fetch the user's anime list after login
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      console.log("Got token:", token);
      setTestMessage("Token is received!");
      setMessageType("success");
      fetchAnimeList(token); // Fetch saved anime list
    }
  }, []);

  return (
    <>
      <header className="header">
        <h1>MyAnimeList Viewer</h1>
      </header>
      <main className="container">
        <div className="outer-square">
          <input
            type="text"
            className="center-input"
            placeholder="Enter your MyAnimeList username (optional)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button className="submit-button" onClick={getData} disabled={loading}>
            {loading ? "Loading..." : "Log in with MyAnimeList"}
          </button>
        </div>

        {/* Display Test Message */}
        {testMessage && (
          <div className={`test-message ${messageType}`}>
            <p>{testMessage}</p>
          </div>
        )}

        {/* Display Anime List */}
        {animeList.length > 0 && (
          <div className="anime-list">
            <h2>Your Anime List:</h2>
            <ul>
              {animeList.map((anime, index) => (
                <li key={index}>
                  <strong>{anime.node.title}</strong> - {anime.list_status.status}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </>
  );
}

export default App;
