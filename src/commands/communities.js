import { getApiKey, getCity, apiPost, printResult, handleError, cleanParams } from '../utils.js'

export async function cmdCommunities(opts) {
  const apiKey = getApiKey()
  const city = getCity()
  console.log('正在查询小区...')

  try {
    const params = cleanParams({
      city,
      communityName: opts.communityName,
      areaId: opts.areaIds,
      communityIds: opts.communityIds,
    })

    const result = await apiPost('/mcp-api/search-communities', params, apiKey)
    printResult(result)
  } catch (err) {
    handleError(err)
  }
}
