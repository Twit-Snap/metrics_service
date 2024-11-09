import {MetricService} from '../service/service';
import {MetricDataDto} from "../types/metric";
import {NextFunction, Request, Response} from 'express';
import {ValidationError} from "../types/customErrors";
import {Params} from "../types/metric";


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
            console.log('Successfully created metric', metric);
            res.status(201).json({data: metric});
        } catch (error) {
            next(error);
        }
    }

    async getRegisterMetrics(req: Request, res: Response, next: NextFunction) {
        try {
            const params: Params = {
                type: req.query.type ? req.query.type.toString() : '',
            };
            const metrics = await this.metricService.getMetrics(params);
            res.status(200).json({data: metrics});
        }
        catch (error) {
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
        if (Object.keys(metricsData.metrics).length === 0) {
            throw new ValidationError('metrics', 'Invalid metrics', 'INVALID_METRICS');
        }

        if(metricsData.type === 'register' || metricsData.type === 'login') {
            this.validateNormalMetrics(metricsData.metrics);
        }else if(metricsData.type === 'register_with_provider' ) {
            this.validateRegisterWithProviderMetrics(metricsData.metrics);
        }else if (metricsData.type === 'login_with_provider'){
            this.validateLoginWithProviderMetrics(metricsData.metrics);
        }else if(metricsData.type === 'blocked'){
            this.validateBlockedMetrics(metricsData.metrics);

        }else
         {
            throw new ValidationError('type', 'Invalid type', 'INVALID_TYPE');
        }

    }

    private validateSuccessMetric(metrics: Record<string, never>){
        if ('success' in metrics) {
            if (typeof metrics.success !== 'boolean') {
                throw new ValidationError('metrics', '"success" must be a boolean', 'INVALID_SUCCESS');
            }
        } else {
            throw new ValidationError('metrics', '"success" is required', 'MISSING_FIELD');
        }
    }


    private validateNormalMetrics(metrics: Record<string, never>) {

        this.validateSuccessMetric(metrics);

        if ('event_time' in metrics) {
            if (typeof metrics.event_time !== 'number') {
                throw new ValidationError('metrics', '"event_time" must be a number', 'INVALID_AVERAGE_TIME');
            }
        } else {
            throw new ValidationError('metrics', '"event_time" is required', 'MISSING_FIELD');
        }
    }

    private validateRegisterWithProviderMetrics(metrics: Record<string, never>) {

        if ('provider' in metrics) {
            if (typeof metrics.provider !== 'string') {
                throw new ValidationError('metrics', '"provider" must be a string', 'INVALID_SUCCESS');
            }
        } else {
            throw new ValidationError('metrics', '"provider" is required', 'MISSING_FIELD');
        }
    }

    private validateLoginWithProviderMetrics(metrics: Record<string, never>) {
        this.validateSuccessMetric(metrics);
    }

    private validateBlockedMetrics(metrics: Record<string, never>) {
        if ('blocked' in metrics) {
            if (typeof metrics.blocked !== 'boolean') {
                throw new ValidationError('metrics', '"blocked" must be a boolean', 'INVALID_BLOCKED');
            }
        } else {
            throw new ValidationError('metrics', '"blocked" is required', 'MISSING_FIELD');
        }
    }
}