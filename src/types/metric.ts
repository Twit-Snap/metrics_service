export type MetricDataDto = {
  createdAt: Date;
  type: string;
  username: string;
  metrics: Record<string, string | number | boolean | Date>;
};

export interface Metric {
  id: number;
  createdAt: Date;
  type: string;
  username: string;
  metrics: Record<string, string | number | boolean | Date>;
}

export interface RegisterMetric {
  date: Date;
  registerUsers: number;
  averageRegistrationTime: number;
  successRate: number;
}

export interface RegisterWithProviderMetric {
  date: Date;
  successfulRegisters: number;
  successfulRegistersWithProvider: number;
}

export interface LoginMetric {
  date: Date;
  loginUsers: number;
  successfulLogins: number;
  failedLoginAttempts: number;
  averageLoginTime: number;
}

export interface LoginWithProviderMetric {
  date: Date;
  successfulLogins: number;
  successfulLoginsWithProvider: number;
  averageRecoveryTime: number;
}

export interface PasswordRecoveryMetric {
  date: Date;
  recoveryAttempts: number;
  successfulRecoveries: number;
  failedRecoveryAttempts: number;
  averageRecoveryTime: number;
}

export interface BlockedMetric {
  date: Date;
  blockedUsers: number;
}

export interface TwitMetric {
  dateName: string;
  date: Date;
  amount: number;
}

export interface LocationMetric {
  country: string;
  amount: number;
}

export interface FollowMetric {
  date: Date;
  amount: number;
}

export interface TotalFollowMetric {
  follows: FollowMetric[];
  total: number;
}

export interface AuthTwitMetric {
  total: number;
  twits: TwitMetric[];
}

export interface HashtagMetric {
  date: Date;
  hashtags: Record<string, number>;
}
export type DateRange = 'week' | 'month' | 'year' | 'all';

export type ParamType =
  | 'register'
  | 'register_with_provider'
  | 'login'
  | 'login_with_provider'
  | 'blocked'
  | 'twit'
  | 'like'
  | 'retwit'
  | 'comment'
  | 'location'
  | 'follow'
  | 'auth_twit'
  | 'hashtag'
  | 'password';

export const PARAM_TYPES: ParamType[] = [
  'register',
  'register_with_provider',
  'login',
  'login_with_provider',
  'blocked',
  'twit',
  'like',
  'retwit',
  'comment',
  'location',
  'follow',
  'auth_twit',
  'hashtag',
  'password'
];

export type Params = {
  type: string;
  username?: string;
  dateRange?: DateRange;
  auth?: boolean;
};
