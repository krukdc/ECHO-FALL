import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

// #(Wczytuje słowniki i zatrzymuje budowanie, jeśli brakuje kluczy lub parametrów.)
export async function bundleLocales(root) {
  const messages={};
  for(const locale of ['pl','en','zh-TW'])messages[locale]=JSON.parse(await readFile(resolve(root,'src/locales',locale+'.json'),'utf8'));
  const keys=Object.keys(messages.en);
  const parameters=text=>[...new Set([...text.matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map(match=>match[1]))].sort().join(',');
  for(const [locale,entries] of Object.entries(messages)) {
    for(const key of keys) {
      if(typeof entries[key]!=='string'||(!key.startsWith('legacy.')&&!entries[key].trim()))throw new Error(`${locale}: brak tłumaczenia ${key}`);
      if(parameters(entries[key])!==parameters(messages.en[key]))throw new Error(`${locale}: inne parametry ${key}`);
    }
    for(const key of Object.keys(entries))if(!Object.hasOwn(messages.en,key))throw new Error(`${locale}: nieznany klucz ${key}`);
  }
  const aliases=JSON.parse(await readFile(resolve(root,'src/locales/source-aliases.json'),'utf8'));
  for(const [source,key] of Object.entries(aliases))if(!source||!Object.hasOwn(messages.en,key))throw new Error(`Nieprawidłowy alias tłumaczeń: ${key}`);
  for(const dictionary of Object.values(messages))for(const key of Object.keys(dictionary))if(key.startsWith('legacy.'))delete dictionary[key];
  // #(Sprawdza klucze zapisane w kodzie oraz w statycznych elementach HTML.)
  const jsRoot=resolve(root,'src/js');
  const sources=await Promise.all((await readdir(jsRoot)).filter(name=>name.endsWith('.js')).map(name=>readFile(resolve(jsRoot,name),'utf8')));
  sources.push(await readFile(resolve(root,'src/index.template.html'),'utf8'));
  for(const source of sources){
    for(const match of source.matchAll(/\b(?:t|th)\(\s*['"]([^'"]+)['"]/g))if(!Object.hasOwn(messages.en,match[1])&&!(match[1].endsWith('.')&&Object.keys(messages.en).some(key=>key.startsWith(match[1]))))throw new Error(`Brak klucza użytego w kodzie: ${match[1]}`);
    for(const match of source.matchAll(/data-i18n="([^"]+)"/g))if(!Object.hasOwn(messages.en,match[1]))throw new Error(`Brak klucza w HTML: ${match[1]}`);
  }
  // #(Chroni osadzony skrypt przed zamknięciem go przez tekst tłumaczenia.)
  const serialize=value=>JSON.stringify(value).replaceAll('<','\\u003c').replaceAll('\u2028','\\u2028').replaceAll('\u2029','\\u2029');
  return `const I18N_MESSAGES=${serialize(messages)};\nconst I18N_ALIASES=${serialize(aliases)};`;
}
