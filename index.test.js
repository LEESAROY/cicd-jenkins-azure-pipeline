const request = require('supertest');
const { createServer } = require('http');
const handler = require('./index');

function createApp() {
    return createServer((req, res) => {
        const context = { res };
        handler(context, req);
    });
}

jest.setTimeout(10000); // Increase the timeout for the test

describe('GET /', () => {
    it('should return 200 status code and Hello, World! text', (done) => {
        const server = createApp().listen(3000, () => {
            request(server)
                .get('/')
                .expect(200)
                .expect('Hello, World!')
                .end((err, res) => {
                    server.close(() => {
                        if (err) return done(err);
                        done();
                    });
                });
        });
    });
});
