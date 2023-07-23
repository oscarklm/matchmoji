<script lang="ts">
	import { levels } from '$lib/config/levels';
	import Game from './Game.svelte';

	let level = levels[0];
	let state: PlayState = 'waiting';
</script>

<Game
	{state}
	level={levels[0]}
	on:match={() => {
		console.log('match');
	}}
	on:start={() => {
		console.log('start');
	}}
/>
