import { writable, derived } from 'svelte/store'
import { rollup } from 'd3-array'

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
}

export const data = writable([])

export const selectedCountry = writable({
  code: 'AT',
  name: 'Austria',
  seats: 18
})

export const allCountries = derived(data, data =>
  data.reduce((acc, cur) => {
    if (!acc.map(d => d.code).includes(cur.country_code)) {
      acc.push({
        code: cur.country_code,
        name: cur.country_name,
        seats: seats[cur.country_code]
      })
    }

    return acc
  }, [])
)

export const activeData = derived(
  [data, selectedCountry],
  ([data, selectedCountry]) =>
    data.filter(d => d.country_code === selectedCountry.code)
)

const answerColors = new Map()
answerColors.set(100, 'hsl(200, 50%, 50%)')
answerColors.set(50, '#999')
answerColors.set(0, 'hsl(0, 50%, 50%)')
answerColors.set(null, 'hsl(310, 50%, 70%)')

const answerColorsLight = new Map()
answerColorsLight.set(100, 'hsl(204, 35%, 78%)')
answerColorsLight.set(50, 'hsl(0, 0%, 80%)')
answerColorsLight.set(0, 'hsl(3, 35%, 75%)')
answerColorsLight.set(null, 'hsl(307, 30%, 83%)')

const answerLabels = new Map()
answerLabels.set(100, 'Agree')
answerLabels.set(50, 'Neutral')
answerLabels.set(0, 'Disagree')
answerLabels.set(null, 'No opinion')

export const opinions = derived(activeData, activeData =>
  activeData.reduce((acc, cur) => {
    const existing = acc.find(
      d =>
        d.question.id === cur.question_id &&
        d.answer.simplifiedValue === cur.simplifiedAnswer
    )
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
          color: answerColors.get(cur.simplifiedAnswer),
          colorLight: answerColorsLight.get(cur.simplifiedAnswer),
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
      })
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
      })
    }

    return acc.sort((a, b) => a.question.id - b.question.id)
  }, [])
)

export const selectedPartyIds = writable([])

function calculatePreference (partyOpinions, dimension) {
  const filteredOpinions = partyOpinions.filter(
    o => o.question[dimension] !== 0 && o.answer.value !== null
  )

  return (
    filteredOpinions.reduce(
      (acc, cur) =>
        acc +
        2 * Math.max(0, cur.question[dimension] * (cur.answer.value - 50)),
      0
    ) / filteredOpinions.length
  )
}

export const allParties = derived(opinions, opinions =>
  opinions.reduce((acc, cur) => {
    cur.parties.forEach(c => {
      if (!acc.find(d => d.id === c.id)) {
        const partyOpinions = opinions.filter(o =>
          o.parties.map(d => d.id).includes(c.id)
        )

        const lrOpinions = partyOpinions.filter(o => o.question.xy_lr !== 0)
        const lcOpinions = partyOpinions.filter(o => o.question.xy_lc !== 0)

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
              'environmental_protection'
            ),
            eu: calculatePreference(partyOpinions, 'european_integration'),
            society: calculatePreference(partyOpinions, 'liberal_society'),
            law: calculatePreference(partyOpinions, 'law_and_order'),
            economy: calculatePreference(
              partyOpinions,
              'economic_liberalisation'
            ),
            finance: calculatePreference(
              partyOpinions,
              'restrictive_financial_policy'
            ),
            immigration: calculatePreference(
              partyOpinions,
              'restrictive_immigration_policy'
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
        })
      }
    })

    return acc
  }, [])
)

export const activeQuestions = derived(activeData, activeData =>
  activeData.reduce((acc, cur) => {
    if (!acc.map(d => d.id).includes(cur.question_id)) {
      acc.push({
        id: cur.question_id,
        shared_id: cur.question_shared_id,
        text: cur.question
      })
    }

    return acc
  }, [])
)
