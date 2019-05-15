<script>
  import { afterUpdate } from "svelte";
  import { fade } from "svelte/transition";
  import { opinions, allParties, selectedPartyIds } from "./store.js";
  import { scaleOrdinal, scaleLinear } from "d3-scale";
  import { extent } from "d3-array";
  import { line, curveMonotoneY } from "d3-shape";
  import { mouse, select } from "d3-selection";
  import { color } from "d3-color";

  let rowHeight = 85;
  let barWidth = 540 / 4 / 15;
  let answerWidth = 540 / 4;
  let hoverParty;
  let hover = undefined;
  let mousePos;
  let popupHeight;
  let innerWidth;
  export let containerHeight;

  $: containerWidth = innerWidth
    ? innerWidth < 768
      ? innerWidth - 210
      : innerWidth - 400
    : 540;

  $: xc = scaleOrdinal()
    .domain([100, 50, 0, null])
    .range(Array.from(Array(4).keys()).map(d => d * answerWidth));

  $: y = scaleLinear()
    .domain(extent($opinions.map(d => d.question.id)))
    .range([0, 21 * rowHeight * 1]);

  $: xOffset = block => answerWidth / 2 - (block.parties.length * barWidth) / 2;

  function filterOpinionsByParty(party) {
    return $opinions.filter(d => d.parties.map(d => d.id).includes(party.id));
  }

  $: getPath = (partyId, opinions) => {
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
  };

  function updateSelectedPartyIds(opinion) {
    const partyIds = opinion.parties.map(d => d.id);

    if ($selectedPartyIds.length === 0) {
      $selectedPartyIds = partyIds;
    } else if ($selectedPartyIds.some(d => partyIds.includes(d))) {
      $selectedPartyIds = $selectedPartyIds.filter(d => partyIds.includes(d));
    } else {
      $selectedPartyIds = partyIds;
    }
  }

  $: includesSelectedPartyIds = opinion =>
    $selectedPartyIds.length > 0 &&
    $selectedPartyIds.every(d => opinion.parties.map(p => p.id).includes(d));

  $: popupLeft = () =>
    !mousePos
      ? 0
      : mousePos[0] < innerWidth / 2
      ? mousePos[0] + 20
      : mousePos[0] - 20 - 40 - 400;

  $: popupMarginTop = () =>
    Math.min(0, innerHeight - (mousePos ? mousePos[2] + popupHeight + 20 : 0));

  function resize() {
    if (innerWidth < 768) {
      barWidth = (innerWidth - 210) / 4 / 15;
      answerWidth = (innerWidth - 210) / 4;
    } else if (innerWidth < 940) {
      barWidth = containerWidth / 4 / 15;
      answerWidth = containerWidth / 4;
    } else {
      barWidth = 540 / 4 / 15;
      answerWidth = 540 / 4;
    }
  }

  $: console.log($opinions);

  afterUpdate(() => {
    resize();
  });
</script>

<style>
  .answer rect {
    fill: #eee;
    stroke: #fff;
    stroke-width: 2;
  }

  .popup {
    position: absolute;
    left: 400px;
    top: 400px;
    width: 400px;
    background-color: white;
    box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.2);
    padding: 20px;
    z-index: 1000;
    display: none;
  }

  .hoverable {
    cursor: pointer;
  }

  .answer.hoverable:hover {
    opacity: 0.6;
  }

  .answer-label {
    text-anchor: middle;
    dominant-baseline: middle;
    font-family: "Libre Baskerville", serif;
    font-size: 11px;
    display: none;
  }

  @media (min-width: 540px) {
    .answer-label {
      font-size: 14px;
      display: block;
    }
  }

  @media (min-width: 940px) {
    .answer-label {
      font-size: 18px;
    }
  }
</style>

<svelte:window bind:innerWidth />

<div>
  <svg width={Math.min(containerWidth, 540)} height={22 * 1 * rowHeight + 22}>
    <g>
      {#each $opinions as opinion}
        {#if $selectedPartyIds.length === 0 || opinion.parties
            .map(d => d.id)
            .some(d => $selectedPartyIds.includes(d))}
          <g
            transition:fade={{ duration: 200 }}
            class="answer {!includesSelectedPartyIds(opinion) ? 'hoverable' : ''}"
            on:click={() => updateSelectedPartyIds(opinion)}>
            <rect
              x={xc(opinion.answer.simplifiedValue)}
              y={y(opinion.question.id)}
              width={answerWidth}
              height={rowHeight}
              style="fill: {includesSelectedPartyIds(opinion) ? opinion.answer.color : '#eee'}" />
            {#if !includesSelectedPartyIds(opinion)}
              <text
                x={xc(opinion.answer.simplifiedValue)}
                y={y(opinion.question.id)}
                dx={answerWidth / 2}
                dy={rowHeight / 2}
                class="answer-label"
                style="fill: #ccc;">
                {opinion.answer.label}
              </text>
            {/if}
          </g>
        {/if}
      {/each}
    </g>
  </svg>
</div>
