<script>
  import { allCountries, selectedCountry, selectedPartyIds } from "./store.js";
  import CountrySelect from "./CountrySelect.svelte";
</script>

<style>
  header {
    width: 100%;
    display: grid;
    grid-auto-columns: 1fr;
    justify-content: center;
    background-color: white;
    position: fixed;
    top: 0;
    padding: 10px 0 10px 0;
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
    margin: 0 10px 0 0;
  }

  .clear-selection:hover {
    cursor: pointer;
    background-color: #ccc;
  }

  .opinion-label {
    display: inline-block;
    text-align: center;
    font-weight: bold;
    font-size: 11px;
    font-family: "Libre Baskerville", serif;
  }

  .country h1 {
    position: relative;
    margin: 0;
  }

  .country .byline {
    font-size: 14px;
    font-family: "Source Sans Pro", sans-serif;
    margin: 0;
  }

  .container-headers {
    display: grid;
    grid-template-columns: 200px 1fr 1fr 1fr 1fr;
    align-items: end;
    margin-right: 10px;
  }

  .country-container {
    display: grid;
    grid-template-columns: 200px 1fr;
    justify-items: start;
    align-items: center;
    margin-bottom: 10px;
  }

  .logo {
    justify-self: start;
    align-self: start;
    width: 80%;
    object-fit: cover;
    margin-left: 10px;
  }

  .bigger {
    display: none;
  }

  .bigger.country-select {
    margin-right: 10px;
    justify-self: end;
  }

  .smaller {
    display: block;
  }

  .smaller.country-select {
    justify-self: start;
    margin-left: 10px;
  }

  @media (min-width: 414px) {
    .smaller {
      display: none;
    }

    .bigger {
      display: block;
    }

    .country .byline {
      font-size: 16px;
    }
  }

  @media (min-width: 540px) {
    .opinion-label {
      font-size: 14px;
    }
  }

  @media (min-width: 768px) and (min-height: 414px) {
    .container-headers {
      grid-template-columns: 200px 1fr 1fr 1fr 1fr 200px;
    }

    .country-container {
      grid-template-columns: 200px 1fr 200px;
    }

    header {
      padding: 30px 0 10px 0;
    }
  }

  @media (min-width: 940px) {
    header {
      grid-auto-columns: 940px;
    }

    .opinion-label {
      font-size: 18px;
    }
  }
</style>

<header>
  <div>
    <div class="country-container">
      <!-- <img class="logo" src="img/logo.png" alt="2019 vote EU" /> -->
      <div>YOUR LOGO HERE
        <div class="smaller country-select"><CountrySelect /></div>
      </div>
      <div class="country">
        <h1> {$selectedCountry.name}</h1>
        <p class="byline">
          <em>{$selectedCountry.seats} seats</em>
          in EU parliament
        </p>
      </div>
      <div class="bigger country-select">
        <CountrySelect />
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
      <div class="opinion-label bigger" style="color: hsl(200, 50%, 50%);">
        Agree
      </div>
      <div class="opinion-label bigger" style="color: #999;">Neutral</div>
      <div class="opinion-label bigger" style="color: hsl(0, 50%, 50%);">
        Disagree
      </div>
      <div class="opinion-label bigger" style="color: hsl(310, 50%, 70%);">
        No Opinion
      </div>
      <div class="opinion-label smaller" style="color: hsl(200, 50%, 50%);">
        Agree
      </div>
      <div class="opinion-label smaller" style="color: #999;">Neut.</div>
      <div class="opinion-label smaller" style="color: hsl(0, 50%, 50%);">
        Dis-agr.
      </div>
      <div class="opinion-label smaller" style="color: hsl(310, 50%, 70%);">
        No Opin.
      </div>
    </div>
  </div>
</header>
