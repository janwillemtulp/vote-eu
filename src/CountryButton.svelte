<script>
  import { selectedCountry, selectedPartyIds } from "./store.js";

  export let country;

  function setSelectedCountry() {
    $selectedCountry = country;
    $selectedPartyIds = [];
  }

  $: selected = $selectedCountry.code === country.code
</script>

<style>
  button {
    border: none;
    border-radius: 0;
  }

  button:hover {
    background-color: hsl(46, 92%, 85%);
    cursor: pointer;
  }

  .selected {
    background-color: hsl(224, 80%, 32%);
    color: hsl(46, 92%, 62%);
  }
</style>

<button
  class:selected
  on:click={() => setSelectedCountry()}>
  {country.code}
</button>
