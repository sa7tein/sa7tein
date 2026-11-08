# sa7tein

Code and living documentation for sa7tein. Everything in this repository is written in English.

## Where requirements come from

- Every piece of work starts from a GitHub issue, and the issue is the only source of requirements. The MVP issues are split from a PRD that is retired once the split is done.
- There is no ERD to copy. Derive the data model from the issues during the Design stage.
- Don't create PRD, user story, epic, sprint, or task-list files. ECC's `/plan-prd`, `/prp-prd`, `story-lifecycle`, and `/epic-*` tools aren't used here. Put plans in the issue or the pull request.
- The backlog uses GitHub issue types and issue fields, not labels:
  - **Types:** Enhancement (new behavior, including the MVP requirements), Changes (a change to existing behavior), Problem (user behavior the docs don't cover that conflicts with them), Bug (the app doesn't match the docs), Task (technical work only).
  - **Fields:** Sequence (work order), Stage, Area, Effort, Related issues, Start date, Target date, Frequency.

## How an issue moves

Every issue goes through five stages, recorded in its Stage field: Requirement, Design, Development, Testing, and Release. Its Status on the project board follows the stage.

| Status | Stages |
|---|---|
| Todo | Requirement |
| In Progress | Design, Development, Testing |
| Done | Release |

- Only one issue is In Progress at a time. Start the next issue, in Sequence order, only after the current one reaches Release or is dropped.
- The MVP issues were written together at the Requirement stage. From Design on, issues go through the stages one at a time, during the MVP and after it.
- **Design:** create the issue's branch and a draft pull request. Commit the design (living documentation and Archify diagrams) to that branch and review it through the branch's Cloudflare preview of the docs. It merges together with the code.
- **Development and Testing** follow ECC (see the next section). During Testing, the branch is deployed to staging, a separate Cloudflare account that uses sandbox credentials and Meta's WhatsApp test number.
- **Release:** once testing passes, merge the pull request into `main` and deploy `main` to production on sa7tein's Cloudflare account. The issue is then at Release and Done. This holds during the MVP too, so production is deployed after every merged issue. Deploys run through GitHub Actions, and production deploys need the owner's approval.
- **Missed requirements:** until an issue reaches Release, its requirements can still change. When a requirement turns out to be missing or wrong, edit the issue once the owner approves, add a comment to the issue that says what changed and why, and note the decision in the handoff note and the pull request. The design and code on the branch then follow the issue. The Stage doesn't move back: before Release it only moves forward, and it doesn't have to match the work at hand.
- A missed requirement that is a large new need, or that belongs to another feature, gets its own issue instead: edit that feature's issue if it is still at Requirement, or create an Enhancement issue whose Sequence comes right after the current one. A change to an issue that is already at Release is a Changes issue, or a Bug when the app doesn't match the docs.
- **Dropped issues:** close them as "Not planned" and leave the Stage as it was. If the issue has a branch, close its pull request without merging and delete the branch. If that branch is deployed to staging, redeploy staging from `main`.

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

## Continuing work on another machine

Work in progress lives on the issue's branch, so it can continue on any machine.

- While an issue is In Progress, keep a handoff note at `.claude/handoff.md` on its branch: the issue, the stage, what's done, the next step, decisions made with the owner, and open questions.
- At every stopping point, such as the end of a session or when the owner asks, update the note, commit it with the work, and push the branch, even if the work is unfinished.
- At the start of a session, pull the branch of the In Progress issue and read its `.claude/handoff.md` before doing anything else. To find the branch, look for the open pull request that closes that issue.
- Delete the note before the pull request leaves draft. Anything still worth keeping goes into the issue, the pull request, or the docs.

## Stack

TypeScript throughout: Cloudflare Workers, Durable Objects, Queues, Workflows, and R2 on the backend, and React PWAs on the frontend.

## Data model naming

- Name each domain model in UPPER_SNAKE_CASE, the same as its ENTITY_TYPE in the DO instance registry, for example `MERCHANT` or `ORDER_ITEM`.
- Name fields in snake_case, for example `merchant_id`.
- Name status and other enum values in camelCase, for example `waitingPayment`.
- Name a field that holds another row's id `<model>_id`. Add a prefix that names the role when a model is referenced for a specific role or more than once.
- End money fields in `_jod` or `_idr`, and timestamps in `_at`. Timestamps are stored in UTC.

## Maintaining the agent setup

- ECC 2.2.3 was installed with `npx ecc-universal@2.2.3 install --target claude-project --profile core --enable-hooks`. After every ECC install or update, run these two scripts in order:
  1. `node .claude/tools/ecc-prune.mjs` removes the ECC resources sa7tein doesn't use, such as the agents, commands, and rules for other languages. Edit its lists to keep or remove more.
  2. `node .claude/tools/ecc-portable-hooks.mjs` replaces the installer's machine-specific path in the hook commands with the project directory, so the hooks work on every machine and in cloud sessions.
- Because of these two scripts, `ecc doctor` reports missing and drifted managed files. That is expected.
- The other skills, including the extra ECC skills, are tracked in `skills-lock.json`. Update them with `npx skills update`.
