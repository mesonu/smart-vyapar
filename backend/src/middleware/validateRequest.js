const ResponseHandler = require('../utils/ResponseHandler');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      return ResponseHandler.validationError(res, error);
    }

    next();
  };
};

const validateParams = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      return ResponseHandler.validationError(res, error);
    }

    next();
  };
};

const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      return ResponseHandler.validationError(res, error);
    }

    next();
  };
};

module.exports = {
  validateRequest,
  validateParams,
  validateQuery
}; 