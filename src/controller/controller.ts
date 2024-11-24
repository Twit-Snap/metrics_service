import { MetricService } from '../service/service';
import { DateRange, MetricDataDto, ParamType, PARAM_TYPES } from '../types/metric';
import { NextFunction, Request, Response } from 'express';
import { ValidationError } from '../types/customErrors';
import { Params } from '../types/metric';

export class MetricController {
  private metricService: MetricService;

  constructor(metricService?: MetricService) {
    this.metricService = metricService || new MetricService();
  }

  async createMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const metricsData: MetricDataDto = req.body;
      this.validateParameters(metricsData);
      const metric = await this.metricService.createMetrics(metricsData);
      console.log('Successfully created metric', metric);
      res.status(201).json({ data: metric });
    } catch (error) {
      next(error);
    }
  }

  async getMetrics(req: Request, res: Response, next: NextFunction) {
    const validDateRanges: DateRange[] = ['week', 'month', 'year'];
    try {
      const params: Params = {
        type: req.query.type ? req.query.type.toString() : '',
        username: req.query.username ? req.query.username.toString() : '',
        dateRange: validDateRanges.includes(req.query.dateRange?.toString() as DateRange)
          ? (req.query.dateRange?.toString() as DateRange)
          : 'week'
      };
      this.validateTwitMetrics(params);
      this.validateParams(params);
      console.log('params', params);
      const metrics = await this.metricService.getMetrics(params);
      console.log('metrics', metrics);
      res.status(200).json({ data: metrics });
    } catch (error) {
      next(error);
    }
  }

  private validateParameters(metricsData: MetricDataDto) {
    this.validateDate(metricsData.createdAt);

    if (!metricsData.metrics) {
      throw new ValidationError('metrics', 'Invalid metrics', 'INVALID_METRICS');
    }
    if (!metricsData.type) {
      throw new ValidationError('type', 'Invalid type', 'INVALID_TYPE');
    }
    this.validateMetrics(metricsData);
  }

  private validateDate(date: string | Date) {
    if (isNaN(new Date(date).getTime()) || !date) {
      throw new ValidationError('createdAt', 'Invalid createdAt', 'INVALID_CREATED_AT');
    }
  }

  private validateMetrics(metricsData: MetricDataDto) {
    if (metricsData.type === 'register' || metricsData.type === 'login') {
      this.validateNormalMetrics(metricsData.metrics);
    } else if (
      metricsData.type === 'register_with_provider' ||
      metricsData.type === 'twit' ||
      metricsData.type === 'like' ||
      metricsData.type === 'retwit' ||
      metricsData.type === 'comment'
    ) {
      this.validateEmptyBodyMetric(metricsData.metrics);
    } else if (metricsData.type === 'login_with_provider') {
      this.validateLoginWithProviderMetrics(metricsData.metrics);
    } else if (metricsData.type === 'blocked') {
      this.validateBlockedMetrics(metricsData.metrics);
    } else if (metricsData.type === 'location') {
      this.validateLocationMetrics(metricsData);
    } else {
      throw new ValidationError('type', 'Invalid type', 'INVALID_TYPE');
    }
  }


  private isValidCoordinate(latitude: number, longitude: number): boolean {
    const isLatitudeValid = latitude >= -90 && latitude <= 90;
    const isLongitudeValid = longitude >= -180 && longitude <= 180;
    return isLatitudeValid && isLongitudeValid;
  }

  private validateLocationMetrics(metricsData: MetricDataDto) {
    if ('latitude' in metricsData.metrics) {
      if (typeof metricsData.metrics.latitude !== 'number') {
        throw new ValidationError('metrics', '"latitude" must be a number', 'INVALID_LATITUDE');
      }
    } else {
      throw new ValidationError('metrics', '"latitude" is required', 'MISSING_FIELD');
    }
    if ('longitude' in metricsData.metrics) {
      if (typeof metricsData.metrics.longitude !== 'number') {
        throw new ValidationError('metrics', '"longitude" must be a number', 'INVALID_LONGITUDE');
      }
    } else {
      throw new ValidationError('metrics', '"longitude" is required', 'MISSING_FIELD');
    }

    if (!this.isValidCoordinate(metricsData.metrics.latitude, metricsData.metrics.longitude)) {
      throw new ValidationError('metrics', 'Invalid coordinates', 'INVALID_COORDINATES');
    }
  }

  private validateSuccessMetric(metrics: Record<string, string | number | boolean | Date>) {
    if ('success' in metrics) {
      if (typeof metrics.success !== 'boolean') {
        throw new ValidationError('metrics', '"success" must be a boolean', 'INVALID_SUCCESS');
      }
    } else {
      throw new ValidationError('metrics', '"success" is required', 'MISSING_FIELD');
    }
  }

  private validateNormalMetrics(metrics: Record<string, string | number | boolean | Date>) {
    this.validateSuccessMetric(metrics);

    if ('event_time' in metrics) {
      if (typeof metrics.event_time !== 'number') {
        throw new ValidationError('metrics', '"event_time" must be a number', 'INVALID_EVENT_TIME');
      }
    } else {
      throw new ValidationError('metrics', '"event_time" is required', 'MISSING_FIELD');
    }
  }

  private validateEmptyBodyMetric(metrics: Record<string, string | number | boolean | Date>) {
    if (Object.keys(metrics).length != 0) {
      throw new ValidationError('metrics', 'Should not need extra information', 'INVALID_METRICS');
    }
  }

  private validateLoginWithProviderMetrics(
    metrics: Record<string, string | number | boolean | Date>
  ) {
    this.validateSuccessMetric(metrics);
  }

  private validateBlockedMetrics(metrics: Record<string, string | number | boolean | Date>) {
    if ('blocked' in metrics) {
      if (typeof metrics.blocked !== 'boolean') {
        throw new ValidationError('metrics', '"blocked" must be a boolean', 'INVALID_BLOCKED');
      }
    } else {
      throw new ValidationError('metrics', '"blocked" is required', 'MISSING_FIELD');
    }
  }

  private validateTwitMetrics(params: Params) {
    if (
      params.type === 'twit' ||
      params.type === 'like' ||
      params.type === 'retwit' ||
      params.type === 'comment'
    ) {
      if (!params.username) {
        throw new ValidationError('username', 'Username is required', 'MISSING_FIELD');
      }
    }
  }

  private validateParams(params: Params) {
    if (!PARAM_TYPES.includes(params.type as ParamType)) {
      throw new ValidationError('type', 'Invalid type', 'INVALID_TYPE');
    }
  }
}
