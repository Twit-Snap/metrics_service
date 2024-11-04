
export type MetricDataDto = {
    timestamp: Date;
    type: string;
    user: string;
    metrics: Record<string, never>;
}

export interface Metric {
    id: number;
    timestamp: Date;
    type: string;
    user: string;
    metrics: Record<string, never>;
}