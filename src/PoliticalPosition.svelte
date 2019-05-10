<script>
  import { fade } from "svelte/transition";
  import { selectedPartyIds, allParties } from "./store.js";
  import { scaleLinear } from "d3-scale";
  import { extent } from 'd3-array';

  let width = 170;
  let margin = 5;
  export let dimension;
  export let labelLeft;
  export let labelRight;
  export let title;

  $: x = scaleLinear()
    .domain([0, 100])
    .range([margin, width - margin]);
  $: filteredParties = $allParties.filter(d =>
    $selectedPartyIds.includes(d.id)
  );

  $: xtnd = extent(filteredParties, d => d.spectrum[dimension])
</script>

<style>
  text {
    font-size: 10px;
    fill: #777;
  }
</style>

<svg {width} height={!labelLeft && !labelRight ? 10 : 30}>
  {#if labelLeft}
    <text y={23} x={x.range()[0]}>{labelLeft}</text>
  {/if}
  {#if labelRight}
    <text y={23} x={x.range()[1]} style="text-anchor: end;"> {labelRight}</text>
  {/if}
  {#if title}
    <text x={x.range()[0]} y={23}>{title}</text>
  {/if}
  <line
    x1={x.range()[0]}
    x2={x.range()[1]}
    y1={5}
    y2={5}
    style="stroke: #ccc;" />
  <line
    x1={x(xtnd[0])}
    x2={x(xtnd[1])}
    y1={5}
    y2={5}
    style="stroke: #000;" />
  {#each filteredParties as party}
    <circle
      transition:fade={{ duration: 200 }}
      cx={x(party.spectrum[dimension])}
      cy={5}
      r={$selectedPartyIds.length === 1 ? 3 : 2}
      style="fill: black;" />
  {/each}
</svg>
