require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require("cors")
const path = require("path")
const { spawn } = require("child_process")
const app = express();
const PORT = 3000;

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { error: 'Rate limit reached' }
});
app.use(limiter);

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

const PRIME_ALGORITHMS = [
  { name: 'trial-division', image: 'prime-trial-division' },
  { name: 'sieve', image: 'prime-sieve' },
  { name: 'miller-rabin', image: 'prime-miller-rabin' },
];

app.get('/primes/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const processes = [];

  PRIME_ALGORITHMS.forEach(({ name, image }) => {
    const proc = spawn('docker', ['run', '--rm', image], { shell: true });
    processes.push(proc);

    let buffer = '';
    proc.stdout.on('data', (data) => {
      buffer += data.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop();
      lines.forEach(line => {
        const value = parseInt(line.trim(), 10);
        if (!isNaN(value)) {
          res.write(`data: ${JSON.stringify({ algorithm: name, value })}\n\n`);
        }
      });
    });

    proc.stderr.on('data', (data) => {
      res.write(`data: ${JSON.stringify({ error: `[${name}] ${data.toString().trim()}` })}\n\n`);
    });

    proc.on('error', (err) => {
      res.write(`data: ${JSON.stringify({ error: `Failed to start ${name}: ${err.message}` })}\n\n`);
    });
  });

  req.on('close', () => {
    processes.forEach(proc => {
      try { proc.kill('SIGTERM'); } catch (_) {}
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});