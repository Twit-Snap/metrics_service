import {MetricsRepository}  from "../repository/repository";
import {
    MetricDataDto,
    Metric,
    RegisterMetric,
    RegisterFederatedIdentityMetric,
    Params,
    LoginMetric, LoginWithProviderMetric
} from "../types/metric";


export class MetricService {
    private metricsRepository: MetricsRepository;

    constructor(metricsRepository?: MetricsRepository) {
        this.metricsRepository = metricsRepository || new MetricsRepository();
    }

    async createMetrics(metricsData: MetricDataDto): Promise<Metric> {
        return this.metricsRepository.createMetric(metricsData);
    }

    async getMetrics(params: Params): Promise<RegisterMetric[] | RegisterFederatedIdentityMetric[] | LoginMetric[] | LoginWithProviderMetric[]> {
        let metrics: RegisterMetric[] | RegisterFederatedIdentityMetric[] | LoginMetric[] | LoginWithProviderMetric[];

        if(params.type == 'register'){
            metrics = await this.metricsRepository.getRegisterMetrics();
        }else if (params.type == 'register_with_provider'){
             metrics = await this.metricsRepository.getRegisterWithProviderMetrics();
        }else if(params.type == 'login'){
             metrics = await this.metricsRepository.getLoginMetrics();
        }else{ //login_with_provider
             metrics = await this.metricsRepository.getLoginWithProviderMetrics();
        }
        return metrics
    }
}