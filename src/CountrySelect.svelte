<script>
  import { allCountries, selectedCountry } from "./store.js";
  
  function setSelectedCountry(country) {
    $selectedCountry = $allCountries.find(d => d.code === country);
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
      selected={country.code === 'AT' ? 'selected' : ''}>
      {country.name}
    </option>
  {/each}
</select>
