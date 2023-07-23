<script lang="ts">
	import { levels } from '$lib/config/levels';
	import Game from './Game.svelte';

	let level = levels[0];
	let state: PlayState = 'waiting';
</script>

<main class="h-screen w-screen">
	<Game
		{state}
		on:match={() => {
			console.log('match');
		}}
		on:start={() => {
			console.log('start');
		}}
	/>
</main>
