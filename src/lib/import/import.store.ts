import { createStore } from 'zustand/vanilla'
import { devtools, persist, type StorageValue } from 'zustand/middleware'
import { type Account, type AccountBalance, type PlannedExpense, type Transaction } from "$lib/types";
import zustandToSvelte from '../utils/zustandToSvelte';
import SuperJSON from 'superjson';
import { getMonthStartAndEnd } from '$lib/utils/helpers';
import { immer } from 'zustand/middleware/immer';

export type AccountBalanceCheckResult = {
	success: boolean,
	divergence: number,
	netTransactions: number,
	expectedBalance: number
}

export type AccountState = {
	id: number,
	account: Account,
	transactions: Transaction[],
	startBalance: number,
	endBalance?: number | undefined,
	result?: AccountBalanceCheckResult | undefined
}

export type MonthYear = {
	year: number,
	month: number
}

type StoreValue = {
	accounts: AccountState[],
	plainAccounts: Account[],
	accountBalances: AccountBalance[],
	selectedAccountId: number;
	activeStep: number;
	plannedExpenses: PlannedExpense[];
	monthYear: MonthYear,
	showBalanceResults: boolean,
	actions: {
		addTransactions: (t: Transaction[]) => void;
		updateTransaction: (index: number, data: Partial<Transaction>) => void;
		deleteTransaction: (index: number) => void;
		deleteAllAccountTransaction: () => void;
		setSelectedAccount: (id: number) => void;
		setActiveStep: (step: number) => void;
		setAccounts: (accounts: Account[], accountBalances: AccountBalance[]) => void;
		setPlannedExpenses: (pes: PlannedExpense[]) => void;
		setMonthYear: (my: MonthYear) => void;
		updateEndBalance: (accountId: number, balance: number | undefined) => void;
		calculateAccountResult: (accountId: number) => void;
		setAccountStates: () => void,
		toggleShowBalanceResults: () => void,
		resetToInitialState: () => void,
	}
};

const importZustandStore = createStore<StoreValue>()(devtools(persist(immer((set, get, store) => ({
	accounts: [],
	plainAccounts: [],
	accountBalances: [],
	selectedAccountId: undefined!,
	accountStates: {},
	activeStep: 0,
	plannedExpenses: [],
	monthYear: { year: new Date().getFullYear(), month: new Date().getMonth() },
	showBalanceResults: false,
	actions: {
		addTransactions: (t) => {
			set((state) => {
				const selectedAccountId = state.selectedAccountId
				const index = state.accounts.findIndex(a => a.id === selectedAccountId)
				state.accounts[index].transactions.unshift(...t)
			})
			get().actions.calculateAccountResult(get().selectedAccountId)
		},

		updateTransaction: (i, data) => {
			set((state) => {
				const accountIndex = state.accounts.findIndex(a => a.id === state.selectedAccountId)
				Object.assign(state.accounts[accountIndex].transactions[i], data)
			})
			get().actions.calculateAccountResult(get().selectedAccountId)
		},

		deleteTransaction: (i) => {
			set((state) => {
				const accountIndex = state.accounts.findIndex(a => a.id === state.selectedAccountId)
				state.accounts[accountIndex].transactions.splice(i, 1)
			})
			get().actions.calculateAccountResult(get().selectedAccountId)
		},

		deleteAllAccountTransaction: () => {
			set((state) => {
				const accountIndex = state.accounts.findIndex(a => a.id === state.selectedAccountId)
				state.accounts[accountIndex].transactions = []
			})
			get().actions.calculateAccountResult(get().selectedAccountId)
		},

		setSelectedAccount: (id) => set((state) => {
			state.selectedAccountId = id
		}),

		setActiveStep: (step) => set((state) => {
			state.activeStep = step
		}),

		setAccounts: (accounts, accountBalances) => {
			set((state) => {
				state.plainAccounts = accounts
				state.accountBalances = accountBalances
			})
			get().actions.setAccountStates()
		},

		setPlannedExpenses: (pes) => set((state) => {
			state.plannedExpenses = pes
		}),

		setMonthYear: (my) => {
			set((state) => {
				state.monthYear = my
			})
			get().actions.setAccountStates()
		},

		updateEndBalance: (accountId: number, balance: number | undefined) => {
			set((state) => {
				const index = state.accounts.findIndex(a => a.id === accountId)
				state.accounts[index].endBalance = balance
			})
			get().actions.calculateAccountResult(accountId)
		},

		calculateAccountResult: (accountId) => {
			set((state) => {
				const index = state.accounts.findIndex(a => a.id === accountId)
				const account = state.accounts[index]

				if (account.endBalance !== undefined) {
					const netTransactions = account.transactions?.length > 0
						? account.transactions
							.map((t) => Math.round(t.amount * 100))
							.reduce((acc, amount) => acc + amount)
						: 0
					const expectedBalance = account.startBalance * 100 + netTransactions
					const divergence = account.endBalance * 100 - expectedBalance

					account.result = {
						success: divergence === 0,
						divergence: divergence / 100,
						netTransactions: netTransactions / 100,
						expectedBalance: expectedBalance / 100
					}
				} else {
					account.result = undefined
				}
			})
		},

		setAccountStates: () => {
			set((state) => {
				const plainAccounts = state.plainAccounts
				const accountBalances = state.accountBalances
				const monthYear = state.monthYear

				plainAccounts.forEach(account => {
					const startBalance = accountBalances.find((b) =>
						b.accountId === account.id &&
						b.date === getMonthStartAndEnd(monthYear).start.toString()
					)?.balance ?? 0

					const index = state.accounts.findIndex(a => a.id === account.id)

					if (index !== -1) {
						const currentState = state.accounts[index]
						if (currentState.startBalance !== startBalance) {
							state.accounts[index].startBalance = startBalance
						}
					} else {
						state.accounts.push({
							id: account.id,
							account,
							transactions: [],
							startBalance,
						})
					}
				})
			})
		},

		toggleShowBalanceResults: () => set((state) => {
			state.showBalanceResults = !state.showBalanceResults
		}),

		resetToInitialState: () => set(store.getInitialState()),
	}
})), {
	name: "importStore",
	partialize: (state) => {
		const { actions, ...rest } = state
		return rest
	},
	storage: {
		getItem: (name) => {
			const str = localStorage.getItem(name);
			if (!str) return null;

			return SuperJSON.parse<StorageValue<StoreValue>>(str);
		},
		setItem: (name, value) => {
			// Serializace - Date objekty se automaticky převedou na stringy
			localStorage.setItem(name, SuperJSON.stringify(value));
		},
		removeItem: (name) => localStorage.removeItem(name),
	},
})));

export const importStore = zustandToSvelte(importZustandStore);
