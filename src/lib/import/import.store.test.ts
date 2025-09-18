import { describe, it, expect, beforeEach, vi } from 'vitest'
import { importStore } from './import.store'
import type { Account, AccountBalance, Transaction } from '$lib/types'

// Mock dependencies
vi.mock('$lib/helpers', () => ({
    getMonthStartAndEnd: vi.fn(() => ({
        start: new Date('2025-01-01'),
        end: new Date('2025-01-31')
    }))
}))

describe('Import Store', () => {
    const mockAccount: Account = { id: 1, name: 'Test Account', type: "bank", plannedExpenses: false }
    const mockAccountBalance: AccountBalance = { id: 1, accountId: 1, date: '2025-08-01', balance: 1000 }
    const mockTransaction: Transaction = {
        id: 1, amount: 100, description: 'Test',
        name: 'Tesst',
        date: new Date(2025, 8, 2),
        type: 'income',
        accountId: 0
    }

    beforeEach(() => {
        // Reset store
        importStore.getState().actions.resetToInitialState()
    })

    describe('Account Management', () => {
        it('should set accounts and balances', () => {
            const { actions } = importStore.getState()

            actions.setAccounts([mockAccount], [mockAccountBalance])

            const state = importStore.getState()
            expect(state.accountBalances).toEqual([mockAccountBalance])
            expect(state.accounts).toHaveLength(1)
            expect(state.accounts[0].startBalance).toBe(1000)
        })

        it('should select account', () => {
            const { actions } = importStore.getState()

            actions.setSelectedAccount(1)

            expect(importStore.getState().selectedAccountId).toBe(1)
        })
    })

    describe('Transaction Management', () => {
        beforeEach(() => {
            const { actions } = importStore.getState()
            actions.setAccounts([mockAccount], [mockAccountBalance])
            actions.setSelectedAccount(1)
        })

        it('should add transactions', () => {
            const { actions } = importStore.getState()

            actions.addTransactions([mockTransaction])

            const account = importStore.getState().accounts[0]
            expect(account.transactions).toHaveLength(1)
            expect(account.transactions[0]).toEqual(mockTransaction)
        })

        it('should update transaction', () => {
            const { actions } = importStore.getState()
            actions.addTransactions([mockTransaction])

            actions.updateTransaction(0, { amount: 200 })

            const transaction = importStore.getState().accounts[0].transactions[0]
            expect(transaction.amount).toBe(200)
        })

        it('should delete transaction', () => {
            const { actions } = importStore.getState()
            actions.addTransactions([mockTransaction, { amount: 50 }])

            actions.deleteTransaction(0)

            const transactions = importStore.getState().accounts[0].transactions
            expect(transactions).toHaveLength(1)
            expect(transactions[0].amount).toBe(50)
        })
    })

    describe('Balance Calculation', () => {
        beforeEach(() => {
            const { actions } = importStore.getState()
            actions.setAccounts([mockAccount], [mockAccountBalance])
        })

        it('should calculate correct result when balanced', () => {
            const { actions } = importStore.getState()
            actions.setSelectedAccount(1)
            actions.addTransactions([{ amount: 100 }, { amount: -50 }])

            actions.updateEndBalance(1, 1050) // 1000 + 100 - 50

            const result = importStore.getState().accounts[0].result
            expect(result).toBeDefined()
            expect(result!.success).toBe(true)
            expect(result!.divergence).toBe(0)
            expect(result!.expectedBalance).toBe(1050)
        })

        it('should detect divergence', () => {
            const { actions } = importStore.getState()
            actions.setSelectedAccount(1)
            actions.addTransactions([{ amount: 100 }])

            actions.updateEndBalance(1, 1150) // Expected: 1100, Actual: 1150

            const result = importStore.getState().accounts[0].result
            expect(result).toBeDefined()
            expect(result!.success).toBe(false)
            expect(result!.divergence).toBe(50)
        })
    })

    describe('UI State', () => {
        it('should toggle balance results visibility', () => {
            const { actions } = importStore.getState()

            actions.toggleShowBalanceResults()
            expect(importStore.getState().showBalanceResults).toBe(true)

            actions.toggleShowBalanceResults()
            expect(importStore.getState().showBalanceResults).toBe(false)
        })

        it('should set active step', () => {
            const { actions } = importStore.getState()

            actions.setActiveStep(2)

            expect(importStore.getState().activeStep).toBe(2)
        })
    })
})