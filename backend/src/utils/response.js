/**
 * Uniform API Response Utility
 * Adheres strictly to Section 7 of the GYMKHANA specification.
 */

export function sendSuccess(res, data = {}, message = null, statusCode = 200) {
  const payload = {
    success: true,
    data,
  };
  if (message) {
    payload.message = message;
  }
  return res.status(statusCode).json(payload);
}

export function sendError(res, message = 'An unexpected error occurred', code = 'BAD_REQUEST', statusCode = 400) {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
    },
  });
}
