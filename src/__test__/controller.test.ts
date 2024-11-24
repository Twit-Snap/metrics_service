// metrics.controller.test.ts

import request from 'supertest';
import { Pool } from 'pg';
import app from '../app';
import { DatabasePool } from '../repository/db';

describe('Metrics API Tests', () => {
  let pool: Pool;

  beforeAll(async () => {
    pool = DatabasePool.getInstance();
    await pool.query('DELETE FROM metrics');
  });

  afterAll(async () => {
    await pool.query('DELETE FROM metrics');
    await DatabasePool.closePool();
    //process.exit(0);
  });

  beforeEach(async () => {
    await pool.query('DELETE FROM metrics');
  });

  describe('POST /metrics', () => {
    it('should create a register metric', async () => {
      const metricData = {
        type: 'register',
        createdAt: new Date().toISOString(),
        username: 'testuser',
        metrics: {
          success: true,
          event_time: 1000
        }
      };

      const response = await request(app).post('/metrics').send(metricData);

      expect(response.status).toBe(201);
      expect(response.body.data.type).toBe('register');
      expect(response.body.data.username).toBe('testuser');
      expect(response.body.data.createdAt).toBe(metricData.createdAt);
      expect(response.body.data.metrics.success).toBe(true);
      expect(response.body.data.metrics.event_time).toBe(1000);
    });

    it('should create a login metric', async () => {
      const metricData = {
        type: 'login',
        createdAt: new Date().toISOString(),
        username: 'testuser',
        metrics: {
          success: true,
          event_time: 500
        }
      };

      const response = await request(app).post('/metrics').send(metricData);

      expect(response.status).toBe(201);
      expect(response.body.data.type).toBe('login');
      expect(response.body.data.username).toBe('testuser');
      expect(response.body.data.createdAt).toBe(metricData.createdAt);
      expect(response.body.data.metrics.success).toBe(true);
      expect(response.body.data.metrics.event_time).toBe(500);
    });

    it('should create a register with provider metric', async () => {
      const metricData = {
        type: 'register_with_provider',
        createdAt: new Date().toISOString(),
        username: 'testuser',
        metrics: {}
      };

      const response = await request(app).post('/metrics').send(metricData);

      expect(response.status).toBe(201);
      expect(response.body.data.type).toBe('register_with_provider');
      expect(response.body.data.username).toBe('testuser');
      expect(response.body.data.createdAt).toBe(metricData.createdAt);
    });

    it('should create a login with provider metric', async () => {
      const metricData = {
        type: 'login_with_provider',
        createdAt: new Date().toISOString(),
        username: 'testuser',
        metrics: {
          success: true
        }
      };

      const response = await request(app).post('/metrics').send(metricData);

      expect(response.status).toBe(201);
      expect(response.body.data.type).toBe(metricData.type);
      expect(response.body.data.username).toBe('testuser');
      expect(response.body.data.createdAt).toBe(metricData.createdAt);
      expect(response.body.data.metrics.success).toBe(true);
    });

    it('should create a blocked metric', async () => {
      const metricData = {
        type: 'blocked',
        createdAt: new Date().toISOString(),
        username: 'testuser',
        metrics: {
          blocked: true
        }
      };

      const response = await request(app).post('/metrics').send(metricData);

      expect(response.status).toBe(201);
      expect(response.body.data.type).toBe('blocked');
      expect(response.body.data.username).toBe('testuser');
      expect(response.body.data.createdAt).toBe(metricData.createdAt);
    });

    it('should return 400 for invalid metric type', async () => {
      const metricData = {
        type: 'invalid_type',
        createdAt: new Date().toISOString(),
        username: 'testuser',
        metrics: {
          success: true,
          event_time: 500
        }
      };

      const response = await request(app).post('/metrics').send(metricData);

      expect(response.status).toBe(400);
      expect(response.body.detail).toBe('Invalid type');
      expect(response.body.type).toBe('INVALID_TYPE');
    });

    it('should return 400 for missing metrics', async () => {
      const metricData = {
        type: 'register',
        createdAt: new Date().toISOString(),
        username: 'testuser'
      };

      const response = await request(app).post('/metrics').send(metricData);

      expect(response.status).toBe(400);
      expect(response.body.type).toBe('INVALID_METRICS');
      expect(response.body.detail).toBe('Invalid metrics');
    });

    it('should return 400 for missing type', async () => {
      const metricData = {
        createdAt: new Date().toISOString(),
        username: 'testuser',
        metrics: {
          success: true,
          event_time: 500
        }
      };

      const response = await request(app).post('/metrics').send(metricData);

      expect(response.status).toBe(400);
      expect(response.body.type).toBe('INVALID_TYPE');
      expect(response.body.detail).toBe('Invalid type');
    });

    it('should return 400 for invalid createdAt', async () => {
      const metricData = {
        type: 'register',
        createdAt: 'invalid_date',
        username: '',
        metrics: {
          success: true,
          event_time: 500
        }
      };

      const response = await request(app).post('/metrics').send(metricData);

      expect(response.status).toBe(400);
      expect(response.body.type).toBe('INVALID_CREATED_AT');
      expect(response.body.detail).toBe('Invalid createdAt');
    });

    it('should return 400 for invalid success metric', async () => {
      const metricData = {
        type: 'register',
        createdAt: new Date().toISOString(),
        username: 'testuser',
        metrics: {
          success: 'invalid',
          event_time: 500
        }
      };

      const response = await request(app).post('/metrics').send(metricData);

      expect(response.status).toBe(400);
      expect(response.body.type).toBe('INVALID_SUCCESS');
      expect(response.body.detail).toBe('"success" must be a boolean');
    });

    it('should return 400 without success metric', async () => {
      const metricData = {
        type: 'register',
        createdAt: new Date().toISOString(),
        username: 'testuser',
        metrics: {
          event_time: 500
        }
      };

      const response = await request(app).post('/metrics').send(metricData);

      expect(response.status).toBe(400);
      expect(response.body.type).toBe('MISSING_FIELD');
      expect(response.body.detail).toBe('"success" is required');
    });

    it('should return 400 for invalid event_time metric', async () => {
      const metricData = {
        type: 'register',
        createdAt: new Date().toISOString(),
        username: 'testuser',
        metrics: {
          success: true,
          event_time: 'invalid'
        }
      };

      const response = await request(app).post('/metrics').send(metricData);

      expect(response.status).toBe(400);
      expect(response.body.type).toBe('INVALID_EVENT_TIME');
      expect(response.body.detail).toBe('"event_time" must be a number');
    });

    it('should return 400 without event_time metric', async () => {
      const metricData = {
        type: 'register',
        createdAt: new Date().toISOString(),
        username: 'testuser',
        metrics: {
          success: true
        }
      };

      const response = await request(app).post('/metrics').send(metricData);

      expect(response.status).toBe(400);
      expect(response.body.type).toBe('MISSING_FIELD');
      expect(response.body.detail).toBe('"event_time" is required');
    });

    it('should return 400 for invalid success metric with login_with_provider', async () => {
      const metricData = {
        type: 'login_with_provider',
        createdAt: new Date().toISOString(),
        username: 'testuser',
        metrics: {
          success: 'invalid'
        }
      };

      const response = await request(app).post('/metrics').send(metricData);

      expect(response.status).toBe(400);
    });

    it('should return 400 for invalid blocked metric with blocked', async () => {
      const metricData = {
        type: 'blocked',
        createdAt: new Date().toISOString(),
        username: 'testuser',
        metrics: {
          blocked: 'invalid'
        }
      };

      const response = await request(app).post('/metrics').send(metricData);

      expect(response.status).toBe(400);
      expect(response.body.type).toBe('INVALID_BLOCKED');
      expect(response.body.detail).toBe('"blocked" must be a boolean');
    });

    it('should return 400 without blocked metric with type blocked', async () => {
      const metricData = {
        type: 'blocked',
        createdAt: new Date().toISOString(),
        username: 'testuser',
        metrics: {}
      };

      const response = await request(app).post('/metrics').send(metricData);

      expect(response.status).toBe(400);
      expect(response.body.type).toBe('MISSING_FIELD');
      expect(response.body.detail).toBe('"blocked" is required');
    });

    it('should return 400 for invalid metrics with register_with_provider', async () => {
      const metricData = {
        type: 'register_with_provider',
        createdAt: new Date().toISOString(),
        username: 'testuser',
        metrics: {
          invalid: 'invalid'
        }
      };

      const response = await request(app).post('/metrics').send(metricData);

      expect(response.status).toBe(400);
      expect(response.body.type).toBe('INVALID_METRICS');
      expect(response.body.detail).toBe('Should not need extra information');
    });

    it('should create a twit metric', async () => {
      const metricData = {
        type: 'twit',
        createdAt: new Date().toISOString(),
        username: 'testuser',
        metrics: {}
      };

      const response = await request(app).post('/metrics').send(metricData);

      expect(response.status).toBe(201);
      expect(response.body.data.type).toBe('twit');
      expect(response.body.data.username).toBe('testuser');
      expect(response.body.data.createdAt).toBe(metricData.createdAt);
    });

    it('should create a like metric', async () => {
      const metricData = {
        type: 'like',
        createdAt: new Date().toISOString(),
        username: 'testuser',
        metrics: {}
      };

      const response = await request(app).post('/metrics').send(metricData);

      expect(response.status).toBe(201);
      expect(response.body.data.type).toBe('like');
      expect(response.body.data.username).toBe('testuser');
      expect(response.body.data.createdAt).toBe(metricData.createdAt);
    });

    it('should create a retwit metric', async () => {
      const metricData = {
        type: 'retwit',
        createdAt: new Date().toISOString(),
        username: 'testuser',
        metrics: {}
      };

      const response = await request(app).post('/metrics').send(metricData);

      expect(response.status).toBe(201);
      expect(response.body.data.type).toBe('retwit');
      expect(response.body.data.username).toBe('testuser');
      expect(response.body.data.createdAt).toBe(metricData.createdAt);
    });

    it('should create a comment metric', async () => {
      const metricData = {
        type: 'comment',
        createdAt: new Date().toISOString(),
        username: 'testuser',
        metrics: {}
      };

      const response = await request(app).post('/metrics').send(metricData);

      expect(response.status).toBe(201);
      expect(response.body.data.type).toBe('comment');
      expect(response.body.data.username).toBe('testuser');
      expect(response.body.data.createdAt).toBe(metricData.createdAt);
    });

    it('should return 400 for invalid metrics with twit', async () => {
      const metricData = {
        type: 'twit',
        createdAt: new Date().toISOString(),
        username: 'testuser',
        metrics: {
          invalid: 'invalid'
        }
      };

      const response = await request(app).post('/metrics').send(metricData);

      expect(response.status).toBe(400);
      expect(response.body.type).toBe('INVALID_METRICS');
      expect(response.body.detail).toBe('Should not need extra information');
    });

    it('should return 400 for invalid metrics with like', async () => {
      const metricData = {
        type: 'like',
        createdAt: new Date().toISOString(),
        username: 'testuser',
        metrics: {
          invalid: 'invalid'
        }
      };

      const response = await request(app).post('/metrics').send(metricData);

      expect(response.status).toBe(400);
      expect(response.body.type).toBe('INVALID_METRICS');
      expect(response.body.detail).toBe('Should not need extra information');
    });

    it('should return 400 for invalid metrics with retwit', async () => {
      const metricData = {
        type: 'retwit',
        createdAt: new Date().toISOString(),
        username: 'testuser',
        metrics: {
          invalid: 'invalid'
        }
      };

      const response = await request(app).post('/metrics').send(metricData);

      expect(response.status).toBe(400);
      expect(response.body.type).toBe('INVALID_METRICS');
      expect(response.body.detail).toBe('Should not need extra information');
    });

    it('should create a location metric', async () => {
      const metricData = {
        type: 'location',
        createdAt: new Date().toISOString(),
        username: 'testuser',
        metrics: {
          latitude: -22.9068,
          longitude: -43.1729,
        }
      };

      const response = await request(app).post('/metrics').send(metricData);

      expect(response.status).toBe(201);
      expect(response.body.data.type).toBe('location');
      expect(response.body.data.username).toBe('testuser');
      expect(response.body.data.createdAt).toBe(metricData.createdAt);
      expect(response.body.data.metrics.latitude).toBe(-22.9068);
      expect(response.body.data.metrics.longitude).toBe(-43.1729);
      expect(response.body.data.metrics.country).toBe('Brasil');
    });

    it('should return 400 for invalid metrics with comment', async () => {
      const metricData = {
        type: 'comment',
        createdAt: new Date().toISOString(),
        username: 'testuser',
        metrics: {
          invalid: 'invalid'
        }
      };

      const response = await request(app).post('/metrics').send(metricData);

      expect(response.status).toBe(400);
      expect(response.body.type).toBe('INVALID_METRICS');
      expect(response.body.detail).toBe('Should not need extra information');
    });

    it('should raise 400 if latitude is missing in location metric', async () => {
      const metricData = {
        type: 'location',
        createdAt: new Date().toISOString(),
        username: 'testuser',
        metrics: {
          longitude: 0
        }
      };

      const response = await request(app).post('/metrics').send(metricData);

      expect(response.status).toBe(400);
      expect(response.body.type).toBe('MISSING_FIELD');
      expect(response.body.detail).toBe('"latitude" is required');
    });

    it('should raise 400 if longitude is missing in location metric', async () => {
      const metricData = {
        type: 'location',
        createdAt: new Date().toISOString(),
        username: 'testuser',
        metrics: {
          latitude: 0
        }
      };

      const response = await request(app).post('/metrics').send(metricData);

      expect(response.status).toBe(400);
      expect(response.body.type).toBe('MISSING_FIELD');
      expect(response.body.detail).toBe('"longitude" is required');
    });

    it('should raise 400 if latitude is not a number in location metric', async () => {
      const metricData = {
        type: 'location',
        createdAt: new Date().toISOString(),
        username: 'testuser',
        metrics: {
          latitude: 'invalid',
          longitude: 0
        }
      };

      const response = await request(app).post('/metrics').send(metricData);

      expect(response.status).toBe(400);
      expect(response.body.type).toBe('INVALID_LATITUDE');
      expect(response.body.detail).toBe('"latitude" must be a number');
    });

    it('should raise 400 if longitude is not a number in location metric', async () => {
      const metricData = {
        type: 'location',
        createdAt: new Date().toISOString(),
        username: 'testuser',
        metrics: {
          latitude: 0,
          longitude: 'invalid'
        }
      };

      const response = await request(app).post('/metrics').send(metricData);

      expect(response.status).toBe(400);
      expect(response.body.type).toBe('INVALID_LONGITUDE');
      expect(response.body.detail).toBe('"longitude" must be a number');
    });

  });

  describe('GET /metrics', () => {
    beforeEach(async () => {
      const testData = [
        {
          type: 'register',
          created_at: new Date().toISOString(),
          username: 'user1',
          metrics: { success: true, event_time: 1000 }
        },
        {
          type: 'login',
          created_at: new Date().toISOString(),
          username: 'user1',
          metrics: { success: true, event_time: 500 }
        },
        {
          type: 'register_with_provider',
          created_at: new Date().toISOString(),
          username: 'user2',
          metrics: {}
        },
        {
          type: 'login_with_provider',
          created_at: new Date().toISOString(),
          username: 'user2',
          metrics: { success: true }
        },
        {
          type: 'blocked',
          created_at: new Date().toISOString(),
          username: 'user3',
          metrics: { blocked: true }
        },
        {
          type: 'twit',
          created_at: new Date().toISOString(),
          username: 'user4',
          metrics: {}
        },
        {
          type: 'like',
          created_at: new Date().toISOString(),
          username: 'user4',
          metrics: {}
        },
        {
          type: 'retwit',
          created_at: new Date().toISOString(),
          username: 'user4',
          metrics: {}
        },
        {
          type: 'comment',
          created_at: new Date().toISOString(),
          username: 'user4',
          metrics: {}
        }
      ];

      for (const data of testData) {
        await pool.query(
          'INSERT INTO metrics (metric_type, created_at, username, metrics) VALUES ($1, $2, $3, $4)',
          [data.type, data.created_at, data.username, JSON.stringify(data.metrics)]
        );
      }
    });

    it('should get register metrics', async () => {
      const response = await request(app).get('/metrics').query({ type: 'register' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data[0]).toHaveProperty('date');
      expect(response.body.data[0]).toHaveProperty('registerUsers');
      expect(response.body.data[0]).toHaveProperty('averageRegistrationTime');
      expect(response.body.data[0]).toHaveProperty('successRate');

      expect(response.body.data.length).toBe(1);
    });

    it('should get valid register metrics', async () => {
      const response = await request(app).get('/metrics').query({ type: 'register' });

      expect(response.status).toBe(200);
      expect(response.body.data[0].registerUsers).toBe(1);
      expect(response.body.data[0].averageRegistrationTime).toBe(1000);
      expect(response.body.data[0].successRate).toBe(1);
      expect(response.body.data.length).toBe(1);
    });

    it('should get valid login metrics', async () => {
      const response = await request(app).get('/metrics').query({ type: 'login' });
      console.log(response.body.data[0]);

      expect(response.status).toBe(200);
      expect(response.body.data[0].loginUsers).toBe(1);
      expect(response.body.data[0].successfulLogins).toBe(1);
      expect(response.body.data[0].failedLoginAttempts).toBe(0);
      expect(response.body.data[0].averageLoginTime).toBe(500);
      expect(response.body.data.length).toBe(1);
    });

    it('should get login metrics with correct structure', async () => {
      const response = await request(app).get('/metrics').query({ type: 'login' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data[0]).toHaveProperty('loginUsers');
      expect(response.body.data[0]).toHaveProperty('date');
      expect(response.body.data[0]).toHaveProperty('successfulLogins');
      expect(response.body.data[0]).toHaveProperty('averageLoginTime');
      expect(response.body.data[0]).toHaveProperty('failedLoginAttempts');
    });

    it('should get login with provider metrics', async () => {
      const response = await request(app).get('/metrics').query({ type: 'login_with_provider' });

      console.log(response.body.data[0]);

      expect(response.status).toBe(200);
      expect(response.body.data[0].successfulLogins).toBe(1);
      expect(response.body.data[0].successfulLoginsWithProvider).toBe(1);
      expect(response.body.data.length).toBe(1);
    });

    it('should get login with provider metrics with correct structure', async () => {
      const response = await request(app).get('/metrics').query({ type: 'login_with_provider' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data[0]).toHaveProperty('successfulLogins');
      expect(response.body.data[0]).toHaveProperty('date');
      expect(response.body.data[0]).toHaveProperty('successfulLoginsWithProvider');
    });

    it('should get register with provider metrics', async () => {
      const response = await request(app).get('/metrics').query({ type: 'register_with_provider' });

      expect(response.status).toBe(200);
      expect(response.body.data[0].successfulRegisters).toBe(1);
      expect(response.body.data[0].successfulRegistersWithProvider).toBe(1);
      expect(response.body.data.length).toBe(1);
    });

    it('should get blocked metrics', async () => {
      const response = await request(app).get('/metrics').query({ type: 'blocked' });

      expect(response.status).toBe(200);
      expect(response.body.data[0].blockedUsers).toBe(1);
      expect(response.body.data.length).toBe(1);
    });

    it('should get blocked metrics with correct structure', async () => {
      const response = await request(app).get('/metrics').query({ type: 'blocked' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data[0]).toHaveProperty('blockedUsers');
      expect(response.body.data[0]).toHaveProperty('date');
    });

    it('should get twit metric by username', async () => {
      const response = await request(app)
        .get('/metrics')
        .query({ type: 'twit', username: 'user4' });

      expect(response.status).toBe(200);
      expect(response.body.data[0].amount).toBe(1);
      expect(response.body.data.length).toBe(1);
    });

    it('should get twit metric by username with correct structure', async () => {
      const response = await request(app)
        .get('/metrics')
        .query({ type: 'twit', username: 'user4' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data[0]).toHaveProperty('amount');
      expect(response.body.data[0]).toHaveProperty('date');
    });

    it('should get retwit metric by username', async () => {
      const response = await request(app)
        .get('/metrics')
        .query({ type: 'retwit', username: 'user4' });

      expect(response.status).toBe(200);
      expect(response.body.data[0].amount).toBe(1);
      expect(response.body.data.length).toBe(1);
    });

    it('should get retwit metric by username with correct structure', async () => {
      const response = await request(app)
        .get('/metrics')
        .query({ type: 'retwit', username: 'user4' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data[0]).toHaveProperty('amount');
      expect(response.body.data[0]).toHaveProperty('date');
    });

    it('should get like metric by username', async () => {
      const response = await request(app)
        .get('/metrics')
        .query({ type: 'like', username: 'user4' });

      expect(response.status).toBe(200);
      expect(response.body.data[0].amount).toBe(1);
      expect(response.body.data.length).toBe(1);
    });

    it('should get like metric by username with correct structure', async () => {
      const response = await request(app)
        .get('/metrics')
        .query({ type: 'like', username: 'user4' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data[0]).toHaveProperty('amount');
      expect(response.body.data[0]).toHaveProperty('date');
    });

    it('should get comment metric by username', async () => {
      const response = await request(app)
        .get('/metrics')
        .query({ type: 'comment', username: 'user4' });

      expect(response.status).toBe(200);
      expect(response.body.data[0].amount).toBe(1);
      expect(response.body.data.length).toBe(1);
    });

    it('should get comment metric by username with correct structure', async () => {
      const response = await request(app)
        .get('/metrics')
        .query({ type: 'comment', username: 'user4' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data[0]).toHaveProperty('amount');
      expect(response.body.data[0]).toHaveProperty('date');
    });

    it('should return 400 for undefined username with twit metric', async () => {
      const response = await request(app).get('/metrics').query({ type: 'twit' });

      expect(response.status).toBe(400);
      expect(response.body.type).toBe('MISSING_FIELD');
      expect(response.body.detail).toBe('Username is required');
    });

    it('should handle empty results', async () => {
      await pool.query('DELETE FROM metrics');

      const response = await request(app).get('/metrics').query({ type: 'register' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(0);
    });

    it('should return 400 for invalid type', async () => {
      const response = await request(app).get('/metrics').query({
        type: 'invalid',
        username: 'user4'
      });

      expect(response.status).toBe(400);
      expect(response.body.type).toBe('INVALID_TYPE');
      expect(response.body.detail).toBe('Invalid type');
    });
  });
});
