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
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
  }

  .inner {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-content: right;
    align-items: center;
    height: 30px;
    text-align: right;
  }

  .inner p {
    margin: 0;
  }

  .smaller {
    display: none;
  }

  .tulp-interactive {
    margin-right: 5px;
    font-weight: bold;
  }

  .about {
    margin-left: 5px;
    justify-self: start;
  }

  @media (min-width: 540px) {
    .smaller {
      display: inline;
    }
  }

  @media (min-width: 940px) {
    .inner {
      width: 940px;
    }
  }
</style>

<footer>
  <div class="inner">
    <p>
      <span class="smaller">concept & design</span>
      by
      <a class="tulp-interactive"
        href="http://tulpinteractive.com"
        title="TULP interactive"
        target="_blank">
        <span>TULP</span> interactive
      </a>
    </p>
    <a class="about" href="about.html" target="_blank" title="about 2019 vote EU">
      about 2019 vote EU
    </a>
  </div>
</footer>
