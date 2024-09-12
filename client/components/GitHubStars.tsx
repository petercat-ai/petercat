async function fetchGitHubStars() {
  const res = await fetch('https://api.github.com/repos/petercat-ai/petercat', {
    cache: 'no-store',
  });
  const { stargazers_count: stars = 0 } = await res.json();
  return stars;
}

export default async function GitHubStars() {
  const stars = await fetchGitHubStars();
  return stars;
}
