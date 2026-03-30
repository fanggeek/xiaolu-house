import { getApiKey, getCity, apiPost, printResult, handleError, cleanParams } from '../utils.js'

export async function cmdNewCommunities(opts) {
  const apiKey = getApiKey()
  const city = getCity()
  console.log('正在查询新房...')

  try {
    let priceRange
    if (opts.minPrice !== undefined || opts.maxPrice !== undefined) {
      priceRange = cleanParams({ min: opts.minPrice, max: opts.maxPrice })
    }

    const params = cleanParams({
      city,
      keyword: opts.newCommunityName,
      areaId: opts.areaIds,
      rooms: opts.rooms,
      propertyTypes: opts.propertyTypes,
      sellStatus: opts.status,
      priceType: opts.priceType || 'totalPrice',
      priceRange,
      decorationStandards: opts.decoration,
      sort: opts.sort || 'smart',
      constructionAreas: opts.constructionAreas,
      teamNewCommunityIds: opts.newCommunityIds,
    })

    const result = await apiPost('/mcp-api/search-new-communities', params, apiKey)
    printResult(result)
  } catch (err) {
    handleError(err)
  }
}
