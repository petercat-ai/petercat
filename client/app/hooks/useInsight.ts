import { useQuery } from '@tanstack/react-query';
import {
  getIssueStatistics,
  getIssueResolutionDuration,
  getPrStatistics,
  getCodeFrequency,
  getActivityStatistics,
  getActivityDatesAndTimes,
  getContributorStatistics,
} from '../services/InsightController';

export function useIssueStatistics(repoName: string) {
  return useQuery({
    queryKey: [`insight.issue.statistics`, repoName],
    queryFn: async () => getIssueStatistics(repoName),
    enabled: repoName !== undefined,
  });
}

export function useContributorStatistics(repoName: string) {
  return useQuery({
    queryKey: [`insight.contributor.statistics`, repoName],
    queryFn: async () => getContributorStatistics(repoName),
    enabled: repoName !== undefined,
  });
}

export function useIssueResolutionDuration(repoName: string) {
  return useQuery({
    queryKey: [`insight.issue.resolution_duration`, repoName],
    queryFn: async () => getIssueResolutionDuration(repoName),
    enabled: repoName !== undefined,
  });
}

export function usePrStatistics(repoName: string) {
  return useQuery({
    queryKey: [`insight.pr.statistics`, repoName],
    queryFn: async () => getPrStatistics(repoName),
    enabled: repoName !== undefined,
  });
}

export function useCodeFrequency(repoName: string) {
  return useQuery({
    queryKey: [`insight.pr.code_frequency`, repoName],
    queryFn: async () => getCodeFrequency(repoName),
    enabled: repoName !== undefined,
  });
}

export function useActivityStatistics(repoName: string) {
  return useQuery({
    queryKey: [`insight.activity.statistics`, repoName],
    queryFn: async () => getActivityStatistics(repoName),
    enabled: repoName !== undefined,
  });
}

export function useActivityDatesAndTimes(repoName: string) {
  return useQuery({
    queryKey: [`insight.activity.dates_and_times`, repoName],
    queryFn: async () => getActivityDatesAndTimes(repoName),
    enabled: repoName !== undefined,
  });
}
