const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const cors = require('cors');
require('dotenv').config();

const app = express();
const upload = multer({ dest: path.join(__dirname, '..', 'uploads') });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple health
app.get('/ping', (req, res) => res.json({ ok: true, ts: Date.now() }));

// Upload avatar
app.post('/upload-avatar', upload.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).json({ ok: false, err: 'no file' });
  // return path relative to backend (client will not fetch it directly in prod)
  res.json({ ok: true, path: req.file.path, filename: req.file.filename });
});

// Animate endpoint: procedural or ml
app.post('/animate', async (req, res) => {
  const { avatarPath, mode } = req.body;
  if (!avatarPath) return res.status(400).json({ ok: false, err: 'avatarPath required' });

  if (mode === 'procedural' || !mode) {
    // Procedural: client-side animation parameters
    return res.json({
      ok: true,
      type: 'procedural',
      animation: {
        kind: 'listen-nod',
        nodIntensity: 0.6,
        blinkIntervalSec: 4
      }
    });
  }

  if (mode === 'ml') {
    // Call Python script (placeholder). Expects JSON on stdout with { output: "<file>" }
    const py = spawn(process.env.PYTHON_PATH || 'python3', [path.join(__dirname, 'animate.py'), avatarPath]);
    let out = '';
    py.stdout.on('data', d => out += d.toString());
    py.stderr.on('data', d => console.error('py-err:', d.toString()));
    py.on('close', code => {
      try {
        const json = JSON.parse(out);
        return res.json({ ok: true, type: 'ml', result: json });
      } catch (e) {
        return res.status(500).json({ ok: false, err: 'ml animation failed', raw: out, code });
      }
    });
    return;
  }

  res.status(400).json({ ok: false, err: 'unknown mode' });
});

// Accept audio file for transcription (single chunk)
app.post('/transcribe', upload.single('audio'), async (req, res) => {
  if (!req.file) return res.status(400).json({ ok: false, err: 'no audio' });
  const filePath = req.file.path;

  try {
    // Placeholder: call OpenAI Whisper or local model here.
    // Example: use process.env.OPENAI_API_KEY and call OpenAI transcription endpoint.
    // For now return a demo transcription.
    const demoText = 'To je demo transkripcija. Vstavi klic v OpenAI Transcription tukaj.';
    const summary = await summarizeMeeting(demoText);

    res.json({ ok: true, transcription: demoText, summary });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, err: e.message });
  } finally {
    // Optionally remove uploaded file after processing
    // fs.unlinkSync(filePath);
  }
});

// Simple ChatGPT summarization placeholder
async function summarizeMeeting(text) {
  // Replace with an actual OpenAI API call.
  // e.g., use axios to POST to OpenAI Chat completions with role system instruction to make minutes & action items.
  const snippet = text.length > 300 ? text.slice(0, 300) + '...' : text;
  return `Povzetek (demo): ${snippet}`;
}

// Zoom OAuth placeholders (dodatna implementacija zahteva Zoom app credentials)
app.get('/zoom/auth-url', (req, res) => {
  // Return the URL to redirect user to Zoom consent screen (implement with ZOOM_CLIENT_ID & redirect)
  res.json({ ok: true, url: 'https://zoom.us/oauth/authorize?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI' });
});

app.get('/zoom/callback', (req, res) => {
  // Handle exchange of code for access token here.
  res.json({ ok: true, note: 'Implement OAuth token exchange here' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`ZoomX backend running on ${PORT}`));
