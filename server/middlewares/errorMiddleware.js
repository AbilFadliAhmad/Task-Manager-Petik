const RouteNotFound = (req, res, next) => {
  const error = new Error(`Rute tidak ditemukan ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let status = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  if (err.name == 'CastError' && err.kind == 'ObjectId') {
    status = 404;
    message = 'Rute tidak ditemukan';
  }
  
  res.status(status).json({
    message, 
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

export {
  RouteNotFound,
  errorHandler
}
