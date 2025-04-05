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
      <Header />
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
        {testMessage && <TestMessage message={testMessage} type={messageType} />}

        {/* Display Anime List */}
        <AnimeList animeList={animeList} />
      </main>
    </>
  );
}

export default App;
