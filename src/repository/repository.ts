import { Pool, QueryResult } from 'pg';
import {DatabasePool} from "./db";
import {MetricDataDto, Metric, RegisterMetric} from "../types/metric";

export class MetricsRepository{
    private pool: Pool;

    constructor(pool?: Pool) {
        this.pool = pool || DatabasePool.getInstance();
    }
    async createMetric(metricsData: MetricDataDto): Promise<Metric> {
        const { createdAt, type, username, metrics } = metricsData;
        const query = `
            INSERT INTO metrics (created_at, metric_type, username, metrics)
            VALUES ($1, $2, $3, $4)
            RETURNING id, created_at, metric_type, username, metrics
    `;

        const result: QueryResult<Metric> = await this.pool.query(query, [createdAt, type, username, metrics]);
        return result.rows[0];
    }

    async getRegisterMetrics(): Promise<RegisterMetric[]> {
        const query = `
            SELECT 
                DATE(created_at) AS date, 
                COUNT(*) AS registerUsers, 
                AVG((metrics->>'registration_time')::float) AS averageRegistrationTime,
                AVG(CASE WHEN (metrics->>'success')::boolean THEN 1 ELSE 0 END) AS successRate
            FROM 
                metrics
            WHERE 
                metric_type = 'register' 
            GROUP BY 
                DATE(created_at)
            ORDER BY 
                DATE(created_at);
`;

        const result: QueryResult<RegisterMetric> = await this.pool.query(query);
        return result.rows;
    }
}
