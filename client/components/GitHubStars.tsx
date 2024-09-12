import React from 'react';

async function fetchGitHubStars() {
  const res = await fetch('https://api.github.com/repos/petercat-ai/petercat', {
    cache: 'no-store',
  });
  const { stargazers_count: stars = 0 } = await res.json();
  return stars;
}

const GitHubStars = async () => {
  const stars = await fetchGitHubStars(); // Fetch stars on the server

  return <span id="github-stars-wrapper">{stars}</span>;
};

export default GitHubStars;
