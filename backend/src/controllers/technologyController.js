const Technology = require('../models/Technology');
const { getCache, setCache, deleteCache } = require('../utils/cache');

exports.getTechnologies = async (req, res) => {
  try {
    const { category, search } = req.query;
    const cacheKey = `technologies:${category || 'all'}:${search || ''}`;

    const cached = await getCache(cacheKey);
    if (cached) return res.json(cached);

    const query = {};
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    const technologies = await Technology.find(query).sort({ name: 1 });

    const result = { success: true, data: technologies };
    await setCache(cacheKey, result, 3600);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTechnology = async (req, res) => {
  try {
    const technology = await Technology.findById(req.params.id);

    if (!technology) {
      return res.status(404).json({ message: 'Technology not found' });
    }

    res.json({ success: true, data: technology });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTechnology = async (req, res) => {
  try {
    const technology = await Technology.create(req.body);

    await deleteCache('technologies:*');

    res.status(201).json({ success: true, data: technology });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTechnology = async (req, res) => {
  try {
    const technology = await Technology.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!technology) {
      return res.status(404).json({ message: 'Technology not found' });
    }

    await deleteCache('technologies:*');

    res.json({ success: true, data: technology });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTechnology = async (req, res) => {
  try {
    const technology = await Technology.findByIdAndDelete(req.params.id);

    if (!technology) {
      return res.status(404).json({ message: 'Technology not found' });
    }

    await deleteCache('technologies:*');

    res.json({ success: true, message: 'Technology deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
