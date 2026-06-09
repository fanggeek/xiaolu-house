import {
  getCity,
  apiPost,
  printResult,
  handleError,
  cleanParams,
} from '../utils.js'

export async function cmdNewCommunities(opts) {
  try {
    const city = getCity()
    let priceRange
    if (opts.minPrice !== undefined || opts.maxPrice !== undefined) {
      priceRange = cleanParams({ min: opts.minPrice, max: opts.maxPrice })
    }

    let constructionAreas
    if (opts.minConstructionArea !== undefined || opts.maxConstructionArea !== undefined) {
      constructionAreas = cleanParams({ min: opts.minConstructionArea, max: opts.maxConstructionArea })
    }

    const params = cleanParams({
      city,
      name: opts.name,
      reason: opts.reason,
      rooms: opts.rooms,
      propertyTypes: opts.propertyTypes,
      sellStatus: opts.sellStatus,
      priceType: opts.priceType || 'totalPrice',
      priceRange,
      decorationStandards: opts.decoration,
      constructionAreas,
      areaId: opts.areaId,
    })

    const result = await apiPost('/mcp-api/search-new-communities', params)
    printResult(result)
  } catch (err) {
    handleError(err)
  }
}
