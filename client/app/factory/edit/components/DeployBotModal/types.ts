export interface DeployState {
  publicMarket?: {
    checked: boolean;
  };
  deployWebsite?: {
    checked: boolean;
    targetUrl?: string;
  };
  appInstalledRepo?: RepoBindBotConfig[];
}

export interface RepoBindBotConfig {
  repo_id: string;
  checked: boolean;
}

export interface BotApproval {
  approval_path: string;
  approval_status: 'open' | 'close';
}
