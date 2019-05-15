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
    font-size: 24px;
    white-space: normal;
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
    margin: 10px;
  }

  .logo-container {
    align-self: end;
    justify-self: end;
    margin-right: 10px;
    text-align: right;
  }

  .bigger {
    display: none;
  }

  .right-country-select {
    margin-right: 10px;
    justify-self: end;
    display: none;
  }

  .smaller {
    display: block;
  }

  .left-country-select {
    justify-self: start;
    margin-left: 10px;
    display: block;
  }

  @media (min-width: 414px) {
    .smaller {
      display: none;
    }

    .bigger {
      display: block;
    }

    .country h1 {
      white-space: nowrap;
    }

    .country .byline {
      font-size: 16px;
    }
  }

  @media (min-width: 540px) {
    .country-container {
      grid-template-columns: 200px 1fr 200px;
    }

    .opinion-label {
      font-size: 14px;
    }

    .left-country-select {
      display: none;
    }

    .right-country-select {
      display: block;
    }
  }

  @media (min-width: 768px) and (min-height: 414px) {
    .container-headers {
      grid-template-columns: 200px 1fr 1fr 1fr 1fr 200px;
    }

    /* .country-container {
      grid-template-columns: 200px 1fr 200px;
    } */

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
      <div class="logo-container">
        <img src="img/logo.png" alt="2019 vote EU" class="logo" />
        <div class="left-country-select">
          <CountrySelect />
        </div>
      </div>
      <div class="country">
        <h1> {$selectedCountry.name}</h1>
        <p class="byline">
          <em>{$selectedCountry.seats} seats</em>
          in EU parliament
        </p>
      </div>
      <div class="right-country-select">
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
