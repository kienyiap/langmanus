import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';

dotenv.config();

const app = express();
app.use(express.json());

app.post('/chat', async (req, res) => {
  const {
    messages,
    model = 'gpt-3.5-turbo',
    max_tokens,
    provider = 'openai',
  } = req.body;
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages must be an array' });
  }

  try {
    let response;
    if (provider === 'claude') {
      response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        { model: model || 'claude-3-opus-20240229', messages, max_tokens },
        {
          headers: {
            'content-type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
          },
        }
      );
    } else if (provider === 'gemini') {
      const url =
        `https://generativelanguage.googleapis.com/v1beta/models/${
          model || 'gemini-pro'
        }:generateContent?key=${process.env.GEMINI_API_KEY}`;
      const contents = messages.map(m => ({ role: m.role, parts: [{ text: m.content }] }));
      response = await axios.post(
        url,
        { contents },
        { headers: { 'content-type': 'application/json' } }
      );
    } else {
      response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        { model, messages, max_tokens },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );
    }
    res.json(response.data);
  } catch (err) {
    const msg = err.response?.data || err.message;
    console.error('LLM API error:', msg);
    res.status(500).json({ error: 'LLM request failed' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
