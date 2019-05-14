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

  footer .inner {
    width: 100%;
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

  .smaller {
    display: none;
  }

  @media (min-width: 414px) {
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
      <span class="smaller">concept & design</span> by
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
