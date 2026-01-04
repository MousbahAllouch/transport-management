const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET all trucks
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM trucks ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching trucks:', error);
    res.status(500).json({ error: { message: 'Failed to fetch trucks' } });
  }
});

// GET single truck by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM trucks WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Truck not found' } });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching truck:', error);
    res.status(500).json({ error: { message: 'Failed to fetch truck' } });
  }
});

// CREATE new truck
router.post('/', async (req, res) => {
  try {
    const { name, license_plate, model, capacity, status, assigned_driver_id } = req.body;

    if (!name || !license_plate) {
      return res.status(400).json({ error: { message: 'Name and license plate are required' } });
    }

    const result = await pool.query(
      `INSERT INTO trucks (name, license_plate, model, capacity, status, assigned_driver_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, license_plate, model, capacity, status || 'active', assigned_driver_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating truck:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: { message: 'License plate already exists' } });
    }
    res.status(500).json({ error: { message: 'Failed to create truck' } });
  }
});

// UPDATE truck
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, license_plate, model, capacity, status, assigned_driver_id } = req.body;

    const result = await pool.query(
      `UPDATE trucks
       SET name = $1, license_plate = $2, model = $3, capacity = $4, status = $5, assigned_driver_id = $6
       WHERE id = $7
       RETURNING *`,
      [name, license_plate, model, capacity, status, assigned_driver_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Truck not found' } });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating truck:', error);
    res.status(500).json({ error: { message: 'Failed to update truck' } });
  }
});

// DELETE truck
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM trucks WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Truck not found' } });
    }

    res.json({ message: 'Truck deleted successfully' });
  } catch (error) {
    console.error('Error deleting truck:', error);
    res.status(500).json({ error: { message: 'Failed to delete truck' } });
  }
});

module.exports = router;
