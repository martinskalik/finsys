<script lang="ts">
    let { title, subheading } = $props();
</script>

<div class="flex flex-col gap-0.5">
    <h2 class="text-lg font-bold">{title}</h2>
    <span class="opacity-0.8 text-gray-300">{subheading}</span>
</div>
