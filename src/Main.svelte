<script>
  import { fade, fly } from "svelte/transition";
  import { afterUpdate } from "svelte";
  import {
    activeQuestions,
    allParties,
    selectedPartyIds,
    opinions,
    filteredParties,
    overlap,
    difference
  } from "./store.js";
  import Svg from "./Svg.svelte";
  import Question from "./Question.svelte";
  import MatchingPartiesBar from "./MatchingPartiesBar.svelte";

  let innerWidth = 0;
  let innerHeight = 0;
  let partyList;
  let isScrolling;

  afterUpdate(() => {
    isScrolling = partyList
      ? partyList.scrollHeight > partyList.clientHeight
      : false;
  });
</script>

<style>
  main {
    display: grid;
    grid-template-columns: 200px 1fr;
    justify-content: center;
    margin-top: 190px;
    padding-bottom: 100px;
  }

  aside {
    margin-left: 10px;
    display: none;
  }

  aside .inner {
    width: 180px;
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

  .matching-party {
    margin-left: 0px;
    padding: 0 0 10px 0;
  }

  .matching-party h3 {
    margin: 0;
  }

  .matching-party p {
    margin-top: 0;
  }

  .overlap-diff {
    padding: 10px;
    background-color: #eee;
    margin-bottom: 2px;
    display: none;
  }

  .overlap-diff .value,
  .matching-parties .label span {
    font-family: "Libre Baskerville", serif;
    font-size: 20px;
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

  .party-list {
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 200px;
  }

  .scroll-hint {
    width: 100%;
    text-align: center;
    font-style: italic;
    margin-top: 3px;
  }

  @media (min-height: 414px) {
    .overlap-diff {
      display: block;
    }
  }

  @media (min-width: 414px) {
    main {
      margin-top: 160px;
    }
  }

  @media (min-width: 768px) and (min-height: 414px) {
    main {
      grid-template-columns: 200px 1fr 200px;
    }

    aside {
      display: block;
    }
  }

  @media (min-width: 940px) {
    main {
      grid-template-columns: 200px 540px 200px;
    }

    .inner {
      width: 190px;
    }
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
        <h2>Matching part{$difference === 0 ? 'y' : 'ies'}</h2>
        {#if $selectedPartyIds.length > 1}
          <div class="overlap-diff overlap">
            <div>
              <span class="label">same opinion in:</span>
              <span class="value">{$overlap}</span>
               {$overlap === 1 ? 'statement' : 'statements'} of {$activeQuestions.length}
              {`(${Math.round(($overlap / $activeQuestions.length) * 100)}%)`}
            </div>
          </div>
          <div class="overlap-diff diff">
            <div>
              <span class="label">
                <span>mixed</span>
                opinions in:
              </span>
              <span class="value">{$difference}</span>
               {overlap === 1 ? 'statement' : 'statements'} of {$activeQuestions.length}
              {`(${Math.round(($difference / $activeQuestions.length) * 100)}%)`}

            </div>
          </div>
        {/if}
        <div
          class="matching-parties"
          style="background-color: {$selectedPartyIds.length === 1 ? 'rgb(179, 219, 186)' : '#eee'};">
          {#if $selectedPartyIds.length > 1}
            <span class="label">
              <span>{$selectedPartyIds.length}</span>
              parties match your selection:
            </span>
          {/if}
          <div
            bind:this={partyList}
            class="party-list"
            style="max-height: {innerHeight - 460}px">
            {#each $filteredParties as party}
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

<MatchingPartiesBar />
