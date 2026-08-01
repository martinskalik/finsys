---
title: Planned Expenses
---

Subscriptions and recurring payments — the Evidence version of the Superset **Planned expenses** dashboard.

## Overview

```sql pe_monthly_total
select
    strftime(current_month, '%Y-%m') as month,
    sum(month_amount) as amount
from finsys.planned_expenses_months
group by 1
order by 1
```

```sql pe_current_total
select sum(month_amount) as amount
from finsys.planned_expenses_view
where active = true
```

<Grid cols=2>
    <BigValue
        data={pe_monthly_total}
        value=amount
        title="[PE] Number with trendline"
        sparkline=month
        fmt="#,##0"
    />
    <BigValue
        data={pe_current_total}
        value=amount
        title="Active monthly commitment"
        fmt="#,##0"
    />
</Grid>

## Cost breakdown

```sql pe_by_name
select name, month_amount as amount
from finsys.planned_expenses_view
where active = true
order by amount desc
```

<Grid cols=2>
    <div>
        <p class="text-sm font-medium text-center">[PE] Planned Expenses Donut</p>
        <ECharts config={
            {
                tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
                series: [{
                    type: 'pie', radius: ['40%', '70%'], avoidLabelOverlap: true,
                    itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
                    label: { formatter: '{b}' },
                    data: pe_by_name.map(d => ({ name: d.name, value: Number(d.amount) }))
                }]
            }
        }/>
    </div>
    <DataTable data={pe_by_name} title="Monthly cost per subscription" totalRow=true>
        <Column id=name title="Subscription" />
        <Column id=amount title="Monthly" fmt="#,##0.00" />
    </DataTable>
</Grid>

## History

```sql pe_history
select
    strftime(current_month, '%Y-%m') as month,
    coalesce(category, 'Uncategorized') as category,
    sum(month_amount) as amount
from finsys.planned_expenses_months
group by 1, 2
order by 1
```

<BarChart
    data={pe_history}
    x=month
    y=amount
    series=category
    type=stacked
    title="[PE] Bar Planned Expenses History"
/>

## Subscriptions

```sql pe_table
select
    name,
    category,
    period,
    amount,
    month_amount,
    year_amount,
    date_from,
    date_to,
    active
from finsys.planned_expenses_view
order by month_amount desc
```

<DataTable data={pe_table} title="[PE] Planned Expenses Table">
    <Column id=name title="Name" />
    <Column id=category />
    <Column id=period />
    <Column id=month_amount title="Per Month" fmt="#,##0.00" />
    <Column id=year_amount title="Per Year" fmt="#,##0.00" />
    <Column id=date_from title="From" />
    <Column id=date_to title="To" />
    <Column id=active />
</DataTable>

## Matched transactions

```sql pe_transactions
select
    pe_name,
    coalesce(category, 'Uncategorized') as category,
    count(t_id) as matched_transactions,
    sum(amount) as total_paid
from finsys.transactions_with_pe
group by pe_name, category
order by total_paid desc
```

<DataTable data={pe_transactions} title="[PE] Transactions table" totalRow=true>
    <Column id=pe_name title="Subscription" />
    <Column id=category />
    <Column id=matched_transactions title="# Matched" />
    <Column id=total_paid title="Total Paid" fmt="#,##0.00" />
</DataTable>
