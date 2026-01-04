const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET all drivers
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM drivers ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({ error: { message: 'Failed to fetch drivers' } });
  }
});

// GET single driver by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM drivers WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Driver not found' } });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching driver:', error);
    res.status(500).json({ error: { message: 'Failed to fetch driver' } });
  }
});

// CREATE new driver
router.post('/', async (req, res) => {
  try {
    const { name, license_number, email, phone, assigned_truck_id } = req.body;

    if (!name) {
      return res.status(400).json({ error: { message: 'Name is required' } });
    }

    const result = await pool.query(
      `INSERT INTO drivers (name, license_number, email, phone, assigned_truck_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, license_number, email, phone, assigned_truck_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating driver:', error);
    res.status(500).json({ error: { message: 'Failed to create driver' } });
  }
});

// UPDATE driver
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, license_number, email, phone, assigned_truck_id } = req.body;

    const result = await pool.query(
      `UPDATE drivers
       SET name = $1, license_number = $2, email = $3, phone = $4, assigned_truck_id = $5
       WHERE id = $6
       RETURNING *`,
      [name, license_number, email, phone, assigned_truck_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Driver not found' } });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating driver:', error);
    res.status(500).json({ error: { message: 'Failed to update driver' } });
  }
});

// DELETE driver
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM drivers WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Driver not found' } });
    }

    res.json({ message: 'Driver deleted successfully' });
  } catch (error) {
    console.error('Error deleting driver:', error);
    res.status(500).json({ error: { message: 'Failed to delete driver' } });
  }
});

module.exports = router;
