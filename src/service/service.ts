import {MetricsRepository}  from "../repository/repository";
import {
    MetricDataDto,
    Metric,
    RegisterMetric,
    RegisterFederatedIdentityMetric,
    Params,
    LoginMetric
} from "../types/metric";


export class MetricService {
    private metricsRepository: MetricsRepository;

    constructor(metricsRepository?: MetricsRepository) {
        this.metricsRepository = metricsRepository || new MetricsRepository();
    }

    async createMetrics(metricsData: MetricDataDto): Promise<Metric> {
        return this.metricsRepository.createMetric(metricsData);
    }

    async getMetrics(params: Params): Promise<RegisterMetric[] | RegisterFederatedIdentityMetric[] | LoginMetric[]> {

        if(params.type == 'register'){
            return this.metricsRepository.getRegisterMetrics();
        }else if (params.type == 'register_with_provider'){
            return this.metricsRepository.getFederatedIdentityMetrics();
        }else{
            return this.metricsRepository.getLoginMetrics()
        }
    }
}