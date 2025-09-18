export type Account = {
    id: number,
    name: string,
    type: string,
    accountNumber?: string | null,
    plannedExpenses: boolean
}

export type TransactionType =
    "income" |
    "expense" |
    "planned_expense" |
    "investment" |
    "transfer";

export const transactionTypeOptions: Array<{
    value: TransactionType;
    label: string;
}> = [
        { value: "income", label: "income" },
        { value: "expense", label: "expense" },
        { value: "planned_expense", label: "planned expense" },
        { value: "investment", label: "investment" },
        { value: "transfer", label: "transfer" }
    ];

export type Transaction = {
    id?: number
    name: string
    name2?: string
    amount: number
    date: Date
    type: TransactionType
    category?: string
    accountId: number
    plannedExpenseId?: number
    updatedAt?: Date
    description?: string
    counterParty?: string
}

export type PlannedExpense = {
    id: number,
    name: string,
    amount: number,
    from: Date,
    to: Date | null,
    transactionMapping: string | null
    // ...
};

export type AccountBalance = {
    id: number,
    date: string,
    accountId: number,
    balance: number,
}