module.exports = async function (context, req) {
    try {
        console.log('Handler invoked');

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'text/plain'
            },
            body: "Hello, World!"
        };

        console.log('Response set');
    } catch (error) {
        console.error('Error:', error);
        context.res = {
            status: 500,
            body: 'Internal Server Error'
        };
    }
};
