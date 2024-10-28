const express = require('express');
const router = express.Router();
const pool = require('../db');
const QRCode = require('qrcode');
const checkJwt = require('../middleware/auth');

router.get('/tickets', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM tickets');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching tickets' });
    }
  });  

router.post('/tickets', checkJwt, async (req, res) => {
    const { vatin, firstName, lastName } = req.body;
    if (!vatin || !firstName || !lastName) {
      return res.status(400).json({ error: 'Missing data' });
    }
  
    const ticketCountResult = await pool.query('SELECT COUNT(*) FROM tickets WHERE vatin = $1', [vatin]);
    if (ticketCountResult.rows[0].count >= 3) {
      return res.status(400).json({ error: 'Maximum tickets reached for this VATIN' });
    }
  
    const newTicket = await pool.query(
      'INSERT INTO tickets (vatin, firstName, lastName) VALUES ($1, $2, $3) RETURNING id',
      [vatin, firstName, lastName]
    );
  
    const ticketId = newTicket.rows[0].id;
    const qrCodeURL = `${process.env.APP_URL}/tickets/${ticketId}`;
  
    QRCode.toDataURL(qrCodeURL, (err, url) => {
      if (err) return res.status(500).json({ error: 'Error generating QR code' });
      res.json({ qrCode: url });
    });
  });

module.exports = router;