import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: 2000,
    },
    category: {
      type: String,
      enum: ['Road', 'Water', 'Streetlight', 'Garbage', 'Drainage', 'Health', 'School', 'Other'],
      default: 'Other',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Pending', 'In Review', 'Resolved', 'Rejected'],
      default: 'Pending',
    },
    address: {
      type: String,
      trim: true,
      maxlength: 250,
    },
    coordinates: {
      lat: Number,
      lng: Number,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    ai: {
      suggestedCategory: String,
      duplicateOf: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Complaint',
      },
      duplicateScore: Number,
      confidence: Number,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

complaintSchema.index({ title: 'text', description: 'text', address: 'text' });
complaintSchema.index({ status: 1, category: 1, createdAt: -1 });
complaintSchema.index({ createdBy: 1, createdAt: -1 });

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;
