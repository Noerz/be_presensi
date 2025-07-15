const successResponse = (res, code, message, data = null, meta = null) => {
  return res.status(code).json({
    code,
    status: "success",
    message,
    data,
    ...(meta && { meta }),
  });
};

const errorResponse = (res, code, message) => {
  return res.status(code).json({
    code,
    status: "error",
    message,
  });
};

module.exports = { successResponse, errorResponse };
