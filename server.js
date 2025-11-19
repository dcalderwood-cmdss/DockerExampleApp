const fs = require('fs').promises;
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));
app.use('/feedback', express.static('feedback'));

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'pages', 'feedback.html');
  res.sendFile(filePath);
});

app.get('/exists', (req, res) => {
  const filePath = path.join(__dirname, 'pages', 'exists.html');
  res.sendFile(filePath);
});

app.post('/create', async (req, res) => {
  try {
    const title = req.body.title;
    const content = req.body.text;

    const adjTitle = (title || '').toLowerCase();

    const tempFilePath = path.join(__dirname, 'temp', adjTitle + '.txt');
    const finalFilePath = path.join(__dirname, 'feedback', adjTitle + '.txt');

    await fs.writeFile(tempFilePath, content);

    // Replace deprecated fs.exists with fs.access (resolves if file exists, rejects otherwise)
    try {
      await fs.access(finalFilePath);
      // File exists -> show exists page
      res.redirect('/exists');
    } catch {
      // File does not exist -> move temp to final
      await fs.rename(tempFilePath, finalFilePath);
      res.redirect('/');
    }
  } catch (err) {
    res.status(500).send('An error occurred.');
  }
});

app.listen(80);
