import express from 'express';
import { protectRoute, isAdminRoute } from '../middlewares/authMiddleware.js';
import {
  registerUser,
  loginUser,
  logoutUser,
  getTeamList,
  getNotificationList,
  updateUserProfile,
  markNotificationRead,
  changeUserPassword,
  activateUserProfile,
  deleteUserProfile,
  createAdmin,
  updateTeam,
  dropdownUser,
  createAnnouncement,
  listUser,
  listHistory,
  deleteHistory
} from '../controllers/UserController.js';
import { upload } from '../middlewares/muttler.js';

export const userRoute = express.Router();

userRoute.post('/admin', upload.single('image'), createAdmin);
userRoute.post('/register', protectRoute, upload.single('image'), registerUser);
userRoute.post('/login', loginUser);
userRoute.post('/logout', protectRoute, logoutUser);
userRoute.post('/logs', protectRoute, isAdminRoute, listHistory);
userRoute.post('/pemberitahuan', protectRoute, isAdminRoute, createAnnouncement);

userRoute.get('/list', listUser); // Route ini hanya untuk mengecek data didatabase
userRoute.get('/get-team', protectRoute, getTeamList);
userRoute.get('/notifications', protectRoute, getNotificationList);
userRoute.get('/dropdown', protectRoute, dropdownUser);

userRoute.put('/team-update', upload.single('image'), protectRoute, updateTeam);
userRoute.put('/profile', protectRoute, upload.single('image'), updateUserProfile);
userRoute.put('/read-noti', protectRoute,  markNotificationRead);
userRoute.put('/change-password', protectRoute, changeUserPassword);

userRoute.delete('/delete-logs', protectRoute, isAdminRoute, deleteHistory);
userRoute.route('/:id').put(protectRoute, activateUserProfile).delete(protectRoute, deleteUserProfile);
