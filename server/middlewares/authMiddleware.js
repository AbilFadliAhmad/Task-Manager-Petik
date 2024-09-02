import jwt from 'jsonwebtoken';
import { userModel } from '../models/UserModel.js';

const protectRoute = async (req, res, next) => {
  try {
    let token = req.cookies?.token;
    if (token) {
      const decode = jwt.verify(token, process.env.TOKEN_SECRET);
      const response = await userModel.findById(decode.userId).select('isAdmin email isUstadz leader');
      req.user = {
        email: response.email,
        isAdmin: response.isAdmin,
        isUstadz: response.isUstadz,
        leader: response.leader,
        userId: decode.userId,
      };  
      next();
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({ success: false, message: error.message, inti: 'Kamu tidak diizinkan masuk, coba lagi lain kali' });
  }
};

const isAdminRoute = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(401).json({ success: false, inti: 'Kamu tidak diizinkan masuk, coba lagi lain kali' });
  }
};

const checkCookie = (req, res, next) => {
  if (req.cookies['token']) {
    next();
  } else {
    const error = new Error('Unauthorized: Cookie is required');
    error.status = 401;
    next(error);
  }
};

export { protectRoute, isAdminRoute, checkCookie };
