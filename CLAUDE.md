# sa7tein

Code and living documentation for sa7tein. Everything in this repository is written in English.

## Where requirements come from

- Every piece of work starts from a GitHub issue. Requirements come from the issue and from the PRD and ERD, which live in Claude Docs outside this repository.
- Don't create PRD, user story, epic, sprint, or task-list files. ECC's `/plan-prd`, `/prp-prd`, `story-lifecycle`, and `/epic-*` tools aren't used here. Put plans in the issue or the pull request.
- The backlog uses GitHub issue types and issue fields, not labels:
  - **Types:** Enhancement (new behavior, including MVP requirements from the PRD), Changes (a change to existing behavior), Problem (user behavior the docs don't cover that conflicts with them), Bug (the app doesn't match the docs), Task (technical work only).
  - **Fields:** Sequence (work order), Stage, Area, Effort, Related issues, Start date, Target date, Frequency.
- The MVP follows waterfall stages (Requirement, Design, Development, Testing, Release), tracked in the Stage field of each issue.

## How work is done

ECC defines the engineering workflow for the Development and Testing stages. Its rules in `.claude/rules/ecc/` apply as written, including test-driven development with at least 80% coverage and Conventional Commits.

| Issue type | Start with |
|---|---|
| Enhancement | `/orch-add-feature` |
| Changes | `/orch-change-feature` |
| Bug | `/orch-fix-defect` |
| Problem | The `intent-driven-development` skill, then a Changes or Enhancement issue |
| Task | `/plan`, or `/orch-refine-code` for a refactor |

- ECC agents are installed in this repository under their plain names, such as `planner` and `code-reviewer`, not `ecc:planner`.
- Pull requests use `.github/pull_request_template.md` and close their issue with `Closes #<number>`.
- Keep the Co-Authored-By trailer on commits made with Claude.
- Make diagrams with the `archify` skill. Put other technical documentation, such as architecture decision records, in `docs/`.

## Stack

TypeScript throughout: Cloudflare Workers, Durable Objects, Queues, Workflows, and R2 on the backend, and React PWAs on the frontend.

## Maintaining the agent setup

- ECC 2.2.3 was installed with `npx ecc-universal@2.2.3 install --target claude-project --profile core --enable-hooks`. After every ECC install or update, run these two scripts in order:
  1. `node .claude/tools/ecc-prune.mjs` removes the ECC resources sa7tein doesn't use, such as the agents, commands, and rules for other languages. Edit its lists to keep or remove more.
  2. `node .claude/tools/ecc-portable-hooks.mjs` replaces the installer's machine-specific path in the hook commands with the project directory, so the hooks work on every machine and in cloud sessions.
- Because of these two scripts, `ecc doctor` reports missing and drifted managed files. That is expected.
- The other skills, including the extra ECC skills, are tracked in `skills-lock.json`. Update them with `npx skills update`.
