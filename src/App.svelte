<script>
  import { csv } from "d3-fetch";
  import { rollup } from "d3-array";
  import {
    data,
    selectedCountry,
    selectedParty,
    selectedAnswers,
    activeData,
    activeQuestions,
    activeParties,
    activeAnswers,
    allCountryCodes
  } from "./store.js";
  import Svg from "./Svg.svelte";

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
      xy_lr: parse(row.xy_lr)
    })).then(res => {
      $data = res;
      console.log(res, $activeAnswers);
    });
  }

  function setSelectedCountry(code) {
    console.log(code);
    $selectedCountry = code;
    $selectedAnswers = new Array(22);
  }
</script>

<style>
  button {
    border: none;
    border-radius: 0;
    width: 30px;
  }

  img {
    cursor: pointer;
  }
</style>

{#await promise}
  <p>...loading data</p>
{:then}
{:catch error}
  <p style="color: red;">{error.message}</p>
{/await}

<div>
  {#each $allCountryCodes as code}
    <button
      style="background-color: {$selectedCountry === code ? 'orange' : '#ddd'}"
      on:click={() => setSelectedCountry(code)}>
      {code}
    </button>
  {/each}
</div>

<div>
  {#each $activeParties as party}
    <img
      src={party.image}
      alt={party.name_long}
      height="30"
      style="margin-right: 5px;"
      on:click={() => ($selectedParty = $selectedParty === party.id ? undefined : party.id)} />
  {/each}
</div>

<Svg />
