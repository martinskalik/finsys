<script lang="ts">
    import {
        LucideCalendar,
        LucideFileUp,
        LucideFlag,
        LucideListChecks,
    } from "@lucide/svelte";
    import { importStore } from "./import.store";
    import ImportStepCard from "./components/import-step-card.svelte";

    let activeStep = $derived($importStore.activeStep);

    function switchStep(step: number) {
        $importStore.actions.setActiveStep(step);
    }

    function getState(step: number) {
        if (activeStep > step) return "success";
        if (activeStep === step) return "active";
        return "inactive";
    }
</script>

<div class="flex flex-row gap-4 w-full">
    <ImportStepCard
        title="Select period"
        description="Year and month"
        icon={LucideCalendar}
        state={getState(0)}
        onclick={() => switchStep(0)}
    />
    <ImportStepCard
        title="Add Transactions"
        description="Import and edit"
        icon={LucideFileUp}
        state={getState(1)}
        onclick={() => switchStep(1)}
    />
    <ImportStepCard
        title="Enter balances"
        description="Validate totals"
        icon={LucideListChecks}
        state={getState(2)}
        onclick={() => switchStep(2)}
    />
    <ImportStepCard
        title="Complete import"
        description="Finish up"
        icon={LucideFlag}
        state={getState(3)}
        onclick={() => switchStep(3)}
    />
</div>
