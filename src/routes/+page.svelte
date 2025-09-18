<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Card } from "$lib/components/ui/card";
    import ImportResultModal from "$lib/import/components/import-result-modal.svelte";
    import StepHeader from "$lib/import/components/step-header.svelte";
    import ImportSteps from "$lib/import/import-steps.svelte";
    import { importStore } from "$lib/import/import.store";
    import { saveImportData } from "$lib/import/saveImportData";
    import BalancesStep from "$lib/import/steps/balances-step.svelte";
    import FinishStep from "$lib/import/steps/finish-step.svelte";
    import SelectMonthStep from "$lib/import/steps/select-month-step.svelte";
    import TransactionsStep from "$lib/import/steps/transactions-step.svelte";
    import { LucideChevronLeft, LucideChevronRight } from "@lucide/svelte";
    import { onMount } from "svelte";

    let { data } = $props();

    onMount(() => {
        $importStore.actions.setAccounts(data.accounts, data.accountBalances);
        $importStore.actions.setPlannedExpenses(data.plannedExpenses);
    });

    let activeStep = $derived($importStore.activeStep);

    function next() {
        $importStore.actions.setActiveStep(activeStep + 1);
    }
    function back() {
        $importStore.actions.setActiveStep(activeStep - 1);
    }

    function resetWizard() {
        $importStore.actions.resetToInitialState();
        window.location.reload();
    }

    let open = $state(false);
    let isLoading = $state(false);
    let success = $state(false);
    let error = $state<string | null>(null);

    async function finish() {
        open = true;
        isLoading = true;

        try {
            await saveImportData();
            success = true;
            error = null;
            resetWizard();
        } catch (e: any) {
            success = false;
            error = e.message;
        }
        isLoading = false;
    }
</script>

<ImportResultModal bind:open {isLoading} {success} {error} />

<div class="mx-auto my-8 px-8 space-y-8 max-w-[1600px]">
    <div class="flex flex-row justify-between align-start">
        <div>
            <h1 class="text-2xl font-bold">FinSys Import Wizard</h1>
            <span class="text-gray-400"
                >Import monthly transactions and reconcile balances.</span
            >
        </div>
        <div>
            <Button variant="outline" size="sm" onclick={resetWizard}
                >Reset wizard</Button
            >
        </div>
    </div>
    <ImportSteps />

    <div class="w-full">
        <Card class="p-8">
            {#if activeStep === 0}
                <StepHeader title="Select period" subheading="Year and month" />
                <SelectMonthStep />
            {:else if activeStep === 1}
                <StepHeader
                    title="Add Transactions"
                    subheading="Import and edit"
                />
                <TransactionsStep />
            {:else if activeStep === 2}
                <StepHeader
                    title="Enter balances"
                    subheading="Validate totals"
                />
                <BalancesStep />
            {:else}
                <StepHeader title="Complete import" subheading="Finish up" />
                <FinishStep />
            {/if}
        </Card>
    </div>

    <div class="flex flex-row justify-between">
        <Button variant="outline" onclick={back} disabled={activeStep === 0}
            ><LucideChevronLeft /> Back</Button
        >
        {#if activeStep < 3}
            <Button onclick={next}>Next <LucideChevronRight /></Button>
        {:else}
            <Button onclick={finish}>Complete import</Button>
        {/if}
    </div>
</div>
