const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM tickets');
    const totalTickets = result.rows[0].count;
    res.render('index', { totalTickets });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching ticket count' });
  }
});

module.exports = router;