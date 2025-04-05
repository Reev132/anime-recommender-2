import { useState, useEffect } from "react";
import "./index.css";
import Header from "./Header";
import TestMessage from "./TestMessage";
import AnimeList from "./AnimeList";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Callback from "./Callback";


function App() {
  const [username, setUsername] = useState(""); // User's MyAnimeList username
  const [testMessage, setTestMessage] = useState(""); // Feedback message
  const [messageType, setMessageType] = useState("success"); // Message type (success/error)
  const [loading, setLoading] = useState(false); // Loading state
  const [animeList, setAnimeList] = useState([]); // User's anime list
  const [isMockMode, setIsMockMode] = useState(false); // Mock mode flag

  // Mock anime list for testing
  const mockAnimeList = [
    { node: { title: "Naruto" }, list_status: { status: "completed" } },
    { node: { title: "Attack on Titan" }, list_status: { status: "watching" } },
    { node: { title: "One Piece" }, list_status: { status: "watching" } },
  ];

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
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/user/anime-list?access_token=${token}`
      );
      

      if (!response.ok) throw new Error("Failed to fetch anime list.");

      const data = await response.json();
      console.log("Fetched Anime List:", data); // Debugging log
      setAnimeList(data?.data || []); // Ensure correct structure
      setTestMessage("");
      setMessageType("success");
    } catch (error) {
      console.error("Fetch Anime List Error:", error); // Debugging log
      setTestMessage("Failed to load anime list.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  // Detect token in URL and fetch anime list
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    console.log("Detected OAuth Token:", token); // Debugging log

    if (token) fetchAnimeList(token);
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
          {/* Button to test mock data */}
          <button className="submit-button" onClick={() => setIsMockMode(true)}>
            Use Mock Data
          </button>
        </div>

        {/* Test message */}
        {testMessage && <TestMessage message={testMessage} type={messageType} />}

        {/* Render Anime List */}
        {/* Show mock list only when mock mode is enabled */}
        {isMockMode && <AnimeList animeList={mockAnimeList} />}

        {/* Show real data when fetched */}
        {!isMockMode && animeList.length > 0 && <AnimeList animeList={animeList} />}
      </main>
    </>
  );
}

export default App;