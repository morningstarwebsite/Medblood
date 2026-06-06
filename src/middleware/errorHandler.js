export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const payload = {
    success: false,
    message: err.message || 'Internal server error'
  };

  if (err.details) {
    payload.details = err.details;
  }

  if (process.env.NODE_ENV === 'development' && err.stack) {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
};
