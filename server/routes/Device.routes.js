import { Router } from 'express';
import * as deviceController from '../controllers/Device.controller';

const router = new Router();

// Get Twin
router.route('/:id/twin').get(deviceController.getDeviceTwin);

// Update
router.route('/:id/twin').put(deviceController.updateDeviceTwin);

export default router;
