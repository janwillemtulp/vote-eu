<script>
  import {
    activeQuestions,
    activeAnswers,
    activeParties,
    selectedAnswers,
    selectedParty
  } from "./store.js";
  import { scaleLinear } from "d3-scale";
  import { line, curveMonotoneY } from "d3-shape";

  let answerValues = [
    { value: 100, label: "Completely agree", color: "hsl(200, 50%, 50%)" },
    { value: 75, label: "Tend to agree", color: "hsl(200, 50%, 60%)" },
    { value: 50, label: "Neutral", color: "#999" },
    { value: 25, label: "Tend to disagree", color: "hsl(0, 50%, 60%)" },
    { value: 0, label: "Completely disagree", color: "hsl(0, 50%, 50%)" },
    { value: null, label: "No opinion", color: "#fff" }
  ];

  let x;

  $: x = scaleLinear()
    .domain([0, answerValues.length])
    .range([0, 400]);

  $: filteredParties = $activeParties.filter(d =>
    $selectedParty === undefined ? true : d.id === $selectedParty
  );

  $: console.log("activeQuestions", $activeQuestions);
  $: console.log("activeAnswers", $activeAnswers);
  // $: console.log("selectedAnswers", $selectedAnswers);

  let maxWidth = 400 / answerValues.length;
  let rowHeight = 60;
  let barWidth = 30;

  function getBackgroundColor(questionId, answerValue) {
    const question = $activeAnswers.get(questionId);

    if (
      [0, 25].includes(answerValue) &&
      !question.has(0) &&
      !question.has(25)
    ) {
      return "#bbb";
    }

    if (
      [100, 75].includes(answerValue) &&
      !question.has(100) &&
      !question.has(75)
    ) {
      return "#bbb";
    }

    return "transparent";
  }

  function toggleAnswer(questionSharedId, answerValue, questionId) {
    const tmp = [...$selectedAnswers];

    if (tmp[questionSharedId] && tmp[questionSharedId].answer === answerValue) {
      tmp[questionSharedId] = undefined;
    } else {
      tmp[questionSharedId] = {
        answer: answerValue,
        questionId
      };
    }

    $selectedAnswers = tmp;
  }

  let partyLine = line()
    .x(
      d =>
        5 +
        x(answerValues.map(d => d.value).indexOf(d.answer)) +
        maxWidth / $activeParties.length / 2 +
        $activeAnswers
          .get(d.question_id)
          .get(d.answer)
          .indexOf(d.party_id) *
          (maxWidth / $activeParties.length)
    )
    .y(
      (d, i) =>
        -rowHeight / 2 +
        Math.floor(i / 3) * 2 * rowHeight +
        (i % 3 === 0 ? -rowHeight / 4 : i % 3 === 2 ? rowHeight / 4 : 0)
    )
    .curve(curveMonotoneY);

  $: isFilteredParty = party => {
    const tmp = $selectedAnswers.filter(d => d !== undefined);
    return tmp.length === 0
      ? false
      : tmp.every(s =>
          party.data.find(
            d => d.answer === s.answer && d.question_id === s.questionId
          )
        );
  };
</script>

<svg width="1000" height="3000">
  <g transform="translate(50, 50)">
    <g transform="translate(400, 0)">
      {#each filteredParties as party, i}
        {console.log(party.data)}
        <path
          d={partyLine(party.data.reduce((acc, cur) => acc.concat([
                  cur,
                  cur,
                  cur
                ]), []))}
          style="stroke: {isFilteredParty(party) ? 'red' : '#ccc'}; fill: none; stroke-width: {isFilteredParty(party) ? 2 : 1};" />
      {/each}
    </g>
    {#each $activeQuestions as question, i}
      <g transform="translate({400 - 5}, {i * 2 * rowHeight})">
        <text
          dy={-rowHeight / 2}
          style="dominant-baseline: middle; text-anchor: end;">
          {question.text}
        </text>
        {#each answerValues as answer, j}
          <g
            transform="translate({10 + x(j)}, 0)"
            on:click={() => toggleAnswer(i, answer.value, question.id)}>
            <rect
              y={-rowHeight}
              width={maxWidth}
              height={rowHeight - 2}
              rx={5}
              ry={5}
              style="opacity: 0.5; fill: {$selectedAnswers[i] && $selectedAnswers[i].answer === answer.value ? answer.color : getBackgroundColor(question.id, answer.value)}; stroke: #ccc;" />
            {#if $activeAnswers.get(question.id).has(answer.value)}
              {#each $activeAnswers
                .get(question.id)
                .get(answer.value) as partyAnswer, p}
                <rect
                  x={(p * maxWidth) / $activeParties.length}
                  y={(-1.5 * rowHeight) / 2}
                  width={maxWidth / $activeParties.length}
                  height={rowHeight / 2}
                  style="fill: {answer.color}; stroke: black;" />
              {/each}
            {/if}
          </g>
        {/each}
      </g>
    {/each}
  </g>
</svg>
