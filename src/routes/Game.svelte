<script lang="ts">
	import { scrambleArray } from '$lib';
	import Button from '$lib/components/Button.svelte';
	import CardView from '$lib/components/CardView.svelte';
	import MatchList from '$lib/components/MatchList.svelte';
	import { levels } from '$lib/config/levels';
	import Emoji from '$lib/icons/Emoji.svelte';
	import { confetti } from '@neoconfetti/svelte';
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	// Settings
	export let state: PlayState;
	let selected_level: Level = levels[0];

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
		spawnCountdown(selected_level.duration);
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
		emojis = scrambleArray(selected_level.emojis).slice(0, selected_level.size ** 2 / 2);

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

	// Check if we won
	$: {
		if (state === 'playing' && matches.length >= emojis.length) {
			const a = matches.sort();
			const b = emojis.sort();

			const arraysMatch = a.every((value, index) => value === b[index]);

			if (arraysMatch) {
				setTimeout(() => {
					state = 'won';
					clearInterval(countdown_id);
				}, 500);
			}
		}
	}
</script>

<main
	class="flex flex-col h-screen w-screen p-6 md:p-48"
	style="--size: {selected_level.size}"
	class:bg-sky-400={selected_level.name === 'Easy'}
	class:bg-orange-400={selected_level.name === 'Medium'}
	class:bg-red-400={selected_level.name === 'Hard'}
>
	{#if state === 'waiting'}
		<div class="flex flex-col justify-center items-center w-full h-full">
			<div class="flex items-center gap-2">
				<h1 class="text-4xl md:text-7xl font-bold tracking-tight">Matchmoji</h1>
				<Emoji class="h-16 w-16 animate-bounce" />
			</div>
			<div class="flex flex-col items-center justify-center py-4">
				<span class="font-semibold text-slate-800 text-lg">Select a difficulty</span>
				<div class="flex gap-2 md:gap-3">
					{#each levels as level}
						<label class="flex gap-2 items-center text-base md:text-lg font-semibold">
							<input
								class="h-5 w-5 text-indigo-600"
								type="radio"
								name="levels"
								value={level}
								bind:group={selected_level}
							/>
							{level.name}
						</label>
					{/each}
				</div>
				<div class="py-8">
					<Button
						on:click={() => {
							startGame();
						}}>START</Button
					>
				</div>
			</div>
		</div>
	{:else if state === 'playing'}
		<div class="flex flex-col w-full h-full gap-2 content-center justify-center">
			<div class="flex flex-col gap-2">
				<div class="text-center">
					<h1 class="text-2xl font-semibold">Match all cards to win 🏆</h1>
					<div class="text-4xl font-bold animate-pulse">{countdown}</div>
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
						particleCount: 20
					}}
				/>
			</div>
			<div class="flex flex-col gap-2 justify-center items-center w-full h-full">
				<h1 class="text-5xl font-bold">You won 🥳</h1>
				<p class="text-3xl font-light pb-4">Press start to play again</p>
				<Button
					on:click={() => {
						resetGame();
					}}>START</Button
				>
			</div>
		</div>
	{:else if state === 'lost'}
		<div class="flex flex-col justify-center items-center w-full h-full">
			<h1 class="text-5xl font-bold">Game over 😵</h1>
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
	@media (min-width: 768px) {
		/* Styles for large screens */
		.grid {
			gap: calc(var(--size) * 0.1rem);
		}
	}
</style>
