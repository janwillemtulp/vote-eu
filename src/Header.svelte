<script>
  import { allCountries, selectedCountry, selectedPartyIds } from "./store.js";
  import CountryButton from "./CountryButton.svelte";
</script>

<style>
  .button-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(1px, 1fr));
  }

  .clear-selection {
    width: 115px;
    justify-self: end;
    margin-right: 10px;
    height: 26px;
    padding: 0;
    border-radius: 40px;
    border: none;
    background-color: #ddd;
  }

  .clear-selection:hover {
    cursor: pointer;
    background-color: #ccc;
  }

  header {
    height: 160px;
    width: 100%;
    display: grid;
    grid-auto-columns: 940px;
    justify-content: center;
    background-color: white;
    position: fixed;
    top: 0;
  }

  .opinion-label {
    display: inline-block;
    width: calc(540px / 4);
    text-align: center;
    font-weight: bold;
    font-size: 18px;
    font-family: "Libre Baskerville", serif;
  }

  .country h1 {
    position: relative;
    margin-bottom: 0;
  }

  .country .byline {
    font-size: 16px;
    font-family: "Source Sans Pro", sans-serif;
    margin-top: 0;
  }

  .container-headers {
    display: grid;
    width: 540px;
    grid-template-columns: 200px 1fr 1fr 1fr 1fr;
  }

  .country-container {
    display: grid;
    grid-template-columns: 200px 1fr;
    justify-items: start;
    align-items: center;
  }
</style>

<header>
  <div>
    <div class="button-container">
      {#each $allCountries as country}
        <CountryButton {country} />
      {/each}
      <!-- <CountrySelect /> -->
    </div>

    <div class="country-container">
      <img src="img/logo.png" alt="2019 vote EU" width="150" />
      <div class="country">
        <h1>
          {$selectedCountry.name}
        </h1>
        <p class="byline">
          <em>{$selectedCountry.seats} seats</em>
          in EU parliament
        </p>
      </div>
    </div>

    <div class="container-headers">
      <button
        on:click={() => ($selectedPartyIds = [])}
        style="visibility: {$selectedPartyIds.length > 0 ? 'visible' : 'hidden'};"
        class="clear-selection">
        <i class="fas fa-times-circle" />
        clear selection
      </button>
      <div class="opinion-label" style="color: hsl(200, 50%, 50%);">Agree</div>
      <div class="opinion-label" style="color: #999;">Neutral</div>
      <div class="opinion-label" style="color: hsl(0, 50%, 50%);">
        Disagree
      </div>
      <div class="opinion-label" style="color: hsl(310, 50%, 70%);">
        No opinion
      </div>
    </div>
  </div>
</header>
