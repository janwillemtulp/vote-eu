<script>
  import { selectedCountry, selectedPartyIds2 } from "./store.js";

  export let country;

  function setSelectedCountry() {
    $selectedCountry = country;
    $selectedPartyIds2 = [];
  }

  $: selected = $selectedCountry.code === country.code
</script>

<style>
  button {
    border: none;
    border-radius: 0;
  }

  button:hover {
    background-color: #ddd;
    cursor: pointer;
  }

  .selected {
    background-color: orange
  }
</style>

<button
  class:selected
  on:click={() => setSelectedCountry()}>
  {country.code}
</button>
