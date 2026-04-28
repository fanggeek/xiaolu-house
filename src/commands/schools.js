import {
  getCity,
  apiPost,
  printResult,
  handleError,
  cleanParams,
} from '../utils.js'

export async function cmdSchools(opts) {
  const city = getCity()

  try {
    const params = cleanParams({
      city,
      name: opts.name,
      reason: opts.reason,
      type: opts.type,
      nature: opts.nature,
      tiers: opts.tiers,
      areaIds: opts.areaIds,
    })

    const result = await apiPost('/mcp-api/search-schools', params)
    printResult(result)
  } catch (err) {
    handleError(err)
  }
}
