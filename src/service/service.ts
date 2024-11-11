import {MetricsRepository}  from "../repository/repository";
import {
    MetricDataDto,
    Metric,
    RegisterMetric,
    RegisterFederatedIdentityMetric,
    Params,
    LoginMetric, LoginWithProviderMetric,
    BlockedMetric
} from "../types/metric";


export class MetricService {
    private metricsRepository: MetricsRepository;

    constructor(metricsRepository?: MetricsRepository) {
        this.metricsRepository = metricsRepository || new MetricsRepository();
    }

    async createMetrics(metricsData: MetricDataDto): Promise<Metric> {
        return this.metricsRepository.createMetric(metricsData);
    }

    async getMetrics(params: Params): Promise<RegisterMetric[] | RegisterFederatedIdentityMetric[] | LoginMetric[] | LoginWithProviderMetric[] | BlockedMetric[] > {
        let metrics: RegisterMetric[] | RegisterFederatedIdentityMetric[] | LoginMetric[] | LoginWithProviderMetric[] | BlockedMetric[] = [];

        if(params.type == 'register'){
            metrics = await this.metricsRepository.getRegisterMetrics();
        }else if (params.type == 'register_with_provider'){
             metrics = await this.metricsRepository.getRegisterWithProviderMetrics();
             console.log(metrics);
        }else if(params.type == 'login'){
             metrics = await this.metricsRepository.getLoginMetrics();
        }else if(params.type == 'login_with_provider'){
             metrics = await this.metricsRepository.getLoginWithProviderMetrics();
        }else if(params.type == 'blocked') {
            metrics = await this.metricsRepository.getBlockedMetrics();
        }

        return metrics
    }
}