
const ErrorHandler = ({ res, message, data, statusCode, errors }) => {
  res.status(statusCode ? statusCode : 400).json({
    status: {
      code: statusCode ? statusCode : 400,
      status: false,
    },
    message: message ? message : "Internal server error! Please try again.",
    data: data || null,
    errors: true,
  });
}
module.exports={
  ErrorHandler
}
