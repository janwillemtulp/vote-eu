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
    max-width: 110px;
  }

  h2 {
    margin: 0;
  }

  ol {
    padding: 0 20px;
  }

  @media (min-width: 768px) {
    .logo {
      max-width: 200px;
    }
  }
</style>

<div class="modal" bind:this={modal}>
  <div class="content">
    <div style="display: grid; grid-template-rows: 1fr 1fr; align-items: end;">
      <img class="logo" src="img/logo.png" alt="2019 vote EU" />
      <h2>Vote matching, but the other way around</h2>
    </div>
    <ol>
      <li>Give your opinion on any of 22 policy statements</li>
      <li>This will eliminate parties that don't share your opinion</li>
      <li>
        All the opinions that the remaining parties share are automatically marked as well
      </li>
      <li>You can only give opinions that are shared by political parties</li>
    </ol>
    <div style="text-align: right;">
      <CountrySelect />
      <button on:click={() => closeModal()}>start</button>
    </div>
  </div>
</div>
