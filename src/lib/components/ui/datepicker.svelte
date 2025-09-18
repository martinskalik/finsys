<script lang="ts">
    import CalendarIcon from "@lucide/svelte/icons/calendar";
    import {
        CalendarDate,
        DateFormatter,
        type DateValue,
        getLocalTimeZone,
        parseDate,
    } from "@internationalized/date";
    import { cn } from "$lib/utils.js";
    import { buttonVariants } from "$lib/components/ui/button/index.js";
    import { Calendar } from "$lib/components/ui/calendar/index.js";
    import * as Popover from "$lib/components/ui/popover/index.js";

    const df = new DateFormatter("en-US", {
        dateStyle: "long",
    });

    let {
        value,
        onValueChange,
        minValue,
        maxValue,
    }: {
        value: CalendarDate | undefined;
        onValueChange: (value: CalendarDate | undefined) => void;
        minValue: CalendarDate;
        maxValue: CalendarDate;
    } = $props();

    let contentRef = $state<HTMLElement | null>(null);

    let calendarValue = {
        get value() {
            return value;
        },
        set value(newValue: CalendarDate | undefined) {
            value = newValue;
            onValueChange(newValue);
        },
    };
</script>

<Popover.Root>
    <Popover.Trigger
        class={cn(
            buttonVariants({
                variant: "outline",
                class: "w-full justify-start text-left font-normal",
            }),
            !value && "text-muted-foreground",
        )}
    >
        <CalendarIcon />
        {value ? `${value.day}.${value.month}.` : ""}
    </Popover.Trigger>
    <Popover.Content bind:ref={contentRef} class="w-auto p-0">
        <Calendar
            type="single"
            bind:value={calendarValue.value}
            {minValue}
            {maxValue}
        />
    </Popover.Content>
</Popover.Root>
