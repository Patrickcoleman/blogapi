const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require("cors")
const path = require("path")
const app = express();
const PORT = 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Rate limit reached' }
});
app.use(limiter);

require('dotenv').config();

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN
}));

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "images")))

const days = require('./output.json');

app.get('/day/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id) || id < 0) {
    return res.status(400).json({ error: 'Invalid day ID.' });
  }

  const day = days[String(id)];
  if (!day) {
    return res.status(404).json({ error: `No entry found for day ${id}` });
  }
  
  res.json({
    title: day.title,
    paragraphs: day.paragraphs,
    imagenames: day.imagenames
  });
});

app.get('/hello', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});