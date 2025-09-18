<script lang="ts">
    import SelectAccount from "../components/select-account.svelte";
    import TransactionsTable from "../components/transactions-table.svelte";
    import { importStore } from "../import.store";

    let account = $derived($importStore.selectedAccountId);
</script>

<div class="flex flex-row gap-4 w-full">
    <SelectAccount />
    {#if account}
        <TransactionsTable {account} />
    {/if}
</div>
