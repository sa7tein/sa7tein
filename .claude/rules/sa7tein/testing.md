# Testing rules

On top of the ECC testing rules, every issue's tests cover these rules wherever its feature touches them.

- A retried command, a retried Odoo transaction, or a re-sent outbox event never applies its change twice: no double charge, payout, refund, points, quota, budget, promo use, or stock change.
- Two actions that race on the same balance, quota, limit, or stock can't both pass a check that only one of them fits.
- Every create, update, and delete creates its activity entry and per-field change traces (#16).
- A delete archives the record, and nothing can be deleted permanently, chat messages included.
- A write command returns only an acknowledgment, its result arrives as an event, and the UI shows a pending state until then. An event is sent only after its change is committed.
- After the WebSocket connects again, the client gets the state it missed, and a client on the previous contract version keeps working during a migration.
- Commands sent while Odoo pauses wait in their queue and are processed once it is back.
- A release's database changes work with the previous release's code (expand/contract).
- Money keeps its precision and rounding: JOD with 3 decimals, IDR as whole numbers, bills rounded up to the hundred, and payouts rounded down to the rupiah (#38, #43).
- Times are checked around midnight in Asia/Amman and in UTC, around midnight in WIB for payout dates (#43), and around the daily schedules.
- Agent users can't create, update, or delete business records, and don't see personal data fields.
- Odoo tests use Odoo's test framework on a real PostgreSQL database. Middleware tests run the real queue, event, and WebSocket flow against local or emulated AWS services.
- External services are replaced by test doubles through their adapters.
