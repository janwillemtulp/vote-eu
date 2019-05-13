<script>
  import { afterUpdate } from "svelte";
  import { fade } from "svelte/transition";
  import { csv } from "d3-fetch";
  import { rollup } from "d3-array";
  import { select } from "d3-selection";
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
  let partyList;

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

  let isScrolling;

  afterUpdate(() => {
    isScrolling = partyList
      ? partyList.scrollHeight > partyList.clientHeight
      : false;
  });
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
  }

  aside .inner .matching-parties {
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
    margin-left: 0px;
    padding: 0 0 10px 0;
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
    background-color: hsla(46, 92%, 75%, 1);
  }

  .flag {
    font-size: 60px;
    margin-top: 14px;
    position: absolute;
    left: -80px;
    top: -32px;
  }

  .info {
    display: inline-block;
    font-size: 10px;
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

  .party-list {
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 200px;
  }

  .scroll-hint {
    width: 100%;
    text-align: center;
    font-style: italic;
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
    {#if $selectedPartyIds.length > 0}
      <div class="inner" transition:fade={{ duration: 200 }}>
        <h2>Matching part{difference === 0 ? 'y' : 'ies'}</h2>
        {#if $selectedPartyIds.length > 1}
          <div class="overlap-diff overlap">
            <div>
              <span class="label">same opinion:</span>
              <span class="value">{overlap}</span>
              {overlap === 1 ? 'statement' : 'statements'}
              {`(${Math.round((overlap / $activeQuestions.length) * 100)}%)`}
              <span class="info">
                The number of statements for which the selected parties have the
                <em>same</em>
                opinion
              </span>
            </div>
          </div>
          <div class="overlap-diff diff">
            <div>
              <span class="label">
                <span>mixed</span>
                opinions:
              </span>
              <span class="value">{difference}</span>
              {difference === 1 ? 'statement' : 'statements'}
              {`(${Math.round((difference / $activeQuestions.length) * 100)}%)`}
              <span class="info">
                The number of statements for which the selected parties have a
                <em>different</em>
                opinion
              </span>
            </div>
          </div>
        {/if}
        <div
          class="matching-parties"
          style="background-color: {$selectedPartyIds.length === 1 ? 'rgb(179, 219, 186)' : '#eee'};">
          {#if $selectedPartyIds.length > 1}
            <span class="label">parties:</span>
          {/if}
          <div
            bind:this={partyList}
            class="party-list"
            style="max-height: {innerHeight - 460}px">
            {#each filteredParties as party}
              <div
                class="matching-party"
                style="padding: {selectedPartyIds.length > 1 ? '0 0 10px 0' : '10px 0'};">
                <h3>{party.name_short}</h3>
                <p>{party.name_full.replace(/(.*)\(.*\)/gi, '$1')}</p>
              </div>
            {/each}
          </div>
        </div>
        <div
          class="scroll-hint"
          style="display: {isScrolling ? 'block' : 'none'};">
          dont't forget to scroll
        </div>
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
