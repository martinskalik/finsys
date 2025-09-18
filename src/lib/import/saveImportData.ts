import { getDateString, getMonthStartAndEnd } from "$lib/utils/helpers";
import { importStore } from "$lib/import/import.store";
import type { BulkImportRequest } from "$lib/server/models/import.models";
import type { NewAccountBalance, NewTransaction } from "$lib/server/schema";

export async function saveImportData() {
  const state = importStore.getState()

  const transactions: NewTransaction[] = state.accounts.flatMap(a => {
    return a.transactions.map(t => (
      { ...t, accountId: a.id, amount: t.amount.toFixed(2), date: getDateString(t.date) }
    ))
  })

  const accountBalances: NewAccountBalance[] = state.accounts.flatMap(a => {
    return {
      accountId: a.id,
      balance: a.endBalance!.toFixed(2),
      date: getMonthStartAndEnd(state.monthYear).end.toString()
    }
  })

  const data: BulkImportRequest = {
    transactions,
    accountBalances
  }

  try {
    const response = await fetch('/api/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `HTTP ${response.status}`);
    }

    return result;
  } catch (error) {
    console.error('Import API error:', error);
    throw error;
  }
}