import {
  getCity,
  apiPost,
  printResult,
  handleError,
  cleanParams,
} from '../utils.js'

export async function cmdHouses(opts) {
  const city = getCity()

  try {
    let prices
    const type = opts.type || 'sell'
    if (type === 'sell') {
      if (opts.minSellPrice !== undefined || opts.maxSellPrice !== undefined) {
        prices = [
          cleanParams({ min: opts.minSellPrice, max: opts.maxSellPrice }),
        ]
      }
    } else {
      if (opts.minRentPrice !== undefined || opts.maxRentPrice !== undefined) {
        prices = [
          cleanParams({ min: opts.minRentPrice, max: opts.maxRentPrice }),
        ]
      }
    }

    let constructionAreas
    if (opts.minArea !== undefined || opts.maxArea !== undefined) {
      constructionAreas = [
        cleanParams({ min: opts.minArea, max: opts.maxArea }),
      ]
    }

    const params = cleanParams({
      city,
      name: opts.name,
      reason: opts.reason,
      unitType: opts.type || 'sell',
      rooms: opts.rooms,
      prices,
      constructionAreas,
      toilets: opts.toilets,
      elevators: opts.elevator,
      directionTypes: opts.direction,
      areaIds: opts.areaIds,
    })

    const result = await apiPost('/mcp-api/search-houses', params)
    printResult(result)
  } catch (err) {
    handleError(err)
  }
}
