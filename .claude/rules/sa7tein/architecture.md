# Architecture rules

These rules hold for every issue, in Design, Development, and Testing. Change a rule only through its own issue, once the owner approves (see `CLAUDE.md`). The issue numbers point to where each rule is explained. On 2026-11-27 the owner moved sa7tein from Cloudflare to Odoo Community on AWS. Until the issues are updated, an issue that still names a Cloudflare service follows these rules instead.

## Platform

- Everything runs on AWS. External services are used only for what AWS doesn't provide: payments and bank transfers (the BCA bank API), maps, WhatsApp, and exchange rates (#13).
- Reach every external service through an adapter, so it can be replaced, and swapped for a test double in tests.
- sa7tein has three parts, each in its own repository, released together:
  - **Module ops**, an Odoo Community custom module, is the backend. It holds the business data and rules, and the screens ops use to run sa7tein.
  - **The middleware**, a set of AWS services between Odoo and the apps, accepts commands, publishes events in realtime, and calls the external services.
  - **The frontend** is the customer and merchant PWA.
- **Module IT**, a second Odoo custom module, is the engineering workspace: releases, their documents, and the agents of the BA, DEVSECOPS, and QA roles. It is released on its own.
- Production and staging each run exactly one Odoo instance, with module ops and module IT installed together (owner decision of 2026-11-27). So a module IT release is deployed like a module ops release, and restoring the database also restores module IT's records.
- Odoo runs 18.0 Community (owner decision of 2026-11-27). Ops and IT users work in Odoo's own web client, which doesn't need to update without a reload.
- The contract between the middleware and the apps is the same for every client, and every WebSocket message carries a contract version, so the PWA and a native app can run side by side (#13, #15).
- Logs, metrics, and alarms use Amazon CloudWatch.

## Data

- Odoo's PostgreSQL database, on Amazon RDS, is the only store of business data. Its models are module ops models, and only Odoo reads and writes them.
- The middleware never reads or writes Odoo's database. It calls only the JSON endpoints that module ops defines, with its own integration user, so an Odoo upgrade doesn't change what the middleware calls. It keeps only what it needs to deliver commands and events, such as connections, queued messages, and idempotency keys.
- Customers and merchants never get Odoo users. The middleware signs them in (#21) and passes their account to Odoo, and module ops checks what that account may do.
- Nothing is ever deleted permanently, chat messages included. A delete archives the record: hidden from users, but kept with its history (#16).
- A value that ops can change is an application configuration key in Odoo, listed in #19, never a constant in code. The middleware gets the values it needs from Odoo, and Odoo validates every action against the current value (#19).
- Files are Odoo attachments in the filestore on Amazon EFS, shared by every Odoo container.
- Secrets, such as the bank, WhatsApp, and LLM provider keys, are kept in AWS Secrets Manager. Odoo keeps only their names.

## Writes, events, and schedules

- The apps are fully asynchronous, reactive, and event-driven, with no exceptions (#14, #15):
  - A write command from an app gets only an acknowledgment from the middleware: accepted, or rejected by input validation. The middleware puts it on an SQS FIFO queue, and a worker sends it to the module ops endpoint for that command. Its result always arrives as an event over WebSocket.
  - Request-response is only for reads: a screen's first snapshot, and the resync after the WebSocket connects again.
  - Every change of business state that another party can observe is written by Odoo to an outbox, in the same transaction as the change. After commit, a dispatcher sends it to Amazon EventBridge, and the middleware publishes it through AWS AppSync Events to every client entitled to it, using the audiences in #15. A change that isn't committed never sends an event.
  - The UI changes state only on events. After an accepted command, it shows a pending state, with no optimistic update.
  - Nothing polls. External services report changes through webhooks, which the middleware passes to Odoo as commands. A status check right after an event, the outbox's recovery sweep after a crash, and the status checks and bank statement read of the daily payout run at its set time, aren't polling (#39, #43).
- Odoo retries a transaction that conflicts with another, so a transaction never calls an external service. Calls to external services run in the middleware after commit, started from the outbox, and their results come back to Odoo as commands. Work with several external calls, such as the daily payout run's calls to the bank API, runs as an AWS Step Functions workflow.
- Every command, and every step that changes a value with a balance, a quota, or a limit, uses an idempotency key that Odoo checks: money, sa7tein poin, order quota, a program's budget, usage limits and exclusive promo uses, and stock. Every other step is also safe to retry (#14).
- Two actions that change the same balance, quota, limit, or stock are serialized by a row lock in Odoo, so they can't both pass a check that only one of them fits.
- A schedule, of one row or of the whole system, runs as an Odoo scheduled action at the time that ops or users set, and moves at once when that time changes. Its calls to external services run in the middleware (#14, #43).

## Deployment and availability

- There is no planned downtime: every release and every maintenance happens while the apps stay up.
  - The frontend is deployed as new versioned files, and a client on the previous contract version keeps working.
  - The middleware and Odoo are deployed blue/green on Amazon ECS: the new version starts next to the old one, traffic moves once it is healthy, and CloudWatch alarms move it back automatically.
  - Odoo's database changes follow expand/contract: a release only adds models, fields, and columns, so the previous release keeps working on the same database. Removing or renaming what the previous release uses waits for a later release.
  - Odoo's module upgrade runs as its own task before traffic moves, after a database snapshot and with the previous release's scheduled actions stopped.
  - The database is RDS for PostgreSQL Multi-AZ behind RDS Proxy, and engine upgrades use RDS Blue/Green Deployments.
  - While Odoo pauses, commands wait in their queue, and the apps show them as pending.
- Rollback runs from AWS, never from Odoo. The previous release keeps running until the bake time ends, so moving traffic back is instant. Because of expand/contract, rolling back code needs no database change, and a snapshot is restored only when a migration damaged data.
- Odoo's sessions and filestore are on EFS, shared by every Odoo container, so moving traffic signs nobody out.
- Staging is a separate AWS environment with its own Odoo instance, the sandbox credentials of every external service, and Meta's WhatsApp test number. Every deploy is rehearsed on staging first.

## Agents

- The agents of the IT roles run outside Odoo's workers, on Amazon Bedrock AgentCore Runtime or ECS, and reach Odoo only through Odoo's external API, each with its own Odoo user: JSON-RPC on 18.0, and JSON-2 after Odoo is upgraded past 18.0, since Odoo deprecated JSON-RPC in 19.0.
- An agent user can read business models but never create, update, or delete them, and doesn't see personal data fields, because what an agent reads can be sent to its LLM provider. It creates and changes only the module IT records of its role (owner decision of 2026-11-27).
- Code that an agent writes reaches production only through a pull request that a person approves.

## Money and time

- An append-only audit ledger records every money movement of payments and of sa7tein's bank account. The system reconciles it automatically with the bank statement it reads through the bank API, which also shows which payments are settled. It is a record, not a balance, and only ops sees it (#43).
- JOD has 3 decimals and IDR is a whole number. Money never uses floating point, so it isn't kept in Odoo's Float or Monetary fields, which are floats in Python. It is kept as an integer in the smallest unit: fils for JOD and rupiah for IDR (#13).
- Times are stored in UTC and shown in the Asia/Amman time zone, unless an issue says otherwise, such as the daily payout time and payout dates in WIB (#13, #19, #43).
