# Design rules

Apply these in the Design stage of every issue, together with the architecture rules and the domain rules.

## What every design shows

Every design, in the living documentation and the Archify diagrams, shows:

- the module ops models it touches, with their access rights and record rules;
- for every command, its queue, the module ops endpoint it calls, and its idempotency key;
- the steps that change a value with a balance, a quota, or a limit, with their idempotency keys and the row locks that serialize them;
- the outbox events, the realtime events with their audiences, and the notifications;
- the activity entries that each change creates;
- every call to an external service: what starts it after commit, and how its result comes back to Odoo;
- the scheduled actions, and the times they follow;
- the database changes, and how they stay compatible with the previous release (expand/contract);
- the files kept as attachments.

## Data model

Derive the models from the Data kept sections of the issues, with the naming in `CLAUDE.md` (#13):

- A model is named after the bold term that introduces it. A list under the bold name of a model from another issue adds fields to that model.
- A field that refers to another row is a relational field: Many2one, One2many, or Many2many.
- Odoo's own create and write fields stay as Odoo adds them, but no business rule uses them. Who changed what, and when, comes from the activity history (#16). A time that a business rule uses is kept in its model.
- A one-to-one attribute is a field of its parent. A many-to-many relation is a Many2many field, or a model of its own when the relation has data of its own. A list of values that doesn't refer to other rows is a Json field.
- A reference that can point to one of several models has one Many2one field per model, and only one of them is set.
- Dates without a time are named `date` or end in `_date`, and percentages end in `_percent`.
- A deleted row is archived through a status or the `active` field, and uniqueness and overlap checks ignore archived rows (#16).
