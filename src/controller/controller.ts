import {MetricService} from '../service/service';
import {MetricDataDto} from "../types/metric";
import {NextFunction, Request, Response} from 'express';
import {ValidationError} from "../types/customErrors";



export class MetricController {
    private metricService: MetricService;

    constructor(metricService?: MetricService) {
        this.metricService = metricService || new MetricService();
    }

    async createMetrics(req: Request, res: Response, next: NextFunction) {
        try{
            const metricsData: MetricDataDto = req.body;
                this.validateParameters(metricsData);
            const metric = await this.metricService.createMetrics(metricsData);
            res.status(201).json({data: metric});

        } catch (error) {
            next(error);
        }
    }

    private validateParameters(metricsData: MetricDataDto) {

        this.validateDate(metricsData.createdAt);

        if (!metricsData.metrics) {
            throw new ValidationError('metrics', 'Invalid metrics', 'INVALID_METRICS');
        }
        if (!metricsData.username) {
            throw new ValidationError('user', 'Invalid user', 'INVALID_USER');
        }
        if (!metricsData.type) {
            throw new ValidationError('type', 'Invalid type', 'INVALID_TYPE');
        }
    }

    private validateDate(date: string | Date) {
        console.log(date);
        if (isNaN(new Date(date).getTime()) || !date) {
            throw new ValidationError('createdAt', 'Invalid createdAt', 'INVALID_CREATED_AT');
        }
    }
}