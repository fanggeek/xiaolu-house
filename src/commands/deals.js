import { getApiKey, getCity, apiPost, printResult, handleError, cleanParams } from '../utils.js'

export async function cmdDeals(opts) {
  const apiKey = getApiKey()
  const city = getCity()
  console.log('正在查询成交记录...')

  try {
    let adCode, subArea
    if (opts.areaIds) {
      const areaId = Array.isArray(opts.areaIds) ? opts.areaIds[0] : opts.areaIds
      const parts = areaId.split('|')
      adCode = parts[0]
      subArea = parts[1] || undefined
    }

    const params = cleanParams({
      city,
      adCode,
      subArea,
      communityIds: opts.communityIds,
      schoolIds: opts.schoolIds,
    })

    const result = await apiPost('/mcp-api/search-deal-prices', params, apiKey)
    printResult(result)
  } catch (err) {
    handleError(err)
  }
}
