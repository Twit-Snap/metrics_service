
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
    successfulRegisters: number;
    successfulRegistersWithProvider: number;
}

export interface LoginMetric{
    date: Date,
    loginUsers: number,
    successfulLogins: number,
    failedLoginAttempt: number,
    averageLoginTime: number
}

export interface LoginWithProviderMetric {
    date: Date,
    successfulLogins: number;
    successfulLoginsWithProvider: number;
}

export interface BlockedMetric{
    date: Date,
    blockedUsers: number
}

export type Params = {
    type: string,
}

