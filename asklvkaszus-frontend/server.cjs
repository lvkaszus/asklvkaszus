const express = require('express');
const compression = require('compression');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3031;

const distPath = path.join(__dirname, 'dist');

app.use(compression());
app.use(express.static(distPath));

const reactRoutes = [
  '/',
  '/info',
  '/admin',
  '/admin/login',
  '/admin/register',
  '/admin/home',
  '/admin/global_settings',
  '/admin/user_settings',
  '/admin/management'
];

app.use((req, res, next) => {
  if (reactRoutes.includes(req.path)) {
    return next();
  }

  const filePath = path.join(distPath, req.path);
  
  if (fs.existsSync(filePath) && !fs.statSync(filePath).isDirectory()) {
    next();
  } else {
    res.status(404);
    next();
  }
});

app.get('/*main', (_, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

app.use((_, res, __) => {
  res.status(404).send('Not Found!');
});

app.listen(port, () => {
  console.log(`[Ask @lvkaszus! - Frontend] Express Server is running on port ${port}!`);
});
