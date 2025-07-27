const analyticsService = require("../services/analyticsService");

exports.getStats = async (req, res, next) => {
  try {
    const stats = await analyticsService.getStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
};
