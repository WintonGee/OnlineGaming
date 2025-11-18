# Online Gaming

A Next.js application for online gaming, featuring Sudoku and other games.

## Getting Started

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
npm run build
npm start
```

## Deployment

This project is configured for deployment on **Cloudflare Pages**.

### ⚠️ Important: Cloudflare Pages Configuration

**Before deploying**, you must configure the `nodejs_compat` compatibility flag in your Cloudflare Pages project settings.

See [CLOUDFLARE_DEPLOYMENT.md](./CLOUDFLARE_DEPLOYMENT.md) for detailed deployment instructions.

**Quick Setup:**
1. Go to Cloudflare Dashboard → Workers & Pages → Your Project
2. Settings → Compatibility Flags
3. Add `nodejs_compat` to both Production and Preview environments

## Tech Stack

- **Framework**: Next.js 14
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Cloudflare Pages

## Project Structure

```
src/
├── app/          # Next.js app directory
├── components/   # React components
└── lib/          # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## License

Private
