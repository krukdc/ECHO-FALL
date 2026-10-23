import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { bundleLocales } from './locales.mjs';

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repositoryRoot = resolve(sourceRoot, '../..');
const templatePath = resolve(sourceRoot, 'src/index.template.html');
const stylesPath = resolve(sourceRoot, 'src/styles.css');
const outputPath = resolve(repositoryRoot, 'ECHO-FALL.build.0.12.5.html');
const fragments = [
  '00-bootstrap.js',
  '05-epilogue-rules.js',
  '10-enemy-combat.js',
  '20-audio.js',
  '30-world-and-ai.js',
  '40-progression-and-menus.js',
  '50-render-input-and-localization.js',
  '60-objectives-and-synergies.js',
  '70-directives-and-challenges.js',
  '80-fullscreen-and-run-setup.js',
  '85-endless-mode.js',
  '90-history-and-startup.js',
];

// #(Zastępuje znacznik wyłącznie wtedy, gdy szablon zawiera go dokładnie raz.)
function replaceExactlyOnce(source, marker, replacement, label) {
  const occurrences = source.split(marker).length - 1;
  if (occurrences !== 1) {
    throw new Error(`Szablon musi zawierać dokładnie jeden znacznik ${label}; znaleziono: ${occurrences}.`);
  }
  return source.replace(marker, () => replacement);
}

// #(Składa produkcyjne źródła w jeden samodzielny plik głównej gry.)
async function build() {
  const [template, styles, ...scripts] = await Promise.all([
    readFile(templatePath, 'utf8'),
    readFile(stylesPath, 'utf8'),
    ...fragments.map((name) => readFile(resolve(sourceRoot, 'src/js', name), 'utf8')),
  ]);
  let output = replaceExactlyOnce(template, '/*__ECHO_FALL_STYLES__*/', styles, 'CSS');
  const script=replaceExactlyOnce(scripts.join('\n\n'),'/*__ECHO_I18N__*/',await bundleLocales(sourceRoot),'słowniki');
  output = replaceExactlyOnce(output, '/*__ECHO_FALL_SCRIPT__*/', script, 'JavaScript');
  await writeFile(outputPath, output, 'utf8');
  console.log(`Zbudowano: ${outputPath}`);
}

build().catch((error) => {
  console.error(`Nie udało się zbudować gry: ${error.message}`);
  process.exitCode = 1;
});
