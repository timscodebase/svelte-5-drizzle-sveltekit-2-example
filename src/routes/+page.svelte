<script lang="ts">
	import { app } from '$lib/state.svelte';
	import { jump_2_today, string_2_bool } from '$lib/utils';
	import Cookies from 'js-cookie';
	import { onMount, tick } from 'svelte';
	import { fade } from 'svelte/transition';
	import Fab from './Fab.svelte';
	import HabitRow from './HabitRow.svelte';
	import ReorderRow from './ReorderRow.svelte';

	let { data, form } = $props();
	const initial_hidden = string_2_bool(Cookies.get('show_hidden'));
	let show_hidden = $state(initial_hidden);
	let what = data.habits;

	function toggle_hidden() {
		show_hidden = !show_hidden;
		Cookies.set('show_hidden', show_hidden.toString(), {
			sameSite: 'lax',
		});
	}

	onMount(async () => {
		await tick();
		jump_2_today();
	});
</script>

<Fab {form} clean_habits={what} bind:habits={data.habits} />

{#if app.mode === 'NORMAL'}
	<section class="habits" id="visible_habits">
		{#each data.habits.filter((habit) => habit.status === 'VISIBLE') as habit, i (habit.id)}
			<HabitRow {form} {habit} row={i} />
		{/each}
	</section>
{:else if app.mode === 'REORDER'}
	<section class="reorder_habits" id="reorder_habits">
		{#each data.habits.filter((habit) => habit.status === 'VISIBLE') as habit, i (habit.id)}
			<ReorderRow {habit} />
		{/each}
	</section>
{/if}

<button class:active={show_hidden} class="toggle-hidden" on:click={toggle_hidden}>↓</button>

{#if show_hidden}
	<h2 class="h4">Hidden</h2>
	<section class="habits" transition:fade>
		{#each data.habits.filter((habit) => habit.status === 'HIDDEN') as habit, i (habit.id)}
			<HabitRow {habit} row={i} />
		{/each}
	</section>
{/if}

<style>
	.habits {
		grid-column: 2 / 4;
		overflow: auto;
		margin-left: -2.5vw;
		padding-left: 2.5vw;
		padding-top: 20px;
		padding-bottom: 80px;
	}

	.reorder_habits {
		grid-column: 2 / 3;
		overflow: auto;
		padding-top: 20px;
		padding-bottom: 80px;
	}

	.toggle-hidden {
		opacity: 0.3;
		cursor: pointer;
		border: none;
		background: transparent;
		color: var(--fg);
	}

	.toggle-hidden:hover {
		opacity: 1;
		background: transparent;
	}

	:global(.ghost-row) {
		background: red;
	}

	.active {
		rotate: 180deg;
	}

	/* Desktop */
	@media (width > 700px) {
	}

	/* Mobile */
	@media (width < 700px) {
	}
</style>
