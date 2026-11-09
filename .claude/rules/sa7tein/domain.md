# Domain rules

Business rules that one issue sets and every other feature must follow. Each rule points to where it is explained: the living doc once it exists, or the issue until then.

## Data and history

- Every create, update, and delete on any Durable Object field or application configuration key records an activity entry with its actor and per-field change traces, without exception. No feature keeps its own change history (#16).
- Ops can't read an order's chat or its activity entries after the manual dispute window, unless the order still has an unresolved ticket or incident (#47, #18).
- A value that ops can change is an application configuration key, listed in #19, never a constant in code. Each feature issue lists the keys it needs (#13, #19).

## Accounts, permissions, and audiences

- One WhatsApp number is one account, and it logs in only with reverse OTP WhatsApp. An account has at most one customer role and any number of merchant roles, one per merchant (#21, #22).
- Ops sign in only through Cloudflare Access with an ops account, never with a WhatsApp account (#17).
- Every merchant feature is gated by a merchant staff permission, so a new merchant feature names its permission. The owner always has every permission, and only the owner manages staff and changes the bank account (#26).
- Every change of business state that another party can observe is a realtime event to every client entitled to it, using the audiences in #15: the merchant team by permission, the related customer, and viewing customers. An event or notification reaches an account for all its roles, whatever role is active (#15, #22).
- Notifications aren't stored. For now, the inbox holds only User Agreement changes (#15, #20).

## Orders

- Once the merchant accepts an order, neither the customer nor the merchant can cancel it, and the merchant must finish it. The customer can cancel only before the merchant accepts (#41, #44).
- An online order reaches the merchant only after its payment succeeds (#39).
- An order keeps what was in force when it was placed: the User Agreement version, its items' prices, and its IDR amount at the locked exchange rate. Later changes don't change placed orders (#20, #38, #39).
- Order items always refer to a variant, and the names in order history and invoices come from the variant (#32).
- Stock, order quota, and program usage are reserved when an order is placed, used when it is done, and released when it is canceled, rejected, or its payment fails or expires (#33, #51, #55).

## Money and disputes

- Prices are in JOD. Online payments are in IDR through QRIS only, and the other method is cash on delivery (#38, #39, #52).
- An amount billed in IDR is rounded up to the hundred, and a payout is the JOD amount × the locked exchange rate, rounded down to the whole rupiah (#38, #43).
- Online order money stays in the aplikator balance at the payment gateway until a payout or a refund. Both go out at the daily payout time, once the payment gateway has settled the money (#43, #44).
- Compensation and punishment are non-monetary only, so no money is taken back after a payout (#20).
- Merchants and customers must follow every User Agreement rule and can't opt out of any. A new version applies on its effective date, without accepting it again (#20).
