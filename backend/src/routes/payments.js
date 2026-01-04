const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET all payments
router.get('/', async (req, res) => {
  try {
    const { client_id } = req.query;

    let query = 'SELECT * FROM payments';
    const params = [];

    if (client_id) {
      query += ' WHERE client_id = $1';
      params.push(client_id);
    }

    query += ' ORDER BY date DESC, created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: { message: 'Failed to fetch payments' } });
  }
});

// GET single payment by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM payments WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Payment not found' } });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ error: { message: 'Failed to fetch payment' } });
  }
});

// CREATE new payment
router.post('/', async (req, res) => {
  try {
    const { client_id, date, amount, method, reference, notes } = req.body;

    if (!client_id || !date || !amount || !method) {
      return res.status(400).json({ error: { message: 'Client ID, date, amount, and method are required' } });
    }

    const result = await pool.query(
      `INSERT INTO payments (client_id, date, amount, method, reference, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [client_id, date, amount, method, reference, notes]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: { message: 'Failed to create payment' } });
  }
});

// UPDATE payment
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { client_id, date, amount, method, reference, notes } = req.body;

    const result = await pool.query(
      `UPDATE payments
       SET client_id = $1, date = $2, amount = $3, method = $4, reference = $5, notes = $6
       WHERE id = $7
       RETURNING *`,
      [client_id, date, amount, method, reference, notes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Payment not found' } });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ error: { message: 'Failed to update payment' } });
  }
});

// DELETE payment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM payments WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Payment not found' } });
    }

    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ error: { message: 'Failed to delete payment' } });
  }
});

module.exports = router;
