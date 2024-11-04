import { Pool, QueryResult } from 'pg';
import {DatabasePool} from "./db";
import {MetricDataDto, Metric} from "../types/metric";

export class MetricsRepository{
    private pool: Pool;

    constructor(pool?: Pool) {
        this.pool = pool || DatabasePool.getInstance();
    }
    async createMetric(metricsData: MetricDataDto): Promise<Metric> {
        const { timestamp, type, user, metrics } = metricsData;
        const query = `
            INSERT INTO metrics (timestamp, type, user, metrics)
            VALUES ($1, $2, $3, $4)
            RETURNING id, timestamp, type, user, metrics
        `;

        const result: QueryResult<Metric> = await this.pool.query(query, [timestamp, type, user, metrics]);
        return result.rows[0];
    }
}
