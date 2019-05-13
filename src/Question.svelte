<script>
  import { opinions, selectedPartyIds } from "./store.js";

  export let question;

  $: answerValuesRemaining = () =>
    $opinions
      .filter(d => d.question.id === question.id)
      .filter(
        d =>
          d.parties.map(d => d.id).filter(d => $selectedPartyIds.includes(d))
            .length > 0
      );

  $: marked = () => answerValuesRemaining().length === 1;
</script>

<style>
  p {
    height: 120px;
    margin: 0 10px 0 0;
    text-align: right;
    font-weight: normal;
  }
</style>

<p
  style="color: {marked() ? answerValuesRemaining()[0].answer.color : 'black'};">
  <span
    style="padding: 0 0 0 4px; background-color: {marked() || $selectedPartyIds.length === 0 ? 'transparent' : 'hsla(46, 92%, 75%, 1)'};">
    {question.text}
  </span>
</p>
