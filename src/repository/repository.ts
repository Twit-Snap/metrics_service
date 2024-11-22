import { Pool, QueryResult, QueryResultRow } from 'pg';
import {DatabasePool} from "./db";
import {
  MetricDataDto,
  Metric,
  RegisterMetric,
  LoginMetric,
  LoginWithProviderMetric,
  BlockedMetric,
  TwitMetric, RegisterWithProviderMetric, DateRange
} from '../types/metric';

export class MetricsRepository {
  private pool: Pool;

  constructor(pool?: Pool) {
    this.pool = pool || DatabasePool.getInstance();
  }
  async createMetric(metricsData: MetricDataDto): Promise<Metric> {
    const { createdAt, type, username, metrics } = metricsData;
    const query = `
            INSERT INTO metrics (created_at, metric_type, username, metrics)
            VALUES ($1, $2, $3, $4)
            RETURNING id, created_at AS "createdAt", metric_type AS "type", username, metrics
    `;

    const result: QueryResult<Metric> = await this.pool.query(query, [
      createdAt,
      type,
      username,
      metrics
    ]);
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
    return result.rows;
  }

  async getRegisterWithProviderMetrics(): Promise<RegisterWithProviderMetric[]> {
    const query = `
        SELECT 
            DATE(created_at) AS "date", 
            SUM(CASE WHEN metric_type = 'register' AND (metrics->>'success')::boolean THEN 1 ELSE 0 END)::int AS "successfulRegisters",
            SUM(CASE WHEN metric_type = 'register_with_provider' THEN 1 ELSE 0 END)::int AS "successfulRegistersWithProvider"
        FROM 
            metrics
        WHERE 
            metric_type IN ('register', 'register_with_provider') 
        GROUP BY 
            DATE(created_at)
        ORDER BY 
            DATE(created_at);
    `;

    const result: QueryResult<RegisterWithProviderMetric> = await this.pool.query(query);
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
            SUM(CASE WHEN metric_type = 'login' AND (metrics->>'success')::boolean THEN 1 ELSE 0 END)::int AS "successfulLogins",
            SUM(CASE WHEN metric_type = 'login_with_provider' AND (metrics->>'success')::boolean THEN 1 ELSE 0 END)::int AS "successfulLoginsWithProvider"
        FROM 
            metrics
        WHERE 
            metric_type IN ('login', 'login_with_provider') 
        GROUP BY 
            DATE(created_at)
        ORDER BY 
            DATE(created_at);
    `;

    const result: QueryResult<LoginWithProviderMetric> = await this.pool.query(query);

    return result.rows;
  }

  async getBlockedMetrics(): Promise<BlockedMetric[]> {
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

  private async getMetricsByUsername<T extends QueryResultRow>(
    username: string | undefined,
    dateRange: DateRange | undefined,
    metricType: string,
    baseDate?: Date
  ): Promise<T[]> {

    let dateCondition: string;
    let groupByGranularity: string;

    const referenceDate = baseDate ? `'${baseDate.toISOString().split('T')[0]}'` : 'CURRENT_DATE';

    switch (dateRange) {
      case 'week':
        dateCondition = `
        created_at >= date_trunc('week', ${referenceDate}::timestamp)
        AND created_at < date_trunc('week', ${referenceDate}::timestamp) + interval '1 week'
      `;
        groupByGranularity = "date_trunc('day', created_at)"; // Por día en la semana
        break;
      case 'month':
        dateCondition = `
        created_at >= date_trunc('month', ${referenceDate}::timestamp)
        AND created_at < date_trunc('month', ${referenceDate}::timestamp) + interval '1 month'
      `;
        //groupByGranularity = "date_trunc('week', created_at)"; // Agrupado por semanas en el mes
        groupByGranularity = "date_trunc('day', created_at)"; // Por día en la semana
        break;
      case 'year':
        dateCondition = `
        created_at >= date_trunc('year', ${referenceDate}::timestamp)
        AND created_at < date_trunc('year', ${referenceDate}::timestamp) + interval '1 year'
      `;
        groupByGranularity = "date_trunc('month', created_at)"; // Agrupado por meses en el año
        //groupByGranularity = "date_trunc('day', created_at)"; // Por día en la semana
        break;
      default:
        throw new Error('Invalid dateRange');
    }


    console.log('dateCondition', dateCondition);
    console.log('groupByGranularity', groupByGranularity);

    const query = `
      SELECT 
          ${groupByGranularity} AS "date", -- Fecha truncada según la granularidad
          COUNT(*)::int AS "amount" -- Total de métricas por el rango agrupado
      FROM 
          metrics
      WHERE 
          metric_type = $1 
          AND username = $2
          AND ${dateCondition} -- Filtrar según el rango de fechas
      GROUP BY 
          ${groupByGranularity} -- Agrupación según la granularidad definida
      ORDER BY 
          ${groupByGranularity}; -- Ordenar los resultados por la fecha agrupada
  `;

    const result: QueryResult<T> = await this.pool.query(query, [metricType, username]);
    return result.rows;
  }


  async getTwitMetricsByUsername(
    username: string | undefined,
    dateRange: DateRange | undefined,
    baseDate?: Date
  ): Promise<TwitMetric[]> {
    return this.getMetricsByUsername<TwitMetric>(username, dateRange, 'twit', baseDate);
  }

  async getLikeMetricsByUsername(
    username: string | undefined,
    dateRange: DateRange | undefined,
    baseDate?: Date
  ): Promise<TwitMetric[]> {
    return this.getMetricsByUsername<TwitMetric>(username, dateRange, 'like', baseDate);
  }

  async getRetwitMetricsByUsername(
    username: string | undefined,
    dateRange: DateRange | undefined,
    baseDate?: Date
  ): Promise<TwitMetric[]> {
    return this.getMetricsByUsername<TwitMetric>(username, dateRange, 'retwit', baseDate);
  }

  async getCommentMetricsByUsername(
    username: string | undefined,
    dateRange: DateRange | undefined,
  baseDate?: Date
  ): Promise<TwitMetric[]> {
    return this.getMetricsByUsername<TwitMetric>(username, dateRange, 'comment', baseDate);
  }
}
