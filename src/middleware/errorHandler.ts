import {Request, Response, NextFunction} from "express";
import { ValidationError } from "../types/customErrors";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ValidationError) {
        console.warn(`ValidationError: ${err.message}`, {
            field: err.field,
            detail: err.detail
        });
        res.status(400).json({
            type: err.type,
            title: 'Validation Error',
            status: 400,
            detail: err.detail,
            instance: req.originalUrl,
            'custom-field': err.field
        });
    } else {
        res.status(500).json({
        message: 'Internal server error',
        });
    }
}
