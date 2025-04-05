import React from "react";

function AnimeList({ animeList }) {
  if (!animeList || animeList.length === 0) {
    return null; // Do not render anything if there is no anime list
  }

  return (
    <div className="anime-list">
      <h2>Your Anime List:</h2>
      <ul>
        {animeList.map((anime, index) => (
          <li key={index} className="anime-item">
            <strong>{anime.node.title}</strong> - {anime.list_status.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AnimeList;
