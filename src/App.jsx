import { useState, useEffect } from "react";
import "./index.css";
import Header from "./Header";
import TestMessage from "./TestMessage";
import AnimeList from "./AnimeList";

function App() {
  const [username, setUsername] = useState("");
  const [testMessage, setTestMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [loading, setLoading] = useState(false);
  const [animeList, setAnimeList] = useState([]);
  const [isMockMode, setIsMockMode] = useState(false);

  const mockAnimeList = [
    { node: { title: "Naruto" }, list_status: { status: "completed" } },
    { node: { title: "Attack on Titan" }, list_status: { status: "watching" } },
    { node: { title: "One Piece" }, list_status: { status: "watching" } },
  ];

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
      window.location.href = data.auth_url;
    } catch (error) {
      console.error("Error:", error);
      setTestMessage("Error getting auth URL");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  async function fetchAnimeList(token) {
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/user/anime-list?access_token=${token}`
      );

      if (!response.ok) throw new Error("Failed to fetch anime list.");
      const data = await response.json();
      console.log("Fetched Anime List:", data);
      setAnimeList(data?.data || []);
      setTestMessage("");
      setMessageType("success");
    } catch (error) {
      console.error("Fetch Anime List Error:", error);
      setTestMessage("Failed to load anime list.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenInUrl = urlParams.get("token");

    if (tokenInUrl) {
      localStorage.setItem("mal_token", tokenInUrl);
      fetchAnimeList(tokenInUrl);
    } else {
      const storedToken = localStorage.getItem("mal_token");
      if (storedToken) fetchAnimeList(storedToken);
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
          <button className="submit-button" onClick={() => setIsMockMode(true)}>
            Use Mock Data
          </button>
        </div>

        {testMessage && <TestMessage message={testMessage} type={messageType} />}
        {isMockMode && <AnimeList animeList={mockAnimeList} />}
        {!isMockMode && animeList.length > 0 && <AnimeList animeList={animeList} />}
      </main>
    </>
  );
}

export default App;
