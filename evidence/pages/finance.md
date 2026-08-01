---
title: Finance
---

```sql periods
select distinct month_year
from finsys.transactions_view
where month_year is not null
order by month_year desc
```

<Dropdown name=period data={periods} value=month_year title="Period">
    <DropdownOption value="%" valueLabel="All periods" />
</Dropdown>

Charts marked _(period)_ react to the dropdown; trend charts always show full history.

## Overview _(period)_

```sql total_income
select sum(amount) as total
from finsys.transactions_view
where is_outgoing = false
  and month_year like '${inputs.period.value}'
```

```sql total_expense
select abs(sum(amount)) as total
from finsys.transactions_view
where is_outgoing = true
  and month_year like '${inputs.period.value}'
```

```sql sum_of_transactions
select sum(amount) as total
from finsys.transactions_view
where month_year like '${inputs.period.value}'
```

<Grid cols=3>
    <BigValue data={total_income} value=total title="[F] Total Income" fmt="#,##0" />
    <BigValue data={total_expense} value=total title="[F] Total Expense" fmt="#,##0" />
    <BigValue data={sum_of_transactions} value=total title="[F] Sum of Transactions" fmt="#,##0" />
</Grid>

## Income vs Expense

```sql flow_over_time
select month_year, 'Income' as direction, sum(amount) as amount
from finsys.transactions_view
where type = 'Income'
group by month_year
union all
select month_year, 'Expense' as direction, abs(sum(amount)) as amount
from finsys.transactions_view
where is_outgoing and type in ('Expense', 'Planned Expense')
group by month_year
order by month_year
```

<Grid cols=2>
    <BarChart
        data={flow_over_time}
        x=month_year
        y=amount
        series=direction
        type=grouped
        title="[F] Income vs Expense"
    />
    <AreaChart
        data={flow_over_time}
        x=month_year
        y=amount
        series=direction
        type=stacked
        title="[F] Area chart income and outcome"
    />
</Grid>

```sql net_by_month
select
    month_year,
    sum(case when type = 'Income' then amount else 0 end)
      - sum(case when is_outgoing and type in ('Expense', 'Planned Expense') then abs(amount) else 0 end) as net
from finsys.transactions_view
group by month_year
order by month_year
```

```sql income_categories_by_month
select month_year, coalesce(category, 'Uncategorized') as category, sum(amount) as amount
from finsys.transactions_view
where type = 'Income'
group by 1, 2
order by 1
```

<Grid cols=2>
    <BarChart
        data={net_by_month}
        x=month_year
        y=net
        title="[F] Bar chart difference income and outcome"
        yAxisTitle="Net"
    />
    <AreaChart
        data={income_categories_by_month}
        x=month_year
        y=amount
        series=category
        type=stacked
        title="[F] Income categories in month"
    />
</Grid>

## Distribution _(period)_

```sql expenses_by_type
select type, abs(sum(amount)) as amount
from finsys.transactions_view
where is_outgoing
  and month_year like '${inputs.period.value}'
group by type
order by amount desc
```

```sql expenses_by_category
select coalesce(category, 'Uncategorized') as category, abs(sum(amount)) as amount
from finsys.transactions_view
where is_outgoing and type in ('Expense', 'Planned Expense')
  and month_year like '${inputs.period.value}'
group by 1
order by amount desc
```

```sql income_by_category
select coalesce(category, 'Uncategorized') as category, sum(amount) as amount
from finsys.transactions_view
where type = 'Income'
  and month_year like '${inputs.period.value}'
group by 1
order by amount desc
```

