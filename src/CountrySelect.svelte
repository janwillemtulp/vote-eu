<script>
  import { allCountries, selectedCountry, selectedPartyIds } from "./store.js";
  import { loadData } from "./common.js";

  function setSelectedCountry(countryCode) {
    $selectedCountry = $allCountries.find(d => d.code === countryCode);
    $selectedPartyIds = [];
    loadData(countryCode);
  }
</script>

<style>
  select {
    outline: none;
  }
</style>

<select on:change={() => setSelectedCountry(this.value)}>
  {#each $allCountries as country}
    <option
      value={country.code}
      selected={country.code === $selectedCountry.code ? 'selected' : ''}>
      {country.name}
    </option>
  {/each}
</select>
