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
export type DateRange = 'week' | 'month' | 'year';

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
  | 'follow';

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
];

export type Params = {
  type: string;
  username?: string;
  dateRange?: DateRange;
};
