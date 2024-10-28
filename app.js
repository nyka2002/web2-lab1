const express = require('express');
const app = express();
const pool = require('./db');
const indexRoute = require('./routes/index');
const ticketsRouter = require('./routes/tickets');
const { auth, requiresAuth } = require('express-openid-connect');
const path = require('path');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', ticketsRouter);
app.use(express.json());
app.use('/', indexRoute);

// app.get('/test-db', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT COUNT(*) FROM tickets');
//     res.json({ totalTickets: result.rows[0].count });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Database connection failed' });
//   }
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//Auth0 konfig
app.use(
    auth({
      authRequired: false,
      auth0Logout: true,
      issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
      baseURL: 'https://web2-lab1-0x3s.onrender.com',
      clientID: process.env.AUTH0_CLIENT_ID,
      secret: process.env.AUTH0_CLIENT_SECRET
    })
  );
  
  //zaštićeni podaci
  app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
  });

app.use((req, res) => {
  res.redirect('/');
});