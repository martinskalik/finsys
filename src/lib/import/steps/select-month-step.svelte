<script lang="ts">
    import MyInput from "$lib/components/ui/my-input.svelte";
    import { importStore } from "../import.store";

    let year = $state($importStore.monthYear.year);
    let month = $state($importStore.monthYear.month);

    function updateStore() {
        $importStore.actions.setMonthYear({ year, month });
    }
</script>

<div class="flex flex-row gap-2">
    <div class="w-[80px]">
        <MyInput
            type="number"
            label="Year"
            min={1970}
            max={new Date().getFullYear()}
            bind:value={year}
            oninput={updateStore}
        />
    </div>
    <div class="w-[70px]">
        <MyInput
            type="number"
            label="Month"
            max={12}
            min={1}
            bind:value={month}
            oninput={updateStore}
        />
    </div>
</div>
