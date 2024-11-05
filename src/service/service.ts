import {MetricsRepository}  from "../repository/repository";
import {MetricDataDto, Metric, RegisterMetric, RegisterFederatedIdentityMetric, Params} from "../types/metric";


export class MetricService {
    private metricsRepository: MetricsRepository;

    constructor(metricsRepository?: MetricsRepository) {
        this.metricsRepository = metricsRepository || new MetricsRepository();
    }

    async createMetrics(metricsData: MetricDataDto): Promise<Metric> {
        return this.metricsRepository.createMetric(metricsData);
    }

    async getMetrics(params: Params): Promise<RegisterMetric[] | RegisterFederatedIdentityMetric[]> {

        if(params.type == 'register'){
            return this.metricsRepository.getRegisterMetrics();
        }else{
            return this.metricsRepository.getFederatedIdentityMetrics();
        }
    }
}