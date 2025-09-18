import { type Account, type PlannedExpense, type Transaction, type TransactionType } from "$lib/types";
import csv from "csvtojson";

async function getCsvData<T>(file: File, map?: (entry: any) => T, delimeter: string = ","): Promise<T[]> {
    const data: any[] = await csv({
        delimiter: delimeter
    }).fromString(await file.text())

    if (!map)
        return data as T[];

    return data.map(map);
}

export async function fetchTransactionsGenericCsv(csv: File, account: Account) {
    return await getCsvData<Transaction>(csv, (e) => {
        const amount = parseFloatWithDecimalComma(e["amount"]);
        return {
            name: e["name"],
            amount,
            date: new Date(e["date"]),
            type: amount > 0 ? "income" : "expense",
            accountId: account.id
        }
    }, ",");
}

export async function fetchTransactionsFromBankCsv(csv: File, account: Account, accounts: Account[], plannedExpenses: PlannedExpense[]) {
    const myAccountNumbers = accounts.filter(a => a.accountNumber).map(a => a.accountNumber!)

    const data = await getCsvData<BankTransaction>(csv, (e) => {
        let amountField = e["Částka v měně účtu"]
        if (!amountField || amountField.trim() === "")
            amountField = e["Poplatek v měně účtu"]

        // Date is in format DD/MM/YYYY
        const parts = e["Datum provedení"].split("/");
        const date = new Date(Date.UTC(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])));

        return {
            name: e["Název protistrany"],
            amount: parseFloatWithDecimalComma(amountField),
            date: date,
            category: e["Kategorie plateb"],
            description: e["Poznámka k úhradě"],
            counterParty: e["Číslo účtu protistrany"]
        }
    }, ";");

    const transactions: Transaction[] = []

    for (const transaction of data) {
        const type = getTransactionType(transaction.category, transaction.amount, account.plannedExpenses,
            transaction.counterParty, myAccountNumbers);
        transactions.push({
            name: transaction.name ?? "",
            amount: transaction.amount,
            date: new Date(transaction.date),
            description: transaction.description,
            type: type,
            accountId: account.id,
            category: transaction.category,
            counterParty: transaction.counterParty,
            plannedExpenseId: tryGetPlannedExpenseId(plannedExpenses, type, transaction.name) ?? undefined
        })
    }

    return transactions;
}

function getTransactionType(category: string | null, amount: number, defaultPlannedExpense: boolean, counterParty?: string, myAccountNumbers?: string[]): TransactionType {
    if (category === "Přesuny" || counterParty !== undefined && myAccountNumbers?.includes(counterParty))
        return "transfer";
    if (amount > 0)
        return "income";
    if (category === "Investice")
        return "investment";
    if (defaultPlannedExpense)
        return "planned_expense";

    return "expense";
}

function tryGetPlannedExpenseId(plannedExpenses: PlannedExpense[], type: TransactionType, name: string | null) {
    if (!name)
        return null;
    if (type !== "planned_expense")
        return null;

    for (const expense of plannedExpenses) {
        const mappingRegex = new RegExp(expense.transactionMapping!);
        if (mappingRegex.test(name))
            return expense.id;
    }

    console.warn(`Planned expense not found for transaction ${name}`);

    return null;
}

function parseFloatWithDecimalComma(value: string) {
    const result = parseFloat(value.replace(",", "."));
    if (isNaN(result))
        throw new Error(`Value '${value}' is not a number`);
    return result;
}

interface BankTransaction {
    name: string,
    amount: number,
    date: Date,
    category: string,
    description: string,
    counterParty: string
}