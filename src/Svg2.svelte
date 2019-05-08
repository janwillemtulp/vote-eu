<script>
  import {
    opinionBlocks,
    allParties,
    selectedOpinions,
    selectedPartyIds
  } from "./store.js";
  import { scaleOrdinal, scaleLinear } from "d3-scale";
  import { extent } from "d3-array";
  import { line, curveMonotoneY } from "d3-shape";

  $: console.log("$opinionBlocks", $opinionBlocks);
  $: console.log("$allParties", $allParties);
  $: console.log("$selectedOpinions", $selectedOpinions);
  $: console.log("$selectedPartyIds", $selectedPartyIds);

  let rowHeight = 60;
  let barWidth = 10;
  let answerWidth = 150;

  let xc = scaleOrdinal()
    .domain([100, 50, 0, null])
    .range(Array.from(Array(4).keys()).map(d => d * answerWidth));

  $: y = scaleLinear()
    .domain(extent($opinionBlocks.map(d => d.question.id)))
    .range([0, 21 * rowHeight * 2]);

  function xOffset(block) {
    if (block.answer.simplifiedValue === 100) {
      return answerWidth - barWidth - block.parties.length * barWidth;
    } else if (block.answer.simplifiedValue === 50) {
      return answerWidth / 2 - (block.parties.length * barWidth) / 2;
    }
    return barWidth;
  }

  function filterOpinionsByParty(party) {
    return $opinionBlocks.filter(d =>
      d.parties.map(d => d.id).includes(party.id)
    );
  }

  function getPath(partyId, opinions) {
    return line()
      .x(
        (d, i) =>
          xc(d.answer.simplifiedValue) +
          xOffset(d) +
          d.parties.map(d => d.id).indexOf(partyId) * barWidth
      )
      .y(
        (d, i) =>
          -rowHeight / 2 +
          Math.floor(i / 3) * 2 * rowHeight +
          (i % 3 === 0 ? -rowHeight / 4 : i % 3 === 2 ? rowHeight / 4 : 0)
      )
      .curve(curveMonotoneY)(opinions);
  }

  function updateSelectedOpinions(opinion) {
    const tmp = $selectedOpinions;

    if (
      tmp.has(opinion.question.id) &&
      tmp.get(opinion.question.id).answer.simplifiedValue ===
        opinion.answer.simplifiedValue
    ) {
      tmp.delete(opinion.question.id);
    } else {
      tmp.set(opinion.question.id, opinion);
    }

    $selectedOpinions = tmp;
  }

  $: isSelectedAnswer = opinion =>
    $selectedOpinions.has(opinion.question.id) &&
    $selectedOpinions.get(opinion.question.id).answer.simplifiedValue ===
      opinion.answer.simplifiedValue;
</script>

<style>
  .answer {
    fill: #eee;
    stroke: #ccc;
  }

  .answer:hover {
    fill: #ddd;
    cursor: pointer;
  }

  .party-answer {
    stroke: black;
  }
</style>

<svg width="620" height={22 * 2 * rowHeight + 22}>
  <g transform="translate(10, 22)">
    {#each $opinionBlocks as opinion}
      <rect
        x={xc(opinion.answer.simplifiedValue)}
        y={y(opinion.question.id)}
        width={answerWidth}
        height={rowHeight}
        on:click={() => updateSelectedOpinions(opinion)}
        class="answer"
        style="fill: {isSelectedAnswer(opinion) ? opinion.answer.color : '#eee'}; fill-opacity: {isSelectedAnswer(opinion) ? 0.4 : 1}" />
    {/each}

    {#each $allParties as party}
      <path
        transform="translate({barWidth / 2}, {rowHeight})"
        d={getPath(party.id, filterOpinionsByParty(party).reduce((acc, cur) => acc.concat(
                [cur, cur, cur]
              ), []))}
        style="fill: none; stroke: {$selectedPartyIds.includes(party.id) ? '#555' : '#ccc'}; stroke-dasharray: {$selectedPartyIds.includes(party.id) ? 'none' : '2 2'};" />
    {/each}

    {#each $opinionBlocks as block}
      <g
        transform="translate({xc(block.answer.simplifiedValue)}, {y(block.question.id)})">
        {#each block.parties as party, i}
          <rect
            x={xOffset(block) + i * barWidth}
            y={rowHeight / 4}
            width={barWidth}
            height={rowHeight / 2}
            style="fill: {$selectedPartyIds.includes(party.id) || $selectedPartyIds.length === 0 ? block.answer.color : '#ccc'}; fill-opacity: {$selectedPartyIds.includes(party.id) ? 1 : 0.4};"
            class="party-answer" />
        {/each}
      </g>
    {/each}
  </g>
</svg>
