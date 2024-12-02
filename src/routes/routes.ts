import express from 'express';
import { MetricController } from '../controller/controller';

const router = express.Router();
router.post('/', async (req, res, next) => {
  await new MetricController().createMetrics(req, res, next);
});
router.get('/', async (req, res, next) => {
  await new MetricController().getMetrics(req, res, next);
});
export default router;
