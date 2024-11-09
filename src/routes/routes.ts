import express from 'express';
import { MetricController} from "../controller/controller";

const router = express.Router();
router.post('/', (req, res, next) => new MetricController().createMetrics(req, res, next));
router.get('/', (req, res, next) => new MetricController().getRegisterMetrics(req, res, next));
export default router;