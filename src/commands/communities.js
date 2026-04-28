import {
  getCity,
  apiPost,
  printResult,
  handleError,
  cleanParams,
} from '../utils.js'

export async function cmdCommunities(opts) {
  const city = getCity()

  try {
    const params = cleanParams({
      city,
      name: opts.name,
      reason: opts.reason,
      areaId: opts.areaId,
    })

    const result = await apiPost('/mcp-api/search-communities', params)
    printResult(result)
  } catch (err) {
    handleError(err)
  }
}
