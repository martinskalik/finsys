import z from "zod";
import { insertAccountBalanceSchema, insertTransactionSchema } from "../schema";

export const bulkImportSchema = z.object({
    transactions: z.array(insertTransactionSchema),
    accountBalances: z.array(insertAccountBalanceSchema)
});

export type BulkImportRequest = z.infer<typeof bulkImportSchema>;