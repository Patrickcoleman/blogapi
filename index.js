const express = require('express');
const cors = require("cors")
const path = require("path")
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors())

app.use("/images", express.static(path.join(__dirname, "images")))

const days = require('./output.json');

app.get('/day/:id', (req, res) => {
  const day = days[req.params.id];

  if (!day) {
    return res.status(404).json({ error: `No entry found for day ${req.params.id}` });
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