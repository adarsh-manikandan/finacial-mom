# Financial Mom - Smart Financial Dashboard

A modern financial dashboard with AI-powered insights and personal finance management features.

## Features

- 💬 AI-powered financial advisor
- 📊 Spending analytics and insights
- 💳 Subscription management
- 📈 Budget tracking
- 📱 Responsive design
- 🔒 Secure data handling

## Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Recharts
- React Hook Form

### Backend (Requirements)
- Node.js/Express or Next.js API routes
- PostgreSQL
- Redis
- OpenAI Integration
- Plaid/Banking API Integration

## Project Structure

```
├── src/
│   ├── components/      # React components
│   ├── pages/          # Next.js pages
│   ├── styles/         # Global styles
│   ├── lib/           # Utilities and helpers
│   └── types/         # TypeScript types
├── public/            # Static assets
├── docs/             # Documentation
│   └── backend-requirements.md
└── package.json
```

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/financial-mom.git
cd financial-mom
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Documentation

- [Backend Requirements](docs/backend-requirements.md) - Comprehensive backend implementation guide
- [API Documentation](docs/api.md) - API endpoints and usage
- [Contributing Guide](CONTRIBUTING.md) - Guidelines for contributing to the project

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0) - see [LICENSE](LICENSE) for details.

This means:
- You can freely use, modify, and distribute this software
- If you modify and distribute this software, you must:
  - Make your modifications open source
  - License your modifications under GPL-3.0
  - Include the original copyright notice
- This effectively prevents use in proprietary/commercial software 