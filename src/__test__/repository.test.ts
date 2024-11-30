import { Pool } from 'pg';
import { DatabasePool } from '../repository/db';
import { MetricsRepository } from '../repository/repository';
import { MetricDataDto } from '../types/metric';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env.dev' });

describe('Metrics Repository', () => {
  let pool: Pool;

  beforeAll(async () => {
    pool = DatabasePool.getInstance();
    await pool.query('DELETE FROM metrics');
  });

  afterAll(async () => {
    await pool.query('DELETE FROM metrics');
    await DatabasePool.closePool();
  });

  beforeEach(async () => {
    await pool.query('DELETE FROM metrics');
  });

  describe('createMetric', () => {
    it('should create a new register metric', async () => {
      const metricsRepository = new MetricsRepository(pool);

      const metricData: MetricDataDto = {
        type: 'register',
        createdAt: new Date('2024-11-10'),
        username: 'testuser',
        metrics: {
          success: true,
          event_time: 1000
        }
      };

      const metric = await metricsRepository.createMetric(metricData);
      expect(metric).toBeDefined();
      expect(metric.createdAt).toEqual(metricData.createdAt);
      expect(metric.metrics).toEqual(metricData.metrics);
      expect(metric.type).toEqual(metricData.type);
      expect(metric.username).toEqual(metricData.username);
    });

    it('should create a new metric with provider', async () => {
      const metricsRepository = new MetricsRepository(pool);

      const metricData: MetricDataDto = {
        type: 'register_with_provider',
        createdAt: new Date('2024-11-10'),
        username: 'testuser',
        metrics: {
          success: true
        }
      };

      const metric = await metricsRepository.createMetric(metricData);
      expect(metric).toBeDefined();
      expect(metric.createdAt).toEqual(metricData.createdAt);
      expect(metric.metrics).toEqual(metricData.metrics);
      expect(metric.type).toEqual(metricData.type);
      expect(metric.username).toEqual(metricData.username);
    });
    it('should create a new login metric', async () => {
      const metricsRepository = new MetricsRepository(pool);

      const metricData: MetricDataDto = {
        type: 'login',
        createdAt: new Date('2024-11-10'),
        username: 'testuser',
        metrics: {
          success: true,
          event_time: 1000
        }
      };

      const metric = await metricsRepository.createMetric(metricData);
      expect(metric).toBeDefined();
      expect(metric.createdAt).toEqual(metricData.createdAt);
      expect(metric.metrics).toEqual(metricData.metrics);
      expect(metric.type).toEqual(metricData.type);
      expect(metric.username).toEqual(metricData.username);
    });

    it('should create a new login with provider metric', async () => {
      const metricsRepository = new MetricsRepository(pool);

      const metricData: MetricDataDto = {
        type: 'login_with_provider',
        createdAt: new Date('2024-11-10'),
        username: 'testuser',
        metrics: {
          success: true
        }
      };

      const metric = await metricsRepository.createMetric(metricData);
      expect(metric).toBeDefined();
      expect(metric.createdAt).toEqual(metricData.createdAt);
      expect(metric.metrics).toEqual(metricData.metrics);
      expect(metric.type).toEqual(metricData.type);
      expect(metric.username).toEqual(metricData.username);
    });

    it('should create a new blocked metric', async () => {
      const metricsRepository = new MetricsRepository(pool);

      const metricData: MetricDataDto = {
        type: 'blocked',
        createdAt: new Date('2024-11-10'),
        username: 'testuser',
        metrics: {
          blocked: true
        }
      };

      const metric = await metricsRepository.createMetric(metricData);
      expect(metric).toBeDefined();
      expect(metric.createdAt).toEqual(metricData.createdAt);
      expect(metric.metrics).toEqual(metricData.metrics);
      expect(metric.type).toEqual(metricData.type);
      expect(metric.username).toEqual(metricData.username);
    });

    it('should create a new twit metric', async () => {
      const metricsRepository = new MetricsRepository(pool);

      const metricData: MetricDataDto = {
        type: 'twit',
        createdAt: new Date('2024-11-10'),
        username: 'testuser',
        metrics: {}
      };

      const metric = await metricsRepository.createMetric(metricData);
      expect(metric).toBeDefined();
      expect(metric.createdAt).toEqual(metricData.createdAt);
      expect(metric.metrics).toEqual(metricData.metrics);
      expect(metric.type).toEqual(metricData.type);
      expect(metric.username).toEqual(metricData.username);
    });

    it('should create a new like metric', async () => {
      const metricsRepository = new MetricsRepository(pool);

      const metricData: MetricDataDto = {
        type: 'like',
        createdAt: new Date('2024-11-10'),
        username: 'testuser',
        metrics: {}
      };

      const metric = await metricsRepository.createMetric(metricData);
      expect(metric).toBeDefined();
      expect(metric.createdAt).toEqual(metricData.createdAt);
      expect(metric.metrics).toEqual(metricData.metrics);
      expect(metric.type).toEqual(metricData.type);
      expect(metric.username).toEqual(metricData.username);
    });

    it('should create a new retwit metric', async () => {
      const metricsRepository = new MetricsRepository(pool);

      const metricData: MetricDataDto = {
        type: 'retwit',
        createdAt: new Date('2024-11-10'),
        username: 'testuser',
        metrics: {}
      };

      const metric = await metricsRepository.createMetric(metricData);
      expect(metric).toBeDefined();
      expect(metric.createdAt).toEqual(metricData.createdAt);
      expect(metric.metrics).toEqual(metricData.metrics);
      expect(metric.type).toEqual(metricData.type);
      expect(metric.username).toEqual(metricData.username);
    });

    it('should create a new comment metric', async () => {
      const metricsRepository = new MetricsRepository(pool);

      const metricData: MetricDataDto = {
        type: 'comment',
        createdAt: new Date('2024-11-10'),
        username: 'testuser',
        metrics: {}
      };

      const metric = await metricsRepository.createMetric(metricData);
      expect(metric).toBeDefined();
      expect(metric.createdAt).toEqual(metricData.createdAt);
      expect(metric.metrics).toEqual(metricData.metrics);
      expect(metric.type).toEqual(metricData.type);
      expect(metric.username).toEqual(metricData.username);
    });

    it('should create a new metric with location', async () => {
      const metricsRepository = new MetricsRepository(pool);

      const metricData: MetricDataDto = {
        type: 'location',
        createdAt: new Date('2024-11-10'),
        username: 'testuser',
        metrics: {
          latitude: 10,
          longitude: 10
        }
      };

      const metric = await metricsRepository.createMetric(metricData);
      expect(metric).toBeDefined();
      expect(metric.createdAt).toEqual(metricData.createdAt);
      expect(metric.metrics).toEqual(metricData.metrics);
      expect(metric.type).toEqual(metricData.type);
      expect(metric.username).toEqual(metricData.username);
    });

    it('should create a new metric with follow', async () => {
      const metricsRepository = new MetricsRepository(pool);

      const metricData: MetricDataDto = {
        type: 'follow',
        createdAt: new Date('2024-11-10'),
        username: 'testuser',
        metrics: {}
      };

      const metric = await metricsRepository.createMetric(metricData);
      expect(metric).toBeDefined();
      expect(metric.createdAt).toEqual(metricData.createdAt);
      expect(metric.metrics).toEqual(metricData.metrics);
      expect(metric.type).toEqual(metricData.type);
      expect(metric.username).toEqual(metricData.username);
    });
  });

  describe('getRegisterMetrics', () => {
    it('should return register metrics', async () => {
      const metricsRepository = new MetricsRepository(pool);

      const metricData: MetricDataDto = {
        type: 'register',
        createdAt: new Date(),
        username: 'testuser',
        metrics: {
          success: true,
          event_time: 1000
        }
      };

      await metricsRepository.createMetric(metricData);
      const metrics = await metricsRepository.getRegisterMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.length).toBeGreaterThan(0);
      expect(metrics[0].date.toISOString().split('T')[0]).toBe(
        metricData.createdAt.toISOString().split('T')[0]
      );
      expect(metrics[0].registerUsers).toBe(1);
      expect(metrics[0].averageRegistrationTime).toBe(1000);
      expect(metrics[0].successRate).toBe(1);
    });

    it('should return multiples register metrics', async () => {
      const metricsRepository = new MetricsRepository(pool);

      const metricData: MetricDataDto = {
        type: 'register',
        createdAt: new Date(),
        username: 'testuser',
        metrics: {
          success: true,
          event_time: 1000
        }
      };

      await metricsRepository.createMetric(metricData);
      await metricsRepository.createMetric(metricData);
      await metricsRepository.createMetric(metricData);

      const metrics = await metricsRepository.getRegisterMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.length).toBeGreaterThan(0);
      expect(metrics[0].date.toISOString().split('T')[0]).toBe(
        metricData.createdAt.toISOString().split('T')[0]
      );
      expect(metrics[0].registerUsers).toBe(3);
      expect(metrics[0].averageRegistrationTime).toBe(1000);
      expect(metrics[0].successRate).toBe(1);
    });

    it('should return register metrics with provider', async () => {
      const metricsRepository = new MetricsRepository(pool);

      const metricData: MetricDataDto = {
        type: 'register_with_provider',
        createdAt: new Date(),
        username: 'testuser',
        metrics: {}
      };

      await metricsRepository.createMetric(metricData);
      const metrics = await metricsRepository.getRegisterWithProviderMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.length).toBeGreaterThan(0);
      expect(metrics[0].date.toISOString().split('T')[0]).toBe(
        metricData.createdAt.toISOString().split('T')[0]
      );
      expect(metrics[0].successfulRegisters).toBe(0);
      expect(metrics[0].successfulRegistersWithProvider).toBe(1);
    });

    it('should return login metrics', async () => {
      const metricsRepository = new MetricsRepository(pool);

      const metricData: MetricDataDto = {
        type: 'login',
        createdAt: new Date(),
        username: 'testuser',
        metrics: {
          success: true,
          event_time: 1000
        }
      };

      await metricsRepository.createMetric(metricData);
      const metrics = await metricsRepository.getLoginMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.length).toBeGreaterThan(0);
      expect(metrics[0].date.toISOString().split('T')[0]).toBe(
        metricData.createdAt.toISOString().split('T')[0]
      );
      expect(metrics[0].loginUsers).toBe(1);
      expect(metrics[0].successfulLogins).toBe(1);
      expect(metrics[0].failedLoginAttempts).toBeDefined();
      expect(metrics[0].averageLoginTime).toBeDefined();
    });

    it('should return login with provider metrics', async () => {
      const metricsRepository = new MetricsRepository(pool);

      const metricData: MetricDataDto = {
        type: 'login_with_provider',
        createdAt: new Date(),
        username: 'testuser',
        metrics: {
          success: true
        }
      };

      await metricsRepository.createMetric(metricData);
      const metrics = await metricsRepository.getLoginWithProviderMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.length).toBeGreaterThan(0);
      expect(metrics[0].date.toISOString().split('T')[0]).toBe(
        metricData.createdAt.toISOString().split('T')[0]
      );
      expect(metrics[0].successfulLogins).toBeDefined();
      expect(metrics[0].successfulLoginsWithProvider).toBeDefined();
    });

    it('should return blocked metrics', async () => {
      const metricsRepository = new MetricsRepository(pool);

      const metricData: MetricDataDto = {
        type: 'blocked',
        createdAt: new Date(),
        username: 'testuser',
        metrics: {
          blocked: true
        }
      };

      await metricsRepository.createMetric(metricData);
      const metrics = await metricsRepository.getBlockedMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.length).toBeGreaterThan(0);
      expect(metrics[0].date.toISOString().split('T')[0]).toBe(
        metricData.createdAt.toISOString().split('T')[0]
      );
      expect(metrics[0].blockedUsers).toBeDefined();
    });

    it('should return twit metrics by username', async () => {
      const metricsRepository = new MetricsRepository(pool);

      const metricData: MetricDataDto = {
        type: 'twit',
        createdAt: new Date(),
        username: 'testuser',
        metrics: {}
      };

      await metricsRepository.createMetric(metricData);
      const metrics = await metricsRepository.getTwitMetricsByUsername('testuser', 'week');
      expect(metrics).toBeDefined();
      expect(metrics.length).toBeGreaterThan(0);
      expect(metrics[0].date.toISOString().split('T')[0]).toBe(
        metricData.createdAt.toISOString().split('T')[0]
      );
      expect(metrics[0].amount).toBeDefined();
    });

    it('should return many twit metrics by username', async () => {
      const metricsRepository = new MetricsRepository(pool);

      const metricData: MetricDataDto = {
        type: 'twit',
        createdAt: new Date(),
        username: 'testuser',
        metrics: {}
      };

      await metricsRepository.createMetric(metricData);
      await metricsRepository.createMetric(metricData);
      await metricsRepository.createMetric(metricData);

      const metrics = await metricsRepository.getTwitMetricsByUsername('testuser', 'week');
      expect(metrics).toBeDefined();
      expect(metrics.length).toBeGreaterThan(0);
      expect(metrics[0].date.toISOString().split('T')[0]).toBe(
        metricData.createdAt.toISOString().split('T')[0]
      );
      expect(metrics[0].amount).toBe(3);
    });

    it('should return many twit metrics by username and date', async () => {
      const metricsRepository = new MetricsRepository(pool);

      const aMetricData: MetricDataDto = {
        type: 'twit',
        createdAt: new Date('2024-11-21'),
        username: 'testuser',
        metrics: {}
      };

      const anotherMetricData: MetricDataDto = {
        type: 'twit',
        createdAt: new Date('2024-11-22'),
        username: 'testuser',
        metrics: {}
      };

      await metricsRepository.createMetric(aMetricData);
      await metricsRepository.createMetric(aMetricData);
      await metricsRepository.createMetric(anotherMetricData);

      const actualDate = new Date('2024-11-21');

      const metrics = await metricsRepository.getTwitMetricsByUsername(
        'testuser',
        'week',
        actualDate
      );
      console.log('metrics: ', metrics);
      expect(metrics).toBeDefined();
      expect(metrics.length).toBeGreaterThan(0);
      expect(metrics[0].date.toISOString().split('T')[0]).toBe(
        aMetricData.createdAt.toISOString().split('T')[0]
      );
      expect(metrics[1].date.toISOString().split('T')[0]).toBe(
        anotherMetricData.createdAt.toISOString().split('T')[0]
      );
      expect(metrics[0].amount).toBe(2);
      expect(metrics[1].amount).toBe(1);
    });

    it('should return like metrics by username', async () => {
      const metricsRepository = new MetricsRepository(pool);

      const metricData: MetricDataDto = {
        type: 'like',
        createdAt: new Date(),
        username: 'testuser',
        metrics: {}
      };

      await metricsRepository.createMetric(metricData);
      const metrics = await metricsRepository.getLikeMetricsByUsername('testuser', 'week');
      expect(metrics).toBeDefined();
      expect(metrics.length).toBeGreaterThan(0);
      expect(metrics[0].date.toISOString().split('T')[0]).toBe(
        metricData.createdAt.toISOString().split('T')[0]
      );
      expect(metrics[0].amount).toBe(1);
    });

    it('should return retwit metrics by username', async () => {
      const metricsRepository = new MetricsRepository(pool);

      const metricData: MetricDataDto = {
        type: 'retwit',
        createdAt: new Date(),
        username: 'testuser',
        metrics: {}
      };

      await metricsRepository.createMetric(metricData);
      const metrics = await metricsRepository.getRetwitMetricsByUsername('testuser', 'week');
      expect(metrics).toBeDefined();
      expect(metrics.length).toBeGreaterThan(0);
      expect(metrics[0].date.toISOString().split('T')[0]).toBe(
        metricData.createdAt.toISOString().split('T')[0]
      );
      expect(metrics[0].amount).toBe(1);
    });

    it('should return comment metrics by username', async () => {
      const metricsRepository = new MetricsRepository(pool);

      const metricData: MetricDataDto = {
        type: 'comment',
        createdAt: new Date(),
        username: 'testuser',
        metrics: {}
      };

      await metricsRepository.createMetric(metricData);
      const metrics = await metricsRepository.getCommentMetricsByUsername('testuser', 'week');
      expect(metrics).toBeDefined();
      expect(metrics.length).toBeGreaterThan(0);
      expect(metrics[0].date.toISOString().split('T')[0]).toBe(
        metricData.createdAt.toISOString().split('T')[0]
      );
      expect(metrics[0].amount).toBe(1);
    });

    it('should return only metrics from the last week', async () => {
      const metricsRepository = new MetricsRepository(pool);

      const baseDate = new Date('2024-11-12');
      const nextWeek = new Date(baseDate);
      nextWeek.setDate(baseDate.getDate() + 7);

      const metricData: MetricDataDto = {
        type: 'twit',
        createdAt: baseDate,
        username: 'testuser',
        metrics: {}
      };

      const anotherMetricData: MetricDataDto = {
        type: 'twit',
        createdAt: nextWeek,
        username: 'testuser',
        metrics: {}
      };
      await metricsRepository.createMetric(metricData);
      await metricsRepository.createMetric(metricData);
      await metricsRepository.createMetric(anotherMetricData);

      const metrics = await metricsRepository.getTwitMetricsByUsername(
        'testuser',
        'week',
        baseDate
      );
      expect(metrics).toBeDefined();
      expect(metrics.length).toBe(1);
      expect(metrics[0].date.toISOString().split('T')[0]).toBe(
        metricData.createdAt.toISOString().split('T')[0]
      );
      expect(metrics[0].amount).toBe(2);
    });

    it('should return metrics only from last month', async () => {
      const metricsRepository = new MetricsRepository(pool);

      const baseDate = new Date('2024-11-12');
      const nextMonth = new Date(baseDate);
      nextMonth.setDate(baseDate.getDate() + 30);

      const metricData: MetricDataDto = {
        type: 'twit',
        createdAt: baseDate,
        username: 'testuser',
        metrics: {}
      };

      const anotherMetricData: MetricDataDto = {
        type: 'twit',
        createdAt: nextMonth,
        username: 'testuser',
        metrics: {}
      };
      await metricsRepository.createMetric(metricData);
      await metricsRepository.createMetric(metricData);
      await metricsRepository.createMetric(anotherMetricData);

      const metrics = await metricsRepository.getTwitMetricsByUsername(
        'testuser',
        'month',
        baseDate
      );
      expect(metrics).toBeDefined();
      expect(metrics.length).toBe(1);
      expect(metrics[0].date.toISOString().split('T')[0]).toBe(
        metricData.createdAt.toISOString().split('T')[0]
      );
      expect(metrics[0].amount).toBe(2);
    });

    it('should return metrics only from last year', async () => {
      const metricsRepository = new MetricsRepository(pool);

      const baseDate = new Date('2024-11-12');
      const nextYear = new Date(baseDate);
      nextYear.setDate(baseDate.getDate() + 365);

      const metricData: MetricDataDto = {
        type: 'twit',
        createdAt: baseDate,
        username: 'testuser',
        metrics: {}
      };

      const anotherMetricData: MetricDataDto = {
        type: 'twit',
        createdAt: nextYear,
        username: 'testuser',
        metrics: {}
      };

      await metricsRepository.createMetric(metricData);
      await metricsRepository.createMetric(anotherMetricData);

      const metrics = await metricsRepository.getTwitMetricsByUsername(
        'testuser',
        'year',
        baseDate
      );
      expect(metrics).toBeDefined();
      expect(metrics.length).toBe(1);

      expect(metrics[0].date.toISOString().split('T')[0]).toBe(
        metricData.createdAt.toISOString().split('T')[0]
      );
      expect(metrics[0].amount).toBe(1);
    });

    it('should return metrics only from last week with the name of the day', async () => {
      const metricsRepository = new MetricsRepository(pool);

      const baseDate = new Date('2024-11-22');

      const metricData: MetricDataDto = {
        type: 'twit',
        createdAt: baseDate,
        username: 'testuser',
        metrics: {}
      };

      await metricsRepository.createMetric(metricData);
      await metricsRepository.createMetric(metricData);

      const metrics = await metricsRepository.getTwitMetricsByUsername(
        'testuser',
        'week',
        baseDate
      );
      expect(metrics).toBeDefined();
      expect(metrics.length).toBe(1);

      expect(metrics[0].date.toISOString().split('T')[0]).toBe(
        baseDate.toISOString().split('T')[0]
      );
      expect(metrics[0].dateName).toBe('Friday');
      expect(metrics[0].amount).toBe(2);
    });

    it('should return metrics with the country', async () => {
      const metricsRepository = new MetricsRepository(pool);

      const metricData: MetricDataDto = {
        type: 'location',
        createdAt: new Date(),
        username: 'testuser',
        metrics: {
          country: 'United States'
        }
      };

      await metricsRepository.createMetric(metricData);
      const metrics = await metricsRepository.getLocationMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.length).toBeGreaterThan(0);
      expect(metrics[0].country).toBe('United States');
      expect(metrics[0].amount).toBe(1);
    });

    it('should return metrics group by the country', async () => {
      const metricsRepository = new MetricsRepository(pool);

      const metricData: MetricDataDto = {
        type: 'location',
        createdAt: new Date(),
        username: 'testuser',
        metrics: {
          country: 'United States'
        }
      };

      const anotherMetricData: MetricDataDto = {
        type: 'location',
        createdAt: new Date(),
        username: 'testuser',
        metrics: {
          country: 'Argentina'
        }
      };

      await metricsRepository.createMetric(metricData);
      await metricsRepository.createMetric(metricData);
      await metricsRepository.createMetric(anotherMetricData);

      const metrics = await metricsRepository.getLocationMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.length).toBe(2);
      expect(metrics[0].country).toBe('Argentina');
      expect(metrics[1].country).toBe('United States');
      expect(metrics[0].amount).toBe(1);
      expect(metrics[1].amount).toBe(2);
    });

    it('should return complete follow metrics by username in the same date', async () => {
      const metricsRepository = new MetricsRepository(pool);

      const metricData: MetricDataDto = {
        type: 'follow',
        createdAt: new Date(),
        username: 'testuser',
        metrics: {
          followed: true,
          amount: 1
        }
      };

      await metricsRepository.createMetric(metricData);
      await metricsRepository.createMetric(metricData);
      await metricsRepository.createMetric(metricData);

      const metrics = await metricsRepository.getFollowersMetrics('testuser', 'week');
      expect(metrics).toBeDefined();
      expect(metrics.total).toBe(3);
      expect(metrics.follows[0].date.toISOString().split('T')[0]).toBe(
        metricData.createdAt.toISOString().split('T')[0]
      );
      expect(metrics.follows[0].amount).toBe(3);
    });

    it('should return complete follow metrics by username in different dates', async () => {
      const metricsRepository = new MetricsRepository(pool);
      const today = new Date('2024-11-10');
      const yesterday = new Date('2024-11-9');

      const metricData: MetricDataDto = {
        type: 'follow',
        createdAt: today,
        username: 'testuser',
        metrics: {
          followed: true,
          amount: 1
        }
      };

      const anotherMetricData: MetricDataDto = {
        type: 'follow',
        createdAt: yesterday,
        username: 'testuser',
        metrics: {
          followed: true,
          amount: 1
        }
      };

      await metricsRepository.createMetric(metricData);
      await metricsRepository.createMetric(metricData);
      await metricsRepository.createMetric(anotherMetricData);



      const metrics = await metricsRepository.getFollowersMetrics('testuser', 'week', today);
      expect(metrics).toBeDefined();
      expect(metrics.total).toBe(3);
      expect(metrics.follows[0].date.toISOString().split('T')[0]).toBe(
        anotherMetricData.createdAt.toISOString().split('T')[0]
      );
      expect(metrics.follows[0].amount).toBe(1);

      expect(metrics.follows[1].date.toISOString().split('T')[0]).toBe(
        metricData.createdAt.toISOString().split('T')[0]
      );
      expect(metrics.follows[1].amount).toBe(2);
    });

    it('should return complete follow metrics by username in different dates with an unfollow action', async () => {
      const metricsRepository = new MetricsRepository(pool);
      const today = new Date('2024-11-10');

      const metricData: MetricDataDto = {
        type: 'follow',
        createdAt: today,
        username: 'testuser',
        metrics: {
          followed: true,
          amount: 1
        }
      };

      const anotherMetricData: MetricDataDto = {
        type: 'follow',
        createdAt: today,
        username: 'testuser',
        metrics: {
          followed: false,
          amount: 1
        }
      };

      await metricsRepository.createMetric(metricData);
      await metricsRepository.createMetric(anotherMetricData);


      const metrics = await metricsRepository.getFollowersMetrics('testuser', 'week', today);
      expect(metrics).toBeDefined();
      expect(metrics.total).toBe(0);
      expect(metrics.follows[0].date.toISOString().split('T')[0]).toBe(
        anotherMetricData.createdAt.toISOString().split('T')[0]
      );
      expect(metrics.follows[0].amount).toBe(1);

    });

    it('should fetch all twits if all is pass by parameter in dateRange', async () => {
      const metricsRepository = new MetricsRepository(pool);
      const metricData: MetricDataDto = {
        type: 'twit',
        createdAt: new Date(),
        username: 'testuser',
        metrics: {}
      };

      await metricsRepository.createMetric(metricData);
      await metricsRepository.createMetric(metricData);
      await metricsRepository.createMetric(metricData);
      const metrics = await metricsRepository.getTwitMetricsByUsername('testuser', 'all');
      expect(metrics).toBeDefined();
      expect(metrics.length).toBe(1);
      expect(metrics[0].date.toISOString().split('T')[0]).toBe(
        metricData.createdAt.toISOString().split('T')[0]
      );
      expect(metrics[0].amount).toBe(3);
    });

    it('should get auth twits metrics', async () => {
      const metricsRepository = new MetricsRepository(pool);
      const metricData: MetricDataDto = {
        type: 'twit',
        createdAt: new Date(),
        username: 'testuser',
        metrics: {}
      };

      await metricsRepository.createMetric(metricData);
      await metricsRepository.createMetric(metricData);
      await metricsRepository.createMetric(metricData);
      const metrics = await metricsRepository.getTwitsAuthMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.total).toBe(3);
      expect(metrics.twits.length).toBe(1);
      expect(metrics.twits[0].amount).toBe(3);
    })

    it('should get hashtag metrics', async () => {
      const metricsRepository = new MetricsRepository(pool);
      const metricData: MetricDataDto = {
        type: 'hashtag',
        createdAt: new Date(),
        username: 'testuser',
        metrics: {hashtag: 'test'}
      };

      await metricsRepository.createMetric(metricData);
      const metrics = await metricsRepository.getHashtagMetrics();
      expect(metrics).toBeDefined();
      expect(metrics[0].amount).toBe(1);
      expect(metrics[0].hashtag).toBe('test');
      expect(metrics.length).toBe(1);
    });

    it('should get hashtag metrics by date and by hashtag type', async () => {
      const metricsRepository = new MetricsRepository(pool);
      const metricData: MetricDataDto = {
        type: 'hashtag',
        createdAt: new Date("2024-11-29"),
        username: 'testuser',
        metrics: {hashtag: 'test'}
      };

      const anotherMetricData: MetricDataDto = {
        type: 'hashtag',
        createdAt: new Date("2024-11-29"),
        username: 'testuser',
        metrics: {hashtag: 'test2'}
      };

      const thirdMetricData: MetricDataDto = {
        type: 'hashtag',
        createdAt: new Date(),
        username: 'testuser',
        metrics: {hashtag: 'test2'}
      };

      await metricsRepository.createMetric(metricData);
      await metricsRepository.createMetric(metricData);
      await metricsRepository.createMetric(anotherMetricData);
      await metricsRepository.createMetric(thirdMetricData);


      const metrics = await metricsRepository.getHashtagMetrics();
      expect(metrics).toBeDefined();
      expect(metrics[0].amount).toBe(2);
      expect(metrics[0].hashtag).toBe('test');
      expect(metrics[0].date.toISOString().split('T')[0]).toBe(
        metricData.createdAt.toISOString().split('T')[0]
      );
      expect(metrics[1].hashtag).toBe('test2');
      expect(metrics[1].amount).toBe(1);
      expect(metrics[1].date.toISOString().split('T')[0]).toBe(
        anotherMetricData.createdAt.toISOString().split('T')[0]
      );
      expect(metrics[2].hashtag).toBe('test2');
      expect(metrics[2].amount).toBe(1);
      expect(metrics[2].date.toISOString().split('T')[0]).toBe(
        thirdMetricData.createdAt.toISOString().split('T')[0]
      );

      expect(metrics.length).toBe(3);
    });

  });
});
