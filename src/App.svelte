<script>
  import { fade } from "svelte/transition";
  import { csv } from "d3-fetch";
  import { rollup } from "d3-array";
  import {
    data,
    selectedCountry,
    selectedPartyIds,
    activeData,
    activeQuestions,
    allCountries,
    allParties,
    opinions
  } from "./store.js";
  import Svg from "./Svg.svelte";
  import CountryButton from "./CountryButton.svelte";
  import Question from "./Question.svelte";
  import PoliticalPosition from "./PoliticalPosition.svelte";

  let innerWidth = 0;
  let innerHeight = 0;
  let promise = loadData();

  const parse = attribute => (attribute === "" ? null : +attribute);

  async function loadData() {
    await csv("./data/data.csv", row => ({
      ...row,
      answer: parse(row.answer),
      simplifiedAnswer:
        parse(row.answer) === null
          ? null
          : parse(row.answer) < 50
          ? 0
          : parse(row.answer) > 50
          ? 100
          : 50,
      economic_liberalisation: parse(row.economic_liberalisation),
      environmental_protection: parse(row.environmental_protection),
      european_integration: parse(row.european_integration),
      law_and_order: parse(row.law_and_order),
      liberal_society: parse(row.liberal_society),
      party_id: parse(row.party_id),
      question_id: parse(row.question_id),
      question_shared_id: parse(row.question_shared_id),
      restrictive_financial_policy: parse(row.restrictive_financial_policy),
      restrictive_immigration_policy: parse(row.restrictive_immigration_policy),
      xy_lc: parse(row.xy_lc),
      xy_lr: parse(row.xy_lr),
      country_code: ["VL", "WA"].includes(row.country_code)
        ? "BE"
        : row.country_code,
      country_name: ["VL", "WA"].includes(row.country_code)
        ? "Belgium"
        : row.country_name
    })).then(res => {
      $data = res;
      console.log(res);
    });
  }

  $: console.log($allCountries);
  $: console.log("opinions", $opinions);

  $: filteredParties = $allParties
    .filter(d => $selectedPartyIds.includes(d.id))
    .sort((a, b) =>
      a.name_short < b.name_short ? -1 : a.name_short > b.name_short ? 1 : 0
    );

  $: overlap = $opinions.filter(d =>
    $selectedPartyIds.every(p => d.parties.map(d => d.id).includes(p))
  ).length;

  $: difference = $activeQuestions.length - overlap;
</script>

<style>
  .button-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(1px, 1fr));
  }

  header {
    height: 150px;
    width: 100%;
    display: grid;
    grid-auto-columns: 940px;
    justify-content: center;
    background-color: white;
    position: fixed;
    top: 0;
  }

  /* footer {
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: white;
    width: 100%;
  } */

  .opinion-label {
    display: inline-block;
    width: calc(540px / 4);
    text-align: center;
    font-weight: bold;
    font-size: 18px;
    font-family: "Libre Baskerville", serif;
  }

  h1 {
    margin-bottom: 30px;
    margin-left: 200px;
  }

  header h1 {
    position: relative;
  }

  h1 .byline {
    font-size: 16px;
    font-family: "Source Sans Pro", sans-serif;
    font-style: italic;
    font-weight: normal;
  }

  main {
    display: grid;
    grid-template-columns: 200px 540px 200px;
    justify-content: center;
    margin-top: 160px;
  }

  aside {
    margin-left: 10px;
    /* background-color: #eee; */
  }

  aside .inner {
    width: 190px;
    position: fixed;
    padding-bottom: 100px;
  }

  aside .inner .matching-parties {
    overflow: scroll;
    background-color: #eee;
    padding: 10px;
  }

  .matching-parties .label {
    margin-bottom: 5px;
  }

  aside h2:first-child {
    margin-top: 0;
  }

  aside h2 {
    font-family: "Source Sans Pro", sans-serif;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: normal;
    margin-bottom: 10px;
    font-size: 20px;
  }

  aside p {
    margin: 0;
  }

  .container-headers {
    display: grid;
    width: 540px;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    margin-left: 200px;
  }

  .matching-party {
    margin-bottom: 10px;
    margin-left: 0px;
    padding: 10px;
  }

  .multi {
    padding: 0;
  }

  /* .multi:before {
    content: "\25B8";
    position: absolute;
    left: 0px;
    margin-top: 0px;
  } */

  .matching-party h3 {
    margin: 0;
  }

  .matching-party p {
    margin-top: 0;
    margin-bottom: 8px;
  }

  /* .position-remark {
    font-size: 10px;
    font-style: italic;
    margin-top: 3px;
  } */

  .overlap-diff {
    padding: 10px;
    background-color: #eee;
    margin-bottom: 2px;
  }

  .overlap-diff .value {
    font-family: "Libre Baskerville", serif;
    font-size: 18px;
  }

  .overlap-diff .label,
  .matching-parties .label {
    font-weight: bold;
    display: block;
  }

  .overlap-diff .label span {
    padding: 0 2px;
    background-color: rgb(247, 206, 69);
  }

  .flag {
    font-size: 60px;
    margin-top: 14px;
    position: absolute;
    left: -80px;
    top: -32px;
  }

  /* .political-preference,
  .political-ideology {
    background-color: #eee;
    padding: 10px;
  }

  .political-preference span,
  .political-ideology span {
    font-size: 12px;
  } */
