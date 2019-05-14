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
    width: 80vw;
    max-width: 800px;
    background-color: white;
    padding: 30px;
    max-height: calc(80vh - 60px);
    box-shadow: 20px 20px 20px rgba(0, 0, 0, 0.2);
  }

  .content h2 {
    margin: 0 40px;
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

  button:hover {
    cursor: pointer;
    background-color: hsl(224, 80%, 22%);
  }

  .logo {
    display: block;
    object-fit: cover;
    width: 100%;
    padding-bottom: 5px;
  }
</style>

<div class="modal" bind:this={modal}>
  <div class="content">
    <div style="display: grid; grid-template-columns: 1fr 5fr; align-items: end;">
      <img class="logo" src="img/logo.png" alt="2019 vote EU" />
      <h2>Vote matching, but the other way around</h2>
    </div>
    <p>
      For any of the statements, click on Agree, Neutral, Disagree or No Opinion to explore similarities and differences between political parties and you!
    </p>
    <div style="text-align: right;">
      <CountrySelect />
      <button on:click={() => closeModal()}>start</button>
    </div>
  </div>
</div>
