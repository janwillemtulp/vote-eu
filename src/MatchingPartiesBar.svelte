<script>
  import {
    overlap,
    difference,
    filteredParties,
    selectedPartyIds
  } from "./store.js";
</script>

<style>
  .container {
    width: 100%;
    background-color: #eee;
    position: fixed;
    bottom: 30px;
    left: 0;
    display: grid;
    padding: 5px;
  }

  .marked {
    padding: 0 2px;
    background-color: hsla(46, 92%, 75%, 1);
  }

  .label {
    font-weight: bold;
    margin-right: 10px;
  }

  .grid-item {
    text-align: center;
  }

  .value {
    font-family: "Libre Baskerville", serif;
    font-size: 20px;
  }

  .single-match {
    background-color: rgb(179, 219, 186);
    grid-template-columns: 1fr 2fr;
    align-items: start;
    justify-items: start;
  }

  .single-match .label {
    justify-self: end;
  }

  .multi-match .grid-item {
    display: grid;
    grid-template-rows: 1fr 1fr;
  }

  .multi-match .label {
    align-self: start;
  }

  .multi-match .value {
    align-self: end;
  }

  .multi-match {
    grid-template-columns: 1fr 1fr 1fr;
    border-top: 1px solid #ddd;
  }

  h3,
  p {
    margin: 0;
    text-align: left;
  }

  @media (min-width: 414px) {
    .single-match {
      grid-template-columns: 200px 1fr;
    }
  }

  @media (min-width: 768px) and (min-height: 414px) {
    .container {
      display: none;
    }
  }
</style>

{#if $selectedPartyIds.length > 0}
  <div
    class="container {$selectedPartyIds.length === 1 ? 'single-match' : 'multi-match'}">
    {#if $selectedPartyIds.length > 1}
      <div class="grid-item">
        <div class="label">matching parties:</div>
        <span class="value">{$filteredParties.length}</span>
      </div>
      <div class="grid-item">
        <div class="label">same opinion:</div>
        <span class="value">{$overlap}</span>
      </div>
      <div class="grid-item">
        <div class="label">
          <span class="marked">mixed</span>
          opinions:
        </div>
        <span class="value">{$difference}</span>
      </div>
    {:else}
      <span class="label grid-item">matching party:</span>
      <div class="grid-item">
        <h3 class="name-short">{$filteredParties[0].name_short}</h3>
        <p class="name-short">
          {$filteredParties[0].name_full.replace(/(.*)\(.*\)/gi, '$1')}
        </p>
      </div>
    {/if}
  </div>
{/if}
