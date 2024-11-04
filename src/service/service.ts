import {MetricsRepository}  from "../repository/repository";
import {MetricDataDto, Metric} from "../types/metric";


export class MetricService {
    private metricsRepository: MetricsRepository;

    constructor(metricsRepository?: MetricsRepository) {
        this.metricsRepository = metricsRepository || new MetricsRepository();
    }

    async createMetrics(metricsData: MetricDataDto): Promise<Metric> {
        return this.metricsRepository.createMetric(metricsData);
    }
}