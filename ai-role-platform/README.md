# AI Role Platform

This is a React + Tailwind project created with Vite. It demonstrates a simple
AI role system. The homepage shows a list of roles. Clicking an avatar navigates
to a chat page that displays the role's system prompt.

## Development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:3000` by default.

### Configuration

Copy `.env.example` to `.env` to configure the backend URL and default provider:

```bash
cp .env.example .env
# edit .env and set VITE_API_BASE and VITE_PROVIDER
```

### Chat History

Conversations are stored in your browser's `localStorage`. Each request sends the
accumulated history to the backend using the configured provider while trimming
the oldest messages so the total token count stays under roughly 4k tokens.

### UI Features

The chat interface is styled with Tailwind CSS. Messages scroll smoothly and fade in as they arrive. Input fields animate on focus and role cards lift slightly when hovered to provide an interactive feel.
