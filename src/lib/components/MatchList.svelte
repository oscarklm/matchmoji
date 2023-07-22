<script lang="ts">
	import { fly } from 'svelte/transition';

	export let matches: string[];
</script>

<div class="matches-found">
	{#each matches as match (match)}
		<div class="box" in:fly={{ x: 350, duration: 300 }}>
			<span class="match">
				{match}
			</span>
			<span class="duplicate">{match}</span>
		</div>
	{/each}
</div>

<style>
	.matches-found {
		display: flex;
		gap: 0.8rem;
		position: relative;
	}

	.box {
		display: flex;
		align-items: center;
		width: 2rem;
		height: 2rem;
		padding: 0.5rem;
		border-radius: 0.5rem;

		background: white;
		z-index: 10;
	}

	.match {
		transform: translate(-30%, 0);
	}

	.duplicate {
		position: relative;
		scale: 0.8;
		transform: translate(-80%, -15%) rotate(25deg);
		z-index: -1;
	}
</style>
