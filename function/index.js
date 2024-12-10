module.exports = async function (context, req) {
    try {
        console.log('Handler invoked');
        context.res.statusCode = 200;
        context.res.setHeader('Content-Type', 'text/plain');
        context.res.write("Hello, World!");
        console.log('Response set');
        context.res.end();
    } catch (error) {
        console.error('Error:', error);
        context.res.statusCode = 500;
        context.res.end('Internal Server Error');
    }
};
