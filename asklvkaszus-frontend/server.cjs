const express = require('express');
const compression = require('compression');
const path = require('path');

const app = express();
const port = '3031';

const distPath = path.join(__dirname, 'dist');

app.use(compression());

app.use(express.static(distPath));

app.listen(port, () => {
  console.log(`[Ask @lvkaszus! Front-end]   Express Server is running on port ${port}!`);
});