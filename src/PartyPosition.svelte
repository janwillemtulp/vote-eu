<script>
  import { scaleLinear } from "d3-scale";

  let width = 200;
  export let labelLeft;
  export let labelRight;
  export let position;

  let x = scaleLinear()
    .domain([0, 100])
    .range([0, width]);

  let c = scaleLinear()
    .domain([0, 50, 100])
    .range(["hsl(170, 50%, 50%)", "hsl(170, 0%, 80%)", "hsl(170, 50%, 50%)"]);
</script>

<style>
  .party-position {
    height: 30px;
    background-color: #f4f4f4;
  }

  .labels {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .label {
    font-size: 12px;
    white-space: nowrap;
  }

  .label-left {
    margin-left: 3px;
  }

  .label-right {
    text-align: right;
    margin-right: 3px;
  }

  .position {
    height: 6px;
    width: 16px;
    margin-left: -8px;
    background-color: black;
    position: absolute;
    top: 6px;
  }

  .position-container {
    border-bottom: 1px solid #ccc;
    position: relative;
    height: 12px;
  }
</style>

<div class="party-position">
  <div class="position-container">
    <div
      class="position"
      style="left: {x(position)}; background-color: {c(position)};" />
  </div>
  <div class="labels">
    <span
      class="label label-left"
      style="color: {position < 50 ? 'black' : '#999'}">
      {labelLeft}
    </span>
    <span
      class="label label-right"
      style="color: {position > 50 ? 'black' : '#999'}">
      {labelRight}
    </span>
  </div>
</div>
