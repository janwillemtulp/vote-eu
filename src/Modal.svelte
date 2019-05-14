<script>
  import CountrySelect from "./CountrySelect.svelte";
  let modal;

  function closeModal() {
    document.body.style.overflow = "auto";
    modal.style.display = "none";
  }
</script>

<style>
  .modal {
    width: 100%;
    height: calc(100% - 30px);
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 1000;
    position: fixed;
    left: 0;
    top: 0;
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    align-items: center;
    overflow: scroll;
  }

  .content {
    max-width: 800px;
    background-color: white;
    padding: 50px;
    max-height: 80vh;
    box-shadow: 20px 20px 20px rgba(0, 0, 0, 0.2);
  }

  .content p {
    font-size: 16px;
    line-height: 26px;
  }

  button {
    background-color: hsl(224, 80%, 32%);
    color: hsl(46, 92%, 62%);
    border: none;
    padding: 10px 30px;
    font-size: 18px;
    margin-left: 10px;
  }

  em {
    font-weight: bold;
    font-style: normal;
  }

  button:hover {
    cursor: pointer;
    background-color: hsl(224, 80%, 22%);
  }

  .logo {
    display: block;
    height: 100px;
  }
</style>

<div class="modal" bind:this={modal}>
  <div class="content">
    <img class="logo" src="img/logo.png" alt="2019 vote EU" />
    <h2>Vote matching, but the other way around</h2>
    <p>
      Many vote matching allow you to find out what percentage of your opinion matches with the opinion of political parties. The approach of
      <b>2019 vote EU</b>
      is different:
      <em>
        ultimately, if you vote for a political party, you vote for all of the opions of that political party. Therefore, it doesn't really matter if your opinion matches 50% or 75%, you vote for the complete package of opinions of that party.
      </em>
    </p>
    <p>
      This means that it is valuable to get a sense of overview: how does this party differ from the others? Does it have unique positions? If I agree with this position, what do I automatically agree with if I vote for them? etc.
    </p>
  <p>Now go ahead, select your country, and for any of the statements, click on Agree, Neutral, Disagree or No Opinion to explore similarities and differences between political parties and you!</p>
    <div style="text-align: right;">
      <CountrySelect />
      <button on:click={() => closeModal()}>start</button>
    </div>
  </div>
</div>
