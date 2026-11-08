# Third-party notices

The agent tooling in `.claude/` comes from these open-source projects and is committed as installed. `skills-lock.json` records the source and hash of every skill installed with the [skills CLI](https://github.com/vercel-labs/skills).

| Source | License | What it provides | License text |
|---|---|---|---|
| [tt-a1i/archify](https://github.com/tt-a1i/archify) | Apache-2.0 | Skill: archify | `.claude/skills/archify/LICENSE` |
| [cloudflare/skills](https://github.com/cloudflare/skills) | Apache-2.0 | Skills: cf-cli, cloudflare, cloudflare-app-bootstrap, cloudflare-one, durable-objects, frameworks-on-cloudflare, turnstile-spin, web-perf, workers-best-practices, workers-development, workers-profiling, wrangler | `.claude/licenses/cloudflare-skills.LICENSE` |
| [Postman-Devrel/postman-claude-code-plugin](https://github.com/Postman-Devrel/postman-claude-code-plugin) | Apache-2.0 | Skills: ai-readiness, api-discovery, api-documentation, api-engineer, api-mocking, api-monitoring, api-testing, bootstrap, ci-integration, collection-schema-v3, flows, performance-testing, postman-mcp-server | `.claude/licenses/postman-claude-code-plugin.LICENSE` |
| [affaan-m/ECC](https://github.com/affaan-m/ECC) v2.2.3 | MIT | The files the ECC installer wrote that `.claude/tools/ecc-prune.mjs` keeps: `.claude/agents/`, `.claude/commands/`, `.claude/rules/ecc/`, `.claude/scripts/`, `.claude/hooks/`, the hooks in `.claude/settings.json`, ECC's workflow skills, `.claude/AGENTS.md`, `.claude/plugin.json`, and `.claude/mcp-configs/`. Also these skills, installed with the skills CLI: api-design, coding-standards, contract-first, frontend-a11y, frontend-patterns, orch-add-feature, orch-change-feature, orch-fix-defect, orch-pipeline, orch-refine-code, react-patterns, react-performance, react-testing, security-review, vite-patterns | `.claude/licenses/ecc.LICENSE` |
