const asyncMiddleware = (fn) => {
  return (req, res, next) => {
    try {
      fn(req, res);
    } catch (error) {
      next(error);
    }
  };
};

module.exports = asyncMiddleware;
