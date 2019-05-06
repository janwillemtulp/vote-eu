import { writable, derived } from 'svelte/store'
import { rollup } from 'd3-array'

export const data = writable([])

export const selectedCountry = writable('NL')

export const selectedAnswers = writable(new Array(22))

export const selectedParty = writable()

export const allCountryCodes = derived(data, data => [
  ...new Set(data.map(d => d.country_code))
])

export const activeData = derived(
  [data, selectedCountry],
  ([data, selectedCountry]) =>
    data.filter(d => d.country_code === selectedCountry)
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

export const activeParties = derived(activeData, activeData =>
  activeData.reduce((acc, cur) => {
    if (!acc.map(d => d.id).includes(cur.party_id)) {
      const partyData = activeData.filter(d => d.party_id === cur.party_id)

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
      })
    }

    return acc
  }, [])
)

export const activeAnswers = derived(activeData, activeData =>
  rollup(
    activeData,
    v =>
      v.reduce((acc, cur) => {
        acc.push(cur.party_id)
        return acc
      }, []),
    d => d.question_id,
    d => d.answer
  )
)

export const allAnswers = derived(data, data =>
  rollup(
    data,
    v =>
      v.reduce((acc, cur) => {
        acc.push(cur.party_id)
        return acc
      }, []),
    d => d.question_id,
    d => d.answer
  )
)
