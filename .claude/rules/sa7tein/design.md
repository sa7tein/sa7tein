# Design rules

Apply these in the Design stage of every issue, together with the architecture rules and the domain rules.

## What every design shows

Every design, in the living documentation and the Archify diagrams, shows:

- the domain models and Durable Objects it touches;
- for every write, the Queue message, the Workflow, and the RPC call to each Durable Object;
- the steps that change a value with a balance, a quota, or a limit, with their idempotency keys;
- the realtime events with their audiences, and the notifications;
- the activity entries that each change creates;
- where Workers KV or the registry may not be consistent yet, and which Durable Object validates the action;
- the files stored in R2.

## Data model

Derive the models from the Data kept sections of the issues, with the naming in `CLAUDE.md` (#13):

- A model is named after the bold term that introduces it, in UPPER_SNAKE_CASE. A list under the bold name of a model from another issue adds fields to that model.
- Every model has an id. A field that holds another row's id refers to that row, and there are no physical foreign keys.
- Models don't keep who created or changed a row, or when; that comes from the activity history (#16). A time that a business rule uses is kept in its model.
- A one-to-one attribute is a field of its parent, a many-to-many relation uses a join model, and a list of values that doesn't refer to other rows is a list field.
- A reference that can point to one of several models has one field per model, and only one of them is set.
- Dates without a time are named `date` or end in `_date`, and percentages end in `_percent`.
- A deleted row is archived through a status or a flag, and uniqueness and overlap checks ignore archived rows (#16).
