const request = require('supertest');
const { createServer } = require('http');
const handler = require('./index');

function createApp() {
  return createServer((req, res) => {
    const context = { res };
    handler(context, req);
  });
}

describe('GET /', () => {
  it('should return 200 status code and Hello, World! text', async () => {
    const response = await request(createApp()).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Hello, World!');
  });
});
