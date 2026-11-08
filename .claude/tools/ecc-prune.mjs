// Removes the ECC resources sa7tein doesn't use: agents, commands, skills, and
// rules for languages, platforms, and outside tools that aren't part of the
// stack. Anything a kept resource depends on stays, even if sa7tein may not use it.
//
// Run it after every ECC install or update, before ecc-portable-hooks.mjs:
//   node .claude/tools/ecc-prune.mjs
import { existsSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const claudeDir = fileURLToPath(new URL('..', import.meta.url));

const agents = [
  // Languages and frameworks outside the stack
  'cpp-build-resolver', 'cpp-reviewer', 'csharp-reviewer', 'dart-build-resolver',
  'django-build-resolver', 'django-reviewer', 'fastapi-reviewer', 'flutter-reviewer',
  'fsharp-reviewer', 'go-build-resolver', 'go-reviewer', 'harmonyos-app-resolver',
  'java-build-resolver', 'java-reviewer', 'kotlin-reviewer', 'php-reviewer',
  'python-reviewer', 'pytorch-build-resolver', 'rust-build-resolver', 'rust-reviewer',
  'swift-reviewer', 'vue-reviewer',
  // Domains sa7tein doesn't work in
  'chief-of-staff', 'healthcare-reviewer', 'homelab-architect', 'marketing-agent',
  'mle-reviewer', 'network-architect', 'network-config-reviewer', 'network-troubleshooter',
  'opensource-forker', 'opensource-packager', 'rag-pipeline-reviewer', 'spec-miner',
].map(name => `agents/${name}.md`);

const commands = [
  // Languages and frameworks outside the stack
  'cpp-build', 'cpp-review', 'cpp-test', 'fastapi-review', 'flutter-build', 'flutter-review',
  'flutter-test', 'go-build', 'go-review', 'go-test', 'kotlin-review', 'kotlin-test',
  'python-review', 'rust-build', 'rust-review', 'rust-test', 'vue-review',
  // Replaced by the PRD in Claude Docs and the GitHub backlog (see CLAUDE.md)
  'plan-prd', 'prp-prd', 'epic-claim', 'epic-decompose', 'epic-publish', 'epic-review',
  'epic-sync', 'epic-unblock', 'epic-validate',
  // Outside tools sa7tein doesn't use
  'jira', 'marketing-campaign', 'multi-backend', 'multi-execute', 'multi-frontend',
  'multi-plan', 'multi-workflow', 'pm2',
].map(name => `commands/${name}.md`);

const skills = [
  'codehealth-mcp', 'council-multi-model', 'inherit-legacy-style', 'product-lens',
  'windows-desktop-e2e',
].map(name => `skills/${name}`);

const rules = [
  'angular', 'arkts', 'cpp', 'csharp', 'dart', 'fsharp', 'golang', 'java', 'nuxt', 'perl',
  'php', 'python', 'ruby', 'rust', 'vue',
].map(name => `rules/ecc/${name}`);

const other = [
  // Files for other agent harnesses and for packaging ECC as a plugin
  '.agents', '.pi', 'PLUGIN_SCHEMA_NOTES.md', 'README.md', 'marketplace.json',
  'hooks/codex-hooks.json',
  // Used only by the /epic-* commands
  'scripts/lib/github-coordination', 'scripts/lib/github-coordination.js',
];

let removed = 0;
for (const relativePath of [...agents, ...commands, ...skills, ...rules, ...other]) {
  const target = path.join(claudeDir, relativePath);
  if (existsSync(target)) {
    rmSync(target, { recursive: true, force: true });
    removed += 1;
  }
}
console.log(`Removed ${removed} ECC resources that sa7tein doesn't use.`);
