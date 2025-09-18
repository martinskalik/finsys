<!-- src/lib/components/ImportModal.svelte -->
<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as Dialog from "$lib/components/ui/dialog";
    import {
        LucideCheckCircle,
        LucideLoader2,
        LucideXCircle,
    } from "@lucide/svelte";

    let {
        open = $bindable(),
        isLoading = false,
        success = false,
        error = null,
    }: {
        open: boolean;
        isLoading: boolean;
        success: boolean;
        error: string | null;
    } = $props();

    function handleClose() {
        if (!isLoading) {
            open = false;
        }
    }
</script>

<Dialog.Root bind:open onOpenChange={handleClose}>
    <Dialog.Content class="sm:max-w-md">
        <Dialog.Header>
            <Dialog.Title>
                {#if isLoading}
                    Importing Data
                {:else if success}
                    Import Successful
                {:else if error}
                    Import Failed
                {/if}
            </Dialog.Title>
        </Dialog.Header>

        <div class="flex flex-col items-center py-6">
            {#if isLoading}
                <div class="flex flex-col items-center space-y-4">
                    <LucideLoader2
                        class="h-12 w-12 animate-spin text-primary"
                    />
                    <p class="text-sm text-muted-foreground">
                        Saving your data to the database...
                    </p>
                </div>
            {:else if success}
                <div class="flex flex-col items-center space-y-4">
                    <LucideCheckCircle class="h-12 w-12 text-green-500" />
                    <div class="text-center">
                        <p class="text-lg font-medium text-green-700">
                            Data imported successfully!
                        </p>
                    </div>
                </div>
            {:else if error}
                <div class="flex flex-col items-center space-y-4">
                    <LucideXCircle class="h-12 w-12 text-red-500" />
                    <div class="text-center">
                        <p class="text-lg font-medium text-red-700">
                            Import failed
                        </p>
                        <p class="mt-2 text-sm text-muted-foreground">
                            {error}
                        </p>
                    </div>
                </div>
            {/if}
        </div>

        <Dialog.Footer>
            {#if isLoading}
                <!-- Žádné tlačítko během loading -->
            {:else if success}
                <Button onclick={() => (open = false)} class="w-full">
                    Close
                </Button>
            {:else if error}
                <div class="flex space-x-2 w-full">
                    <Button
                        variant="outline"
                        onclick={() => (open = false)}
                        class="flex-1"
                    >
                        Cancel
                    </Button>
                </div>
            {/if}
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
