import express from 'express';
import {
  createComplaint,
  deleteComplaint,
  getComplaintById,
  getComplaints,
  updateComplaint,
  updateComplaintStatus,
} from '../controllers/complaintController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getComplaints).post(protect, createComplaint);
router
  .route('/:id')
  .get(protect, getComplaintById)
  .put(protect, updateComplaint)
  .delete(protect, deleteComplaint);
router.patch('/:id/status', protect, authorize('admin'), updateComplaintStatus);

export default router;

