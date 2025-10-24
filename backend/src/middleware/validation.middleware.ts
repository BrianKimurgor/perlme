// src/middleware/validate.js
export const validate = (schema) => async (
  req,
  res,
  next
) => {
  try {
    // validate body against schema
    req.body = await schema.validate(req.body, { 
      abortEarly: false, // collect all errors
      stripUnknown: true, // remove extra fields
    });
    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: err.errors, // array of all validation messages
    });
  }
};
