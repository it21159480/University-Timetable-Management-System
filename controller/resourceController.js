const Resource = require('../models/Resource');

exports.createResource = async (req, res) => {
  const { name, type, availability } = req.body;
  try {
    const newResource = new Resource({
      name,
      type,
      availability
    });
    await newResource.save();
    res.status(201).json({ message: 'Resource created successfully', data: newResource });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create resource', error: error.message });
  }
};

exports.getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find();
    res.status(200).json(resources);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving resources', error: error.message });
  }
};

exports.getResourceById = async (req, res) => {
  const { id } = req.params;
  try {
    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(200).json(resource);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching resource', error: error.message });
  }
};

exports.updateResource = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedResource = await Resource.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedResource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(200).json({ message: 'Resource updated successfully', data: updatedResource });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update resource', error: error.message });
  }
};

exports.deleteResource = async (req, res) => {
  const { id } = req.params;
  try {
    const resource = await Resource.findByIdAndDelete(id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete resource', error: error.message });
  }
};
