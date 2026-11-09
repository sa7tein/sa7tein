# Testing rules

On top of the ECC testing rules, every issue's tests cover these rules wherever its feature touches them.

- A retried Workflow step never applies its change twice: no double charge, payout, refund, points, quota, budget, promo use, or stock change.
- Every create, update, and delete creates its activity entry and per-field change traces (#16).
- A delete makes a system archive, and nothing can be deleted permanently, chat messages included.
- A write command returns only an acknowledgment, its result arrives as an event, and the UI shows a pending state until then.
- After the WebSocket connects again, the client gets the state it missed, and a client on the previous contract version keeps working during a migration.
- The owning Durable Object validates an action even when the registry or the configuration hasn't propagated yet.
- Money keeps its precision and rounding: JOD with 3 decimals, IDR as whole numbers, bills rounded up to the hundred, and payouts rounded down to the rupiah (#38, #43).
- Times are checked around midnight in Asia/Amman and in UTC, and around the daily schedules.
- The ops Worker refuses requests without Cloudflare Access.
- Integration tests run on the Workers runtime with local bindings for Durable Objects, Workers KV, Queues, and Workflows, not with mocked Durable Objects.
- External services are replaced by test doubles through their adapters.
