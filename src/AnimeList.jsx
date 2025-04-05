function AnimeList({ animeList }) {
  if (!animeList || animeList.length === 0) {
    return <p>No anime found in your list.</p>;
  }

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
