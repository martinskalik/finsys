<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import { Input } from "$lib/components/ui/input";
    import * as Table from "$lib/components/ui/table";
    import BalanceResult from "$lib/import/components/balance-result.svelte";
    import { importStore } from "$lib/import/import.store";

    let accounts = {
        get value() {
            return $importStore.accounts;
        },
    };

    let showingResults = {
        get value() {
            return $importStore.showBalanceResults;
        },
    };

    let showResultsDisabled: boolean = $derived(
        accounts.value.some((a) => a.endBalance === undefined),
    );

    function toggleShowResults() {
        $importStore.actions.toggleShowBalanceResults();
    }

    function updateEndingBalance(
        accountId: number,
        balance: number | undefined,
    ) {
        $importStore.actions.updateEndBalance(accountId, balance);
    }
</script>

<div>
    <Button
        onclick={toggleShowResults}
        disabled={showResultsDisabled}
        variant={showingResults ? "secondary" : "default"}
    >
        {#if !showingResults.value}
            Show results
        {:else}
            Hide results
        {/if}
    </Button>
</div>

<div class="overflow-x-auto">
    <Table.Root class="min-w-300 table-fixed">
        <Table.Header>
            <Table.Row>
                <Table.Head class="w-[140px]">Account</Table.Head>
                <Table.Head class="w-[100px]">Ending balance</Table.Head>
                <Table.Head class="w-[80px]">Starting balance</Table.Head>
                <Table.Head class="w-[100px]">Net Transactions</Table.Head>
                <Table.Head class="w-[100px]">Expected balance</Table.Head>
                <Table.Head class="w-[200px]">Result</Table.Head>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {#each accounts.value as a, i}
                <Table.Row>
                    <Table.Cell>
                        {a.account.name}
                    </Table.Cell>
                    <Table.Cell
                        ><Input
                            type="number"
                            disabled={showingResults.value}
                            value={a.endBalance}
                            oninput={(e) =>
                                updateEndingBalance(
                                    a.id,
                                    e.currentTarget.value !== ""
                                        ? Number(e.currentTarget.value)
                                        : undefined,
                                )}
                        /></Table.Cell
                    >
                    {#if !showingResults.value}
                        {#if a.endBalance === undefined}
                            <Table.Cell colspan={4}>
                                <span class="text-sm text-muted-foreground"
                                    >Enter end balance</span
                                >
                            </Table.Cell>
                        {/if}
                    {:else if a?.result}
                        <Table.Cell>{a.startBalance}</Table.Cell>
                        <Table.Cell>{a.result.netTransactions}</Table.Cell>
                        <Table.Cell>{a.result.expectedBalance}</Table.Cell>
                        <Table.Cell>
                            <BalanceResult result={a.result} />
                        </Table.Cell>
                    {/if}
                </Table.Row>
            {/each}
        </Table.Body>
    </Table.Root>
</div>
