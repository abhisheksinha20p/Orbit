const Project = require('../models/Project');
const { getCache, setCache, deleteCache } = require('../utils/cache');
const { sendMessage } = require('../config/kafka');

exports.getProjects = async (req, res) => {
  try {
    const { search, status, technology, page = 1, limit = 10 } = req.query;
    const cacheKey = `projects:${JSON.stringify(req.query)}`;

    const cached = await getCache(cacheKey);
    if (cached) return res.json(cached);

    const query = {};
    if (search) query.$text = { $search: search };
    if (status) query.status = status;
    if (technology) query.technologies = technology;

    const projects = await Project.find(query)
      .populate('technologies', 'name category icon')
      .populate('createdBy', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Project.countDocuments(query);

    const result = {
      success: true,
      data: projects,
      pagination: { total: count, page: parseInt(page), pages: Math.ceil(count / limit) }
    };

    await setCache(cacheKey, result, 600);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('technologies')
      .populate('createdBy', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      createdBy: req.user._id
    });

    await deleteCache('projects:*');
    await sendMessage('project-events', { type: 'created', projectId: project._id });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await deleteCache('projects:*');
    await sendMessage('project-events', { type: 'updated', projectId: project._id });

    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await deleteCache('projects:*');
    await sendMessage('project-events', { type: 'deleted', projectId: project._id });

    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
