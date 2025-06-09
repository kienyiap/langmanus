# Express Server

This simple Node.js backend forwards chat requests to various LLM providers.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the example environment file and add any API keys you want to use:
   ```bash
   cp .env.example .env
   # edit .env to set OPENAI_API_KEY, ANTHROPIC_API_KEY or GEMINI_API_KEY
   ```

## Running

Start the server with:
```bash
npm start
```
The server listens on the port defined in `.env` (default `3001`).

Send a POST request to `/chat` with a JSON body containing `messages` and optional `model`, `provider`, or `max_tokens` fields. `provider` can be `openai`, `claude`, or `gemini`.
