
export type MetricDataDto = {
    createdAt: Date;
    type: string;
    username: string;
    metrics: Record<string, never>;
}

export interface Metric {
    id: number;
    createdAt: Date;
    type: string;
    username: string;
    metrics: Record<string, never>;
}


export interface RegisterMetric {
    date: Date;
    registerUsers: number;
    averageRegistrationTime: number;
    successRate: number;
}

export interface RegisterFederatedIdentityMetric {
    date: string;
    totalUsers: number;
    providerDistribution: Record<string, number>;
}

export interface LoginMetric{
    date: Date,
    successfulLogins: number,
    failedLoginAttempt: number,
    averageLoginTime: number
}

export interface LoginWithProviderMetric{
    date: Date,
    successfulLogins: number,
}

export interface BlockedMetric{
    date: Date,
    blockedUsers: number
}
export type Params = {
    type: string,
}

