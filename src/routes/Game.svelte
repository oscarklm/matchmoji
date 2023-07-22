<script lang="ts">
	import { scrambleArray } from '$lib';
	import Button from '$lib/components/Button.svelte';
	import CardView from '$lib/components/CardView.svelte';
	import MatchList from '$lib/components/MatchList.svelte';
	import { confetti } from '@neoconfetti/svelte';
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	// Settings
	export let level: Level;

	// State
	let state: 'waiting' | 'playing' | 'won' | 'lost' = 'waiting';
	let emojis: string[] = [];
	let matches: string[] = [];
	let prev_selection: Card | null = null;
	let cards: Card[] = [];

	// Game logic
	function startGame() {
		cards = createCards();
		dispatch('start');
		state = 'playing';
	}

	function resetGame() {
		state = 'waiting';
		matches = [];
		prev_selection = null;
		cards = [];
	}

	function createCards(): Card[] {
		// Create an array of random unique emojis, using the levels emoji list
		emojis = scrambleArray(level.emojis).slice(0, level.size ** 2 / 2);

		// Create 2 cards for each item in the emojis array
		const newCards = [...emojis, ...emojis].map((emoji, index) => {
			return {
				id: index,
				emoji,
				flipped: false,
				matched: false
			};
		});

		return scrambleArray(newCards);
	}

	function handleSelection(new_selection: Card) {
		if (prev_selection === new_selection) return;

		if (prev_selection === null) {
			prev_selection = new_selection;
		} else {
			if (prev_selection.emoji === new_selection.emoji) {
				matches = [...matches, prev_selection.emoji];
				dispatch('match', prev_selection.emoji);
			}
			prev_selection = new_selection;
		}
	}

	$: {
		if (matches.length === level.size * 2) {
			setTimeout(() => {
				state = 'won';
			}, 500);
		}
	}
</script>

<main class="flex flex-col h-screen w-screen p-10 md:p-48">
	{#if state === 'waiting'}
		<div class="flex flex-col gap-2 justify-center items-center w-full h-full">
			<h1 class="text-4xl md:text-7xl font-bold tracking-tight">Matchmoji 🤠</h1>
			<p class="text-2xl md:text-4xl font-light pb-4 md:pb-6">Press start to play</p>
			<Button
				on:click={() => {
					startGame();
				}}>Start</Button
			>
		</div>
	{:else if state === 'playing'}
		<div class="flex flex-col w-full h-full gap-2 content-center justify-center">
			<div class="flex flex-col gap-2">
				<div class="text-center">
					<h1 class="text-2xl font-semibold">Collect all matches to win 🏆</h1>
				</div>
				<div class="h-10">
					<MatchList {matches} />
				</div>
			</div>
			<div class="grid gap-2 md:gap-6 aspect-square">
				{#each cards as card}
					<CardView
						{card}
						on:click={() => {
							handleSelection(card);
						}}
						flipped={prev_selection?.id === card.id || matches.includes(card.emoji)}
						matched={matches.includes(card.emoji)}
					/>
				{/each}
			</div>
		</div>
	{:else if state === 'won'}
		<div class="flex flex-col w-full h-full">
			<div class="flex justify-between">
				<div
					class="confetti"
					use:confetti={{
						stageWidth: innerWidth,
						stageHeight: innerHeight,
						particleCount: 20
					}}
				/>
				<div
					class="confetti"
					use:confetti={{
						stageWidth: innerWidth,
						stageHeight: innerHeight,
						particleCount: 18
					}}
				/>
			</div>
			<div class="flex flex-col gap-2 justify-center items-center w-full h-full">
				<h1 class="text-5xl">You won 🥳</h1>
				<p class="text-3xl font-light pb-4">Press start to play</p>
				<Button
					on:click={() => {
						resetGame();
						startGame();
					}}>Play again</Button
				>
			</div>
		</div>
	{:else if state === 'lost'}
		<div>
			<h1>Game over 😵</h1>
			<button on:click={() => {}}>Try again</button>
		</div>
	{/if}
</main>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(4, 1fr);
		perspective: 100vw;
	}
</style>
