const express = require('express');
const {
  getTechnologies,
  getTechnology,
  createTechnology,
  updateTechnology,
  deleteTechnology
} = require('../controllers/technologyController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTechnologies)
  .post(createTechnology);

router.route('/:id')
  .get(getTechnology)
  .put(updateTechnology)
  .delete(deleteTechnology);

module.exports = router;
