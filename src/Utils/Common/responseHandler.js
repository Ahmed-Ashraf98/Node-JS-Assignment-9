import httpStatus from "./httpStatus.js";

export const responseHandler = (
  res,
  message,
  statusCode = httpStatus.OK,
  data = null
) => {
  const resObject = {};

  if (data) {
    for (const key in data) {
      resObject[key] = data[key];
    }
  }
  if (message) {
    resObject.message = message;
  }

  return res.status(statusCode).json(resObject);
};
