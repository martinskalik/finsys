<script lang="ts">
    import Card from "$lib/components/ui/card/card.svelte";
    import { LucideCheck } from "@lucide/svelte";
    import type { MouseEventHandler } from "svelte/elements";

    type StepState = "inactive" | "success" | "active";

    let {
        title,
        description,
        icon: Icon,
        state,
        onclick,
    }: {
        title: string;
        description: string;
        icon: any;
        state: StepState;
        onclick: MouseEventHandler<HTMLDivElement>;
    } = $props();

    let isSuccess = $derived(state === "success");
    let isActive = $derived(state === "active");
</script>

<Card
    class={`grow py-3 ${isSuccess && "text-green-600 bg-green-600/10 border-green-600"} ${isActive && "border-white"}`}
    {onclick}
>
    <div class="flex flex-row px-6 gap-6 items-center">
        {#if isSuccess}
            <LucideCheck />
        {:else}
            <Icon />
        {/if}

        <div class="flex flex-col">
            <span class="font-bold text-sm">{title}</span>
            <span class="text-gray-400 text-sm">{description}</span>
        </div>
    </div>
</Card>
