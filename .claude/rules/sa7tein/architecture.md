# Architecture rules

These rules hold for every issue, in Design, Development, and Testing. Change a rule only through its own issue, once the owner approves (see `CLAUDE.md`). The issue numbers point to where each rule is explained.

## Platform

- Everything runs on Cloudflare. External services are used only for what Cloudflare doesn't provide: payments, maps, WhatsApp, and exchange rates (#13).
- Reach every external service through an adapter, so it can be replaced, and swapped for a test double in tests.
- One Worker serves the customer and merchant app, and a separate Worker serves the ops app. Both reach the same Durable Objects, Workflows, and Queues. The ops app is behind Cloudflare Access (#13, #17).
- The Worker contract is the same for every client, and every WebSocket message carries a contract version, so the PWA and a native app can run side by side (#13, #15).
- Analytics use Workers Analytics Engine, and logs use Workers Logs.

## Data

- Durable Objects with SQLite storage are the database. Data is stored through the Durable Object storage's KV async API (#13).
- One Durable Object class is one domain model, and one instance is one row. No Durable Object class has only one instance forever (#13).
- Nothing is ever deleted permanently, chat messages included. A delete makes a system archive: hidden from users, but kept with its history (#13, #16).
- Workers KV holds only single-row application configuration and the DO instance registry. Workers KV has no delete operation, and the registry only supports read and create. Its values aren't copied into Durable Objects, and multi-row configuration lives in Durable Objects (#13).
- Workers KV can take up to 60 seconds to be consistent everywhere, so the owning Durable Object stays the source of truth and validates every action (#13).
- Files go to R2, and a model keeps only the R2 key (#13).

## Writes, events, and schedules

- The system is fully asynchronous, reactive, and event-driven, with no exceptions (#14, #15):
  - The Workers only read Durable Object data, through RPC. Every write, including writing application configuration to Workers KV, runs as a Workflow started from a Queue, and the Workflow changes each Durable Object through RPC.
  - A write command from a client gets only an acknowledgment: accepted, or rejected by input validation. Its result always arrives as an event over WebSocket.
  - Request-response is only for reads: a screen's first snapshot, and the resync after the WebSocket connects again.
  - Nothing polls. External services report changes through webhooks.
  - The UI changes state only on events. After an accepted command, it shows a pending state, with no optimistic update.
- A row's schedule runs on its Durable Object alarm. A global schedule whose time ops sets, such as the daily exchange rate update and the daily payout, runs as a Workflow that waits until that time, and is scheduled again when ops changes it. A time that ops or users can change never uses a Cron Trigger (#13).
- Every Workflow step that changes a value with a balance, a quota, or a limit uses an idempotency key: money, sa7tein poin, order quota, a program's budget, usage limits and exclusive promo uses, and stock. Every other step is also safe to retry (#14).

## Money and time

- An append-only audit ledger records every money movement at the payment gateway, and is reconciled daily with the payment gateway's report. It is a record, not a balance, and only ops sees it (#43).
- JOD has 3 decimals and IDR is a whole number. Money never uses floating point (#13).
- Times are shown in the Asia/Amman time zone (#13).
