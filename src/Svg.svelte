<script>
  import { afterUpdate } from 'svelte'
  import { opinions, allParties, selectedPartyIds } from "./store.js";
  import { scaleOrdinal, scaleLinear } from "d3-scale";
  import { extent } from "d3-array";
  import { line, curveMonotoneY } from "d3-shape";
  import { mouse, select } from "d3-selection";
  import { color } from "d3-color";


  let rowHeight = 60;
  let barWidth = 540 / 4 / 15;
  let answerWidth = 540 / 4;
  let hoverParty;
  let hover = undefined;
  let mousePos;
  let popupHeight;
  let innerWidth;
  export let containerHeight;
  $: containerWidth = innerWidth ? innerWidth < 768 ? innerWidth - 210 : innerWidth - 400 : 540;
  $: console.log(containerWidth, innerWidth)

  $: xc = scaleOrdinal()
    .domain([100, 50, 0, null])
    .range(Array.from(Array(4).keys()).map(d => d * answerWidth));

  $: y = scaleLinear()
    .domain(extent($opinions.map(d => d.question.id)))
    .range([0, 21 * rowHeight * 2]);

  $: xOffset = block => {
    if (block.answer.simplifiedValue === 100) {
      return answerWidth - barWidth - block.parties.length * barWidth;
    } else if (block.answer.simplifiedValue === 50) {
      return answerWidth / 2 - (block.parties.length * barWidth) / 2;
    }
    return barWidth;
  }

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
  }

  function updateSelectedPartyIds(opinion) {
    const partyIds = opinion.parties.map(d => d.id);

    if ($selectedPartyIds.length === 0) {
      $selectedPartyIds = partyIds;
    } else if ($selectedPartyIds.every(d => partyIds.includes(d))) {
      $selectedPartyIds = $selectedPartyIds.filter(d => !partyIds.includes(d));
    } else if ($selectedPartyIds.some(d => partyIds.includes(d))) {
      $selectedPartyIds = $selectedPartyIds.filter(d => partyIds.includes(d));
    } else {
      $selectedPartyIds = partyIds;
    }
  }

  $: includesSelectedPartyIds = opinion =>
    $selectedPartyIds.length > 0 &&
    $selectedPartyIds.every(d => opinion.parties.map(p => p.id).includes(d));

  $: selectedPartiePaths = $allParties.filter(d =>
    $selectedPartyIds.includes(d.id)
  );
  $: nonSelectedPartiePaths = $allParties.filter(
    d => !$selectedPartyIds.includes(d.id)
  );

  function showPopup(info, e) {
    hoverParty = info;
    hover = { question: info.question, answer: info.answer };
  }

  function hidePopup() {
    hoverParty = undefined;
    hover = undefined;
  }

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
      barWidth = (containerWidth) / 4 / 15;
      answerWidth = (containerWidth) / 4;
    } else {
      barWidth = 540 / 4 / 15;
      answerWidth = 540 / 4;
    }
  }

  afterUpdate(() => {
    console.log('after update')
    resize()
  })

</script>

<style>
  .answer {
    fill: #eee;
    stroke: #fff;
    stroke-width: 2;
  }

  .answer:hover {
    fill: #ddd;
    cursor: pointer;
  }

  .party-answer:hover {
    cursor: pointer;
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

  .popup h2 {
    margin: 3px 0;
    font-family: "Libre Baskerville", serif;
  }

  .popup h4 {
    margin: 3px 0;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: normal;
  }

  path {
    pointer-events: none;
  }

  /* @media (min-width: 940px) {
    .popup {
      display: block;
    }
  } */
</style>

<svelte:window bind:innerWidth />

<div>
  <svg width={containerWidth} height={22 * 2 * rowHeight + 22}>
    <g>
      {#each $opinions as opinion}
        <rect
          x={xc(opinion.answer.simplifiedValue)}
          y={y(opinion.question.id)}
          width={answerWidth}
          height={rowHeight}
          on:click={() => updateSelectedPartyIds(opinion)}
          on:mouseover={() => {
            hover = opinion;
          }}
          on:mouseout={() => {
            hover = undefined;
          }}
          class="answer"
          style="fill: {hover && hover.question.id === opinion.question.id && hover.answer.simplifiedValue === opinion.answer.simplifiedValue ? color(includesSelectedPartyIds(opinion) ? opinion.answer.colorLight : '#eee')
                .darker(0.5)
                .rgb() : color(includesSelectedPartyIds(opinion) ? opinion.answer.colorLight : '#eee')}; " />
      {/each}

      {#each nonSelectedPartiePaths as party}
        <path
          transform="translate({barWidth / 2}, {rowHeight})"
          d={getPath(party.id, filterOpinionsByParty(party).reduce((acc, cur) => acc.concat(
                  [cur, cur, cur]
                ), []))}
          style="fill: none; stroke: rgba(0, 0, 0, 0.2); stroke-dasharray: 2 2;" />
      {/each}

      {#each selectedPartiePaths as party}
        <path
          transform="translate({barWidth / 2}, {rowHeight})"
          d={getPath(party.id, filterOpinionsByParty(party).reduce((acc, cur) => acc.concat(
                  [cur, cur, cur]
                ), []))}
          style="fill: none; stroke: #000; stroke-dasharray: none;" />
      {/each}

      {#each $opinions as opinion}
        <g
          transform="translate({xc(opinion.answer.simplifiedValue)}, {y(opinion.question.id)})">
          {#each opinion.parties as party, i}
            <rect
              x={xOffset(opinion) + i * barWidth}
              y={rowHeight / 4}
              width={barWidth}
              height={rowHeight / 2}
              style="fill: {$selectedPartyIds.includes(party.id) ? opinion.answer.color : opinion.answer.colorLight}; stroke: {containerWidth < 368 ? ($selectedPartyIds.includes(party.id) ? opinion.answer.color : opinion.answer.color) : 'black'}"
              class="party-answer"
              on:click={() => updateSelectedPartyIds(opinion)}
              on:mousemove={e => (mousePos = [e.clientX, e.offsetY, e.clientY])}
              on:mouseover={e => showPopup({ party, ...opinion }, e)}
              on:mouseout={() => hidePopup()} />
          {/each}
        </g>
      {/each}
    </g>
  </svg>
  {#if mousePos}
    <div
      class="popup"
      style="display: {hoverParty ? 'block' : 'none'}; left: {popupLeft()}px; top: {mousePos[1]}; margin-top: {popupMarginTop()}px;"
      bind:clientHeight={popupHeight}>
      {#if hoverParty}
        <h2>{hoverParty.party.name_short}</h2>
        <h4>{hoverParty.party.name_full}</h4>
        <h4 style="color: {hoverParty.answer.color}">
          {hoverParty.answer.label}
        </h4>
        <p>
          <em>Motivation:</em>
          {hoverParty.parties.find(d => d.id === hoverParty.party.id).motivation.text}
        </p>
        <p>
          <em>source:</em>
          <a
            href={hoverParty.parties.find(d => d.id === hoverParty.party.id).motivation.link}>
            {hoverParty.parties.find(d => d.id === hoverParty.party.id).motivation.source}
          </a>
        </p>
      {/if}
    </div>
  {/if}
</div>
