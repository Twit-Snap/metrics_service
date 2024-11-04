import { Pool, QueryResult } from 'pg';
import {DatabasePool} from "./db";
import {MetricDataDto, Metric} from "../types/metric";

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
}