</style>

<svelte:window bind:innerWidth bind:innerHeight />

<main>
  <div>
    {#each $activeQuestions as question}
      <Question {question} />
    {/each}
  </div>
  <Svg containerHeight={innerHeight - 150 - 100} />
  <aside>
    {#if $selectedPartyIds.length > 0}
      <div class="inner" transition:fade={{ duration: 200 }}>
        <h2>Matching part{difference === 0 ? 'y' : 'ies'}</h2>
        {#if $selectedPartyIds.length > 1}
          <div class="overlap-diff overlap">
            <div>
              <span class="label">same opinion:</span>
              <span class="value">{overlap}</span>
              statements
              {`(${Math.round((overlap / $activeQuestions.length) * 100)}%)`}
            </div>
          </div>
          <div class="overlap-diff diff">
            <div>
              <span class="label">
                <span>mixed</span>
                opinions:
              </span>
              <span class="value">{difference}</span>
              statements
              {`(${Math.round((difference / $activeQuestions.length) * 100)}%)`}
            </div>
          </div>
        {/if}
        <div class="matching-parties">
          {#if $selectedPartyIds.length > 1}
            <span class="label">parties:</span>
          {/if}
          {#each filteredParties as party}
            <div
              class="matching-party"
              style="background-color: {$selectedPartyIds.length === 1 ? 'rgb(179, 219, 186)' : 'transparent'} ; padding: {$selectedPartyIds.length === 1 ? 10 : 0} px;">
              <h3>{party.name_short}</h3>
              <p>{party.name_full.replace(/(.*)\(.*\)/gi, '$1')}</p>
            </div>
          {/each}
        </div>
        <!-- {#if filteredParties.length === 1}
          <h2>Political Ideology</h2>
          <div class="political-ideology">
            <PoliticalPosition
              dimension="leftRight"
              labelLeft="left"
              labelRight="right" />
            <PoliticalPosition
              dimension="liberalConservative"
              labelLeft="liberal/pro-EU"
              labelRight="conservative/anti-EU" />
            <div class="position-remark">
              positions are calculated from each party's opinions on these
              {$activeQuestions.length}
              statements, "no opinion" is ignored in the calculation.
            </div>
          </div>
          <h2>Political Preference</h2>
          <div class="political-preference">
            <div
              style="display: grid; grid-template-columns: 1fr 1fr; font-size: 12px; margin-bottom: 5px; font-weight: bold;">
              <span>none</span>
              <span style="text-align: right;">strong</span>
            </div>
            <span>environmental protection</span>
            <PoliticalPosition dimension="environment" />
            <span>EU integration</span>
            <PoliticalPosition dimension="eu" />
            <span>liberal society</span>
            <PoliticalPosition dimension="society" />
            <span>law and order</span>
            <PoliticalPosition dimension="law" />
            <span>economic liberalisation</span>
            <PoliticalPosition dimension="economy" />
            <span>restrictive financial policy</span>
            <PoliticalPosition dimension="finance" />
            <span>restrictive immigration policy</span>
            <PoliticalPosition dimension="immigration" />
            <div
              style="display: grid; grid-template-columns: 1fr 1fr; font-size: 12px; margin-bottom: 5px; font-weight: bold;">
              <span>none</span>
              <span style="text-align: right;">strong</span>
            </div>
            <div class="position-remark">
              positions are calculated from each party's opinions on these
              {$activeQuestions.length}
              statements, "no opinion" is ignored in the calculation.
            </div>
          </div>
        {/if} -->
      </div>
    {/if}
  </aside>
</main>

<header>
  <div>
    {#await promise}
      <p>...loading data</p>
    {:then}
    {:catch error}
      <p style="color: red;">{error.message}</p>
    {/await}

    <div class="button-container">
      {#each $allCountries as country}
        <CountryButton {country} />
      {/each}
    </div>

    <h1>
      <span class="flag">🇪🇺</span>
      {$selectedCountry.name}
      <span class="byline">
        {$selectedCountry.seats}
        seats in EU parliament
      </span>
    </h1>

    <div class="container-headers">
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

<!-- <footer>
  <p>concept & design by TULP interactive ©2019</p>
</footer> -->
