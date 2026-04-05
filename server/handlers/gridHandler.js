const axios = require('axios')

async function handleGridCreated(grid, broadcast, sendToClient, marsUrl, callbackUrl) {
  try {
    const response = await axios.post(`${marsUrl}/api/grid`, {
      ...grid,
      callbackUrl: `${callbackUrl}/api/cell-update`
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    const marsCells = response.data.cells
    const marsQuadrants = response.data.quadrants || []

    const cellMap = Object.fromEntries(
      grid.cells.map((c) => [c.id, c.itemPresent])
    )

    const mergedCells = marsCells.map((c) => ({
      id: c.id,
      weather: c.weather,
      itemPresent: cellMap[c.id] ?? false
    }))

    broadcast({
      type: 'WEATHER_UPDATE',
      cells: mergedCells,
      quadrants: marsQuadrants
    })

  } catch (err) {
    if (err.response) {
      console.error(`Failed to reach Mars service: HTTP ${err.response.status} from ${err.config?.url}`)
    } else if (err.request) {
      console.error(`Failed to reach Mars service: no response received (${err.code}) — is the Mars service running at ${marsUrl}?`)
    } else {
      console.error(`Failed to reach Mars service: ${err.message}`)
    }
    sendToClient({
      type: 'ERROR',
      message: 'Failed to reach Mars service'
    })
  }
}

module.exports = { handleGridCreated }
