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
    grid-template-columns: 200px 1fr;
    justify-content: right;
    align-items: center;
    height: 30px;
  }

  a {
    margin: 0 5px;
  }

  .links {
    text-align: right;
  }

  .inner p {
    margin: 0;
  }

  .tulp-interactive {
    margin-right: 5px;
    font-weight: bold;
  }

  .about {
    margin-left: 5px;
    justify-self: start;
  }

  .privacy {
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
      by
      <a
        class="tulp-interactive"
        href="http://tulpinteractive.com"
        title="TULP interactive"
        target="_blank">
        <span>TULP</span>
        interactive
      </a>
    </p>
    <div class="links">
      <a
        class="about"
        href="about.html"
        target="_blank"
        title="about 2019 vote EU">
        about
      </a>
      <a
        class="privacy"
        href="privacy-statement.html"
        target="_blank"
        title="privacy statement">
        privacy
      </a>
    </div>
  </div>
</footer>
