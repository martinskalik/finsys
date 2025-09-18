<script lang="ts">
    import {
        LucideCheckCircle2,
        LucideTrendingDown,
        LucideTrendingUp,
    } from "@lucide/svelte";
    import type { AccountBalanceCheckResult } from "../import.store";

    let { result }: { result: AccountBalanceCheckResult } = $props();

    let color = $derived(
        result.success ? "text-emerald-600" : "text-amber-600",
    );

    let diffStr = $derived(result.divergence);
</script>

{#snippet statusIcon()}
    {#if result.success}
        <LucideCheckCircle2 className="h-4 w-4" />
    {:else if result.divergence > 0}
        <LucideTrendingUp className="h-4 w-4" />
    {:else}
        <LucideTrendingDown className="h-4 w-4" />
    {/if}
{/snippet}

<div class={`flex items-center gap-2 ${color}`}>
    {@render statusIcon()}
    <span class={`text-sm`}>
        {#if result.success}
            Balanced
        {:else if result.divergence > 0}
            Missing income or extra expenses. Diff: {diffStr}
        {:else}
            Extra income or missing expenses. Diff: {diffStr}
        {/if}
    </span>
</div>
