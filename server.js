import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const apiKey = process.env.OPENROUTER_API_KEY;
const defaultModels = [
  'meta-llama/llama-4-scout:free',
  'mistralai/mistral-7b-instruct:free',
  'deepseek/deepseek-chat-v3-0324:free',
];

const parseModels = (raw) => {
  if (!raw) return defaultModels;
  return raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const models = parseModels(process.env.OPENROUTER_MODELS);

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/openrouter-chat', async (req, res) => {
  if (!apiKey) {
    return res.status(500).json({
      error: 'OPENROUTER_API_KEY must be configured.',
    });
  }

  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Missing messages array in request body.' });
  }

  let lastError = null;

  for (const model of models) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://localhost',
          'X-Title': 'Iqraa Academy',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.3,
          max_tokens: 512,
        }),
      });

      const responseText = await response.text();
      let data = null;
      try {
        data = responseText ? JSON.parse(responseText) : null;
      } catch {
        data = null;
      }

      if (!response.ok) {
        lastError = {
          model,
          status: response.status,
          error: data?.error?.message ?? data?.error ?? responseText,
        };
        continue;
      }

      const content = data?.choices?.[0]?.message?.content;
      if (!content) {
        lastError = {
          model,
          status: 502,
          error: 'OpenRouter returned invalid JSON or empty response.',
          raw: responseText,
        };
        continue;
      }

      return res.json({
        choices: [
          {
            message: {
              role: 'assistant',
              content,
            },
          },
        ],
        raw: data,
      });
    } catch (error) {
      lastError = {
        model,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  return res.status(502).json({
    error: 'All OpenRouter models failed.',
    details: lastError,
  });
});

app.listen(port, () => {
  console.log(`OpenRouter proxy listening on http://localhost:${port}`);
});
