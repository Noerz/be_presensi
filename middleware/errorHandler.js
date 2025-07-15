const errorHandler = (err, req, res, next) => {
  console.error(err);
  return res.status(500).json({
    code: 500,
    status: "error",
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
