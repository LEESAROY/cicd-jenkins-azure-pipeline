const request = require('supertest');
const { createServer } = require('http');
const handler = require('./index');

function createApp() {
    return createServer((req, res) => {
        const context = { res: {} };

        handler(context, req).then(() => {
            res.statusCode = context.res.status;
            for (const [key, value] of Object.entries(context.res.headers)) {
                res.setHeader(key, value);
            }
            res.end(context.res.body);
        }).catch((err) => {
            console.error('Error in handler:', err);
            res.statusCode = 500;
            res.end('Internal Server Error');
        });
    });
}

jest.setTimeout(10000); // Increase the timeout for the test

describe('GET /', () => {
    it('should return 200 status code and Hello, World! text', (done) => {
        const server = createApp().listen(3000, () => {
            request(server)
                .get('/')
                .expect(200)
                .expect('Content-Type', /text\/plain/)
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
