import Complaint from '../models/Complaint.js';

const buildComplaintQuery = (req) => {
  const query = {};

  if (req.user.role !== 'admin') {
    query.createdBy = req.user._id;
  }

  if (req.query.status) query.status = req.query.status;
  if (req.query.category) query.category = req.query.category;

  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }

  return query;
};

export const createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, priority, address, lat, lng, imageUrl } = req.body;

    if (!title || !description) {
      res.status(400);
      throw new Error('Title and description are required.');
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority,
      address,
      coordinates: {
        lat: lat === '' || lat === undefined ? undefined : Number(lat),
        lng: lng === '' || lng === undefined ? undefined : Number(lng),
      },
      imageUrl,
      createdBy: req.user._id,
    });

    await complaint.populate('createdBy', 'name email role');

    res.status(201).json({ complaint });
  } catch (error) {
    next(error);
  }
};

export const getComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find(buildComplaintQuery(req))
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    res.json({ complaints });
  } catch (error) {
    next(error);
  }
};

export const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('createdBy', 'name email role');

    if (!complaint) {
      res.status(404);
      throw new Error('Complaint not found.');
    }

    const isOwner = complaint.createdBy._id.equals(req.user._id);
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403);
      throw new Error('You can only view your own complaints.');
    }

    res.json({ complaint });
  } catch (error) {
    next(error);
  }
};

export const updateComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      res.status(404);
      throw new Error('Complaint not found.');
    }

    const isOwner = complaint.createdBy.equals(req.user._id);
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403);
      throw new Error('You can only edit your own complaints.');
    }

    if (complaint.status !== 'Pending' && !isAdmin) {
      res.status(400);
      throw new Error('Only pending complaints can be edited by citizens.');
    }

    const editableFields = ['title', 'description', 'category', 'priority', 'address', 'imageUrl'];
    editableFields.forEach((field) => {
      if (req.body[field] !== undefined) complaint[field] = req.body[field];
    });

    if (req.body.lat !== undefined || req.body.lng !== undefined) {
      complaint.coordinates = {
        lat: req.body.lat === '' ? undefined : Number(req.body.lat),
        lng: req.body.lng === '' ? undefined : Number(req.body.lng),
      };
    }

    const updated = await complaint.save();
    await updated.populate('createdBy', 'name email role');

    res.json({ complaint: updated });
  } catch (error) {
    next(error);
  }
};

export const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['Pending', 'In Review', 'Resolved', 'Rejected'].includes(status)) {
      res.status(400);
      throw new Error('Invalid complaint status.');
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      res.status(404);
      throw new Error('Complaint not found.');
    }

    complaint.status = status;
    const updated = await complaint.save();
    await updated.populate('createdBy', 'name email role');

    res.json({ complaint: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      res.status(404);
      throw new Error('Complaint not found.');
    }

    const isOwner = complaint.createdBy.equals(req.user._id);
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403);
      throw new Error('You can only delete your own complaints.');
    }

    await complaint.deleteOne();
    res.json({ message: 'Complaint deleted.' });
  } catch (error) {
    next(error);
  }
};

