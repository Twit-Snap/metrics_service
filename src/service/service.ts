import {MetricsRepository}  from "../repository/repository";
import {MetricDataDto, Metric, RegisterMetric} from "../types/metric";


export class MetricService {
    private metricsRepository: MetricsRepository;

    constructor(metricsRepository?: MetricsRepository) {
        this.metricsRepository = metricsRepository || new MetricsRepository();
    }

    async createMetrics(metricsData: MetricDataDto): Promise<Metric> {
        return this.metricsRepository.createMetric(metricsData);
    }

    async getRegisterMetrics(): Promise<RegisterMetric[]> {
        return this.metricsRepository.getRegisterMetrics();
    }
}