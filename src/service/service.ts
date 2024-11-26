import { MetricsRepository } from '../repository/repository';
import {
  MetricDataDto,
  Metric,
  RegisterMetric,
  RegisterWithProviderMetric,
  Params,
  LoginMetric,
  LoginWithProviderMetric,
  BlockedMetric,
  TwitMetric,
  LocationMetric,
  FollowMetric, TotalFollowMetric
} from '../types/metric';
import axios from 'axios';
import { ServiceUnavailableError } from '../types/customErrors';

export class MetricService {
  private metricsRepository: MetricsRepository;

  constructor(metricsRepository?: MetricsRepository) {
    this.metricsRepository = metricsRepository || new MetricsRepository();
  }

  async createMetrics(metricsData: MetricDataDto): Promise<Metric> {
    if (metricsData.type == 'location') {
      try {
        const country = await axios.get(
          `${process.env.NOMINATIM_URL ?? 'https://nominatim.openstreetmap.org/reverse'}`,
          {
            params: {
              lat: metricsData.metrics.latitude,
              lon: metricsData.metrics.longitude,
              format: 'json'
            }
          }
        );
        metricsData.metrics.country = country.data.address.country;
      } catch (error) {
        console.error(error);
        throw new ServiceUnavailableError();
      }
    }
    return await this.metricsRepository.createMetric(metricsData);
  }

  async getMetrics(
    params: Params
  ): Promise<
    | RegisterMetric[]
    | RegisterWithProviderMetric[]
    | LoginMetric[]
    | LoginWithProviderMetric[]
    | BlockedMetric[]
    | TwitMetric[]
    | LocationMetric[]
    | TotalFollowMetric
  > {
    let metrics:
      | RegisterMetric[]
      | RegisterWithProviderMetric[]
      | LoginMetric[]
      | LoginWithProviderMetric[]
      | BlockedMetric[]
      | TwitMetric[]
      | LocationMetric[]
      | TotalFollowMetric = [];

    if (params.type == 'register') {
      metrics = await this.metricsRepository.getRegisterMetrics();
    } else if (params.type == 'register_with_provider') {
      metrics = await this.metricsRepository.getRegisterWithProviderMetrics();
    } else if (params.type == 'login') {
      metrics = await this.metricsRepository.getLoginMetrics();
    } else if (params.type == 'login_with_provider') {
      metrics = await this.metricsRepository.getLoginWithProviderMetrics();
    } else if (params.type == 'blocked') {
      metrics = await this.metricsRepository.getBlockedMetrics();
    } else if (params.type == 'twit') {
      metrics = await this.metricsRepository.getTwitMetricsByUsername(
        params.username,
        params.dateRange
      );
    } else if (params.type == 'like') {
      metrics = await this.metricsRepository.getLikeMetricsByUsername(
        params.username,
        params.dateRange
      );
    } else if (params.type == 'retwit') {
      metrics = await this.metricsRepository.getRetwitMetricsByUsername(
        params.username,
        params.dateRange
      );
    } else if (params.type == 'comment') {
      metrics = await this.metricsRepository.getCommentMetricsByUsername(
        params.username,
        params.dateRange
      );
    } else if (params.type == 'location') {
      metrics = await this.metricsRepository.getLocationMetrics();
    } else if (params.type == 'follow') {
      metrics = await this.metricsRepository.getFollowersMetrics(
        params.username,
        params.dateRange
      );
    }

    return metrics;
  }
}
