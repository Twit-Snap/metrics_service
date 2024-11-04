import {MetricService} from '../service/service';
import {MetricDataDto} from "../types/metric";
import {NextFunction, Request, Response} from 'express';



export class MetricController {
    private metricService: MetricService;

    constructor(metricService?: MetricService) {
        this.metricService = metricService || new MetricService();
    }

    async createMetrics(req: Request, res: Response, next: NextFunction) {
        try{
            const metricsData: MetricDataDto = req.body;
            const metric = await this.metricService.createMetrics(metricsData);
            res.status(201).json({data: metric});

        } catch (error) {
            next(error);
        }
    }
}