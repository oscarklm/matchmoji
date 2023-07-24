<script lang="ts">
	import { scrambleArray } from '$lib';
	import Button from '$lib/components/Button.svelte';
	import CardView from '$lib/components/CardView.svelte';
	import MatchList from '$lib/components/MatchList.svelte';
	import { levels } from '$lib/config/levels';
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
				matches.unshift(prev_selection.emoji);
				matches = matches;
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

<div
	class="flex flex-col w-full h-full px-6 md:p-48"
	style="--size: {selected_level.size}"
	class:bg-sky-500={selected_level.name === 'Easy'}
	class:bg-orange-500={selected_level.name === 'Medium'}
	class:bg-rose-500={selected_level.name === 'Hard'}
>
	{#if state === 'waiting'}
		<div class="flex flex-col justify-center items-center w-full h-full">
			<div class="flex items-center gap-2">
				<h1 class="text-4xl md:text-7xl font-bold tracking-tight">Matchmoji</h1>
				<span class="text-4xl md:text-7xl font-bold"
					>{selected_level.emojis[Math.floor(Math.random() * selected_level.emojis.length)]}</span
				>
			</div>
			<div class="flex flex-col items-center justify-center py-4">
				<span class="font-semibold text-slate-800 text-lg">Select a difficulty</span>
				<div class="flex-col justify-center items-center gap-2 md:gap-3">
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
							{#if level.name === 'Hard'}
								<div class="text-yellow-200 drop-shadow-md text-sm">⚠️ ANTI-BOOMER MODE ⚠️</div>
							{/if}
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
				<img alt="owl" src="owl.gif" class="h-36" />
				<h1 class="text-5xl font-bold">DAMN!</h1>
				<div class="flex flex-col justify-center items-center py-4">
					<p class="text-lg font-bold py-2">
						You cleared <span class="uppercase underline underline-offset-2 text-white"
							>{selected_level.name}
						</span> in
					</p>
					<div class="bg-green-300 px-2 py-1 rounded-lg">
						<span class="font-bold"> {selected_level.duration - countdown} </span> seconds
					</div>
				</div>
				<div class="flex flex-col">
					<p class="text-3xl font-light pb-4">Not done yet?</p>
					<Button
						color="bg-green-400"
						on:click={() => {
							resetGame();
						}}>PLAY AGAIN</Button
					>
				</div>
			</div>
		</div>
	{:else if state === 'lost'}
		<div class="flex flex-col justify-center items-center w-full h-full">
			<img alt="owl" src="smile.gif" class="h-48 pb-2" />
			<h1 class="text-5xl font-bold">It's ok...</h1>
			<div class="flex flex-col justify-center items-center">
				<h1>You found {matches.length} / {emojis.length} matches</h1>
			</div>
			<div class="flex flex-col py-5">
				<p class="text-3xl font-light pb-4">Wanna try again?</p>
				<Button
					color="bg-purple-400"
					on:click={() => {
						resetGame();
					}}>PLAY AGAIN</Button
				>
			</div>
		</div>
	{/if}
</div>

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
