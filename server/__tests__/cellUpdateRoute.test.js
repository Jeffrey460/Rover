const request = require('supertest')
const app = require('../index')

describe('POST /api/cell-update', () => {
  test('returns 200 for valid cell update', async () => {
    const res = await request(app)
      .post('/api/cell-update')
      .send({ id: '0-0', weather: 'windy' })
    expect(res.statusCode).toBe(200)
  })

  test('returns 400 when id is missing', async () => {
    const res = await request(app)
      .post('/api/cell-update')
      .send({ weather: 'windy' })
    expect(res.statusCode).toBe(400)
  })

  test('returns 400 when weather is missing', async () => {
    const res = await request(app)
      .post('/api/cell-update')
      .send({ id: '0-0' })
    expect(res.statusCode).toBe(400)
  })
})