<Grid cols=3>
    <div>
        <p class="text-sm font-medium text-center">[F] Expenses Donut</p>
        <ECharts config={
            {
                tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
                series: [{
                    type: 'pie', radius: ['40%', '70%'], avoidLabelOverlap: true,
                    itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
                    label: { formatter: '{b}' },
                    data: expenses_by_type.map(d => ({ name: d.type, value: Number(d.amount) }))
                }]
            }
        }/>
    </div>
    <div>
        <p class="text-sm font-medium text-center">[F] Donut categories expenses</p>
        <ECharts config={
            {
                tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
                series: [{
                    type: 'pie', radius: ['40%', '70%'], avoidLabelOverlap: true,
                    itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
                    label: { formatter: '{b}' },
                    data: expenses_by_category.map(d => ({ name: d.category, value: Number(d.amount) }))
                }]
            }
        }/>
    </div>
    <div>
        <p class="text-sm font-medium text-center">[F] Income Donut</p>
        <ECharts config={
            {
                tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
                series: [{
                    type: 'pie', radius: ['40%', '70%'], avoidLabelOverlap: true,
                    itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
                    label: { formatter: '{b}' },
                    data: income_by_category.map(d => ({ name: d.category, value: Number(d.amount) }))
                }]
            }
        }/>
    </div>
</Grid>

## Investments & non-recurring spend

```sql invested_by_month
select month_year, sum(-amount) as amount
from finsys.transactions_view
where type = 'Investment'
group by month_year
order by month_year
```

```sql unplanned_expenses_by_month
select month_year, abs(sum(amount)) as amount
from finsys.transactions_view
where type = 'Expense'
group by month_year
order by month_year
```

<Grid cols=2>
    <BarChart
        data={invested_by_month}
        x=month_year
        y=amount
        title="[F] Bar Invested Amount"
    />
    <BarChart
        data={unplanned_expenses_by_month}
        x=month_year
        y=amount
        title="[F] Bar not planned expenses in months"
    />
</Grid>

## Account balances

```sql balances_over_time
select month_year, sum(balance) as total_balance
from finsys.balances_view
where balance is not null
group by month_year
order by month_year
```

```sql latest_balances
select account_name, account_type, balance, date
from finsys.balances_view
where balance is not null
  and date = (select max(date) from finsys.balances_view)
order by balance desc
```

<Grid cols=2>
    <AreaChart
        data={balances_over_time}
        x=month_year
        y=total_balance
        title="[F] Balances"
    />
    <DataTable data={latest_balances} title="[F] Balances Table">
        <Column id=account_name title="Account" />
        <Column id=account_type title="Type" />
        <Column id=balance fmt="#,##0.00" />
        <Column id=date />
    </DataTable>
</Grid>

## Summary tables _(period)_

```sql sum_by_type
select type, sum(amount) as amount, count(*) as transactions
from finsys.transactions_view
where month_year like '${inputs.period.value}'
group by type
order by amount
```

```sql sum_by_category
select coalesce(category, 'Uncategorized') as category, abs(sum(amount)) as amount
from finsys.transactions_view
where is_outgoing
  and month_year like '${inputs.period.value}'
group by 1
order by amount desc
```

<Grid cols=2>
    <DataTable data={sum_by_type} title="[F] Sum transactions table based on type" totalRow=true>
        <Column id=type />
        <Column id=amount fmt="#,##0.00" />
        <Column id=transactions />
    </DataTable>
    <DataTable data={sum_by_category} title="[F] Table transactions categories" totalRow=true>
        <Column id=category />
        <Column id=amount title="Spent" fmt="#,##0.00" />
    </DataTable>
</Grid>

```sql transactions_aggregated
select
    name,
    type,
    account_name,
    coalesce(category, 'Uncategorized') as category,
    sum(amount) as amount,
    count(*) as count
from finsys.transactions_view
where month_year like '${inputs.period.value}'
group by name, type, account_name, category
order by abs(sum(amount)) desc
```

<DataTable data={transactions_aggregated} title="[F] Table transactions aggregated" search=true rows=10>
    <Column id=name title="Name" />
    <Column id=type />
    <Column id=account_name title="Account" />
    <Column id=category />
    <Column id=amount fmt="#,##0.00" contentType=colorscale />
    <Column id=count />
</DataTable>

## Transactions _(period)_

```sql transactions
select date, name, type, category, account_name, amount
from finsys.transactions_view
where month_year like '${inputs.period.value}'
order by date desc, id desc
```

<DataTable data={transactions} title="[F] Transactions Table" search=true rows=15>
    <Column id=date />
    <Column id=name title="Name" />
    <Column id=type />
    <Column id=category />
    <Column id=account_name title="Account" />
    <Column id=amount fmt="#,##0.00" contentType=colorscale />
</DataTable>
