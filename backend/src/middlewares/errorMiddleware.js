const notFound = (req, res, next) => {
  const error = new Error(`Not Found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

// Handle Method Not Allowed
const methodNotAllowed = (req, res) => {
  const message = `Method ${req.method} not allowed on ${req.originalUrl}`;
  res.status(405);
  logger.error(`405 - ${req.method} ${req.originalUrl}`);
  res.json({
    message,
    stack: process.env.NODE_ENV === "production" ? null : undefined,
  });
};

export { notFound, errorHandler, methodNotAllowed };
