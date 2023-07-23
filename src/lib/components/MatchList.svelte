<script lang="ts">
	import { fly } from 'svelte/transition';

	export let matches: string[];
</script>

<div class="flex gap-2 w-full h-full select-none overflow-hidden">
	{#each matches as match (match)}
		<div class="flex justify-center items-center bg-white rounded-md h-9 w-9">
			<div class="text-sm translate-x-1 -translate-y-0.5">{match}</div>
			<div class="absolute -translate-x-1">{match}</div>
		</div>
	{/each}
</div>
