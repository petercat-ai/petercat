export interface BotProfile {
  id: string;
  avatar?: string;
  name: string;
  description?: string;
  prompt?: string;
  starters?: string[];
}
