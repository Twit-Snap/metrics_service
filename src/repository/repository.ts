import { Pool, QueryResult, QueryResultRow } from 'pg';
import { DatabasePool } from './db';
import {
  MetricDataDto,
  Metric,
  RegisterMetric,
  LoginMetric,
  LoginWithProviderMetric,
  BlockedMetric,
  TwitMetric,
  RegisterWithProviderMetric,
  DateRange,
  LocationMetric,
  FollowMetric,
  TotalFollowMetric
} from '../types/metric';
import { ValidationError } from '../types/customErrors';

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
    const {groupByGranularity,dateCondition}  = this.selectGranurality(dateRange, baseDate);

    const query = `
      SELECT 
          ${groupByGranularity} AS "date",
          TO_CHAR(${groupByGranularity}, 'FMDay') AS "dateName",  -- Nombre del día (e.g., 'Monday')
          COUNT(*)::int AS "amount" -- Total de métricas por el rango agrupado
      FROM 
          metrics
      WHERE 
          metric_type = $1 
          AND username = $2
          AND ${dateCondition} -- Filtrar según el rango de fechas
      GROUP BY 
          ${groupByGranularity} --, TO_CHAR( ${groupByGranularity}, 'FMDay') -- Agrupación según la granularidad definida
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

  private async getTotalFollowersMetrics(): Promise<number> {
    const query = `
    SELECT 
      SUM(
        CASE 
          WHEN (metrics->>'followed') = 'true' THEN 1 
          WHEN (metrics->>'followed') = 'false' THEN -1 
          ELSE 0 
        END
      )::int AS "totalFollowers"
    FROM 
      metrics
    WHERE 
      metric_type = 'follow';
  `;

    const result: QueryResult<{ totalFollowers: number }> = await this.pool.query(query);

    return result.rows[0]?.totalFollowers || 0;
  }

  async getFollowersMetrics(
    username: string | undefined,
    dateRange: DateRange | undefined,
    baseDate?: Date
  ): Promise<TotalFollowMetric> {
    const followsInTime = await this.getFollowMetricByUsername(username, dateRange, baseDate);
    const totalFollowers = await this.getTotalFollowersMetrics();

    return { follows: followsInTime, total: totalFollowers };
  }
  private selectGranurality(dateRange: DateRange | undefined , baseDate: Date | undefined): { dateCondition: string; groupByGranularity: string } {
    const referenceDate = baseDate ? `'${baseDate.toISOString().split('T')[0]}'` : 'CURRENT_DATE';

    let dateCondition: string;
    let groupByGranularity: string;

    switch (dateRange) {
      case 'week':
        dateCondition = `
        created_at >= ${referenceDate}::timestamp - interval '7 days'
        AND created_at <= ${referenceDate}::timestamp + interval '1 day'
      `;
        groupByGranularity = "date_trunc('day', created_at)";
        break;
      case 'month':
        dateCondition = `
        created_at >= date_trunc('month', ${referenceDate}::timestamp)
        AND created_at < date_trunc('month', ${referenceDate}::timestamp) + interval '1 month'
      `;
        groupByGranularity = "date_trunc('day', created_at)";
        break;
      case 'year':
        dateCondition = `
        created_at >= date_trunc('year', ${referenceDate}::timestamp)
        AND created_at < date_trunc('year', ${referenceDate}::timestamp) + interval '1 year'
      `;
        groupByGranularity = "date_trunc('day', created_at)";
        break;
      default:
        throw new ValidationError('dateRange', 'Invalid date range', 'INVALID_DATE_RANGE');
    }

    return { dateCondition, groupByGranularity };
  }

  private async getFollowMetricByUsername(
    username: string | undefined,
    dateRange: DateRange | undefined,
    baseDate?: Date
  ): Promise<FollowMetric[]> {

    const {groupByGranularity,dateCondition}  = this.selectGranurality(dateRange, baseDate);
    const query = `
      SELECT 
          ${groupByGranularity} AS "date",
          TO_CHAR(${groupByGranularity}, 'FMDay') AS "dateName",  -- Nombre del día (e.g., 'Monday')
          SUM(CASE WHEN (metrics->>'followed')::boolean THEN 1 ELSE 0 END)::int AS "amount"
          
      FROM 
          metrics
      WHERE 
          metric_type = 'follow' 
          AND username = $1
          AND ${dateCondition} 
      GROUP BY 
          ${groupByGranularity} --, TO_CHAR( ${groupByGranularity}, 'FMDay') 
      ORDER BY 
          ${groupByGranularity}; 
  `;

    const result: QueryResult<FollowMetric> = await this.pool.query(query, [username]);
    return result.rows;
  }

  async getLocationMetrics(): Promise<LocationMetric[]> {
    const query = `
      SELECT 
          (metrics->>'country')::text AS "country",
          COUNT(*)::int AS "amount"
      FROM 
          metrics
      WHERE 
          metric_type = 'location'
      GROUP BY 
          (metrics->>'country')::text
      ORDER BY 
          "amount" ASC;
  `;

    const result: QueryResult<LocationMetric> = await this.pool.query(query);

    return result.rows;
  }
}
