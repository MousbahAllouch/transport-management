const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET all clients
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM clients ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: { message: 'Failed to fetch clients' } });
  }
});

// GET single client by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM clients WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Client not found' } });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ error: { message: 'Failed to fetch client' } });
  }
});

// CREATE new client
router.post('/', async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name) {
      return res.status(400).json({ error: { message: 'Name is required' } });
    }

    const result = await pool.query(
      `INSERT INTO clients (name, phone)
       VALUES ($1, $2)
       RETURNING *`,
      [name, phone]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: { message: 'Failed to create client' } });
  }
});

// UPDATE client
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone } = req.body;

    const result = await pool.query(
      `UPDATE clients
       SET name = $1, phone = $2
       WHERE id = $3
       RETURNING *`,
      [name, phone, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Client not found' } });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: { message: 'Failed to update client' } });
  }
});

// DELETE client
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM clients WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Client not found' } });
    }

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: { message: 'Failed to delete client' } });
  }
});

module.exports = router;
