# GamesAdFree (gamesadfree.com)

Ad-free browser games. Next.js 16 + React 19, Tailwind, shadcn/ui. Every page is statically prerendered; deployed by Cloudflare Pages from `main`.

- Issues: GitHub Issues on `WintonGee/OnlineGaming` via the `tracker` MCP.
- Conventions for adding or changing a game: `GAME_IMPLEMENTATION_GUIDE.md`. Each game lives in `src/app/games/<slug>/` and is registered in `src/app/games/index.ts`.
- Game rules belong in pure functions under `logic/`; hooks orchestrate, components render.

## Gate
Run before every PR:

```bash
npx tsc --noEmit
npm run validate   # architecture rules in scripts/
npm run build
```

Lint and unit tests are not set up yet (tracked as an issue); add them to the gate when they land.
