import axios from 'axios';

const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN;
axios.defaults.withCredentials = true;

export async function getIssueStatistics(repoName: string) {
  const response = await axios.get(
    `${apiDomain}/api/insight/issue/statistics?repo_name=${repoName}`,
  );
  return response.data.data;
}

export async function getIssueResolutionDuration(repoName: string) {
  const response = await axios.get(
    `${apiDomain}/api/insight/issue/resolution_duration?repo_name=${repoName}`,
  );
  return response.data.data;
}

export async function getContributorStatistics(repoName: string) {
  const response = await axios.get(
    `${apiDomain}/api/insight/contributor/statistics?repo_name=${repoName}`,
  );
  return response.data.data;
}

export async function getPrStatistics(repoName: string) {
  const response = await axios.get(
    `${apiDomain}/api/insight/pr/statistics?repo_name=${repoName}`,
  );
  return response.data.data;
}

export async function getCodeFrequency(repoName: string) {
  const response = await axios.get(
    `${apiDomain}/api/insight/pr/code_frequency?repo_name=${repoName}`,
  );
  return response.data.data;
}

export async function getActivityStatistics(repoName: string) {
  const response = await axios.get(
    `${apiDomain}/api/insight/activity/statistics?repo_name=${repoName}`,
  );
  return response.data.data;
}

export async function getActivityDatesAndTimes(repoName: string) {
  const response = await axios.get(
    `${apiDomain}/api/insight/activity/dates_and_times?repo_name=${repoName}`,
  );
  return response.data.data;
}
