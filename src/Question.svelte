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

  $: marked = () => answerValuesRemaining().length === 1
</script>

<style>
  p {
    height: 120px;
    margin: 0 10px 0 0;
    text-align: right;
    font-weight: normal;
  }

  .marked {
    font-weight: bold;
  }
</style>

<p
  class:marked={marked()}
  style="color: {marked() ? answerValuesRemaining()[0].answer.color : 'black'}">
  {question.text}
</p>
