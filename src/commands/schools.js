import { getApiKey, getCity, apiPost, printResult, handleError, cleanParams } from '../utils.js'

export async function cmdSchools(opts) {
  const apiKey = getApiKey()
  const city = getCity()
  console.log('正在查询学校...')

  try {
    const params = cleanParams({
      city,
      keyword: opts.schoolName,
      type: opts.type,
      nature: opts.nature,
      tiers: opts.tiers,
      areaIds: opts.areaIds,
      schoolIds: opts.schoolIds,
    })

    const result = await apiPost('/mcp-api/search-schools', params, apiKey)
    printResult(result)
  } catch (err) {
    handleError(err)
  }
}
