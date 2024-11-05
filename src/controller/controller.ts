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
        if (!metricsData.username) {
            throw new ValidationError('user', 'Invalid user', 'INVALID_USER');
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

        if(metricsData.type === 'register' ) {
            this.validateRegisterMetrics(metricsData.metrics);
        }else if(metricsData.type === 'register_with_provider' ) {
            this.validateWithProviderMetrics(metricsData.metrics);
        }else if (metricsData.type === 'login'){
            this.validateLoginMetrics(metricsData.metrics);
        }else if (metricsData.type === 'login_with_provider'){
            this.validateWithProviderMetrics(metricsData.metrics);

        }else {
            throw new ValidationError('type', 'Invalid type', 'INVALID_TYPE');
        }

    }

    private validateRegisterMetrics(metrics: Record<string, never>){

        if ('count' in metrics) {
            if (typeof metrics.count !== 'number') {
                throw new ValidationError('metrics', '"count" must be a number', 'INVALID_COUNT');
            }
        } else {
            throw new ValidationError('metrics', '"count" is required', 'MISSING_FIELD');
        }

        if ('registration_time' in metrics) {
            if (typeof metrics.registration_time !== 'number') {
                throw new ValidationError('metrics', '"registration_time" must be a number', 'INVALID_REGISTRATION_TIME');
            }
        } else {
            throw new ValidationError('metrics', '"registration_time" is required', 'MISSING_FIELD');
        }

        if ('success' in metrics) {
            if (typeof metrics.success !== 'boolean') {
                throw new ValidationError('metrics', '"success" must be a boolean', 'INVALID_SUCCESS');
            }
        } else {
            throw new ValidationError('metrics', '"success" is required', 'MISSING_FIELD');
        }

    }

    private validateLoginMetrics(metrics: Record<string, never>) {

            if ('successfulLogins' in metrics) {
                if (typeof metrics.successfulLogins !== 'number') {
                    throw new ValidationError('metrics', '"successfulLogins" must be a number', 'INVALID_SUCCESSFUL_LOGINS');
                }
            } else {
                throw new ValidationError('metrics', '"successfulLogins" is required', 'MISSING_FIELD');
            }

            if ('failedLoginAttempts' in metrics) {
                if (typeof metrics.failedLoginAttempts !== 'number') {
                    throw new ValidationError('metrics', '"failedLoginAttempts" must be a number', 'INVALID_FAILED_LOGIN_ATTEMPTS');
                }
            } else {
                throw new ValidationError('metrics', '"failedLoginAttempts" is required', 'MISSING_FIELD');
            }

            if ('averageLoginTime' in metrics) {
                if (typeof metrics.averageLoginTime !== 'number') {
                    throw new ValidationError('metrics', '"averageLoginTime" must be a number', 'INVALID_AVERAGE_LOGIN_TIME');
                }
            } else {
                throw new ValidationError('metrics', '"averageLoginTime" is required', 'MISSING_FIELD');
            }
    }

    private validateWithProviderMetrics(metrics: Record<string, never>) {

                if ('count' in metrics) {
                    if (typeof metrics.count !== 'number') {
                        throw new ValidationError('metrics', '"count" must be a number', 'INVALID_COUNT');
                    }
                } else {
                    throw new ValidationError('metrics', '"count" is required', 'MISSING_FIELD');
                }

                if ('provider' in metrics) {
                    if (typeof metrics.provider !== 'string') {
                        throw new ValidationError('metrics', '"provider" must be a string', 'INVALID_SUCCESS');
                    }
                } else {
                    throw new ValidationError('metrics', '"provider" is required', 'MISSING_FIELD');
                }
    }
}