import express from 'express';
import { protectRoute, isAdminRoute, checkCookie } from '../middlewares/authMiddleware.js';
import { createTask, duplicateTask, postTaskActivity, dashboardStatistics, getTask, updateTask, deleteRestoreTask, listTasks, isExpiredTask, resetSemua, updateTaskStage } from '../controllers/TaskController.js';
import { upload } from '../middlewares/muttler.js';

export const taskRoute = express.Router();

taskRoute.post('/create', protectRoute, isAdminRoute, upload.single('image'), createTask);
taskRoute.post('/duplicate', protectRoute, upload.single('image'), duplicateTask);
taskRoute.post('/activity', protectRoute, postTaskActivity);
taskRoute.post('/list-task', checkCookie, protectRoute, listTasks);

taskRoute.get('/dashboard', protectRoute, dashboardStatistics);
taskRoute.get('/:id', protectRoute, getTask);
taskRoute.delete('/reset', resetSemua);

taskRoute.put('/update', protectRoute, upload.single('image'), updateTask);
taskRoute.put('/is-expired', protectRoute, isExpiredTask);
taskRoute.put('/update-stage', protectRoute, updateTaskStage);

taskRoute.delete('/delete-restore/:id?', protectRoute, isAdminRoute, deleteRestoreTask);
