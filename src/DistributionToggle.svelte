<script>
  import { showDistributions } from "./store.js";
</script>

<style>
  /* The switch - the box around the slider */
  .switch {
    position: relative;
    /* display: inline-block; */
    width: 40px;
    height: 20px;
  }

  label {
    display: inline-block;
    top: 0;
  }

  /* Hide default HTML checkbox */
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.2s;
    transition: 0.2s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 13px;
    width: 13px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.2s;
    transition: 0.2s;
  }

  input:checked + .slider {
    background-color: hsl(221, 85%, 31%);
  }

  input:focus + .slider {
    box-shadow: 0 0 1px hsl(221, 85%, 31%);
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(18px);
    -ms-transform: translateX(18px);
    transform: translateX(18px);
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
</style>

<div style="text-align: right; display: flex;">
  party opinions:
  <label class="switch">
    <input
      id="opinion-distribution"
      type="checkbox"
      on:click={() => ($showDistributions = !$showDistributions)} />
    <span class="slider round" />
  </label>
</div>
