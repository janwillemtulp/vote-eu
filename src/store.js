import { writable, derived } from "svelte/store";
import { rollup } from "d3-array";

// from Wikipedia, assuming the UK won't leave before the elections
const seats = {
  DE: 96,
  FR: 74,
  UK: 73,
  IT: 73,
  SP: 54,
  PL: 51,
  RO: 32,
  NL: 26,
  BE: 21,
  CZ: 21,
  EL: 21,
  HU: 21,
  PT: 21,
  SE: 20,
  AT: 18,
  BG: 17,
  DK: 13,
  FI: 13,
  SK: 13,
  IE: 11,
  HR: 11,
  LT: 11,
  LV: 8,
  SI: 8,
  EE: 6,
  CY: 6,
  LU: 6,
  MT: 6
};

export const data = writable([]);

export const selectedCountry = writable({
  code: "NL",
  name: "The Netherlands",
  seats: 26
});

export const selectedAnswers = writable(new Array(22));

export const selectedParty = writable();

export const allCountries = derived(data, data =>
  data.reduce((acc, cur) => {
    if (!acc.map(d => d.code).includes(cur.country_code)) {
      acc.push({
        code: cur.country_code,
        name: cur.country_name,
        seats: seats[cur.country_code]
      });
    }

    return acc;
  }, [])
);

export const activeData = derived(
  [data, selectedCountry],
  ([data, selectedCountry]) =>
    data.filter(d => d.country_code === selectedCountry.code)
);

const answerColors = new Map();
answerColors.set(100, "hsl(200, 50%, 50%)");
answerColors.set(50, "#999");
answerColors.set(0, "hsl(0, 50%, 50%)");
answerColors.set(null, "pink");

export const opinionBlocks = derived(activeData, activeData =>
  activeData.reduce((acc, cur) => {
    const existing = acc.find(
      d =>
        d.question.id === cur.question_id &&
        d.answer.simplifiedValue === cur.simplifiedAnswer
    );
    if (!existing) {
      acc.push({
        question: {
          id: cur.question_id,
          shared_id: cur.question_shared_id,
          text: cur.question,
          economic_liberalisation: cur.economic_liberalisation,
          environmental_protection: cur.environmental_protection,
          european_integration: cur.european_integration,
          law_and_order: cur.law_and_order,
          liberal_society: cur.liberal_society,
          restrictive_financial_policy: cur.restrictive_financial_policy,
          restrictive_immigration_policy: cur.restrictive_immigration_policy,
          xy_lc: cur.xy_lc,
          xy_lr: cur.xy_lr
        },
        answer: {
          value: cur.answer,
          simplifiedValue: cur.simplifiedAnswer,
          color: answerColors.get(cur.simplifiedAnswer)
        },
        country: {
          code: cur.country_code,
          name: cur.country_name
        },
        parties: [
          {
            id: cur.party_id,
            image: cur.party_image,
            name_full: cur.party_name_full,
            name_short: cur.party_name_short,
            motivation: {
              source: cur.motivation_src,
              link: cur.motivation_src_link,
              text: cur.motivation
            }
          }
        ]
      });
    } else {
      existing.parties.push({
        id: cur.party_id,
        image: cur.party_image,
        name_full: cur.party_name_full,
        name_short: cur.party_name_short,
        motivation: {
          source: cur.motivation_src,
          link: cur.motivation_src_link,
          text: cur.motivation
        }
      });
    }

    return acc;
  }, [])
);

export const allParties = derived(opinionBlocks, opinionBlocks =>
  opinionBlocks.reduce((acc, cur) => {
    cur.parties.forEach(c => {
      if (!acc.find(d => d.id === c.id)) {
        acc.push(c);
      }
    });

    return acc;
  }, [])
);

export const activeQuestions = derived(activeData, activeData =>
  activeData.reduce((acc, cur) => {
    if (!acc.map(d => d.id).includes(cur.question_id)) {
      acc.push({
        id: cur.question_id,
        shared_id: cur.question_shared_id,
        text: cur.question
      });
    }

    return acc;
  }, [])
);

export const activeParties = derived(activeData, activeData =>
  activeData.reduce((acc, cur) => {
    if (!acc.map(d => d.id).includes(cur.party_id)) {
      const partyData = activeData.filter(d => d.party_id === cur.party_id);

      acc.push({
        id: cur.party_id,
        name_short: cur.party_name_short,
        name_long: cur.party_name_full,
        image: cur.party_image,
        data: partyData,
        leftRight:
          partyData // economical
            .map(d => d.xy_lr * (d.answer - 50) + 50)
            .reduce((acc, cur) => acc + cur, 0) / partyData.length,
        liberalConservative:
          partyData // cultural
            .map(d => d.xy_lc * (d.answer - 50) + 50)
            .reduce((acc, cur) => acc + cur, 0) / partyData.length
      });
    }

    return acc;
  }, [])
);

export const activeAnswers = derived(activeData, activeData =>
  rollup(
    activeData,
    v =>
      v.reduce((acc, cur) => {
        acc.push(cur.party_id);
        return acc;
      }, []),
    d => d.question_id,
    d => d.simplifiedAnswer
  )
);

// TODO: should work with activeAnswers directly????
export const filteredAnswers = derived(
  [activeData, selectedAnswers],
  ([$activeData, $selectedAnswers]) => {
    console.log($selectedAnswers.filter(d => d !== undefined));
    return rollup(
      $activeData.filter(d =>
        $selectedAnswers
          .filter(d => d !== undefined)
          .map(d => d.questionId)
          .includes(d.question_id)
      ),
      v =>
        v.reduce((acc, cur) => {
          acc.push(cur.party_id);
          return acc;
        }, []),
      d => d.question_id,
      d => d.simplifiedAnswer
    );
  }
);

export const filteredParties = derived(
  [activeAnswers, selectedAnswers],
  ([$activeAnswers, $selectedAnswers]) => {
    console.log($selectedAnswers, $activeAnswers);
    return "jsjs";
  }
);
