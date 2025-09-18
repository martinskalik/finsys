// src/routes/api/users/+server.ts
import { db } from '$lib/server/db';
import { bulkImportSchema } from '$lib/server/models/import.models';
import { accountBalancesTable, transactionsTable } from '$lib/server/schema';
import { json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const rawData = await request.json();

        // Validace
        const validatedData = bulkImportSchema.parse(rawData);

        // Database operace v transakci
        const result = await db.transaction(async (tx) => {
            // Vytvoř transakce
            const createdTransactions = await tx
                .insert(transactionsTable)
                .values(validatedData.transactions)
                .returning();

            // Vytvoř account balances
            const createdBalances = await tx
                .insert(accountBalancesTable)
                .values(validatedData.accountBalances)
                .returning();

            return {
                transactions: createdTransactions,
                accountBalances: createdBalances
            };
        });

        return json({
            success: true,
            data: {
                transactionsCreated: result.transactions.length,
                balancesCreated: result.accountBalances.length,
                transactions: result.transactions,
                accountBalances: result.accountBalances
            }
        });

    } catch (error) {
        console.error('Bulk import error:', error);

        if (error instanceof z.ZodError) {
            return json({
                success: false,
                error: 'Validation failed',
                errors: error.message
            }, { status: 400 });
        }

        return json({
            success: false,
            error: 'Internal server error'
        }, { status: 500 });
    }
};