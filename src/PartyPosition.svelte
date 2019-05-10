<script>
  import { scaleLinear } from "d3-scale";
  import { interpolateHsl } from "d3-interpolate";

  let width = 200;
  let sideMargin = 0;
  export let labelLeft;
  export let labelRight;
  export let position;
  export let colorLeft = "hsl(120, 72%, 45%)";
  export let colorRight = "hsl(280, 72%, 45%)";

  let x = scaleLinear()
    .domain([0, 100])
    .range([sideMargin, width - sideMargin]);

  // let c = scaleLinear()
  //   .domain([0, 50, 100])
  //   .range(["hsl(170, 70%, 40%)", "hsl(340, 0%, 50%)", "hsl(170, 70%, 50%)"]);
  let c = scaleLinear()
    .domain([0, 50, 100])
    .range([colorLeft, "hsl(200, 0%, 55%)", colorRight])
    .interpolate(interpolateHsl);
</script>

<style>
  .party-position {
    height: 16px;
    /* background-color: #eee; */
  }

  .labels {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .label {
    font-size: 12px;
    white-space: nowrap;
  }

  .label-right {
    text-align: right;
  }

  .position {
    height: 8px;
    width: 16px;
    margin-left: -8px;
    position: absolute;
    top: 6px;
  }

  .position-container {
    border-bottom: 1px dashed #ccc;
    position: relative;
    height: 10px;
    margin-bottom: 2px;
  }
</style>

<div class="party-position">
  <div class="position-container">
    <div
      class="position"
      style="left: {x(position)}; background-color: {c(position)};" />
  </div>
  <!-- <div class="labels">
    <span
      class="label label-left"
      style="color: {position < 50 ? c(position) : '#aaa'}">
      {labelLeft}
    </span>
    <span
      class="label label-right"
      style="color: {position > 50 ? c(position) : '#aaa'}">
      {labelRight}
    </span>
  </div> -->
</div>
