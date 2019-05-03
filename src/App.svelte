<script>
	import { csv } from 'd3-fetch'
	import { rollup } from 'd3-array'
	import { data, selectedCountry, activeData, activeQuestions, activeParties, activeAnswers, allCountryCodes } from './store.js'

	let promise = loadData()
	let answerValues = [
		{ value: 100, label: 'Completely agree', color: 'hsl(200, 50%, 50%)' },
		{ value: 75, label: 'Tend to agree', color: 'hsl(200, 50%, 60%)'  },
		{ value: 50, label: 'Neutral', color: '#999'  },
		{ value: 25, label: 'Tend to disagree', color: 'hsl(0, 50%, 60%)'  },
		{ value: 0, label: 'Completely disagree', color: 'hsl(0, 50%, 50%)'  },
		{ value: null, label: 'No opinion', color: '#ccc'  }
	]

	const parse = attribute => attribute === '' ? null : +attribute

	async function loadData() {
		await csv('./data/data.csv', row => ({
			...row,
			answer: parse(row.answer),
			economic_liberalisation: parse(row.economic_liberalisation),
			environmental_protection: parse(row.environmental_protection),
			european_integration: parse(row.european_integration),
			law_and_order: parse(row.law_and_order),
			liberal_society: parse(row.liberal_society),
			party_id: parse(row.party_id),
			question_id: parse(row.question_id),
			question_shared_id: parse(row.question_shared_id),
			restrictive_financial_policy: parse(row.restrictive_financial_policy),
			restrictive_immigration_policy: parse(row.restrictive_immigration_policy),
			xy_lc: parse(row.xy_lc),
			xy_lr: parse(row.xy_lr)
		})).then(res => {
			$data = res
			console.log(res, $activeAnswers)
		})
	}

</script>

<style>
	.answer {
		margin-right: 5px;
		font-size: 11px;
		font-style: italic;
		font-weight: bold;
	}

	.question {
		width: 400px;
		display: inline-block;
		text-align: right;
	}

	button {
		border: none;
		border-radius: 0;
		width: 30px;
	}
</style>

{#await promise}
	<p>...loading data</p>
{:then}
{:catch error}
	<p style="color: red;">{error.message}</p>
{/await}

<div>
	{#each $allCountryCodes as code}
		<button style="background-color: {$selectedCountry === code ? 'orange' : '#ddd'}" on:click={() => $selectedCountry = code}>{code}</button>
	{/each}
</div>
<div>
	{#each $activeParties as party}
		<!-- <span style="margin-right: 10px;">{party.name_short}</span> -->
		<img src={party.image} alt={party.name_long} height="30" style="margin-right: 5px;" />
	{/each}
</div>
{#each $activeQuestions as question}
	<p style="margin: 0;">
		<span class="question">{question.text}</span>
		{#each answerValues as answer}
			{#if $activeAnswers.get(question.id).has(answer.value)}
				<span style="display: inline-block; height: 20px; width: {$activeAnswers.get(question.id).get(answer.value).length / $activeParties.length * 400}px; background-color: {answer.color};"></span>
				<!-- <span class="answer" style="color: {answer.color}">{answer.label}: {$activeAnswers.get(question.id).get(answer.value).length}</span> -->
			{:else}
				<span style="display: inline-block; height: 20px; width: 0px; background-color: {answer.color};"></span>
				<!-- <span class="answer" style="color: {answer.color}">{answer.label}: 0</span> -->
			{/if}
		{/each}
	</p>
{/each}
