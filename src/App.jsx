import { useState, useEffect } from "react";
import "./index.css";
import Header from "./Header";
import TestMessage from "./TestMessage";
import AnimeList from "./AnimeList";

function App() {
  const [username, setUsername] = useState(""); // User's MyAnimeList username
  const [testMessage, setTestMessage] = useState(""); // Feedback message
  const [messageType, setMessageType] = useState("success"); // Message type (success/error)
  const [loading, setLoading] = useState(false); // Loading state
  const [animeList, setAnimeList] = useState([]); // User's anime list
  const [accessToken, setAccessToken] = useState(""); // OAuth2 access token

  // Function to initiate OAuth2 authentication
  async function startOAuth() {
    if (!username) {
      setTestMessage("Please enter your MyAnimeList username.");
      setMessageType("error");
      return;
    }

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

  // Function to fetch the user's anime list
  async function fetchAnimeList(token) {
    if (!token) {
      console.error("Access token is missing.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/user/anime-list?access_token=${token}`);
      if (!response.ok) {
        throw new Error("Failed to fetch anime list.");
      }
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

  // Handle token retrieval and fetch the user's anime list after login
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      console.log("Got token:", token);
      setAccessToken(token); // Save the access token
      fetchAnimeList(token); // Fetch saved anime list
    }
  }, []);

  return (
    <>
      <Header />
      <main className="container">
        <div className="outer-square">
          <input
            type="text"
            className="center-input"
            placeholder="Enter your MyAnimeList username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button className="submit-button" onClick={startOAuth} disabled={loading}>
            {loading ? "Loading..." : "Log in with MyAnimeList"}
          </button>
        </div>

        {/* Display Test Message */}
        {testMessage && <TestMessage message={testMessage} type={messageType} />}

        {/* Display Anime List */}
        {animeList.length > 0 && <AnimeList animeList={animeList} />}
      </main>
    </>
  );
}

export default App;
