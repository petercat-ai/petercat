export interface BotProfile {
  id: string;
  avatar?: string;
  name: string;
  description?: string;
  prompt?: string;
  starters?: string[];
  public?: boolean;
  helloMessage?: string;
  repoName?: string;
}
