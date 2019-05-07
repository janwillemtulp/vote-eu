<script>
  import { opinionBlocks, allParties } from "./store.js";
  import { scaleOrdinal, scaleLinear } from "d3-scale";
  import { extent } from "d3-array";
  import { line, curveMonotoneY } from "d3-shape";

  $: console.log("$opinionBlocks", $opinionBlocks);
  $: console.log("$allParties", $allParties);

  let rowHeight = 80;
  let barWidth = 10;
  let answerWidth = 150;

  let xc = scaleOrdinal()
    .domain([100, 50, 0, null])
    .range(Array.from(Array(4).keys()).map(d => d * answerWidth));

  $: y = scaleLinear()
    .domain(extent($opinionBlocks.map(d => d.question.id)))
    .range([0, 21 * rowHeight * 2]);

  function getPartyX(block, i) {
    if (block.answer.simplifiedValue === 100) {
      return (
        answerWidth - barWidth - block.parties.length * barWidth + i * barWidth
      );
    } else if (block.answer.simplifiedValue === 50) {
      return (
        answerWidth / 2 - (block.parties.length * barWidth) / 2 + i * barWidth
      );
    }
    return barWidth + i * barWidth;
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
          getPartyX(d, d.parties.map(d => d.id).indexOf(partyId))
      )
      .y(
        (d, i) =>
          -rowHeight / 2 +
          Math.floor(i / 3) * 2 * rowHeight +
          (i % 3 === 0 ? -rowHeight / 4 : i % 3 === 2 ? rowHeight / 4 : 0)
      )
      .curve(curveMonotoneY)(opinions);
  }
</script>

<svg width="620" height="3500">
  <g transform="translate(10, 22)">
    {#each $opinionBlocks as block}
      <rect
        x={xc(block.answer.simplifiedValue)}
        y={y(block.question.id)}
        width={answerWidth}
        height={rowHeight}
        style="fill: #eee; stroke: #ccc;" />
    {/each}

    {#each $allParties as party}
      <path
        transform="translate({barWidth / 2}, {rowHeight})"
        d={getPath(party.id, filterOpinionsByParty(party).reduce((acc, cur) => acc.concat(
                [cur, cur, cur]
              ), []))}
        style="fill: none; stroke: #000;" />
    {/each}

    {#each $opinionBlocks as block}
      <g
        transform="translate({xc(block.answer.simplifiedValue)}, {y(block.question.id)})">
        {#each block.parties as party, i}
          <rect
            x={getPartyX(block, i)}
            y={rowHeight / 4}
            width={barWidth}
            height={rowHeight / 2}
            style="fill: {block.answer.color}; stroke: black;" />
        {/each}
      </g>
    {/each}
  </g>
</svg>
