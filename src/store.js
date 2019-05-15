import { writable, derived, readable } from "svelte/store";
import { rollup } from "d3-array";

export const data = writable([]);

export const allCountries = readable([
  { code: "AT", name: "Austria", seats: 18 },
  { code: "BE", name: "Belgium", seats: 21 },
  { code: "BG", name: "Bulgaria", seats: 17 },
  { code: "HR", name: "Croatia", seats: 11 },
  { code: "CY", name: "Cyprus", seats: 6 },
  { code: "CZ", name: "Czech Republic", seats: 21 },
  { code: "DK", name: "Denmark", seats: 13 },
  { code: "EE", name: "Estonia", seats: 6 },
  { code: "FI", name: "Finland", seats: 13 },
  { code: "FR", name: "France", seats: 74 },
  { code: "DE", name: "Germany", seats: 96 },
  { code: "EL", name: "Greece", seats: 21 },
  { code: "HU", name: "Hungary", seats: 21 },
  { code: "IE", name: "Ireland", seats: 11 },
  { code: "IT", name: "Italy", seats: 73 },
  { code: "LV", name: "Latvia", seats: 8 },
  { code: "LT", name: "Lithuania", seats: 11 },
  { code: "LU", name: "Luxembourg", seats: 6 },
  { code: "MT", name: "Malta", seats: 6 },
  { code: "NL", name: "The Netherlands", seats: 26 },
  { code: "PL", name: "Poland", seats: 51 },
  { code: "PT", name: "Portugal", seats: 21 },
  { code: "RO", name: "Romania", seats: 32 },
  { code: "SK", name: "Slovakia", seats: 13 },
  { code: "SI", name: "Slovenia", seats: 8 },
  { code: "SP", name: "Spain", seats: 54 },
  { code: "SE", name: "Sweden", seats: 20 },
  { code: "UK", name: "United Kingdom", seats: 73 }
]);

export const selectedCountry = writable({
  code: "AT",
  name: "Austria",
  seats: 18
});

export const activeData = derived(
  [data, selectedCountry],
  ([data, selectedCountry]) =>
    data.filter(d => d.country_code === selectedCountry.code)
);

const answerColors = new Map();
answerColors.set(100, "hsl(200, 50%, 50%)");
answerColors.set(50, "#999");
answerColors.set(0, "hsl(0, 50%, 50%)");
answerColors.set(null, "hsl(310, 50%, 70%)");

const answerColorsLight = new Map();
answerColorsLight.set(100, "hsl(204, 35%, 78%)");
answerColorsLight.set(50, "hsl(0, 0%, 80%)");
answerColorsLight.set(0, "hsl(3, 35%, 75%)");
answerColorsLight.set(null, "hsl(307, 30%, 83%)");

const answerColorsDark = new Map();
answerColorsDark.set(100, "hsl(200, 86%, 21%)");
answerColorsDark.set(50, "hsl(0, 0%, 23%)");
answerColorsDark.set(0, "hsl(0, 81%, 19%)");
answerColorsDark.set(null, "hsl(311, 62%, 20%)");

const answerLabels = new Map();
answerLabels.set(100, "Agree");
answerLabels.set(50, "Neutral");
answerLabels.set(0, "Disagree");
answerLabels.set(null, "No opinion");

export const opinions = derived(activeData, activeData =>
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
          text: cur.question
        },
        answer: {
          value: cur.answer,
          simplifiedValue: cur.simplifiedAnswer,
          color: answerColors.get(cur.simplifiedAnswer),
          colorLight: answerColorsLight.get(cur.simplifiedAnswer),
          colorDark: answerColorsDark.get(cur.simplifiedAnswer),
          label: answerLabels.get(cur.simplifiedAnswer)
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

    return acc.sort((a, b) => a.question.id - b.question.id);
  }, [])
);

export const selectedPartyIds = writable([]);

function calculatePreference(partyOpinions, dimension) {
  const filteredOpinions = partyOpinions.filter(
    o => o.question[dimension] !== 0 && o.answer.value !== null
  );

  return (
    filteredOpinions.reduce(
      (acc, cur) =>
        acc +
        2 * Math.max(0, cur.question[dimension] * (cur.answer.value - 50)),
      0
    ) / filteredOpinions.length
  );
}

export const allParties = derived(opinions, opinions =>
  opinions.reduce((acc, cur) => {
    cur.parties.forEach(c => {
      if (!acc.find(d => d.id === c.id)) {
        const partyOpinions = opinions.filter(o =>
          o.parties.map(d => d.id).includes(c.id)
        );

        const lrOpinions = partyOpinions.filter(o => o.question.xy_lr !== 0);
        const lcOpinions = partyOpinions.filter(o => o.question.xy_lc !== 0);

        acc.push({
          ...c,
          spectrum: {
            leftRight:
              lrOpinions.reduce(
                (acc, cur) =>
                  acc + cur.question.xy_lr * (cur.answer.value - 50) + 50,
                0
              ) / lrOpinions.length,
            liberalConservative:
              100 -
              lcOpinions.reduce(
                (acc, cur) =>
                  acc + cur.question.xy_lc * (cur.answer.value - 50) + 50,
                0
              ) /
                lcOpinions.length,
            environment: calculatePreference(
              partyOpinions,
              "environmental_protection"
            ),
            eu: calculatePreference(partyOpinions, "european_integration"),
            society: calculatePreference(partyOpinions, "liberal_society"),
            law: calculatePreference(partyOpinions, "law_and_order"),
            economy: calculatePreference(
              partyOpinions,
              "economic_liberalisation"
            ),
            finance: calculatePreference(
              partyOpinions,
              "restrictive_financial_policy"
            ),
            immigration: calculatePreference(
              partyOpinions,
              "restrictive_immigration_policy"
            )
          },
          opinionCounts: {
            noOpinion: partyOpinions.filter(d => d.answer.value === null)
              .length,
            shared: partyOpinions.filter(
              d => d.answer.value !== null && d.parties.length > 1
            ).length,
            unique: partyOpinions.filter(
              d => d.answer.value !== null && d.parties.length === 1
            ).length
          }
        });
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

export const filteredParties = derived(
  [allParties, selectedPartyIds],
  ([allParties, selectedPartyIds]) =>
    allParties
      .filter(d => selectedPartyIds.includes(d.id))
      .sort((a, b) =>
        a.name_short < b.name_short ? -1 : a.name_short > b.name_short ? 1 : 0
      ),
  []
);

export const overlap = derived(
  [opinions, selectedPartyIds],
  ([opinions, selectedPartyIds]) =>
    opinions.filter(d =>
      selectedPartyIds.every(p => d.parties.map(d => d.id).includes(p))
    ).length,
  0
);

export const difference = derived(
  [activeQuestions, overlap],
  ([activeQuestions, overlap]) => activeQuestions.length - overlap,
  0
);
