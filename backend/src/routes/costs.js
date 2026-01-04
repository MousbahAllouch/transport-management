const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET all costs
router.get('/', async (req, res) => {
  try {
    const { date, driver_id, truck_id, category } = req.query;

    let query = 'SELECT * FROM costs';
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
    if (truck_id) {
      conditions.push(`truck_id = $${paramCount++}`);
      params.push(truck_id);
    }
    if (category) {
      conditions.push(`category = $${paramCount++}`);
      params.push(category);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY date DESC, created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching costs:', error);
    res.status(500).json({ error: { message: 'Failed to fetch costs' } });
  }
});

// GET single cost by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM costs WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Cost not found' } });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching cost:', error);
    res.status(500).json({ error: { message: 'Failed to fetch cost' } });
  }
});

// CREATE new cost
router.post('/', async (req, res) => {
  try {
    const { date, amount, category, truck_id, driver_id, description } = req.body;

    if (!date || !amount || !category) {
      return res.status(400).json({ error: { message: 'Date, amount, and category are required' } });
    }

    const result = await pool.query(
      `INSERT INTO costs (date, amount, category, truck_id, driver_id, description)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [date, amount, category, truck_id, driver_id, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating cost:', error);
    res.status(500).json({ error: { message: 'Failed to create cost' } });
  }
});

// UPDATE cost
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { date, amount, category, truck_id, driver_id, description } = req.body;

    const result = await pool.query(
      `UPDATE costs
       SET date = $1, amount = $2, category = $3, truck_id = $4, driver_id = $5, description = $6
       WHERE id = $7
       RETURNING *`,
      [date, amount, category, truck_id, driver_id, description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Cost not found' } });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating cost:', error);
    res.status(500).json({ error: { message: 'Failed to update cost' } });
  }
});

// DELETE cost
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM costs WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Cost not found' } });
    }

    res.json({ message: 'Cost deleted successfully' });
  } catch (error) {
    console.error('Error deleting cost:', error);
    res.status(500).json({ error: { message: 'Failed to delete cost' } });
  }
});

module.exports = router;
