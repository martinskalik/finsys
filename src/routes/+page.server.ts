import { db } from "$lib/server/db";
import { accountBalancesTable, accountsTable, plannedExpensesTable } from "$lib/server/schema";
import type { Account, PlannedExpense } from "$lib/types";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./import/$types";

export const load: PageServerLoad = async () => {
        try {
                const accounts: Account[] = await db.select().from(accountsTable);
                const plannedExpenses: PlannedExpense[] = (await db.select().from(plannedExpensesTable)).map(pe => ({
                        ...pe,
                        amount: parseFloat(pe.amount),
                        from: new Date(pe.from),
                        to: pe.to ? new Date(pe.to) : null
                }))
                const accountBalances = ((await db.select().from(accountBalancesTable)).map(b => ({
                        ...b,
                        balance: parseFloat(b.balance)
                })))
                return { accounts, plannedExpenses, accountBalances };
        } catch (e: unknown) {
                error(500, {
                        message: e.toString()
                })
        }
};
