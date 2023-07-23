<script lang="ts">
	export let color: 'bg-green-400' | 'bg-pink-400' | 'bg-orange-400' | 'bg-purple-400' =
		'bg-green-400';
</script>

<button
	class="rounded-md ring-2 shadow-lg shadow-black/30 ring-slate-800 px-10 md:px-14 p-2.5 md:p-4.5 text-lg md:text-xl bg-green-400 text-slate-800 font-semibold hover:bg-green-500 {color}"
	on:click
>
	<slot />
</button>
