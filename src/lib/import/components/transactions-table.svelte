<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import Datepicker from "$lib/components/ui/datepicker.svelte";
    import { Input } from "$lib/components/ui/input";
    import MySelect from "$lib/components/ui/my-select.svelte";
    import * as Table from "$lib/components/ui/table";
    import {
        transactionTypeOptions,
        type Transaction,
        type TransactionType,
    } from "$lib/types";
    import { getMonthStartAndEnd } from "$lib/utils/helpers";
    import { CalendarDate, getLocalTimeZone } from "@internationalized/date";
    import { LucidePlus, LucideRedo, LucideUndo } from "@lucide/svelte";
    import ImportCsvCard from "./import-csv-card.svelte";
    import { importStore } from "../import.store";

    let { account } = $props();

    let minDate = $derived(getMonthStartAndEnd($importStore.monthYear).start);
    let maxDate = $derived(getMonthStartAndEnd($importStore.monthYear).lastDay);

    let transactions = $derived(
        $importStore.accounts.find(
            (a) => a.id === $importStore.selectedAccountId,
        )!.transactions,
    );

    function addTransaction() {
        const date = getMonthStartAndEnd($importStore.monthYear).lastDay.toDate(
            "UTC",
        );
        $importStore.actions.addTransactions([
            {
                name: "",
                date,
                amount: 0,
                accountId: account.id,
                type: "expense",
            },
        ]);
    }

    function updateTransaction(index: number, newData: Partial<Transaction>) {
        $importStore.actions.updateTransaction(index, newData);
    }

    function onInput(
        event: Event & {
            currentTarget: EventTarget & HTMLInputElement;
        },
        i: number,
        property: keyof Transaction,
    ) {
        updateTransaction(i, {
            [property]: event.currentTarget.value,
        });
    }

    function amountOnInput(i: number, value: string) {
        // Povolí prázdný string, minus nebo validní číslo
        if (value === "" || value === "-" || (!isNaN(+value) && value !== "")) {
            updateTransaction(i, {
                amount: value === "" || value === "-" ? value : Number(value),
            });
        }
    }

    function deleteTransaction(index: number) {
        $importStore.actions.deleteTransaction(index);
    }

    function deleteAllTransactions() {
        $importStore.actions.deleteAllAccountTransaction();
    }

    function amountColor(amount: number) {
        if (amount > 0) return "text-green-400";
        if (amount < 0) return "text-amber-400";
        return "text-zinc-400";
    }

    function typeColor(t: TransactionType) {
        switch (t) {
            case "expense":
                return "text-orange-400";
            case "income":
                return "text-lime-400";
            case "transfer":
                return "text-zinc-400";
            case "planned_expense":
                return "text-blue-400";
            case "investment":
                return "text-fuchsia-400";
        }
    }

    function isAmountValidForType(t: Transaction) {
        if (!t.amount) return true;
        if (t.type === "expense" || t.type === "planned_expense")
            return t.amount < 0;
        if (t.type === "income") return t.amount > 0;
        return true;
    }
</script>

<div class="flex flex-col space-y-4 max-w-[80%]">
    <ImportCsvCard />

    <div class="flex flex-row justify-between">
        <div class="flex flex-row gap-2">
            <Button onclick={() => addTransaction()}>
                <LucidePlus /> Add row</Button
            >
        </div>
        <Button variant="destructive" onclick={() => deleteAllTransactions()}
            >Delete all transactions</Button
        >
    </div>

    <div class="overflow-x-auto">
        {#snippet Optional()}
            <span class="text-xs text-gray-300">(opt.)</span>
        {/snippet}
        <Table.Root class="min-w-280 table-fixed">
            <Table.Header>
                <Table.Row>
                    <Table.Head class="w-[90px]">Date</Table.Head>
                    <Table.Head class="w-[110px]">Amount</Table.Head>
                    <Table.Head class="w-[150px]">Type</Table.Head>
                    <Table.Head class="w-[220px]"
                        >Name {@render Optional()}</Table.Head
                    >
                    <Table.Head class="w-[120px]"
                        >Name2 {@render Optional()}</Table.Head
                    >
                    <Table.Head class="w-[150px]"
                        >Category {@render Optional()}</Table.Head
                    >
                    <Table.Head class="w-[70px]"
                        >PEId {@render Optional()}</Table.Head
                    >
                    <Table.Head class="w-[75px]">Actions</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {#each transactions as t, i}
                    <Table.Row>
                        <Table.Cell>
                            <Datepicker
                                value={t.date && t.date instanceof Date
                                    ? new CalendarDate(
                                          t.date.getFullYear(),
                                          t.date.getMonth() + 1,
                                          t.date.getDate(),
                                      )
                                    : undefined}
                                onValueChange={(v) =>
                                    updateTransaction(i, {
                                        date: v?.toDate(getLocalTimeZone()),
                                    })}
                                minValue={minDate}
                                maxValue={maxDate}
                            />
                        </Table.Cell>
                        <Table.Cell
                            ><Input
                                type="number"
                                value={t.amount}
                                class={`${amountColor(t.amount)} ${isAmountValidForType(t) ? "" : "border-red-600"}`}
                                oninput={(e) =>
                                    amountOnInput(i, e.currentTarget.value)}
                            /></Table.Cell
                        >
                        <Table.Cell>
                            <MySelect
                                value={t.type}
                                options={transactionTypeOptions}
                                triggerClass={typeColor(t.type)}
                                onValueChange={(e) =>
                                    updateTransaction(i, { type: e })}
                            />
                        </Table.Cell>
                        <Table.Cell
                            ><Input
                                value={t.name}
                                oninput={(e) => onInput(e, i, "name")}
                            /></Table.Cell
                        >
                        <Table.Cell
                            ><Input
                                value={t.name2}
                                oninput={(e) => onInput(e, i, "name2")}
                            /></Table.Cell
                        >
                        <Table.Cell
                            ><Input
                                value={t.category}
                                oninput={(e) => onInput(e, i, "category")}
                            /></Table.Cell
                        >
                        <Table.Cell>
                            <Input
                                value={t.plannedExpenseId}
                                class={t.type === "planned_expense" &&
                                !t.plannedExpenseId
                                    ? "border-red-600"
                                    : undefined}
                                oninput={(e) =>
                                    onInput(e, i, "plannedExpenseId")}
                            />
                        </Table.Cell>
                        <Table.Cell>
                            <Button
                                variant="destructive"
                                onclick={() => deleteTransaction(i)}
                                >Delete</Button
                            >
                        </Table.Cell>
                    </Table.Row>
                {/each}
            </Table.Body>
        </Table.Root>
    </div>
</div>
