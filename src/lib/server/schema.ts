import {
	type AnyPgColumn,
	boolean,
	date,
	integer,
	numeric,
	pgEnum,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const TransactionType = pgEnum("transaction_type", [
	"income",
	"expense",
	"planned_expense",
	"investment",
	"transfer",
]);

export const PlannedExpensePeriod = pgEnum("planned_expense_period", [
	"month",
	"year",
]);

export const transactionsTable = pgTable("transactions", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	name: text("name"),
	name2: text("name2"),
	amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
	date: date("date").notNull(),
	type: TransactionType("type").notNull(),
	category: text("category"),
	accountId: integer("account_id")
		.references(() => accountsTable.id)
		.notNull(),
	plannedExpenseId: integer("planned_expense_id"),
	updatedAt: timestamp("updated_at", { precision: 3 }).notNull().defaultNow(),
	description: text("description"),
	counterParty: text("counter_party"),
});

export const accountsTable = pgTable("accounts", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	name: text("name").notNull(),
	type: text("type").notNull(),
	plannedExpenses: boolean("planned_expenses").notNull().default(false),
	accountNumber: text("account_number"),
});

export const accountBalancesTable = pgTable("account_balances", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	date: date("date").notNull(),
	accountId: integer("account_id")
		.references(() => accountsTable.id)
		.notNull(),
	balance: numeric("balance", { precision: 12, scale: 2 }).notNull(),
	updatedAt: timestamp("updated_at", { precision: 3 }).notNull().defaultNow(),
});

export const plannedExpensesTable = pgTable("planned_expenses", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	name: text("name").notNull(),
	amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
	from: date("from").notNull(),
	to: date("to"),
	category: text("category"),
	transactionMapping: text("transaction_mapping"),
	period: PlannedExpensePeriod("period").notNull(),
	description: text("description"),
	previousExpenseId: integer("previous_expense_id").references(
		(): AnyPgColumn => plannedExpensesTable.id,
	),
	updatedAt: timestamp("updated_at", { precision: 3 }).notNull().defaultNow(),
});

export const insertTransactionSchema = createInsertSchema(transactionsTable);
export const insertAccountBalanceSchema = createInsertSchema(accountBalancesTable);

export type NewTransaction = typeof transactionsTable.$inferInsert;
export type NewAccountBalance = typeof accountBalancesTable.$inferInsert;
