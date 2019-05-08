<script>
  import { csv } from "d3-fetch";
  import { rollup } from "d3-array";
  import {
    data,
    selectedCountry,
    selectedPartyIds2,
    activeData,
    activeQuestions,
    activeParties,
    allCountries,
    opinionBlocks
  } from "./store.js";
  import Svg from "./Svg.svelte";

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

  function setSelectedCountry(code) {
    console.log(code);
    $selectedCountry = code;
    $selectedPartyIds2 = [];
  }

  $: console.log($allCountries);
  $: console.log("opinionBlocks", $opinionBlocks);

  $: answerValuesRemaining = question =>
    $opinionBlocks
      .filter(d => d.question.id === question.id)
      .filter(
        d =>
          d.parties.map(d => d.id).filter(d => $selectedPartyIds2.includes(d))
            .length > 0
      );
</script>

<style>
  button {
    border: none;
    border-radius: 0;
    width: 30px;
  }

  header {
    padding: 0 20px;
    height: 150px;
  }

  footer {
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: white;
    width: 100%;
  }

  .main-container {
    overflow: scroll;
    width: 1200px;
    display: grid;
    grid-template-columns: 200px 620px;
    width: 840px;
    padding: 0 20px 50px 20px;
  }

  .column-label {
    display: inline-block;
    width: 150px;
    text-align: center;
    font-weight: bold;
    font-size: 18px;
    font-family: "Libre Baskerville", serif;
  }

  .question {
    height: 120px;
    margin: 0;
    text-align: right;
  }

  h1 span {
    font-size: 14px;
    font-family: "Source Sans Pro", sans-serif;
    font-style: italic;
  }
</style>

<svelte:window bind:innerWidth bind:innerHeight />

<header>
  {#await promise}
    <p>...loading data</p>
  {:then}
  {:catch error}
    <p style="color: red;">{error.message}</p>
  {/await}

  <div>
    {#each $allCountries as country}
      <button
        class="bg-blue"
        style="background-color: {$selectedCountry.code === country.code ? 'orange' : '#ddd'}"
        on:click={() => setSelectedCountry(country)}>
        {country.code}
      </button>
    {/each}
  </div>

  <h1>
    {$selectedCountry.name}
    <span> {$selectedCountry.seats} seats in EU parliament</span>
  </h1>

  <div style="margin-left: 200px;">
    <div class="column-label" style="color: hsl(200, 50%, 50%);">Agree</div>
    <div class="column-label" style="color: #999;">Neutral</div>
    <div class="column-label" style="color: hsl(0, 50%, 50%);">Disagree</div>
    <div class="column-label" style="color: hsl(310, 50%, 70%);">
      No opinion
    </div>
  </div>
</header>

<div class="main-container" style="height: {innerHeight - 150 - 100}px;">
  <div style="margin-top: 20px;">
    {#each $activeQuestions as question, i}
      <p
        class="question"
        style="font-weight: {answerValuesRemaining(question).length === 1 ? 'bold' : 'normal'}; color: {answerValuesRemaining(question).length === 1 ? answerValuesRemaining(question)[0].answer.color : 'black'}">
        {question.text}
      </p>
    {/each}
  </div>
  <Svg containerHeight={innerHeight - 150 - 100} />
</div>

<footer>
  <p>concept & design by TULP interactive ©2019</p>
</footer>
