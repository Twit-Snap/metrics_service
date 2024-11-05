
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
    date: string;
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
    successfulLogins: number,
    failedLoginAttempts: number,
    averageLoginTime: number
}

export type Params = {
    type: string,
}

