const { publish } = require('gh-pages');
void publish('.', {
    src: [
        'index.html',
        'build/release.*',
        'build/debug.*',
        'src/app.mjs'
    ]
}, (err) => {
    if (err) {
        process.exitCode = process.exitCode || 1;
        console.error(err);
    } else {
        console.log('Done')
    }
});
