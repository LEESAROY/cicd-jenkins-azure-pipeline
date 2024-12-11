const request = require('supertest');
const { createServer } = require('http');
const handler = require('./index');

function createApp() {
    return createServer((req, res) => {
        const context = { res: {} };

        handler(context, req).then(() => {
            res.statusCode = context.res.status;
            for (const [key, value] of Object.entries(context.res.headers || {})) {
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

jest.setTimeout(10000);

describe('Function handler tests', () => {
    let server;

    beforeAll((done) => {
        server = createApp().listen(3000, done);
    });

    afterAll((done) => {
        server.close(done);
    });

    it('should return 200 status code and Hello, World! text', (done) => {
        request(server)
            .get('/')
            .expect(200)
            .expect('Content-Type', /text\/plain/)
            .expect('Hello, World!')
            .end(done);
    });

    it('should handle errors gracefully', (done) => {
        const faultyHandler = async (context, req) => {
            throw new Error('Test error');
        };

        const app = createServer((req, res) => {
            const context = { res: {} };

            faultyHandler(context, req).then(() => {
                res.statusCode = context.res.status;
                for (const [key, value] of Object.entries(context.res.headers || {})) {
                    res.setHeader(key, value);
                }
                res.end(context.res.body);
            }).catch((err) => {
                console.error('Error in handler:', err);
                res.statusCode = 500;
                res.end('Internal Server Error');
            });
        });

        const testServer = app.listen(3001, () => {
            request(testServer)
                .get('/')
                .expect(500)
                .expect('Internal Server Error')
                .end((err, res) => {
                    testServer.close(() => {
                        if (err) return done(err);
                        done();
                    });
                });
        });
    });

    it('should return 404 for non-existing routes', (done) => {
        const app = createServer((req, res) => {
            const context = { res: {} };

            if (req.url !== '/') {
                res.statusCode = 404;
                res.end('Not Found');
                return;
            }

            handler(context, req).then(() => {
                res.statusCode = context.res.status;
                for (const [key, value] of Object.entries(context.res.headers || {})) {
                    res.setHeader(key, value);
                }
                res.end(context.res.body);
            }).catch((err) => {
                console.error('Error in handler:', err);
                res.statusCode = 500;
                res.end('Internal Server Error');
            });
        });

        const testServer = app.listen(3002, () => {
            request(testServer)
                .get('/non-existing-route')
                .expect(404)
                .expect('Not Found')
                .end((err, res) => {
                    testServer.close(() => {
                        if (err) return done(err);
                        done();
                    });
                });
        });
    });
});
