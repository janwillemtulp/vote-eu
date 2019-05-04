<script>
  import { activeQuestions, activeAnswers, activeParties, selectedAnswers } from './store.js'
  import { scaleLinear } from 'd3-scale'

  let answerValues = [
	  { value: 100, label: "Completely agree", color: "hsl(200, 50%, 50%)" },
	  { value: 75, label: "Tend to agree", color: "hsl(200, 50%, 60%)" },
	  { value: 50, label: "Neutral", color: "#999" },
	  { value: 25, label: "Tend to disagree", color: "hsl(0, 50%, 60%)" },
	  { value: 0, label: "Completely disagree", color: "hsl(0, 50%, 50%)" },
	  { value: null, label: "No opinion", color: "#fff" }
  ];

  let x
  
  $: x = scaleLinear()
    .domain([0, answerValues.length])
    .range([0, 400])

  let maxWidth = 400 / answerValues.length
  let rowHeight = 40

  function getBackgroundColor(questionId, answerValue) {
    const question = $activeAnswers.get(questionId)

    if (([0, 25].includes(answerValue) && !question.has(0) && !question.has(25))) {
      return '#bbb'
    }

    if (([100, 75].includes(answerValue) && !question.has(100) && !question.has(75))) {
      return '#bbb'
    }

    return 'transparent'
  }

  function toggleAnswer(questionSharedId, answerValue) {
    const tmp = [...$selectedAnswers]
    
    if (tmp[questionSharedId] === answerValue) {
      tmp[questionSharedId] = undefined
    } else {
      tmp[questionSharedId] = answerValue
    }

    $selectedAnswers = tmp
  }
</script>

<svg width="1000" height="2000">
	<g transform="translate(50, 50)">
		{#each $activeQuestions as question, i}
      <g transform="translate({400 - 5}, {i * 2 * rowHeight})">
        <text
          dy={-rowHeight / 2}
          style="dominant-baseline: middle; text-anchor: end;"
        >{question.text}</text>
        {#each answerValues as answer, j}
          <g transform="translate({10 + x(j)}, 0)" on:click={() => toggleAnswer(i, answer.value)}>
            <rect
              y={-rowHeight}
              width={maxWidth}
              height={rowHeight - 2}
              rx={5}
              ry={5}
              style="opacity: 0.5; fill: {$selectedAnswers[i] === answer.value ? answer.color : getBackgroundColor(question.id, answer.value)}; stroke: #ccc;"
            />
            {#if $activeAnswers.get(question.id).has(answer.value)}
              <rect
                y={-1.5 * rowHeight / 2}
                width={$activeAnswers.get(question.id).get(answer.value).length / $activeParties.length * maxWidth}
                height={rowHeight / 2}
                style="fill: {answer.color};"
              />
            {/if}
          </g>
        {/each}
      </g>
		{/each}
	</g>
</svg>