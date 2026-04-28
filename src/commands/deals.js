import {
  getCity,
  apiPost,
  printResult,
  handleError,
  cleanParams,
} from '../utils.js'

export async function cmdDeals(opts) {
  const city = getCity()

  try {
    const params = cleanParams({
      city,
      name: opts.name,
      reason: opts.reason,
      areaId: opts.areaId,
    })

    const result = await apiPost('/mcp-api/search-deal-prices', params)
    printResult(result)
  } catch (err) {
    handleError(err)
  }
}
