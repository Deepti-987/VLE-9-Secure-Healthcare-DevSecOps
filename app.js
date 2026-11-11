const express = require('express');
const app = express();

app.use(express.json({ limit: '10kb' }));

app.get('/', (req, res) => {
  res.send(`
    <h1>Secure Healthcare Demo</h1>
    <p>VLE-9 DevSecOps application is running.</p>
    <p>This demonstration uses no real patient information.</p>
    <a href="/health">Check application health</a>
  `);
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', application: 'healthcare-demo' });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body || {};

  if (typeof username !== 'string' || typeof password !== 'string' ||
      username.length < 3 || username.length > 50 ||
      password.length < 8 || password.length > 100) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  res.status(401).json({ message: 'Demo login: authentication not configured' });
});

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Healthcare demo running on port ${port}`);
});
