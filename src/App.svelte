<script>
  import { csv } from "d3-fetch";
  import { rollup } from "d3-array";
  import {
    data,
    selectedCountry,
    selectedPartyIds,
    activeData,
    activeQuestions,
    activeParties,
    allCountries,
    allParties,
    opinions
  } from "./store.js";
  import Svg from "./Svg.svelte";
  import CountryButton from "./CountryButton.svelte";
  import Question from "./Question.svelte";
  import PartyPosition from "./PartyPosition.svelte";

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

  h1 span {
    font-size: 16px;
    font-family: "Source Sans Pro", sans-serif;
    font-style: italic;
  }

  main {
    display: grid;
    grid-template-columns: 200px 540px 200px;
    justify-content: center;
    margin-top: 160px;
  }

  aside {
    margin-left: 10px;
  }

  aside div {
    width: 200px;
  }

  aside .inner {
    position: fixed;
    padding-bottom: 100px;
  }

  aside .inner .matching-parties {
    overflow: scroll;
    height: calc(100vh - 150px);
  }

  aside h4 {
    margin-top: 0;
    font-family: "Source Sans Pro", sans-serif;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .opinion-labels {
    margin-left: 200px;
  }

  .matching-party {
    margin-bottom: 30px;
  }

  .matching-party h3 {
    margin: 0;
  }

  .matching-party p {
    margin-top: 0;
    margin-bottom: 8px;
  }

  .position-remark {
    font-size: 10px;
    font-style: italic;
    margin-top: 3px;
    text-align: right;
  }
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
    <div class="inner">
      <h4>Matching parties</h4>
      <div class="matching-parties">
        {#each filteredParties as party}
          <div class="matching-party">
            <h3>{party.name_short}</h3>
            <p>{party.name_full.replace(/(.*)\(.*\)/gi, '$1')}</p>
            <PartyPosition
              labelLeft="left"
              labelRight="right"
              position={party.leftRight} />
            <PartyPosition
              labelLeft="liberal/pro-EU"
              labelRight="conservative/anti-EU"
              position={party.liberalConservative} />
            <div class="position-remark">
              positions are based on
              {22 - party.noOpinionCount}
              opinions
            </div>
          </div>
        {/each}
      </div>
    </div>
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
      {$selectedCountry.name}
      <span> {$selectedCountry.seats} seats in EU parliament</span>
    </h1>

    <div class="opinion-labels">
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
