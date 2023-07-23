<script lang="ts">
	import { scrambleArray } from '$lib';
	import Button from '$lib/components/Button.svelte';
	import CardView from '$lib/components/CardView.svelte';
	import MatchList from '$lib/components/MatchList.svelte';
	import Emoji from '$lib/icons/Emoji.svelte';
	import { confetti } from '@neoconfetti/svelte';
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	// Settings
	export let level: Level;
	export let state: PlayState;

	// State
	let emojis: string[] = [];
	let matches: string[] = [];
	let prev_selection: Card | null = null;
	let cards: Card[] = [];
	let countdown: number = 0;
	let countdown_id: number;

	// Game logic
	function startGame() {
		cards = createCards();
		dispatch('start');
		state = 'playing';
		spawnCountdown(level.duration);
	}

	function resetGame() {
		clearInterval(countdown_id);
		state = 'waiting';
		matches = [];
		prev_selection = null;
		cards = [];
	}

	function spawnCountdown(duration: number) {
		countdown = duration;
		countdown_id = setInterval(() => {
			countdown--;
			if (countdown === 0) {
				clearInterval(countdown_id);
				state = 'lost';
			}
		}, 1000);
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

<main class="flex flex-col h-screen w-screen p-10 md:p-48" style="--size: {level.size}">
	{#if state === 'waiting'}
		<div class="flex flex-col gap-2 justify-center items-center w-full h-full">
			<div class="flex items-center gap-2">
				<h1 class="text-4xl md:text-7xl font-bold tracking-tight">Matchmoji</h1>
				<Emoji class="h-16 w-16" />
			</div>
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
					<h1 class="text-2xl font-semibold">Match all cards to win 🏆</h1>
					<div class="text-4xl font-bold">{countdown}</div>
				</div>
				<div class="h-10">
					<MatchList {matches} />
				</div>
			</div>
			<div class="grid aspect-auto">
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
					}}>START</Button
				>
			</div>
		</div>
	{:else if state === 'lost'}
		<div class="flex flex-col justify-center items-center w-full h-full">
			<h1 class="text-5xl">Game over 😵</h1>
			<p class="text-3xl font-light pb-4">Press start to try again</p>
			<Button
				on:click={() => {
					resetGame();
					startGame();
				}}>START</Button
			>
		</div>
	{/if}
</main>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(var(--size), minmax(0, 1fr));
		grid-template-rows: repeat(var(--size), minmax(0, 1fr));
		gap: calc(var(--size) * 0.05rem);
		perspective: 100vw;
	}
	@media (min-width: 500) {
		.grid {
			gap: 1rem;
		}
	}
</style>
