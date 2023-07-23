<script lang="ts">
	import { fly } from 'svelte/transition';

	export let matches: string[];
</script>

<div class="flex gap-2 select-none overflow-hidden">
	{#each matches as match, index (match + index)}
		<div class="flex h-9 w-9 justify-center items-center bg-white rounded-md">
			<div class="text-sm translate-x-1 -translate-y-0.5">{match}</div>
			<div class="-translate-x-1">{match}</div>
		</div>
	{/each}
</div>
