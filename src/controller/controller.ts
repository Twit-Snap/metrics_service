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

        this.validateMetrics(metricsData);
    }

    private validateDate(date: string | Date) {
        console.log(date);
        if (isNaN(new Date(date).getTime()) || !date) {
            throw new ValidationError('createdAt', 'Invalid createdAt', 'INVALID_CREATED_AT');
        }
    }

    private validateMetrics(metricsData: MetricDataDto) {
        if (Object.keys(metricsData.metrics).length === 0) {
            throw new ValidationError('metrics', 'Invalid metrics', 'INVALID_METRICS');
        }
        if(metricsData.type === 'register' ) {
            this.validateRegisterMetrics(metricsData.metrics);
        }

    }

    private validateRegisterMetrics(metrics: Record<string, never>){


        // Validar que contenga los campos necesarios
        // Validar que 'count' sea un número y exista
        if ('count' in metrics) {
            if (typeof metrics.count !== 'number') {
                throw new ValidationError('metrics', '"count" must be a number', 'INVALID_COUNT');
            }
        } else {
            throw new ValidationError('metrics', '"count" is required', 'MISSING_FIELD');
        }

        // Validar que 'registration_time' sea un número y exista
        if ('registration_time' in metrics) {
            if (typeof metrics.registration_time !== 'number') {
                throw new ValidationError('metrics', '"registration_time" must be a number', 'INVALID_REGISTRATION_TIME');
            }
        } else {
            throw new ValidationError('metrics', '"registration_time" is required', 'MISSING_FIELD');
        }

        // Validar que 'success' sea un booleano y exista
        if ('success' in metrics) {
            if (typeof metrics.success !== 'boolean') {
                throw new ValidationError('metrics', '"success" must be a boolean', 'INVALID_SUCCESS');
            }
        } else {
            throw new ValidationError('metrics', '"success" is required', 'MISSING_FIELD');
        }

    }
}