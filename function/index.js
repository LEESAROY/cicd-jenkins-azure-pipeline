module.exports = async function (context, req) {
    console.log('Handler invoked');
    context.res.statusCode = 200;
    context.res.setHeader('Content-Type', 'text/plain');
    context.res.write("Hello, World!");
    console.log('Response set');
    context.res.end();
};
