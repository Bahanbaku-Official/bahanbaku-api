const { body, validationResult } = require('express-validator');

const registerRules = () => {
  return [
    body('username').exists(),
    body('email').isEmail(),
    body('password').exists(),
  ]
}

const loginRules = () => {
  return [
    body('email').isEmail(),
    body('password').exists(),
  ]
}

const locationRules = () => {
  return [
    body('location.lat').isNumeric(),
    body('location.lng').isNumeric(),
  ]
}

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next()
  }

  const extractedError = [];
  errors.array().map((err) => {
    extractedError.push({ [err.param]: err.msg });
  })

  return res.status(422).json({
    status: false,
    message: 'validation failed',
    errors: extractedError,
  })
}

module.exports = {
  registerRules,
  loginRules,
  locationRules,
  validate,
}