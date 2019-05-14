<script>
  import { csv } from "d3-fetch";
  import { data } from "./store.js";
  import Modal from "./Modal.svelte";
  import Header from "./Header.svelte";
  import Main from "./Main.svelte";

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
</script>

<style>
  footer {
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #fff;
    width: 100%;
    display: grid;
    grid-template-columns: auto;
    justify-content: center;
    align-items: center;
  }

  footer .inner {
    width: 940px;
    display: grid;
    grid-template-columns: auto 200px;
    justify-content: right;
    align-items: center;
    height: 30px;
    text-align: right;
  }

  footer .inner p {
    margin: 0;
  }
</style>

{#await promise}
  <p>...loading data</p>
{:then}
{:catch error}
  <p style="color: red;">{error.message}</p>
{/await}

<Main />

<Header />

<!-- <Modal /> -->

<footer>
  <div class="inner">
    <p>
      concept & design by
      <a
        href="http://tulpinteractive.com"
        title="TULP interactive"
        target="_blank">
        TULP interactive
      </a>
    </p>
    <a href="about.html" target="_blank" title="about 2019 vote EU">
      about 2019 vote EU
    </a>
  </div>
</footer>
