<script>
  import { csv } from "d3-fetch";
  import { loadData } from "./common.js";
  import Modal from "./Modal.svelte";
  import Header from "./Header.svelte";
  import Main from "./Main.svelte";
  import Footer from "./Footer.svelte";

  let promise = loadData("NL");
</script>

{#await promise}
  <p>...loading data</p>
{:then}
  <Main />

  <Header />
{:catch error}
  <p style="color: red;">{error.message}</p>
{/await}

<!-- <Modal /> -->
<Footer />
