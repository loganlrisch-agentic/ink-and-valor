// Build Ink & Valor into a static site in dist/.
//   node build.mjs          -> dist/index.html (+ dist/vendor, assets)
//   node build.mjs --dev    -> also dist/dev.html for local testing against node_modules
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, 'dist');
const ORDER = ['00_core', '01_audio', '01b_music', '02_art', '03_kit3d', '04_models', '05_world', '06_data', '06b_data2', '06c_data3', '06d_data4', '06e_gear', '07_hero', '08_story', '08b_story1x', '08c_story2', '08d_story3', '08c2_story2x', '08e_story4', '08d3_story3x', '08f_side1', '08g_side2', '09_chapters', '09b_lore', '10_r3d', '11_battle', '12_bview', '13_skills', '13c_champs', '13d_champs2', '14_hud', '15_book', '16_main', '17_arena'];
const FONTS = [['IM Fell English', 'fell.woff2', 'normal', 'normal'], ['IM Fell English', 'fell-italic.woff2', 'normal', 'italic'], ['IM Fell English SC', 'fell-sc.woff2', 'normal', 'normal'], ['Cinzel', 'cinzel.woff2', '700', 'normal'], ['Grenze Gotisch', 'grenze.woff2', '800', 'normal']];
const EX = ['shaders/CopyShader.js', 'shaders/LuminosityHighPassShader.js', 'postprocessing/EffectComposer.js', 'postprocessing/RenderPass.js', 'postprocessing/ShaderPass.js', 'postprocessing/UnrealBloomPass.js'];
const THREE_DIR = path.join(ROOT, 'node_modules', 'three');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

function build(mode) {
  let html = read('src/index.html');
  const css = read('src/css/style.css');
  const fonts = FONTS.map(([fam, f, w, s]) => {
    const src = mode === 'dev' ? `url('../fonts/${f}') format('woff2')` : `url(data:font/woff2;base64,${fs.readFileSync(path.join(ROOT, 'fonts', f)).toString('base64')}) format('woff2')`;
    return `@font-face{font-family:'${fam}';src:${src};font-weight:${w};font-style:${s};font-display:swap}`;
  }).join('\n');
  const js = ORDER.map((n) => read(`src/js/${n}.js`)).join('\n');
  let three;
  if (mode === 'dev') three = ['../node_modules/three/build/three.min.js', ...EX.map((e) => `../node_modules/three/examples/js/${e}`)];
  else if (mode === 'site' && fs.existsSync(THREE_DIR)) {
    // self-host three.js so the game never depends on a CDN
    const V = path.join(DIST, 'vendor');
    fs.mkdirSync(path.join(V, 'shaders'), { recursive: true }); fs.mkdirSync(path.join(V, 'postprocessing'), { recursive: true });
    fs.copyFileSync(path.join(THREE_DIR, 'build/three.min.js'), path.join(V, 'three.min.js'));
    for (const e of EX) fs.copyFileSync(path.join(THREE_DIR, 'examples/js', e), path.join(V, e));
    three = ['vendor/three.min.js', ...EX.map((e) => `vendor/${e}`)];
  } else three = ['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', ...EX.map((e) => `https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/${e}`)];
  const head = three.map((s) => `<script src="${s}"></script>`).join('\n') + (mode === 'site' ? '\n<link rel="manifest" href="manifest.webmanifest">\n<link rel="icon" href="icon-192.png">\n<link rel="apple-touch-icon" href="apple-touch-icon.png">\n<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-status-bar-style" content="black">\n<meta name="theme-color" content="#1a0e08">' : '');
  html = html.replace('/*FONTS*/', () => fonts).replace('/*CSS*/', () => css).replace('<!--THREE-->', () => head).replace('/*JS*/', () => js.replace(/<\/script/g, '<\\/script'));
  return html;
}

fs.mkdirSync(DIST, { recursive: true });
fs.writeFileSync(path.join(DIST, 'index.html'), build('site'));
// static assets (icons, manifest)
const PUB = path.join(ROOT, 'public');
if (fs.existsSync(PUB)) for (const f of fs.readdirSync(PUB)) fs.copyFileSync(path.join(PUB, f), path.join(DIST, f));
if (process.argv.includes('--dev')) fs.writeFileSync(path.join(DIST, 'dev.html'), build('dev'));
if (process.argv.includes('--artifact')) fs.writeFileSync(path.join(DIST, 'artifact.html'), build('artifact'));
console.log('built', fs.statSync(path.join(DIST, 'index.html')).size >> 10, 'KB');
