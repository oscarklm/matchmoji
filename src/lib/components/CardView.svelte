<script lang="ts">
	export let card: Card;
	export let flipped = false;
	export let matched = false;
</script>

<div class="card aspect-square relative transition-transform duration-300" class:flipped>
	<div class="front bg-slate-800 rounded-md">
		<button class="w-full h-full bg-transparent" on:click />
	</div>
	<div
		class="back rounded-md bg-white flex justify-center items-center ring-2 ring-slate-800 md:text-4xl"
		class:matched
	>
		{card.emoji}
	</div>
</div>

<style>
	.card {
		font-size: 2rem;
		width: 100%;
		/* 3d transform */
		transform-style: preserve-3d;
	}

	.front,
	.back {
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		position: absolute;
		backface-visibility: hidden;
	}

	.back {
		transition: opacity 1s;
		transition: background-color 1s;
		transform: rotateY(180deg);
	}

	.flipped {
		transform: rotateY(180deg);
	}

	.matched {
		opacity: 0.5;
		@apply bg-green-400 ring-2 ring-green-600;
	}
</style>
