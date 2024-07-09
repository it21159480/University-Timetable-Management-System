const resourceController = require('../controller/resourceController');
const Resource = require('../models/Resource');

jest.mock('../models/Resource'); // Correct the path according to your project structure

describe('resourceController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });



  describe('getAllResources', () => {
    it('should retrieve all resources successfully', async () => {
      const req = {};
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      Resource.find.mockResolvedValue([]);

      await resourceController.getAllResources(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });
  });

  describe('getResourceById', () => {
    it('should retrieve a specific resource by ID successfully', async () => {
      const req = {
        params: { id: '1' }
      };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      Resource.findById.mockResolvedValue({
        _id: req.params.id,
        name: 'Existing Projector',
        type: 'projector',
        availability: true
      });

      await resourceController.getResourceById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        _id: req.params.id,
        name: 'Existing Projector'
      }));
    });
  });

  describe('updateResource', () => {
    it('should update a resource successfully', async () => {
      const req = {
        params: { id: '1' },
        body: { name: 'Updated Projector', type: 'Updated Equipment' }
      };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      Resource.findByIdAndUpdate.mockResolvedValue({
        ...req.body,
        _id: req.params.id
      });

      await resourceController.updateResource(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Resource updated successfully',
        data: expect.objectContaining(req.body)
      }));
    });
  });

  describe('deleteResource', () => {
    it('should delete a resource successfully', async () => {
      const req = {
        params: { id: '1' }
      };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      Resource.findByIdAndDelete.mockResolvedValue({
        _id: req.params.id
      });

      await resourceController.deleteResource(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Resource deleted successfully'
      });
    });
  });
});
