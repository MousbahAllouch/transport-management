const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET all trips
router.get('/', async (req, res) => {
  try {
    const { date, driver_id, client_id } = req.query;

    let query = 'SELECT * FROM trips';
    const conditions = [];
    const params = [];
    let paramCount = 1;

    if (date) {
      conditions.push(`date = $${paramCount++}`);
      params.push(date);
    }
    if (driver_id) {
      conditions.push(`driver_id = $${paramCount++}`);
      params.push(driver_id);
    }
    if (client_id) {
      conditions.push(`client_id = $${paramCount++}`);
      params.push(client_id);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY date DESC, created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ error: { message: 'Failed to fetch trips' } });
  }
});

// GET single trip by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM trips WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Trip not found' } });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching trip:', error);
    res.status(500).json({ error: { message: 'Failed to fetch trip' } });
  }
});

// CREATE new trip
router.post('/', async (req, res) => {
  try {
    const {
      client_id,
      truck_id,
      driver_id,
      date,
      service_type,
      material,
      quantity,
      origin,
      destination,
      distance,
      amount,
      tips,
      collected,
      notes
    } = req.body;

    if (!client_id || !truck_id || !driver_id || !date || !service_type || !origin || !destination || !amount) {
      return res.status(400).json({ error: { message: 'Missing required fields' } });
    }

    const result = await pool.query(
      `INSERT INTO trips (
        client_id, truck_id, driver_id, date, service_type, material, quantity,
        origin, destination, distance, amount, tips, collected, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        client_id, truck_id, driver_id, date, service_type, material, quantity,
        origin, destination, distance, amount, tips || 0, collected || 0, notes
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({ error: { message: 'Failed to create trip' } });
  }
});

// UPDATE trip
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      client_id,
      truck_id,
      driver_id,
      date,
      service_type,
      material,
      quantity,
      origin,
      destination,
      distance,
      amount,
      tips,
      collected,
      notes
    } = req.body;

    const result = await pool.query(
      `UPDATE trips SET
        client_id = $1, truck_id = $2, driver_id = $3, date = $4, service_type = $5,
        material = $6, quantity = $7, origin = $8, destination = $9, distance = $10,
        amount = $11, tips = $12, collected = $13, notes = $14
      WHERE id = $15
      RETURNING *`,
      [
        client_id, truck_id, driver_id, date, service_type, material, quantity,
        origin, destination, distance, amount, tips, collected, notes, id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Trip not found' } });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating trip:', error);
    res.status(500).json({ error: { message: 'Failed to update trip' } });
  }
});

// DELETE trip
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM trips WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Trip not found' } });
    }

    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ error: { message: 'Failed to delete trip' } });
  }
});

module.exports = router;
