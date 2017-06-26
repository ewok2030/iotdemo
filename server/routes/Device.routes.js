import { Router } from 'express';
import * as deviceController from '../controllers/Device.controller';

const router = new Router();

// Get Twin
router.route('/:id/twin').get(deviceController.getDeviceTwin);

// Update
router.route('/:id/twin').post(deviceController.updateDeviceTwin);

// Get device history
router.route('/:id/messages/history').post(deviceController.getDeviceMessages);

export default router;
