---
title: FinSys
---

Truly private, code-based personal finance dashboards — powered by your Postgres database.

## Dashboards

- [Finance](/finance) — income, expenses, balances and the monthly overview
- [Planned Expenses](/planned-expenses) — subscriptions and recurring payments

<Details title="About this project">

These dashboards are the Evidence BI counterpart to the FinSys Superset dashboards.
They read from the same Postgres SQL views (`transactions_view`, `balances_view`),
so no data is duplicated. Edit the `.md` files under `pages/` to change a dashboard —
everything is SQL + Markdown.

</Details>
