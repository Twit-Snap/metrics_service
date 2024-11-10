import { Pool, QueryResult } from 'pg';
import {DatabasePool} from "./db";
import {
    MetricDataDto,
    Metric,
    RegisterMetric,
    RegisterFederatedIdentityMetric,
    LoginMetric,
    LoginWithProviderMetric, BlockedMetric
} from '../types/metric';

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
                DATE(created_at) AS "date", 
                COUNT(*)::int AS "registerUsers", 
                AVG((metrics->>'event_time')::float)::float AS "averageRegistrationTime",
                AVG(CASE WHEN (metrics->>'success')::boolean THEN 1 ELSE 0 END)::float AS "successRate"
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
        console.log(result.rows);
        return result.rows;

    }

    async getRegisterWithProviderMetrics(): Promise<RegisterFederatedIdentityMetric[]> {
        const query = `
        SELECT 
            "date",
            SUM(provider_count)::int AS "totalUsers",
            json_object_agg(provider, provider_count) AS "providerDistribution"
        FROM (
            SELECT 
                DATE(created_at) AS "date",
                metrics->>'provider' AS "provider",
                COUNT(*)::int AS "provider_count"
            FROM 
                metrics
            WHERE 
                metric_type = 'register_with_provider'
            GROUP BY 
                DATE(created_at), metrics->>'provider'
        ) AS provider_counts
        GROUP BY 
            date
        ORDER BY 
            date;
    `;

        const result: QueryResult<RegisterFederatedIdentityMetric> = await this.pool.query(query);

        return result.rows;
    }

    async getLoginMetrics(): Promise<LoginMetric[]> {

        const query = `
        SELECT 
            DATE(created_at) AS "date",
             COUNT(*)::int AS "loginUsers", 
            SUM(CASE WHEN (metrics->>'success')::boolean THEN 1 ELSE 0 END)::int AS "successfulLogins",
            SUM(CASE WHEN (metrics->>'success')::boolean THEN 0 ELSE 1 END)::int AS "failedLoginAttempts",
            AVG((metrics->>'event_time')::float)::float AS "averageLoginTime"
        FROM 
            metrics
        WHERE 
            metric_type = 'login'
        GROUP BY 
            DATE(created_at)
        ORDER BY 
            DATE(created_at);
    `;

        const result: QueryResult<LoginMetric> = await this.pool.query(query);

        return result.rows;
    }

    async getLoginWithProviderMetrics(): Promise<LoginWithProviderMetric[]> {

        const query = `
        SELECT 
             DATE(created_at) AS "date",
             SUM(CASE WHEN (metrics->>'success')::boolean THEN 1 ELSE 0 END)::int AS "successfulLogins"
        FROM 
            metrics
        WHERE 
            metric_type = 'login_with_provider'
        GROUP BY 
            DATE(created_at)
        ORDER BY 
            DATE(created_at);
       `;

        const result: QueryResult<LoginWithProviderMetric> = await this.pool.query(query);

        return result.rows;
    }

    async getBlockedMetrics(): Promise<BlockedMetric[]>{
        const query = `
        SELECT 
            DATE(created_at) AS "date",
            COUNT(*)::int AS "blockedUsers"
        FROM 
            metrics
        WHERE 
            metric_type = 'blocked'
        GROUP BY 
            DATE(created_at)
        ORDER BY 
            DATE(created_at);
    `;

        const result: QueryResult<BlockedMetric> = await this.pool.query(query);

        return result.rows;
    }
}
