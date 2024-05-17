const responseHandler = ({ res, message, data, statusCode, status, errors }) => {
  res.status(statusCode ? statusCode : 200).json({
    status: {
      code: statusCode ? statusCode : 200,
      status: status ? Boolean(status) : true,
    },
    message: message ? message : "Success",
    data: data || null,
    errors: errors || null,
  });
};
module.exports = { responseHandler };
