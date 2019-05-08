<script>
  import { opinionBlocks, allParties, selectedPartyIds2 } from "./store.js";
  import { scaleOrdinal, scaleLinear } from "d3-scale";
  import { extent } from "d3-array";
  import { line, curveMonotoneY } from "d3-shape";
  import { mouse, select } from "d3-selection";

  $: console.log("$opinionBlocks", $opinionBlocks);
  $: console.log("$allParties", $allParties);
  $: console.log("$selectedPartyIds2", $selectedPartyIds2);

  let rowHeight = 60;
  let barWidth = 10;
  let answerWidth = 540 / 4;
  let hoverParty;
  let mousePos;
  let popupHeight;
  export let containerHeight;

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

  function updateSelectedPartyIds(opinion) {
    const partyIds = opinion.parties.map(d => d.id);

    if ($selectedPartyIds2.length === 0) {
      $selectedPartyIds2 = partyIds;
    } else if ($selectedPartyIds2.every(d => partyIds.includes(d))) {
      $selectedPartyIds2 = $selectedPartyIds2.filter(
        d => !partyIds.includes(d)
      );
    } else if ($selectedPartyIds2.some(d => partyIds.includes(d))) {
      $selectedPartyIds2 = $selectedPartyIds2.filter(d => partyIds.includes(d));
    } else {
      $selectedPartyIds2 = partyIds;
    }
  }

  $: includesSelectedPartyIds = opinion =>
    $selectedPartyIds2.length > 0 &&
    $selectedPartyIds2.every(d => opinion.parties.map(p => p.id).includes(d));

  function showPopup(info, e) {
    mousePos = [e.clientX, e.clientY];
    hoverParty = info;
  }

  function hidePopup() {
    hoverParty = undefined;
  }
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

  .party-answer:hover {
    cursor: pointer;
  }

  .popup {
    position: absolute;
    left: 400px;
    top: 400px;
    width: 300px;
    background-color: white;
    box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.2);
    padding: 20px;
  }

  .popup h2 {
    margin: 3px 0;
    font-family: "Libre Baskerville", serif;
  }

  .popup h4 {
    margin: 3px 0;
    font-family: "Source Sans Pro", sans-serif;
  }
</style>

<div>
  <svg width="540" height={22 * 2 * rowHeight + 22}>
    <g transform="translate(0, 22)">
      {#each $opinionBlocks as opinion}
        <rect
          x={xc(opinion.answer.simplifiedValue)}
          y={y(opinion.question.id)}
          width={answerWidth}
          height={rowHeight}
          on:click={() => updateSelectedPartyIds(opinion)}
          class="answer"
          style="fill: {includesSelectedPartyIds(opinion) ? opinion.answer.color : '#eee'}; fill-opacity: {includesSelectedPartyIds(opinion) ? 0.4 : 1}" />
      {/each}
      <!-- style="fill: {isSelectedAnswer(opinion) ? opinion.answer.color : '#eee'}; fill-opacity: {isSelectedAnswer(opinion) ? 0.4 : 1}" /> -->
      {#each $allParties as party}
        <path
          transform="translate({barWidth / 2}, {rowHeight})"
          d={getPath(party.id, filterOpinionsByParty(party).reduce((acc, cur) => acc.concat(
                  [cur, cur, cur]
                ), []))}
          style="fill: none; stroke: {$selectedPartyIds2.includes(party.id) ? '#555' : '#ccc'}; stroke-dasharray: {$selectedPartyIds2.includes(party.id) ? 'none' : '2 2'};" />
      {/each}

      {#each $opinionBlocks as opinion}
        <g
          transform="translate({xc(opinion.answer.simplifiedValue)}, {y(opinion.question.id)})">
          {#each opinion.parties as party, i}
            <rect
              x={xOffset(opinion) + i * barWidth}
              y={rowHeight / 4}
              width={barWidth}
              height={rowHeight / 2}
              style="fill: {$selectedPartyIds2.includes(party.id) || $selectedPartyIds2.length === 0 ? opinion.answer.color : '#ccc'}; fill-opacity: {$selectedPartyIds2.includes(party.id) ? 1 : 0.4};"
              class="party-answer"
              on:click={() => updateSelectedPartyIds(opinion)}
              on:mousemove={e => (mousePos = [e.clientX, e.clientY])}
              on:mouseover={e => showPopup({ party, ...opinion }, e)}
              on:mouseout={() => hidePopup()} />
          {/each}
        </g>
      {/each}
    </g>
  </svg>
  <div
    class="popup"
    style="display: {hoverParty ? 'block' : 'none'}; left: {mousePos ? mousePos[0] + 20 : 0}px; top: {mousePos ? mousePos[1] - Math.max(0, mousePos[1] + popupHeight - 150 - 46 - containerHeight) : 0};"
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
</div>
