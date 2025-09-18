<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import { Card } from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import MySelect from "$lib/components/ui/my-select.svelte";
    import {
        fetchTransactionsFromBankCsv,
        fetchTransactionsGenericCsv,
    } from "$lib/import/csv-importer";
    import type { Transaction } from "$lib/types";
    import { LucideShare } from "@lucide/svelte";
    import { importStore } from "../import.store";

    // svelte-ignore non_reactive_update
    let fileInput: HTMLInputElement | null = null;
    let files = $state<FileList | undefined>();
    let file = $derived(files && files.length > 0 ? files.item(0) : null);

    let type: "generic" | "airbank" = $state("generic");

    let inputId = $props.id();

    async function onSubmit(e: Event) {
        e.preventDefault();
        if (!file || !$importStore.selectedAccountId)
            throw Error("file or selectedAccount is missing in submit");
        let transactions: Transaction[];
        const account = $importStore.plainAccounts.find(
            (a) => a.id === $importStore.selectedAccountId,
        )!;
        if (type === "airbank") {
            transactions = await fetchTransactionsFromBankCsv(
                file,
                account,
                $importStore.plainAccounts,
                $importStore.plannedExpenses,
            );
        } else {
            transactions = await fetchTransactionsGenericCsv(file, account);
        }
        $importStore.actions.addTransactions(
            transactions.sort((a, b) => a.amount - b.amount),
        );
        files = undefined;
        fileInput!.value = "";
        const changeEvent = new Event("change", { bubbles: true });
        fileInput!.dispatchEvent(changeEvent);
    }

    const typeOptions = [
        { value: "generic", label: "Generic" },
        { value: "airbank", label: "AirBank" },
    ];
</script>

<Card class="p-4 border-dashed max-w-120">
    <div class="flex flex-row gap-2">
        <LucideShare />
        <span class="font-bold">Import transactions from CSV</span>
    </div>

    <form method="POST" onsubmit={onSubmit}>
        <div class="flex flex-row gap-2">
            <Input
                id={inputId}
                placeholder="test"
                type="file"
                maxlength={1}
                bind:files
                bind:ref={fileInput}
            />
            <div class="w-40">
                <MySelect options={typeOptions} bind:value={type} />
            </div>
            <Button type="submit" disabled={!file}>Import</Button>
        </div>
    </form>
</Card>
