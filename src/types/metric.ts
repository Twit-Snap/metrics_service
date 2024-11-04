
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