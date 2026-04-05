const axios = require('axios')
const { handleGridCreated } = require('../handlers/gridHandler')

jest.mock('axios')

const sampleGrid = {
  width: 2,
  height: 1,
  cells: [
    { id: '0-0', weather: 'calm', itemPresent: false },
    { id: '1-0', weather: 'windy', itemPresent: true }
  ]
}

const marsResponse = {
  data: {
    cells: [
      { id: '0-0', weather: 'windy' },
      { id: '1-0', weather: 'stormy' }
    ]
  }
}

describe('handleGridCreated', () => {
  let broadcast
  let sendToClient

  beforeEach(() => {
    broadcast = jest.fn()
    sendToClient = jest.fn()
    jest.clearAllMocks()
  })

  test('calls axios.post with the correct Mars URL and grid body', async () => {
    axios.post.mockResolvedValue(marsResponse)
    await handleGridCreated(sampleGrid, broadcast, sendToClient, 'http://mars:8080', 'http://localhost:5000')
    expect(axios.post).toHaveBeenCalledWith(
      'http://mars:8080/api/grid',
      expect.objectContaining({ width: sampleGrid.width, height: sampleGrid.height }),
      expect.objectContaining({ headers: { 'Content-Type': 'application/json' } })
    )
  })

  test('includes callbackUrl in the POST body to Mars', async () => {
    axios.post.mockResolvedValue(marsResponse)
    await handleGridCreated(sampleGrid, broadcast, sendToClient, 'http://mars:8080', 'http://localhost:5000')
    expect(axios.post).toHaveBeenCalledWith(
      'http://mars:8080/api/grid',
      expect.objectContaining({ callbackUrl: 'http://localhost:5000/api/cell-update' }),
      expect.anything()
    )
  })

  test('broadcasts a WEATHER_UPDATE message on successful Mars response', async () => {
    axios.post.mockResolvedValue(marsResponse)
    await handleGridCreated(sampleGrid, broadcast, sendToClient, 'http://mars:8080', 'http://localhost:5000')
    expect(broadcast).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'WEATHER_UPDATE' })
    )
  })

  test('merged cells contain the correct weather from the Mars response', async () => {
    axios.post.mockResolvedValue(marsResponse)
    await handleGridCreated(sampleGrid, broadcast, sendToClient, 'http://mars:8080', 'http://localhost:5000')
    const { cells } = broadcast.mock.calls[0][0]
    expect(cells[0].weather).toBe('windy')
    expect(cells[1].weather).toBe('stormy')
  })

  test('merged cells preserve itemPresent from the original grid cells', async () => {
    axios.post.mockResolvedValue(marsResponse)
    await handleGridCreated(sampleGrid, broadcast, sendToClient, 'http://mars:8080', 'http://localhost:5000')
    const { cells } = broadcast.mock.calls[0][0]
    expect(cells[0].itemPresent).toBe(false)
    expect(cells[1].itemPresent).toBe(true)
  })

  test('itemPresent defaults to false for cells not found in the original grid', async () => {
    const marsResponseWithExtra = {
      data: { cells: [{ id: '9-9', weather: 'calm' }] }
    }
    axios.post.mockResolvedValue(marsResponseWithExtra)
    await handleGridCreated(sampleGrid, broadcast, sendToClient, 'http://mars:8080', 'http://localhost:5000')
    const { cells } = broadcast.mock.calls[0][0]
    expect(cells[0].itemPresent).toBe(false)
  })

  test('calls sendToClient with type ERROR when the Mars call fails', async () => {
    axios.post.mockRejectedValue(new Error('connection refused'))
    await handleGridCreated(sampleGrid, broadcast, sendToClient, 'http://mars:8080', 'http://localhost:5000')
    expect(sendToClient).toHaveBeenCalledWith({
      type: 'ERROR',
      message: 'Failed to reach Mars service'
    })
  })

  test('does not broadcast when the Mars call fails', async () => {
    axios.post.mockRejectedValue(new Error('connection refused'))
    await handleGridCreated(sampleGrid, broadcast, sendToClient, 'http://mars:8080', 'http://localhost:5000')
    expect(broadcast).not.toHaveBeenCalled()
  })

  test('does not throw when Mars is unreachable', async () => {
    axios.post.mockRejectedValue(new Error('ECONNREFUSED'))
    await expect(
      handleGridCreated(sampleGrid, broadcast, sendToClient, 'http://mars:8080', 'http://localhost:5000')
    ).resolves.not.toThrow()
  })
})
