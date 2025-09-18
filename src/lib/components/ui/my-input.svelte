<script lang="ts">
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import type { WithElementRef } from "$lib/utils";
    import type {
        HTMLInputAttributes,
        HTMLInputTypeAttribute,
    } from "svelte/elements";

    type InputType = Exclude<HTMLInputTypeAttribute, "file">;

    type Props = HTMLInputAttributes & { label: string };

    let {
        value = $bindable(),
        label,
        type,
        class: className,
        ...rest
    }: Props = $props();
    const id = $props.id();
</script>

<div class="flex w-full max-w-sm flex-col gap-1.5">
    <Label for={id}>{label}</Label>
    <Input {id} bind:value class={className} {type} {...rest} />
</div>
