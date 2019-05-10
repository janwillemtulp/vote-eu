<script>
  import { fade } from "svelte/transition";
  import { scaleLinear } from "d3-scale";
  import { activeQuestions, opinions, selectedPartyIds } from "./store.js";

  let width = 190;

  $: x = scaleLinear()
    .domain([0, $activeQuestions.length])
    .range([0, width]);

  $: overlap =
    $selectedPartyIds.length === 0
      ? 0
      : $opinions.filter(d =>
          $selectedPartyIds.every(p => d.parties.map(d => d.id).includes(p))
        ).length;
</script>

<style>
  .container {
    width: 190px;
    height: 10px;
    margin-top: -10px;
  }

  .bar {
    height: 10px;
    background-color: rgb(247, 206, 69);
    margin-top: 6px;
  }

  .label {
    margin-top: -6px;
  }

  .label span {
    padding: 0 2px;
    background-color: rgb(247, 206, 69);
  }
</style>

<div class="container">
  {#if $selectedPartyIds.length > 0}
    <div transition:fade={{ duration: 200 }}>
      <div class="label">
        <span>mixed</span>
        opinions
      </div>
      <!-- <div
        class="bar"
        style="width: {x($activeQuestions.length - overlap)}px;" /> -->
    </div>
  {/if}
</div>
