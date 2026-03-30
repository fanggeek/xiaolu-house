import { getApiKey, getCity, apiPost, printResult, handleError, cleanParams } from '../utils.js'

export async function cmdSuggestions(opts) {
  const apiKey = getApiKey()
  const city = getCity()
  console.log('正在搜索匹配相关的小区、学校、地铁站、新房...')

  try {
    const params = cleanParams({
      city,
      keyword: opts.keyword,
      type: opts.type || 'sell',
    })

    const result = await apiPost('/mcp-api/search-suggestions', params, apiKey)
    printResult(result)
  } catch (err) {
    handleError(err)
  }
}
