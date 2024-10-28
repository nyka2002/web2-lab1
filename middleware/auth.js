const { auth } = require('express-oauth2-jwt-bearer');

const checkJwt = auth({
  audience: 'https://web2-lab1/login',
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`
});

module.exports = checkJwt;