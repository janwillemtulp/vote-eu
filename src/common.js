import { csv } from "d3-fetch";
import { data } from "./store.js";

const parse = attribute => (attribute === "" ? null : +attribute);

export async function loadData(countryCode) {
  csv(`./data/${countryCode}.csv`, row => ({
    ...row,
    answer: parse(row.answer),
    simplifiedAnswer:
      parse(row.answer) === null
        ? null
        : parse(row.answer) < 50
        ? 0
        : parse(row.answer) > 50
        ? 100
        : 50,
    party_id: parse(row.party_id),
    question_id: parse(row.question_id),
    question_shared_id: parse(row.question_shared_id),
    country_code: ["VL", "WA"].includes(row.country_code)
      ? "BE"
      : row.country_code,
    country_name: ["VL", "WA"].includes(row.country_code)
      ? "Belgium"
      : row.country_name
  })).then(res => {
    data.set(res);
    // console.log(res)
  });
}
