<script>
  import { opinionBlocks } from "./store.js";
  import { scaleOrdinal, scaleLinear } from "d3-scale";
  import { extent } from "d3-array";

  $: console.log(opinionBlocks);

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
      return answerWidth - 2 * barWidth - i * barWidth;
    } else if (block.answer.simplifiedValue === 50) {
      return (
        answerWidth / 2 - (block.parties.length * barWidth) / 2 + i * barWidth
      );
    }
    return barWidth + i * barWidth;
  }
</script>

<svg width="620" height="3500">
  <g transform="translate(10, 22)">
    {#each $opinionBlocks as block}
      <g
        transform="translate({xc(block.answer.simplifiedValue)}, {y(block.question.id)})">
        <rect
          width={answerWidth}
          height={rowHeight}
          style="fill: #eee; stroke: #ccc;" />
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
