<script lang="ts">
    import { Badge } from "$lib/components/ui/badge";
    import { Card } from "$lib/components/ui/card";
    import { importStore, type AccountState } from "../import.store";

    let accounts = {
        get value() {
            return $importStore.accounts;
        },
    };

    let totalTransactions = $derived(
        $importStore.accounts.flatMap((a) => a.transactions).length,
    );
</script>

{#snippet SummaryInfo(name: string, value: string)}
    <div class="flex flex-col gap-0.2 grow">
        <span class="text-md text-gray-400">{name}</span>
        <span class="text-xl font-bold">{value}</span>
    </div>
{/snippet}

<Card>
    <div class="flex flex-row justify-start px-8">
        {@render SummaryInfo(
            "Period",
            `${$importStore.monthYear.year}-${$importStore.monthYear.month}`,
        )}
        {@render SummaryInfo("Transactions", totalTransactions.toString())}
    </div>
</Card>

{#snippet AccountCard(a: AccountState)}
    <Card class="w-[48%] p-0">
        <div class="flex flex-row justify-between align-start p-4">
            <div class="flex flex-col justify-between">
                <span class="text-md font-semibold">Pravidelné platby</span>
                <span class="text-sm text-gray-400"
                    >Net: {a.result?.netTransactions} | Start: {a.startBalance}
                    | End: {a.endBalance}</span
                >
            </div>
            <div>
                <Badge variant={a.result?.success ? "default" : "destructive"}
                    >{a.result?.success ? "Balanced" : "Has discrepancy"}</Badge
                >
            </div>
        </div>
    </Card>
{/snippet}

<Card class="p-4">
    <span class="text-lg">Per-account summary</span>
    <div class="flex flex-row flex-wrap gap-3">
        {#each accounts.value as a}
            {@render AccountCard(a)}
        {/each}
    </div>
</Card>
