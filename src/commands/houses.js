import { getApiKey, getCity, apiPost, printResult, handleError, cleanParams } from '../utils.js'

export async function cmdHouses(opts) {
  const apiKey = getApiKey()
  const city = getCity()
  console.log('正在查询房源...')

  try {
    let prices
    const type = opts.type || 'sell'
    if (type === 'sell') {
      if (opts.minSellPrice !== undefined || opts.maxSellPrice !== undefined) {
        prices = [cleanParams({ min: opts.minSellPrice, max: opts.maxSellPrice })]
      }
    } else {
      if (opts.minRentPrice !== undefined || opts.maxRentPrice !== undefined) {
        prices = [cleanParams({ min: opts.minRentPrice, max: opts.maxRentPrice })]
      }
    }

    let constructionAreas
    if (opts.minArea !== undefined || opts.maxArea !== undefined) {
      constructionAreas = [cleanParams({ min: opts.minArea, max: opts.maxArea })]
    }

    const params = cleanParams({
      city,
      unitType: opts.type || 'sell',
      communityName: opts.communityName,
      communityIds: opts.communityIds,
      areaIds: opts.areaIds?.length ? opts.areaIds : undefined,
      subwayIds: opts.subwayIds?.length ? opts.subwayIds : undefined,
      schoolIds: opts.schoolIds?.length ? opts.schoolIds : undefined,
      rooms: opts.rooms,
      prices,
      constructionAreas,
      toilets: opts.toilets,
      sort: opts.sort || 'default',
      elevators: opts.elevator,
      directionTypes: opts.direction,
    })

    const result = await apiPost('/mcp-api/search-houses', params, apiKey)
    printResult(result)
  } catch (err) {
    handleError(err)
  }
}
