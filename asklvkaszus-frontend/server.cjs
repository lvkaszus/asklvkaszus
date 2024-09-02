const express = require('express');
const compression = require('compression');
const path = require('path');

const app = express();
const port = 3031;

const distPath = path.join(__dirname, 'dist');

app.use(compression());
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`[Ask @lvkaszus! - Frontend] Express Server is running on port ${port}!`);
});
