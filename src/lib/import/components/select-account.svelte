<script lang="ts">
    import { Card } from "$lib/components/ui/card";
    import { importStore } from "$lib/import/import.store";

    let selectedAccountId = {
        get value() {
            return $importStore.selectedAccountId;
        },
    };

    $effect(() => {
        // Select first account if none is selected
        if (!selectedAccountId && $importStore.accounts?.length > 0)
            selectAccount($importStore.accounts[0].id);
    });

    function selectAccount(id: number) {
        $importStore.actions.setSelectedAccount(id);
    }
</script>

<Card class="p-4">
    Accounts
    <div class="flex flex-col mt-2 gap-2">
        {#each $importStore.accounts as a (a.id)}
            <Card
                class={`p-3 min-w-60 ${selectedAccountId.value === a.id ? "border-white bg-gray-700" : ""}`}
                onclick={() => selectAccount(a.id)}
            >
                <div
                    class="flex flex-row justify-between items-center w-full gap-4"
                >
                    <div class="flex flex-col">
                        <span class="">{a.account.name}</span>
                        <span class="text-sm text-gray-400"
                            >{a.account.type}</span
                        >
                    </div>
                    <span class="text-sm text-gray-400">
                        {a.transactions.length} tx
                    </span>
                </div>
            </Card>
        {/each}
    </div>
</Card>
