# Ink & Valor

A dark-fantasy gamebook with real-time 3D battles. Choose your path through the Hundred-Path Tome one page at a time. When the ink stirs, you fight in Battleheart-style tap-to-move battles with a team of heroes, 18 classes and over a hundred spells.

## Play locally

```bash
npm install
npm run build      # writes dist/index.html (open it in a browser)
```

## Deploy on Vercel

1. Go to https://vercel.com/new and import this GitHub repository.
2. Leave the settings as they are. `vercel.json` already tells Vercel to run `npm run build` and serve the `dist` folder.
3. Click **Deploy**. Every push to `main` redeploys automatically.

Progress saves automatically in the browser (localStorage). Use **Menu → Save code** to move a save between devices.

## Layout

- `src/js/` game source, concatenated in the order listed in `build.mjs`
  - `04_models.js` cel-shaded characters, `05_world.js` props and scenes
  - `06_data.js`, `06b_data2.js` items, cast, enemies, battles
  - `08_story.js` to `08e_story4.js` the four chapters, `09_chapters.js` chapter table
  - `11_battle.js` battle engine, `13_skills.js` abilities, `13c_champs.js` named champions
  - `15_book.js` page engine, sheet and shop, `16_main.js` saves and boot
- `src/css/style.css`, `src/index.html` page shell
- `public/` icons and web manifest
- `test/` headless test harness (Playwright)
