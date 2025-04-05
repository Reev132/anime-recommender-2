import React from "react";

function AnimeList({ animeList }) {
  if (!animeList || animeList.length === 0) return null;

  return (
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
  );
}

export default AnimeList;
