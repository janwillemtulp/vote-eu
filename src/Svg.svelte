<script>
  import {
    activeQuestions,
    activeAnswers,
    activeParties,
    selectedAnswers,
    selectedParty,
    selectedCountry,
    filteredAnswers
  } from "./store.js";
  import { scaleLinear } from "d3-scale";
  import { line, curveMonotoneY } from "d3-shape";

  let answerValues = [
    { value: 100, label: "Completely agree", color: "hsl(200, 50%, 50%)" },
    // { value: 75, label: "Tend to agree", color: "hsl(200, 50%, 60%)" },
    { value: 50, label: "Neutral", color: "#999" },
    // { value: 25, label: "Tend to disagree", color: "hsl(0, 50%, 60%)" },
    { value: 0, label: "Completely disagree", color: "hsl(0, 50%, 50%)" },
    { value: null, label: "No opinion", color: "pink" }
  ];

  let x;
  let maxWidth = 400 / answerValues.length;
  let rowHeight = 80;
  let barWidth = 10;
  let margin = 20;

  $: x = scaleLinear()
    .domain([0, answerValues.length])
    .range([
      0,
      13 * barWidth * answerValues.length + answerValues.length * margin
    ]);

  $: filteredParties = $activeParties.filter(d =>
    $selectedParty === undefined ? true : d.id === $selectedParty
  );

  $: console.log("activeQuestions", $activeQuestions);
  $: console.log("activeAnswers", $activeAnswers);
  // $: console.log("selectedAnswers", $selectedAnswers);
  $: console.log("filteredAnswers", $filteredAnswers);

  function getBackgroundColor(questionId, answerValue) {
    const question = $activeAnswers.get(questionId);

    if (
      [0, 25].includes(answerValue) &&
      !question.has(0) &&
      !question.has(25)
    ) {
      return "#FED8B1";
    }

    if (
      [100, 75].includes(answerValue) &&
      !question.has(100) &&
      !question.has(75)
    ) {
      return "#FED8B1";
    }

    if ([50].includes(answerValue) && !question.has(50)) {
      return "#FED8B1";
    }

    return "#eee";
  }

  function toggleAnswer(questionSharedId, answerValue, questionId) {
    const tmp = [...$selectedAnswers];

    if (
      tmp[questionSharedId] &&
      tmp[questionSharedId].simplifiedAnswer === answerValue
    ) {
      tmp[questionSharedId] = undefined;
    } else {
      tmp[questionSharedId] = {
        simplifiedAnswer: answerValue,
        questionId
      };
    }

    $selectedAnswers = tmp;
  }

  function getOffset(activeAnswers, answerValue) {
    if (answerValue === 100) {
      return 13 * barWidth - activeAnswers.length * barWidth;
    } else if (answerValue === 50) {
      return 6 * barWidth - activeAnswers.length * 0.5 * barWidth;
    } else {
      return 0;
    }
  }

  let partyLine = line()
    .x(d => {
      const currentActiveAnswers = $activeAnswers
        .get(d.question_id)
        .get(d.simplifiedAnswer);

      return (
        5 +
        x(answerValues.map(d => d.value).indexOf(d.simplifiedAnswer)) +
        barWidth / 2 +
        currentActiveAnswers.indexOf(d.party_id) * barWidth +
        getOffset(currentActiveAnswers, d.simplifiedAnswer)
      );
    })
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
            d =>
              d.simplifiedAnswer === s.simplifiedAnswer &&
              d.question_id === s.questionId
          )
        );
  };

  function allAgree(questionId) {
    //TODO:
    return false;
  }
</script>

<svg width="1200" height="3500">
  <g transform="translate(50, 100)">
    <g transform="translate(400, 0)">
      {#each filteredParties as party, i}
        <path
          d={partyLine(party.data.reduce((acc, cur) => acc.concat([
                  cur,
                  cur,
                  cur
                ]), []))}
          style="stroke: {!isFilteredParty(party) ? '#ccc' : party.liberalConservative < 50 ? 'purple' : 'green'}; fill: none; stroke-width: {isFilteredParty(party) ? 2 : 1};" />
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
              x={-barWidth}
              y={-rowHeight}
              width={2 * barWidth + 13 * barWidth}
              height={rowHeight - 2}
              style="opacity: 0.5; fill: {$selectedAnswers[i] && $selectedAnswers[i].simplifiedAnswer === answer.value ? answer.color : getBackgroundColor(question.id, answer.value)}; stroke: #ccc;" />
            {#if !$activeAnswers
              .get(question.id)
              .has(answer.value) && [100, 50, 0].includes(answer.value)}
              <text
                style="font-size: 12px; text-anchor: middle; fill: hsl(30, 97%, 60%); dominant-baseline: middle;">
                <tspan x={(13 * barWidth) / 2} y={-14 - 3 * 17}>
                  <tspan style="font-size: 16px;">{$selectedCountry.seats}</tspan>
                  seats representing
                </tspan>
                <tspan x={(13 * barWidth) / 2} y={-14 - 2 * 17}>
                  {$selectedCountry.name}
                </tspan>
                <tspan x={(13 * barWidth) / 2} y={-14 - 1 * 17}>
                  won't have this opinion,
                </tspan>
                <tspan x={(13 * barWidth) / 2} y={-14 - 0 * 17}>
                  despite the outcome
                </tspan>
              </text>
            {/if}
            {#if $activeAnswers.get(question.id).has(answer.value)}
              {#each $activeAnswers
                .get(question.id)
                .get(answer.value) as partyAnswer, p}
                <rect
                  x={getOffset($activeAnswers
                      .get(question.id)
                      .get(answer.value), answer.value) + p * barWidth}
                  y={(-1.5 * rowHeight) / 2}
                  width={barWidth}
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
