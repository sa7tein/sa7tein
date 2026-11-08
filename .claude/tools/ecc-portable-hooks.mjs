// Makes the ECC hooks in .claude/settings.json work from any checkout path.
//
// The ECC installer writes the absolute path of the machine it ran on into
// every hook command (base64-encoded). This script swaps that path for the
// project directory that Claude Code passes to every hook, so the same
// settings work on every machine and in cloud sessions.
//
// Run it after every ECC install or update:
//   node .claude/tools/ecc-portable-hooks.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const settingsFile = new URL('../settings.json', import.meta.url);
const bakedRoot = /var e=Buffer\.from\('[A-Za-z0-9+/=]+','base64'\)\.toString\('utf8'\);/g;
const projectRoot =
  "var e=process.env.CLAUDE_PROJECT_DIR?p.join(process.env.CLAUDE_PROJECT_DIR,'.claude'):'';";

const text = readFileSync(settingsFile, 'utf8');
const count = (text.match(bakedRoot) || []).length;
writeFileSync(settingsFile, text.replace(bakedRoot, projectRoot));
console.log(`Replaced the install path in ${count} hook commands.`);
