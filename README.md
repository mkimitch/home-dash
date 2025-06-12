# Momentum Dashboard Clone

A feature-rich personal dashboard inspired by Momentum Dash, built with React, TypeScript, and Express.

## Features

- 🖼️ Dynamic background images from Unsplash
- 👋 Time-based personalized greeting
- 🎯 Daily focus task
- ✅ Minimal to-do list with local and cloud sync
- 🌤️ Weather widget with location detection
- 💬 Daily inspirational quotes
- 🔖 Quick-link bookmarks
- ⚙️ Customizable settings
- 📱 Offline-first PWA functionality
- ♿ Fully accessible (WCAG 2.2 AA compliant)

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand (state management)

### Backend
- Node.js with Express
- Prisma ORM
- PostgreSQL
- JWT Authentication

### Testing & Quality
- Vitest + React Testing Library
- Playwright (e2e testing)
- ESLint + Prettier
- Husky pre-commit hooks

## Getting Started

### Prerequisites
- Node.js (v18+)
- Yarn package manager
- Docker and Docker Compose

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/momentumdash-clone.git
cd momentumdash-clone
```

2. Install dependencies
```bash
yarn
```

3. Set up environment variables
```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

4. Start development servers
```bash
yarn dev
```

5. Access the application at http://localhost:3000

### Using Docker

To run the full stack using Docker:

```bash
docker compose up
```

## Production Build

```bash
yarn build
```

## Testing

```bash
# Run all tests
yarn test

# Run frontend tests only
yarn workspace frontend test

# Run backend tests only
yarn workspace backend test

# Run end-to-end tests
yarn e2e

# Run accessibility checks
yarn a11y
```

## Deployment

### Vercel

1. Connect your GitHub repository to Vercel
2. Configure the environment variables
3. Deploy with Vercel CLI:
```bash
vercel
```

## License

MIT
