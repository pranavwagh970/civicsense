import Complaint from '../models/Complaint.js';

const groupByField = async (field) =>
  Complaint.aggregate([
    {
      $group: {
        _id: `$${field}`,
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

export const getDashboardStats = async (_req, res, next) => {
  try {
    const [total, byStatus, byCategory, latest] = await Promise.all([
      Complaint.countDocuments(),
      groupByField('status'),
      groupByField('category'),
      Complaint.find().populate('createdBy', 'name email').sort({ createdAt: -1 }).limit(5),
    ]);

    res.json({
      total,
      byStatus,
      byCategory,
      latest,
    });
  } catch (error) {
    next(error);
  }
};

