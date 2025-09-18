<script lang="ts">
    import { Label } from "./label";
    import * as Select from "./select";

    let {
        value = $bindable(),
        label,
        name,
        options,
        onValueChange,
        triggerClass,
    }: {
        value: string;
        label?: string;
        name?: string;
        options: { label: string; value: string }[];
        onValueChange?: (value: string) => void;
        triggerClass?: string;
    } = $props();

    let triggerContent = $derived(
        options.find((o) => o.value === value)?.label ?? "",
    );
</script>

{#if label}
    <Label>{label}</Label>
{/if}
<Select.Root type="single" {name} bind:value {onValueChange}>
    <Select.Trigger class={`w-full ${triggerClass}`}
        >{triggerContent}</Select.Trigger
    >
    <Select.Content>
        {#each options as o (o.value)}
            <Select.Item value={o.value} label={o.label}>
                {o.label}
            </Select.Item>
        {/each}
    </Select.Content>
</Select.Root>
